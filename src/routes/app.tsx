import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { WordMark } from "@/components/atlas/Logo";
import { WalletButton } from "@/components/atlas/WalletButton";
import { TxToast } from "@/components/atlas/TxToast";
import { DemoOverlay, useDemoMode } from "@/components/atlas/DemoMode";
import { useTx, useWallet, type TxRequest } from "@/lib/atlas-chain";
import { agents, portfolioStats, positions, riskFindings, activity, proposals } from "@/lib/atlas-data";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "AtlasOS · Dashboard" },
      { name: "description", content: "Your autonomous DeFi operations dashboard on HashKey Chain." },
    ],
  }),
  component: AppShell,
});

const TABS = ["Overview", "Portfolio", "Agents", "Risk", "Chat", "Governance", "Activity"] as const;
type Tab = (typeof TABS)[number];

function AppShell() {
  const [tab, setTab] = useState<Tab>("Overview");
  const tx = useTx();
  const wallet = useWallet();
  const demo = useDemoMode();

  function requireWallet(): boolean {
    if (!wallet) {
      alert("Connect your HashKey wallet to broadcast this transaction.");
      return false;
    }
    return true;
  }
  async function exec(req: TxRequest) {
    if (!requireWallet()) return;
    await tx.run(req);
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar tab={tab} setTab={setTab} onStartDemo={demo.start} />
        <main className="flex-1 min-w-0">
          <TopBar />
          <div className="mx-auto max-w-7xl px-8 py-8">
            {tab === "Overview" && <Overview exec={exec} />}
            {tab === "Portfolio" && <Portfolio exec={exec} />}
            {tab === "Agents" && <AgentsView exec={exec} />}
            {tab === "Risk" && <RiskTab />}
            {tab === "Chat" && <Chat exec={exec} />}
            {tab === "Governance" && <GovernanceTab />}
            {tab === "Activity" && <Activity />}
          </div>
        </main>
      </div>
      <TxToast {...tx} onClose={tx.reset} />
      {demo.active && <DemoOverlay onExit={demo.stop} />}
    </div>
  );
}

