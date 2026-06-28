export function AtlasLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id="atlas-g" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="oklch(0.82 0.16 200)" />
            <stop offset="100%" stopColor="oklch(0.65 0.22 295)" />
          </linearGradient>
        </defs>
        <path d="M20 3 L35 11 V29 L20 37 L5 29 V11 Z" stroke="url(#atlas-g)" strokeWidth="1.5" fill="oklch(0.20 0.028 260 / 0.6)" />
        <circle cx="20" cy="20" r="4" fill="url(#atlas-g)" />
        <circle cx="20" cy="20" r="9" stroke="url(#atlas-g)" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
      </svg>
    </div>
  );
}

export function WordMark() {
  return (
    <div className="flex items-center gap-2.5">
      <AtlasLogo className="h-8 w-8" />
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">AtlasOS</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">DeFi · AI · HashKey</span>
      </div>
    </div>
  );
}
