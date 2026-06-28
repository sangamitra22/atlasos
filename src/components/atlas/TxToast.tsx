import type { TxResult, TxStatus } from "@/lib/atlas-chain";

export function TxToast({
  status, step, result, error, onClose,
}: {
  status: TxStatus;
  step: { i: number; label: string } | null;
  result: TxResult | null;
  error: string | null;
  onClose: () => void;
}) {
  if (status === "idle") return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl border border-border/60 bg-background/95 p-4 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${
            status === "success" ? "bg-success"
            : status === "error" ? "bg-destructive"
            : "animate-pulse-glow bg-primary"
          }`} />
          <div className="font-display text-sm font-semibold">
            {status === "signing" && "Awaiting signature"}
            {status === "pending" && "Transaction pending"}
            {status === "success" && "Transaction confirmed"}
            {status === "error" && "Transaction failed"}
          </div>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
      </div>
      {step && status !== "success" && (
        <div className="mt-3 font-mono text-xs text-muted-foreground">
          step {step.i + 1} · {step.label}…
        </div>
      )}
      {result && (
        <div className="mt-3 space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-mono">{result.method}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Block</span><span className="font-mono">#{result.block.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Gas</span><span className="font-mono">{result.gas}</span></div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Tx</span>
            <a href={result.explorer} target="_blank" rel="noreferrer" className="truncate font-mono text-primary hover:underline">{result.hash.slice(0, 18)}…</a>
          </div>
        </div>
      )}
      {error && <div className="mt-3 text-xs text-destructive">{error}</div>}
    </div>
  );
}
