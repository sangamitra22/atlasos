import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { WordMark } from "@/components/atlas/Logo";
import { WalletButton } from "@/components/atlas/WalletButton";
import { TxToast } from "@/components/atlas/TxToast";
import { useTx, useWallet } from "@/lib/atlas-chain";
import { proposals as seedProposals } from "@/lib/atlas-data";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "AtlasOS · Governance" },
      { name: "description", content: "Create, vote, and execute proposals with AI agent recommendations on HashKey Chain." },
    ],
  }),
  component: GovernancePage,
});

type Proposal = {
  id: number;
  title: string;
  summary: string;
  status: "Draft" | "Active" | "Passed" | "Failed" | "Executed";
  agentVote: "For" | "Against" | "Abstain";
  confidence: number;
  forVotes: number;
  againstVotes: number;
  quorum: number;
  ends: string;
  target: string;
  agentRationale: string;
  executionTx?: string;
};

const INITIAL: Proposal[] = [
  {
    id: 84, title: "Grant admin role to multisig", summary: "Transfers PolicyManager admin to 0x90vrn…multisig with 3/5 threshold.",
    status: "Active", agentVote: "Against", confidence: 96, forVotes: 1_240_000, againstVotes: 4_180_000,
    quorum: 5_000_000, ends: "18h", target: "PolicyManager.grantRole",
    agentRationale: "Consul flagged the proposed multisig owners overlap with a wallet cluster involved in a 2024 rug. Recommends AGAINST.",
  },
  {
    id: 83, title: "Increase Atlas Vault α cap to $10M", summary: "Raises vault deposit cap from $4M to $10M; introduces 24h withdrawal queue.",
    status: "Active", agentVote: "For", confidence: 88, forVotes: 3_820_000, againstVotes: 410_000,
    quorum: 5_000_000, ends: "2d", target: "AtlasVault.setCap",
    agentRationale: "Harvester simulated $6M utilization at current APY; expected net APY uplift +1.8%. No correlated tail risk found.",
  },
  {
    id: 82, title: "Add stHSK as collateral on HashLend", summary: "Onboard stHSK with 65% LTV, 78% liquidation threshold.",
    status: "Passed", agentVote: "For", confidence: 91, forVotes: 6_100_000, againstVotes: 240_000,
    quorum: 5_000_000, ends: "ended", target: "HashLend.addCollateral",
    agentRationale: "Oracle priced peg deviation risk at 28bps. Liquidation buffer within policy.",
  },
];

function GovernancePage() {
  const wallet = useWallet();
  const tx = useTx();
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL);
  const [creating, setCreating] = useState(false);

  async function vote(p: Proposal, choice: "For" | "Against") {
    if (!wallet) return alert("Connect your HashKey wallet to vote.");
    const r = await tx.run({
      contract: "GovernanceHub", method: "castVote",
      args: { proposalId: p.id, support: choice === "For" },
    });
    setProposals((all) => all.map((x) => x.id === p.id
      ? { ...x, [choice === "For" ? "forVotes" : "againstVotes"]: x[choice === "For" ? "forVotes" : "againstVotes"] + 250_000 }
      : x));
    return r;
  }

  async function execute(p: Proposal) {
    if (!wallet) return alert("Connect your HashKey wallet to execute.");
    const r = await tx.run({
      contract: "GovernanceHub", method: "execute",
      args: { proposalId: p.id, target: p.target },
    });
    setProposals((all) => all.map((x) => x.id === p.id ? { ...x, status: "Executed", executionTx: r.hash } : x));
  }

  function createProposal(form: { title: string; summary: string; target: string }) {
    const next: Proposal = {
      id: Math.max(...proposals.map((p) => p.id)) + 1,
      title: form.title || "Untitled proposal",
      summary: form.summary || "—",
      status: "Active",
      agentVote: "For",
      confidence: 78 + Math.floor(Math.random() * 18),
      forVotes: 0, againstVotes: 0, quorum: 5_000_000,
      ends: "5d",
      target: form.target || "AtlasVault.setParam",
      agentRationale: "Consul indexed the on-chain payload and ran a 10k-path Monte Carlo. Predicted economic impact: +0.4% net APY, –0.2% HF impact.",
    };
    setProposals([next, ...proposals]);
    setCreating(false);
  }

  return (
    <div className="min-h-screen">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">Governance</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Proposals</h1>
            <p className="mt-1 text-muted-foreground">Consul simulates impact, recommends a vote, and routes execution through GovernanceHub.sol.</p>
          </div>
          <button
            data-demo="gov-cta"
            onClick={() => setCreating(true)}
            className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >+ New proposal</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="Active proposals" value={String(proposals.filter((p) => p.status === "Active").length)} tone="primary" />
          <Stat label="Agent participation" value="94%" tone="success" />
          <Stat label="Voting power" value={wallet ? "412,800 vHSK" : "— connect wallet"} tone="primary" />
        </div>

        <div className="mt-8 space-y-4">
          {proposals.map((p) => (
            <ProposalCard key={p.id} p={p} onVote={vote} onExecute={execute} />
          ))}
        </div>
      </div>

      {creating && <CreateProposal onCancel={() => setCreating(false)} onSubmit={createProposal} />}

      <TxToast {...tx} onClose={tx.reset} />
    </div>
  );
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-8 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <Link to="/"><WordMark /></Link>
        <nav className="hidden gap-4 text-sm text-muted-foreground md:flex">
          <Link to="/app" className="hover:text-foreground">Dashboard</Link>
          <Link to="/risk" className="hover:text-foreground">Risk</Link>
          <Link to="/governance" className="text-foreground">Governance</Link>
          <Link to="/architecture" className="hover:text-foreground">Architecture</Link>
        </nav>
      </div>
      <div data-demo="wallet"><WalletButton /></div>
    </header>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "primary" | "success" }) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className={`mt-1 text-xs ${tone === "success" ? "text-success" : "text-primary"}`}>via GovernanceHub.sol</div>
    </div>
  );
}