function Sidebar({ tab, setTab, onStartDemo }: { tab: Tab; setTab: (t: Tab) => void; onStartDemo: () => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/40 bg-background/60 backdrop-blur-xl md:flex md:flex-col">
      <div className="border-b border-border/40 px-5 py-4">
        <Link to="/"><WordMark /></Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              tab === t ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tab === t ? "bg-primary" : "bg-muted-foreground/40"}`} />
            {t}
          </button>
        ))}
        <div className="mt-3 border-t border-border/40 pt-3 space-y-1">
          <Link to="/risk" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Risk page →
          </Link>
          <Link to="/governance" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Governance →
          </Link>
        </div>
      </nav>
      <div className="border-t border-border/40 p-4 space-y-3">
        <button
          onClick={onStartDemo}
          className="w-full rounded-xl bg-gradient-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_30px_oklch(0.82_0.16_200/0.35)]"
        >
          ▸ Launch Demo Mode
        </button>
        <div className="rounded-xl border border-border/60 bg-surface/60 p-3 text-xs">
          <div className="font-mono uppercase tracking-widest text-muted-foreground">Network</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
            <span className="font-medium">HashKey Mainnet</span>
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">chain id · 177</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-8 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground">Overview</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs md:flex">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Block</span>
          <span className="font-mono">#18,422,901</span>
        </div>
        <div data-demo="wallet"><WalletButton /></div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, deltaTone = "primary", id }: { label: string; value: string; delta?: string; deltaTone?: "primary" | "success" | "warning"; id?: string }) {
  const tone = deltaTone === "success" ? "text-success" : deltaTone === "warning" ? "text-warning" : "text-primary";
  return (
    <div data-demo={id} className="surface-card rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
      {delta && <div className={`mt-1 text-xs ${tone}`}>{delta}</div>}
    </div>
  );
}

type Exec = (req: TxRequest) => Promise<void>;

function Overview({ exec }: { exec: Exec }) {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">Overview</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Good evening, Operator.</h1>
          <p className="mt-1 text-muted-foreground">6 agents are running across your portfolio. No interventions required.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exec({ contract: "AtlasVault", method: "deposit", args: { amount: "10000 USDC" } })}
            className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >Deposit to Vault</button>
          <button
            onClick={() => exec({ contract: "AtlasVault", method: "rebalanceAll" })}
            className="rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm hover:bg-surface-2"
          >Rebalance now</button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Value Managed" value={portfolioStats.tvl} delta={portfolioStats.tvlChange} deltaTone="success" />
        <StatCard label="Net APY" value={`${portfolioStats.netApy}%`} delta="+1.2% wk" />
        <StatCard id="health" label="Health Factor" value={String(portfolioStats.healthFactor)} delta="safe · target ≥ 1.8" deltaTone="success" />
        <StatCard label="24h P&L" value={portfolioStats.exposure24h} delta="+1.21%" deltaTone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Portfolio performance</h3>
            <div className="font-mono text-xs text-muted-foreground">last 30 days</div>
          </div>
          <Sparkline />
        </div>
        <div className="surface-card rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Live agent activity</h3>
          <ul className="mt-4 space-y-3">
            {activity.slice(0, 5).map((a) => (
              <li key={a.ts} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-muted-foreground">{a.ts}</span>
                  <span className="font-mono text-primary">{a.agent}</span>
                </div>
                <div className="mt-1 text-sm text-foreground/90">{a.action}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="surface-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold">Agent fleet</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 animate-pulse-glow rounded-full bg-gradient-to-r ${a.accent}`} />
                  <span className="font-display font-semibold">{a.name}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-success">● live</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{a.role}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-xs text-primary">{a.metric}</span>
                <button
                  onClick={() => exec({ contract: "PolicyManager", method: "ping", args: { agent: a.id } })}
                  className="rounded-md border border-border bg-surface/60 px-2 py-1 text-[10px] hover:bg-surface-2"
                >ping</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  const points = Array.from({ length: 60 }, (_, i) => {
    const x = i / 59;
    const noise = Math.sin(i * 0.6) * 0.04 + Math.sin(i * 0.21) * 0.06;
    const y = 0.6 - 0.45 * x + noise;
    return [x * 760, Math.max(0.05, Math.min(0.95, y)) * 200];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L760,200 L0,200 Z`;
  return (
    <div className="mt-4">
      <svg viewBox="0 0 760 200" className="h-56 w-full">
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.16 200)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.82 0.16 200)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark)" />
        <path d={path} fill="none" stroke="oklch(0.82 0.16 200)" strokeWidth="2" />
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>30d ago</span><span>now</span>
      </div>
    </div>
  );
}

function Portfolio({ exec }: { exec: Exec }) {
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-primary">Portfolio</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Positions</h1>
      </header>
      <div className="surface-card overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Protocol", "Asset", "Value", "APY", "Risk", "Managed by", ""].map((h) => (
                <th key={h} className="px-5 py-3 font-mono font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => (
              <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-surface/40">
                <td className="px-5 py-4 font-medium">{p.protocol}</td>
                <td className="px-5 py-4 text-muted-foreground">{p.asset}</td>
                <td className="px-5 py-4 font-mono">${p.value.toLocaleString()}</td>
                <td className="px-5 py-4 font-mono text-success">{p.apy}%</td>
                <td className="px-5 py-4">
                  <span className={`rounded-md px-2 py-0.5 text-xs ${
                    p.risk === "Low" ? "bg-success/15 text-success" : p.risk === "Medium" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                  }`}>{p.risk}</span>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-primary">{p.agent}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => exec({ contract: "TradingAgent", method: "closePosition", args: { protocol: p.protocol, asset: p.asset } })}
                    className="rounded-md border border-border bg-surface/60 px-2 py-1 text-xs hover:bg-surface-2"
                  >Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AgentsView({ exec }: { exec: Exec }) {
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-primary">Agents</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Agent fleet</h1>
        <p className="mt-1 text-muted-foreground">Configure permissions, policies and reasoning depth per agent.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map((a) => (
          <div key={a.id} className="surface-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 animate-pulse-glow rounded-full bg-gradient-to-r ${a.accent}`} />
                <div>
                  <div className="font-display text-xl font-semibold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                </div>
              </div>
              <button
                onClick={() => exec({ contract: "PolicyManager", method: "updatePolicy", args: { agent: a.id } })}
                className="rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs hover:bg-surface-2"
              >Configure</button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{a.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border/60 pt-4 text-xs">
              <div><div className="text-muted-foreground">Model</div><div className="font-mono">gpt-5.2</div></div>
              <div><div className="text-muted-foreground">Tools</div><div className="font-mono">12 via MCP</div></div>
              <div><div className="text-muted-foreground">Last act</div><div className="font-mono">2m ago</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskTab() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">Risk</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Risk intelligence</h1>
        </div>
        <Link
          to="/risk"
          className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >Open full Risk Engine →</Link>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Portfolio Risk Score</div><div className="mt-2 font-display text-3xl font-semibold">A−</div><div className="mt-1 text-xs text-success">low correlation</div></div>
        <div className="surface-card rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Liquidation Buffer</div><div className="mt-2 font-display text-3xl font-semibold">48.2%</div><div className="mt-1 text-xs text-success">HF 2.31</div></div>
        <div className="surface-card rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Open Alerts</div><div className="mt-2 font-display text-3xl font-semibold">1</div><div className="mt-1 text-xs text-warning">1 critical · governance</div></div>
      </div>
      <div className="surface-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold">Recent findings</h3>
        <ul className="mt-4 divide-y divide-border/40">
          {riskFindings.map((r, i) => (
            <li key={i} className="flex items-start gap-4 py-4">
              <span className={`mt-1 inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${
                r.severity === "crit" ? "bg-destructive/15 text-destructive" :
                r.severity === "warn" ? "bg-warning/15 text-warning" :
                "bg-primary/15 text-primary"
              }`}>{r.severity}</span>
              <div className="flex-1">
                <div className="font-medium">{r.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{r.detail}</div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">{r.time}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Chat({ exec }: { exec: Exec }) {
  const [messages, setMessages] = useState([
    { role: "agent", name: "Atlas", text: "Hello Operator. Your portfolio is healthy. Sentinel preempted one liquidation today; Harvester rebalanced $84k into HashSwap LP. What would you like to do?" },
  ]);
  const [input, setInput] = useState("");
  const presets = [
    "Summarize today's agent activity",
    "What's the safest 15%+ APY available?",
    "Simulate a 20% HSK drawdown",
    "Vote on proposal #84",
  ];
  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", name: "You", text },
      {
        role: "agent",
        name: "Atlas",
        text: "Routing your request through the agent network… Oracle is researching, Sentinel is simulating, Consul is reviewing. Aggregated answer in 3.1s — every step logged on-chain at tx 0x91…02bc.",
      },
    ]);
    setInput("");
    exec({ contract: "AtlasVault", method: "logIntent", args: { prompt: text } }).catch(() => {});
  }
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-primary">Chat</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Talk to AtlasOS</h1>
        <p className="mt-1 text-muted-foreground">Natural language commands routed across the agent network.</p>
      </header>

      <div data-demo="chat" className="surface-card flex h-[560px] flex-col rounded-2xl">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "agent" && <div className="mt-1 h-8 w-8 shrink-0 rounded-lg bg-gradient-primary" />}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user" ? "bg-surface-2 text-foreground" : "bg-background/60 border border-border/60"
              }`}>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.name}</div>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p} onClick={() => send(p)} className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground hover:bg-surface-2 hover:text-foreground">
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything — e.g. find me 12% APY with low correlation to HSK"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-lg bg-gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GovernanceTab() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">Governance</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Proposals</h1>
          <p className="mt-1 text-muted-foreground">Consul simulates impact and casts your delegated votes.</p>
        </div>
        <Link to="/governance" className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open Governance →</Link>
      </header>
      <div className="surface-card overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>{["#", "Proposal", "Status", "Agent vote", "Confidence", "Ends"].map((h) => <th key={h} className="px-5 py-3 font-mono font-normal">{h}</th>)}</tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-surface/40">
                <td className="px-5 py-4 font-mono text-muted-foreground">#{p.id}</td>
                <td className="px-5 py-4 font-medium">{p.title}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-md px-2 py-0.5 text-xs ${
                    p.status === "Active" ? "bg-primary/15 text-primary" :
                    p.status === "Passed" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 font-mono">{p.agentVote}</td>
                <td className="px-5 py-4 font-mono">{p.confidence}%</td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{p.ends}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Activity() {
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-primary">Activity</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Transaction history</h1>
      </header>
      <div className="surface-card overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>{["Time", "Agent", "Action", "Tx"].map((h) => <th key={h} className="px-5 py-3 font-mono font-normal">{h}</th>)}</tr>
          </thead>
          <tbody>
            {activity.map((a, i) => (
              <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-surface/40">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{a.ts}</td>
                <td className="px-5 py-4 font-mono text-primary">{a.agent}</td>
                <td className="px-5 py-4">{a.action}</td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{a.tx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
