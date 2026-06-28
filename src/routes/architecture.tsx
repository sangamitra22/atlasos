import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/atlas/Nav";
import { Footer } from "@/components/atlas/Footer";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "AtlasOS · Architecture & Whitepaper" },
      { name: "description", content: "Complete system architecture: frontend, agents, smart contracts, AI layer, HSP and CCIP integrations." },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <article className="mx-auto max-w-4xl px-6 py-20">
        <div className="font-mono text-xs uppercase tracking-widest text-primary">Whitepaper · v1.0</div>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Architecture</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          AtlasOS is an autonomous DeFi operating system. It consists of four layers — frontend,
          agent network, execution layer and HashKey Chain — connected through cryptographically
          enforced policies and on-chain audit trails.
        </p>

        <Section title="1 · Frontend">
          <p>
            React + TanStack Start renders the dashboard, chat and governance surfaces.
            Wallet auth via SIWE; real-time agent telemetry through WebSocket.
          </p>
        </Section>

        <Section title="2 · Agent Network">
          <p>Six specialist agents — Sentinel, Harvester, Router, Oracle, Consul, Ledger.</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>LLM core (GPT-5-class) with structured tool calling via MCP</li>
            <li>Vector memory + RAG over protocol docs, audits, governance forums</li>
            <li>Shared on-chain reasoning bus — every decision hash anchored to HashKey Chain</li>
            <li>Policy contracts cryptographically bound to user signatures (no rogue execution)</li>
          </ul>
        </Section>

        <Section title="3 · Execution Layer">
          <p>Smart contracts on HashKey Chain Mainnet:</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li><b>AtlasVault.sol</b> — ERC-4626 vaults with strategy slots, scoped per-user</li>
            <li><b>PolicyManager.sol</b> — encodes allowed venues, assets, slippage, risk caps</li>
            <li><b>RiskEngine.sol</b> — oracle-driven health factor + circuit breakers</li>
            <li><b>HSPGateway.sol</b> — payment & streaming rails via HSP SDK</li>
            <li><b>CCIPRouter.sol</b> — Chainlink CCIP adapter for cross-chain execution</li>
            <li><b>Governor.sol</b> — UUPS-upgradeable, timelocked, emergency pause</li>
          </ul>
          <p className="mt-3">Security patterns: ReentrancyGuard, pull-payments, role-based access, oracle TWAPs, MEV-protected swaps.</p>
        </Section>

        <Section title="4 · HashKey Chain Integration">
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Deployed on HashKey Chain Mainnet (chain id 177)</li>
            <li>HSP for payment streams, payroll and merchant settlement</li>
            <li>Chainlink CCIP router for Ethereum ↔ HashKey bridging</li>
            <li>HashFans API for protocol & token metadata</li>
          </ul>
        </Section>

        <Section title="AI Capabilities">
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Predictive risk intelligence — protocol scoring with explainable features</li>
            <li>Self-improving yield strategies — reinforcement signal from realized PnL</li>
            <li>Autonomous liquidation defender — pre-empts via real-time TWAP simulation</li>
            <li>Governance copilot with proposal economic simulation</li>
            <li>Cross-chain MEV-aware routing</li>
            <li>Financial digital twin — agents simulate user's portfolio under stress</li>
          </ul>
        </Section>

        <Section title="Security model">
          <p>
            Funds remain in user-controlled vaults. Agents act only within signed policies.
            Every action is published to an on-chain audit log with a reasoning hash.
            Contracts audited by three independent firms. Agents red-teamed against
            prompt injection, goal hijacking and tool abuse.
          </p>
        </Section>

        <div className="mt-12 flex gap-3">
          <Link to="/app" className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-medium text-primary-foreground">Launch App →</Link>
          <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 text-sm">Back home</Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
