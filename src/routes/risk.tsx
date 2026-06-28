import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { WordMark } from "@/components/atlas/Logo";
import { WalletButton } from "@/components/atlas/WalletButton";
import { TxToast } from "@/components/atlas/TxToast";
import { useTx } from "@/lib/atlas-chain";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "AtlasOS · Risk Engine" },
      { name: "description", content: "Explainable on-chain risk scores, liquidation warnings, and AI strategy recommendations." },
    ],
  }),
  component: RiskPage,
});

type Factor = { key: string; label: string; weight: number; score: number; note: string };

const FACTORS: Factor[] = [
  { key: "liq", label: "Liquidity depth", weight: 0.25, score: 88, note: "HSK/USDT depth ±2% slippage: $12.4M. Above policy floor." },
  { key: "oracle", label: "Oracle integrity", weight: 0.2, score: 92, note: "Chainlink aggregator p99 latency 4.4s. No deviations >50bps last 24h." },
  { key: "contract", label: "Contract risk", weight: 0.2, score: 81, note: "AtlasVault α audited by 3 firms · 1 medium finding (mitigated)." },
  { key: "corr", label: "Correlation", weight: 0.15, score: 76, note: "Portfolio ρ(HSK) = 0.41. Within target band." },
  { key: "gov", label: "Governance", weight: 0.1, score: 64, note: "Proposal #84 flagged by Consul — admin grant to opaque multisig." },
  { key: "mev", label: "MEV / Execution", weight: 0.1, score: 90, note: "Router CCIP path private mempool. Sandwich exposure ≤ 6bps." },
];

const POSITIONS_RISK = [
  { protocol: "HashLend wBTC", hf: 2.31, liqPrice: "$38,200", current: "$67,400", buffer: "+76%", level: "safe" },
  { protocol: "Atlas Vault α ETH", hf: 1.92, liqPrice: "$1,820", current: "$3,140", buffer: "+72%", level: "safe" },
  { protocol: "HashSwap HSK/USDT", hf: 1.48, liqPrice: "—", current: "—", buffer: "il 0.4%", level: "watch" },
  { protocol: "stHSK leveraged", hf: 1.18, liqPrice: "$0.84", current: "$0.96", buffer: "+14%", level: "warn" },
];

const STRATEGIES = [
  {
    title: "Rotate 8% of HSK exposure → stables",
    impact: "−0.12 portfolio risk · −0.4% APY",
    rationale: "Reduces ρ(HSK) from 0.41 → 0.32. Consul + Harvester aligned. Auto-route through HashSwap.",
    method: "rebalance",
    confidence: 87,
  },
  {
    title: "Top up stHSK collateral by 1,200 stHSK",
    impact: "HF 1.18 → 1.62 · 0 gas via Sentinel",
    rationale: "Pre-empts liquidation if stHSK depegs to $0.91. Sentinel can execute on threshold breach.",
    method: "topUpCollateral",
    confidence: 95,
  },
  {
    title: "Hedge 30% ETH delta on perp DEX",
    impact: "−$140k tail risk · +$2.1k 24h funding",
    rationale: "Funding currently negative — long-side pays you. Router executes hedge across two venues.",
    method: "openHedge",
    confidence: 73,
  },
];

