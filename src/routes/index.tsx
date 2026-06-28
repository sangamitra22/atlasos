import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/atlas/Nav";
import { Footer } from "@/components/atlas/Footer";
import { agents } from "@/lib/atlas-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AtlasOS — The AI Operating System for On-Chain Finance" },
      { name: "description", content: "Autonomous AI agents that manage risk, yield, liquidations and treasury on HashKey Chain. Non-custodial, transparent, on-chain." },
      { property: "og:title", content: "AtlasOS — AI DeFi Operating System on HashKey Chain" },
      { property: "og:description", content: "Self-driving DeFi. Built on HashKey Chain with HSP, CCIP and onchain agent vaults." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Logos />
      <Agents />
      <Architecture />
      <Capabilities />
      <Security />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
            <span className="font-mono uppercase tracking-widest text-muted-foreground">
              Live on HashKey Chain Mainnet · v1.0
            </span>
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            The AI operating system <br />
            for <span className="text-gradient">on-chain finance</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            AtlasOS is a network of autonomous agents that manage risk, yield, liquidations,
            bridges and treasury — non-custodially — across HashKey Chain.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/app"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_40px_oklch(0.82_0.16_200/0.35)] transition-transform hover:scale-[1.02]"
            >
              Launch AtlasOS
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/architecture"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              View architecture
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <span>HashKey Chain</span>
            <span className="opacity-30">·</span>
            <span>HSP Rails</span>
            <span className="opacity-30">·</span>
            <span>Chainlink CCIP</span>
            <span className="opacity-30">·</span>
            <span>Non-custodial</span>
          </div>
        </div>

        <HeroDashboardPreview />
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto mt-20 max-w-6xl">
      <div className="surface-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">atlasos.app / dashboard</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">block #18,422,901</span>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-4">
          {[
            { label: "Total Value Managed", value: "$2.84M", delta: "+12.4%" },
            { label: "Net APY", value: "18.42%", delta: "+1.2%" },
            { label: "Health Factor", value: "2.31", delta: "stable" },
            { label: "Agents Active", value: "6 / 6", delta: "live" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 text-xs text-primary">{s.delta}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 px-5 pb-5 md:grid-cols-3">
          {agents.slice(0, 3).map((a) => (
            <div key={a.id} className="rounded-xl border border-border/60 bg-background/30 p-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 animate-pulse-glow rounded-full bg-gradient-to-r ${a.accent}`} />
                <span className="font-display text-sm font-semibold">{a.name}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.role}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
              <div className="mt-3 font-mono text-xs text-primary">{a.metric}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -inset-x-12 -bottom-12 -z-10 h-40 bg-gradient-primary opacity-30 blur-3xl" />
    </div>
  );
}

function Logos() {
  const items = ["HashKey Chain", "HSP", "Chainlink CCIP", "HashFans", "Kraken", "AWS"];
  return (
    <section className="border-b border-border/40 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Integrated with the HashKey ecosystem
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-80">
          {items.map((i) => (
            <div key={i} className="font-display text-lg font-semibold text-muted-foreground/70">{i}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Agents() {
  return (
    <section id="agents" className="border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">The Agent Network</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Six specialist agents. One operating system.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each agent owns a domain — risk, yield, bridging, research, governance, treasury — and
            collaborates through a shared on-chain memory and reasoning bus.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className="surface-card group relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${a.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 animate-pulse-glow rounded-full bg-gradient-to-r ${a.accent}`} />
                  <span className="font-display text-xl font-semibold">{a.name}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.role}</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{a.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-mono text-xs text-primary">{a.metric}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-success">● {a.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section id="architecture" className="border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">System Architecture</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Built like an exchange. Operated like an OS.</h2>
        </div>
        <div className="surface-card overflow-hidden rounded-2xl p-8">
          <ArchitectureDiagram />
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/architecture" className="text-primary underline-offset-4 hover:underline">Read the full architecture →</Link>
        </div>
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  const layers = [
    { title: "Frontend", color: "from-cyan-400/30 to-sky-500/30", items: ["React · TanStack Start", "Wallet Connect", "Real-time WS"] },
    { title: "Agent Network", color: "from-violet-400/30 to-fuchsia-500/30", items: ["LLM Reasoning (GPT-5)", "MCP Tool Calling", "Vector Memory · RAG"] },
    { title: "Execution Layer", color: "from-emerald-400/30 to-teal-500/30", items: ["Atlas Vault Contracts", "HSP Payment Rails", "Chainlink CCIP Router"] },
    { title: "HashKey Chain", color: "from-amber-400/30 to-orange-500/30", items: ["Mainnet · L2", "HSK Token Contracts", "On-chain Audit Log"] },
  ];
  return (
    <div className="space-y-3">
      {layers.map((l, i) => (
        <div key={l.title} className={`relative rounded-xl border border-border/60 bg-gradient-to-r ${l.color} p-5`}>
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold">{l.title}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Layer {i}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {l.items.map((it) => (
              <span key={it} className="rounded-lg border border-border/60 bg-background/50 px-3 py-1 text-xs font-mono">{it}</span>
            ))}
          </div>
          {i < layers.length - 1 && (
            <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 text-muted-foreground">↓</div>
          )}
        </div>
      ))}
    </div>
  );
}

function Capabilities() {
  const caps = [
    { title: "Autonomous yield routing", body: "Agents continuously search for risk-adjusted APY across HashKey DeFi and migrate capital via signed user policies." },
    { title: "Liquidation defender", body: "Sentinel pre-empts liquidations by topping up collateral or unwinding positions seconds before threshold." },
    { title: "Cross-chain execution", body: "Router uses Chainlink CCIP to move assets between Ethereum and HashKey Chain with MEV-protected paths." },
    { title: "AI Treasury manager", body: "Ledger manages DAO treasuries — diversification, hedging, payroll — through HSP payment rails." },
    { title: "Governance copilot", body: "Consul simulates proposal economics and votes via delegated wallets, with full on-chain audit trail." },
    { title: "Predictive risk intelligence", body: "Oracle indexes 27+ protocols, audits and forum signals to produce daily protocol risk briefs." },
  ];
  return (
    <section className="border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">Capabilities</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">DeFi superpowers, on autopilot.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caps.map((c) => (
            <div key={c.title} className="surface-card rounded-2xl p-6">
              <div className="font-display text-lg font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  const pillars = [
    { title: "Non-custodial", body: "User funds never leave their wallet or signed vault. Agents act through scoped permissions." },
    { title: "Policy-bound agents", body: "Every action is bounded by user-signed policies — assets, venues, max slippage, risk caps." },
    { title: "Multi-layer audits", body: "Contracts audited by 3 firms. AI agents red-teamed against prompt injection and goal hijacking." },
    { title: "On-chain transparency", body: "Every agent decision and reasoning hash is logged to HashKey Chain for verifiable accountability." },
  ];
  return (
    <section id="security" className="border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">Security</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Trust, but verify — on-chain.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="surface-card rounded-2xl p-6">
              <div className="font-display text-lg font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          Stop managing DeFi. <br /><span className="text-gradient">Let it manage itself.</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Connect your wallet, sign a policy, and watch AtlasOS run your portfolio with on-chain transparency.
        </p>
        <div className="mt-10">
          <Link
            to="/app"
            className="inline-flex h-14 items-center gap-3 rounded-xl bg-gradient-primary px-8 font-display text-base font-medium text-primary-foreground shadow-[0_0_60px_oklch(0.82_0.16_200/0.45)] transition-transform hover:scale-[1.02]"
          >
            Launch AtlasOS
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
