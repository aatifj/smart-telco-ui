import { Link } from "@tanstack/react-router";
import { Globe, AlertCircle, Plane, ChevronRight, Lock as LockIcon, LifeBuoy } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LifecycleBanner } from "@/components/LifecycleBanner";
import { useLifecycleGuard } from "@/store/persona";

const roamingBundles = [
  { n: "Daily Roam 500 MB", c: "🇰🇪 Kenya", p: "ETB 299", tag: "1 day" },
  { n: "Weekly Roam 3 GB", c: "🇦🇪 UAE", p: "ETB 1,499", tag: "7 days" },
  { n: "Monthly Roam 10 GB", c: "🇺🇸 USA", p: "ETB 4,999", tag: "30 days" },
  { n: "Mega Roam 30 GB", c: "🌍 Global", p: "ETB 9,999", tag: "30 days" },
];

export function RoamingHome() {
  const { isRestricted, isSuspended, isDeactivated } = useLifecycleGuard();
  const blockPurchase = isRestricted;

  return (
    <div className="animate-fade-in">
      <AppHeader greeting={isDeactivated ? "Line deactivated" : isSuspended ? "Line suspended" : "Roaming detected"} />

      <LifecycleBanner />

      {/* Roaming alert */}
      <section className="px-5">
        <div className="flex items-start gap-3 rounded-2xl border border-info/30 bg-info/8 p-3.5">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-info/15 text-info">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">You are roaming in 🇰🇪 Kenya</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Standard charges apply. Activate a roaming pack to save up to 80%.
            </p>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="mt-4 px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-roaming p-5 text-primary-foreground shadow-elevated">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-white/75">Active in</p>
              <Globe className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-semibold">Nairobi, Kenya</p>
            <p className="text-xs text-white/70">Network: Safaricom Kenya · 4G</p>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/65">Roaming data</p>
                <p className="mt-1 text-base font-semibold">No active pack</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/65">Pay-as-you-go</p>
                <p className="mt-1 text-base font-semibold">ETB 0.45/MB</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                disabled={blockPurchase}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-info disabled:opacity-55"
              >
                {blockPurchase && <LockIcon className="h-3 w-3" />}
                Buy roaming pack
              </button>
              <button className="rounded-xl bg-white/15 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur">Check rates</button>
            </div>
          </div>
        </div>
      </section>

      {/* Report roaming issue */}
      <section className="mt-4 px-5">
        <Link
          to="/app/roaming-report"
          className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-gradient-to-br from-warning/10 via-card to-card p-4 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/20 text-warning-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Having issues while roaming?</p>
            <p className="text-xs text-muted-foreground">Report problems with calls, data, or SMS abroad.</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-[10px] font-semibold text-warning-foreground">
            Report <ChevronRight className="h-3 w-3" />
          </span>
        </Link>
      </section>
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">Popular destinations</h3>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {[
            { f: "🇰🇪", n: "Kenya", a: true },
            { f: "🇦🇪", n: "UAE" },
            { f: "🇸🇦", n: "Saudi" },
            { f: "🇺🇸", n: "USA" },
            { f: "🇬🇧", n: "UK" },
            { f: "🇨🇳", n: "China" },
          ].map((c) => (
            <button
              key={c.n}
              className={`flex min-w-[72px] flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 ${
                c.a ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <span className="text-2xl">{c.f}</span>
              <span className="text-[11px] font-medium">{c.n}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Bundles */}
      <section className="mt-6 px-5 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Roaming bundles</h3>
          <Link to="/app/roaming" className="flex items-center gap-0.5 text-xs font-semibold text-primary">
            All packs <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {roamingBundles.map((b, i) => (
            <div key={b.n} className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft ${blockPurchase ? "opacity-60" : ""}`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${i === 3 ? "bg-gradient-roaming text-primary-foreground" : "bg-secondary"} text-lg`}>
                {i === 3 ? <Plane className="h-5 w-5" /> : b.c.split(" ")[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{b.n}</p>
                <p className="text-xs text-muted-foreground">{b.c} · {b.tag}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{b.p}</p>
                <button
                  disabled={blockPurchase}
                  className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
                >
                  {blockPurchase && <LockIcon className="h-3 w-3" />}
                  {blockPurchase ? "Locked" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
