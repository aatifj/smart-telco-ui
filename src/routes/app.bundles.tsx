import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, RefreshCw, ChevronRight, Sparkles, Coins } from "lucide-react";
import { useLifecycleGuard } from "@/store/persona";
import { LifecycleBanner } from "@/components/LifecycleBanner";
import { bundleCatalog, loyaltyPointsFor, type Category } from "@/lib/catalog";

export const Route = createFileRoute("/app/bundles")({
  component: BundlesPage,
});

const cats: Category[] = ["Daily", "Weekly", "Monthly", "Unlimited", "Mega"];

function BundlesPage() {
  const [active, setActive] = useState<Category>("Daily");
  const { isRestricted } = useLifecycleGuard();
  const visible = bundleCatalog.filter((b) => b.category === active);

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Bundles</h1>
      </header>

      <LifecycleBanner />

      <section className="mt-4 px-5 grid gap-2">
        <Link
          to="/app/my-bundles"
          className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-soft"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">My bundles</p>
            <p className="text-xs text-muted-foreground">Renew, auto-renew or change active plans</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          to="/app/advance"
          className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-gradient-to-br from-warning/10 via-card to-card p-4 shadow-soft"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-warning/20 text-warning-foreground">
            <Coins className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Get airtime advance</p>
            <p className="text-xs text-muted-foreground">Borrow airtime now, repay on next top-up</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            disabled={isRestricted}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all disabled:opacity-50 ${
              c === active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 px-5">
        {isRestricted ? (
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4 opacity-70">
            <div>
              <p className="text-sm font-semibold">✨ Build your own combo</p>
              <p className="text-xs text-muted-foreground">Locked — top up to unlock</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Lock className="h-3 w-3" /> Locked
            </span>
          </div>
        ) : (
          <Link to="/app/diy" className="mb-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div>
              <p className="text-sm font-semibold">✨ Build your own combo</p>
              <p className="text-xs text-muted-foreground">Custom data + voice + SMS</p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Build</span>
          </Link>
        )}

        <div className="space-y-2">
          {visible.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">No bundles in this category yet.</p>
          )}
          {visible.map((b) => {
            const points = loyaltyPointsFor(b.price);
            const card = (
              <div className={`flex items-center gap-3 rounded-2xl border border-border bg-gradient-card p-4 shadow-soft ${isRestricted ? "opacity-60" : ""}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl">
                  {b.icon ?? "📶"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{b.name}</p>
                    {b.tag && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">{b.tag}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{b.data} · {b.validity}</p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    <Sparkles className="h-2.5 w-2.5" /> +{points} pts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">ETB {b.price}</p>
                  <span className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                    Buy
                  </span>
                </div>
              </div>
            );
            return isRestricted ? (
              <div key={b.id} aria-disabled>{card}</div>
            ) : (
              <Link key={b.id} to="/app/buy/$bundleId" params={{ bundleId: b.id }}>
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
