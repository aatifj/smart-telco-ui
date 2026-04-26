import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Lock as Lock, RefreshCw, ChevronRight } from "lucide-react";
import { useLifecycleGuard } from "@/store/persona";
import { LifecycleBanner } from "@/components/LifecycleBanner";

export const Route = createFileRoute("/app/bundles")({
  component: BundlesPage,
});

const cats = ["Daily", "Weekly", "Monthly", "Unlimited", "Mega"];
const bundles = [
  { n: "Daily Mini", d: "500 MB", p: "19", v: "24 hrs", tag: "" },
  { n: "Daily Saver", d: "1.5 GB", p: "49", v: "24 hrs", tag: "Popular" },
  { n: "Daily Plus", d: "3 GB + 30 min", p: "99", v: "24 hrs", tag: "" },
  { n: "Daily Mega", d: "5 GB", p: "149", v: "24 hrs", tag: "Best value" },
];

function BundlesPage() {
  const [active, setActive] = useState(0);
  const { isRestricted } = useLifecycleGuard();
  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Bundles</h1>
      </header>

      <LifecycleBanner />

      <section className="mt-4 px-5">
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
      </section>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {cats.map((c, i) => (
          <button
            key={c}
            onClick={() => setActive(i)}
            disabled={isRestricted}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all disabled:opacity-50 ${
              i === active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
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
          {bundles.map((b) => (
            <div key={b.n} className={`flex items-center gap-3 rounded-2xl border border-border bg-gradient-card p-4 shadow-soft ${isRestricted ? "opacity-60" : ""}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl">
                📶
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{b.n}</p>
                  {b.tag && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">{b.tag}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{b.d} · {b.v}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">ETB {b.p}</p>
                <button
                  disabled={isRestricted}
                  className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
                >
                  {isRestricted ? <Lock className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
