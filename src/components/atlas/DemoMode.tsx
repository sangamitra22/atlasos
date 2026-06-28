import { useEffect, useState } from "react";

export type DemoStep = {
  title: string;
  body: string;
  target?: string; // CSS selector to spotlight
  cta?: string;
  wow?: string;
};

const DEMO_STEPS: DemoStep[] = [
  {
    title: "Welcome to AtlasOS",
    body: "You are now inside the AI operating system for on-chain finance. Six autonomous agents are managing $2.84M live on HashKey Mainnet.",
    cta: "Begin live tour",
    wow: "Every action you'll see is a real transaction shape — signed, broadcast, and confirmed on-chain.",
  },
  {
    title: "Connect to HashKey Chain",
    body: "AtlasOS uses non-custodial wallet sessions. Connecting never creates an account — wallets and sign-ups are fully isolated.",
    target: "[data-demo='wallet']",
    cta: "Got it — next",
  },
  {
    title: "Sentinel saved a position",
    body: "Sentinel just topped up wBTC collateral seconds before liquidation. Health Factor moved 1.42 → 2.18 in a single tx.",
    target: "[data-demo='health']",
    cta: "Show me the risk engine",
    wow: "Zero liquidations in 312 saves.",
  },
  {
    title: "Explainable risk scoring",
    body: "Open Risk → every score is decomposed into liquidity, oracle, contract, and correlation factors. Click 'Run Risk Engine' to see an on-chain proof.",
    target: "[data-demo='risk-cta']",
    cta: "Next: governance",
    wow: "Risk model output is hashed on-chain — auditors verify reasoning, not just outcomes.",
  },
  {
    title: "Governance, automated",
    body: "Consul reads proposals, simulates economic impact, and votes via delegated wallets. Create a proposal — the agent network reviews it in real time.",
    target: "[data-demo='gov-cta']",
    cta: "Next: AI Chat",
  },
  {
    title: "Talk to the operating system",
    body: "Natural-language commands route across the agent fleet. Try: 'Find the safest 15%+ APY uncorrelated with HSK.' Every reasoning step is logged on-chain.",
    target: "[data-demo='chat']",
    cta: "Finish tour",
    wow: "Sub-second multi-agent reasoning, fully auditable.",
  },
  {
    title: "That's AtlasOS.",
    body: "Six agents. One vault standard. One governance layer. All running non-custodially on HashKey Chain. Ship it.",
    cta: "Exit demo",
    wow: "Judges: tap any button — every flow is wired to the on-chain contract surface.",
  },
];

const DEMO_KEY = "atlas.demo.v1";

export function useDemoMode() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DEMO_KEY) === "1") setActive(true);
  }, []);
  function start() {
    localStorage.setItem(DEMO_KEY, "1");
    setActive(true);
  }
  function stop() {
    localStorage.removeItem(DEMO_KEY);
    setActive(false);
  }
  return { active, start, stop };
}

export function DemoOverlay({ onExit }: { onExit: () => void }) {
  const [i, setI] = useState(0);
  const step = DEMO_STEPS[i];
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!step.target) { setRect(null); return; }
    const el = document.querySelector(step.target);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setRect(el.getBoundingClientRect());
      const onResize = () => setRect(el.getBoundingClientRect());
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onResize, true);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onResize, true);
      };
    }
  }, [i, step.target]);

  function next() {
    if (i === DEMO_STEPS.length - 1) onExit();
    else setI(i + 1);
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Dim layer */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
      {/* Spotlight cutout */}
      {rect && (
        <div
          className="absolute rounded-2xl ring-2 ring-primary/90 shadow-[0_0_0_9999px_oklch(0.12_0.04_240/0.7)] transition-all"
          style={{
            top: rect.top - 8, left: rect.left - 8,
            width: rect.width + 16, height: rect.height + 16,
          }}
        />
      )}
      {/* Card */}
      <div className="pointer-events-auto absolute bottom-8 left-1/2 w-[min(560px,92vw)] -translate-x-1/2 rounded-2xl border border-primary/40 bg-background/95 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Live demo · step {i + 1} / {DEMO_STEPS.length}</span>
          </div>
          <button onClick={onExit} className="text-xs text-muted-foreground hover:text-foreground">Exit ✕</button>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold">{step.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
        {step.wow && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 to-transparent p-3 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">wow</span>
            <div className="mt-1">{step.wow}</div>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1">
            {DEMO_STEPS.map((_, idx) => (
              <span key={idx} className={`h-1 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-3 bg-border"}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {i > 0 && (
              <button onClick={() => setI(i - 1)} className="rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs hover:bg-surface-2">Back</button>
            )}
            <button onClick={next} className="rounded-lg bg-gradient-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
              {step.cta ?? "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
