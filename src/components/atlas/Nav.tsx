import { Link } from "@tanstack/react-router";
import { WordMark } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <WordMark />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#agents" className="transition-colors hover:text-foreground">Agents</a>
          <a href="/#architecture" className="transition-colors hover:text-foreground">Architecture</a>
          <a href="/#security" className="transition-colors hover:text-foreground">Security</a>
          <Link to="/architecture" className="transition-colors hover:text-foreground">Docs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/app" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
            Sign in
          </Link>
          <Link
            to="/app"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_0_24px_oklch(0.82_0.16_200/0.35)] transition-transform hover:scale-[1.02]"
          >
            Launch App
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