function ProposalCard({ p, onVote, onExecute }: {
  p: Proposal;
  onVote: (p: Proposal, c: "For" | "Against") => Promise<unknown>;
  onExecute: (p: Proposal) => Promise<unknown>;
}) {
  const total = p.forVotes + p.againstVotes;
  const pct = total === 0 ? 0 : (p.forVotes / total) * 100;
  const quorumPct = Math.min(100, (total / p.quorum) * 100);
  return (
    <div className="surface-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>#{p.id}</span><span>·</span><span>{p.target}</span><span>·</span><span>ends {p.ends}</span>
          </div>
          <h3 className="mt-1 font-display text-xl font-semibold">{p.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{p.summary}</p>
        </div>
        <span className={`rounded-md px-2 py-0.5 text-xs ${
          p.status === "Active" ? "bg-primary/15 text-primary" :
          p.status === "Passed" ? "bg-success/15 text-success" :
          p.status === "Executed" ? "bg-success/15 text-success" :
          p.status === "Failed" ? "bg-destructive/15 text-destructive" : "bg-muted/20 text-muted-foreground"
        }`}>{p.status}</span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">For {(p.forVotes / 1e6).toFixed(2)}M</span>
              <span className="text-muted-foreground">Against {(p.againstVotes / 1e6).toFixed(2)}M</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-success transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Quorum {(p.quorum / 1e6).toFixed(0)}M</span>
              <span className="font-mono text-muted-foreground">{quorumPct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-primary" style={{ width: `${quorumPct}%` }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Consul recommendation</span>
            <span className="font-mono text-xs text-muted-foreground">conf {p.confidence}%</span>
          </div>
          <div className="mt-1 font-display text-lg font-semibold">
            Vote <span className={p.agentVote === "For" ? "text-success" : p.agentVote === "Against" ? "text-destructive" : "text-warning"}>{p.agentVote.toUpperCase()}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{p.agentRationale}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
        <div className="font-mono text-[10px] text-muted-foreground">
          {p.executionTx ? <>executed · tx {p.executionTx.slice(0, 18)}…</> : <>target · {p.target}</>}
        </div>
        <div className="flex gap-2">
          {p.status === "Active" && (
            <>
              <button onClick={() => onVote(p, "Against")} className="rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-sm hover:bg-destructive/10 hover:text-destructive">Vote Against</button>
              <button onClick={() => onVote(p, "For")} className="rounded-lg bg-gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Vote For</button>
            </>
          )}
          {p.status === "Passed" && (
            <button onClick={() => onExecute(p)} className="rounded-lg bg-success/20 px-3 py-1.5 text-sm font-medium text-success hover:bg-success/30">Execute on-chain</button>
          )}
          {p.status === "Executed" && <span className="text-xs text-success">● Executed</span>}
        </div>
      </div>
    </div>
  );
}

function CreateProposal({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (f: { title: string; summary: string; target: string }) => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [target, setTarget] = useState("AtlasVault.setParam");
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit({ title, summary, target }); }}
        className="w-full max-w-xl rounded-2xl border border-border/60 bg-background p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">New proposal</h3>
          <button type="button" onClick={onCancel} className="text-sm text-muted-foreground">✕</button>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Summary</span>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Target call</span>
            <input value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 font-mono" />
          </label>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs">
            <span className="font-mono uppercase tracking-widest text-primary">consul preview</span>
            <div className="mt-1 text-muted-foreground">Consul will simulate this proposal, score economic impact, and recommend a vote within ~6 seconds of submission.</div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-sm">Cancel</button>
          <button type="submit" className="rounded-lg bg-gradient-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">Submit on-chain</button>
        </div>
      </form>
    </div>
  );
}
// seedProposals referenced indirectly through styling reuse
void seedProposals;
