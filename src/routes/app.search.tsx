import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";

export const Route = createFileRoute("/app/search")({
  component: SearchPage,
});

function SearchPage() {
  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input autoFocus placeholder="Search bundles, services…" className="w-full bg-transparent text-sm outline-none" />
        </div>
      </header>

      <section className="mt-6 px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trending</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Daily 1.5GB", "Mega Stream", "Roaming Kenya", "M-PESA limit", "eSIM", "Send airtime", "Night Owl"].map((t) => (
            <button key={t} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium">
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
        <div className="mt-3 space-y-1">
          {["Weekly 8GB", "Buy SMS", "Roaming UAE"].map((t) => (
            <button key={t} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left">
              <Search className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{t}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
