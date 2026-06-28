import { WordMark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <WordMark />
          <p className="max-w-xs text-sm text-muted-foreground">
            Self-driving DeFi. Built for HashKey Chain. Non-custodial, transparent, on-chain.
          </p>
        </div>
        {[
          { title: "Product", items: ["Agents", "Vaults", "Risk Engine", "Treasury"] },
          { title: "Developers", items: ["Documentation", "HSP SDK", "Contracts", "Audits"] },
          { title: "Company", items: ["About", "Careers", "Blog", "Press"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">{col.title}</div>
            <ul className="space-y-2 text-sm">
              {col.items.map((i) => (
                <li key={i}><a className="text-foreground/80 transition-colors hover:text-primary" href="#">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© 2026 AtlasOS Labs · Deployed on HashKey Chain Mainnet</div>
          <div className="font-mono">Contract: 0xA71A5...0S99 · CCIP Router: 0x3C3D7...e2A1</div>
        </div>
      </div>
    </footer>
  );
}
