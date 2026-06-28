import { useState } from "react";
import { connectWallet, disconnectWallet, shortAddr, useHydrateWallet, useWallet, HASHKEY_CHAIN } from "@/lib/atlas-chain";

export function WalletButton() {
  useHydrateWallet();
  const wallet = useWallet();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  async function onConnect() {
    setBusy(true);
    try { await connectWallet(); } finally { setBusy(false); }
  }

  if (!wallet) {
    return (
      <button
        onClick={onConnect}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        <span className="h-2 w-2 rounded-full bg-white/90" />
        {busy ? "Connecting…" : "Connect HashKey Wallet"}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-sm transition-colors hover:bg-surface-2"
      >
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
        <span className="font-mono">{shortAddr(wallet.address)}</span>
        <span className="font-mono text-[10px] text-muted-foreground">·  HSK</span>
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-border/60 bg-background/95 p-3 backdrop-blur-xl shadow-2xl">
          <div className="rounded-lg border border-border/60 bg-surface/60 p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Connected</div>
            <div className="mt-1 break-all font-mono text-xs">{wallet.address}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><div className="text-muted-foreground">Network</div><div className="font-mono">{HASHKEY_CHAIN.name}</div></div>
              <div><div className="text-muted-foreground">Chain ID</div><div className="font-mono">{HASHKEY_CHAIN.chainId}</div></div>
            </div>
          </div>
          <button
            onClick={() => { disconnectWallet(); setOpen(false); }}
            className="mt-2 w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            Disconnect wallet
          </button>
          <p className="mt-2 px-1 text-[10px] text-muted-foreground">
            Wallet sessions are independent from account sign-ups — disconnecting here never signs you out of AtlasOS.
          </p>
        </div>
      )}
    </div>
  );
}