function RiskPage() {
  const tx = useTx();
  const [proofs, setProofs] = useState<{ ts: number; hash: string }[]>([]);
  const composite = Math.round(FACTORS.reduce((a, f) => a + f.score * f.weight, 0));

  async function runEngine() {
    const r = await tx.run({
      contract: "RiskEngine", method: "computeAndAttest",
      args: { account: "self", model: "atlas-risk-v3" },
    });
    setProofs((p) => [{ ts: Date.now(), hash: r.hash }, ...p].slice(0, 5));
  }

  async function applyStrategy(s: typeof STRATEGIES[number]) {
    await tx.run({
      contract: s.method === "openHedge" ? "TradingAgent" : "AtlasVault",
      method: s.method,
      args: { strategy: s.title, conf: s.confidence },
    });
  }

  return (
    <div className="min-h-screen">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">Risk Engine</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Explainable risk, on-chain.</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">
              Every score is a weighted decomposition of measurable on-chain signals. Outputs are hashed
              and attested through <span className="font-mono text-primary">RiskEngine.sol</span> so auditors can replay reasoning.
            </p>
          </div>
          <button
            data-demo="risk-cta"
            onClick={runEngine}
            className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Run Risk Engine ↻
          </button>
        </div>

        {/* Score + factors */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="surface-card rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Composite portfolio score</div>
            <div className="mt-3 flex items-end gap-3">
              <div className="font-display text-6xl font-semibold text-gradient">{composite}</div>
              <div className="pb-2 font-mono text-xs text-success">grade A− · stable</div>
            </div>
            <RiskRing value={composite} />
            <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-3 font-mono text-[11px] text-muted-foreground">
              attested · last 2m ago<br />
              model · atlas-risk-v3<br />
              {proofs[0] && <>proof · <span className="text-primary">{proofs[0].hash.slice(0, 24)}…</span></>}
            </div>
          </div>

          <div className="surface-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Score decomposition</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">why this score?</span>
            </div>
            <div className="mt-4 space-y-3">
              {FACTORS.map((f) => (
                <div key={f.key} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{f.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">{(f.weight * 100).toFixed(0)}% weight · {f.score}/100</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full ${f.score >= 85 ? "bg-success" : f.score >= 70 ? "bg-primary" : "bg-warning"}`}
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{f.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Liquidation map */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Liquidation warnings</h2>
          <div className="surface-card mt-4 overflow-hidden rounded-2xl">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>{["Position", "Health factor", "Liq. price", "Current", "Buffer", "Status"].map((h) => <th key={h} className="px-5 py-3 font-mono font-normal">{h}</th>)}</tr>
              </thead>
              <tbody>
                {POSITIONS_RISK.map((p) => (
                  <tr key={p.protocol} className="border-b border-border/40 last:border-0 hover:bg-surface/40">
                    <td className="px-5 py-4 font-medium">{p.protocol}</td>
                    <td className="px-5 py-4 font-mono">{p.hf.toFixed(2)}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{p.liqPrice}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{p.current}</td>
                    <td className="px-5 py-4 font-mono">{p.buffer}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-0.5 text-xs ${
                        p.level === "safe" ? "bg-success/15 text-success" :
                        p.level === "watch" ? "bg-primary/15 text-primary" :
                        "bg-warning/15 text-warning"
                      }`}>{p.level === "safe" ? "safe" : p.level === "watch" ? "monitoring" : "Sentinel armed"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategies */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Recommended strategies</h2>
          <p className="mt-1 text-sm text-muted-foreground">Generated by the agent fleet. Apply with a single signature — each route maps to an audited contract call.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {STRATEGIES.map((s) => (
              <div key={s.title} className="surface-card flex flex-col rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">confidence {s.confidence}%</div>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.rationale}</p>
                <div className="mt-3 rounded-lg border border-border/60 bg-background/40 p-2 font-mono text-[11px] text-muted-foreground">{s.impact}</div>
                <button
                  onClick={() => applyStrategy(s)}
                  className="mt-4 rounded-lg bg-gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                >Apply strategy</button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          <Link to="/risk" className="text-foreground">Risk</Link>
          <Link to="/governance" className="hover:text-foreground">Governance</Link>
          <Link to="/architecture" className="hover:text-foreground">Architecture</Link>
        </nav>
      </div>
      <div data-demo="wallet"><WalletButton /></div>
    </header>
  );
}

function RiskRing({ value }: { value: number }) {
  const r = 52; const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 140 140" className="mt-4 h-36 w-full">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 200)" />
          <stop offset="100%" stopColor="oklch(0.7 0.2 150)" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r={r} stroke="oklch(0.25 0.02 240)" strokeWidth="10" fill="none" />
      <circle cx="70" cy="70" r={r} stroke="url(#ring)" strokeWidth="10" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 70 70)" />
      <text x="70" y="78" textAnchor="middle" className="fill-foreground" fontSize="22" fontFamily="Space Grotesk" fontWeight="600">{value}</text>
    </svg>
  );
}
