import { Link } from "@tanstack/react-router";
import { Sparkles, Smartphone, Zap, Check, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export function ExplorerHome() {
  return (
    <div className="animate-fade-in">
      <AppHeader greeting="Welcome" />

      {/* Hero */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary-glow/30 blur-2xl" />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3 w-3" /> Ethiopia's smartest network
          </span>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Join Safaricom Ethiopia
          </h2>
          <p className="mt-1.5 text-sm text-white/80">
            Get an eSIM in minutes or order a physical SIM home — free delivery in Addis.
          </p>
          <div className="mt-5 flex gap-2">
            <Link to="/app/sim" className="flex-1 rounded-2xl bg-white px-3 py-3 text-center text-sm font-semibold text-primary">
              Get eSIM now
            </Link>
            <Link to="/app/sim" className="flex-1 rounded-2xl bg-white/15 px-3 py-3 text-center text-sm font-semibold text-white backdrop-blur">
              Order SIM
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">Why Safaricom</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { i: Zap, t: "Faster 4G+", s: "Top speeds" },
            { i: Smartphone, t: "M-PESA", s: "Mobile money" },
            { i: Sparkles, t: "Daily offers", s: "Save more" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-3 text-center shadow-soft">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <x.i className="h-4 w-4" />
              </span>
              <p className="mt-2 text-xs font-semibold">{x.t}</p>
              <p className="text-[10px] text-muted-foreground">{x.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse bundles (locked) */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Preview bundles</h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Activate with SIM</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { n: "Daily 1.5 GB", p: "ETB 49" },
            { n: "Weekly 8 GB + 30 min", p: "ETB 299" },
            { n: "Monthly 30 GB", p: "ETB 899" },
          ].map((b) => (
            <div key={b.n} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 shadow-soft">
              <div>
                <p className="text-sm font-semibold">{b.n}</p>
                <p className="text-xs text-muted-foreground">Includes free social apps</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{b.p}</p>
                <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">🔒 SIM needed</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">How we compare</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4">
            <p className="text-xs font-bold text-primary">SAFARICOM</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              {["Faster 4G+", "M-PESA built-in", "eSIM ready", "Daily rewards"].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-bold text-muted-foreground">OTHERS</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li>Standard 4G</li>
              <li>No mobile money</li>
              <li>Physical SIM only</li>
              <li>Limited offers</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5 pb-6">
        <Link to="/app/sim" className="flex items-center justify-between rounded-2xl bg-foreground p-4 text-background">
          <div>
            <p className="text-sm font-semibold">Ready to switch?</p>
            <p className="text-xs text-background/70">Activate eSIM in under 5 minutes</p>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
