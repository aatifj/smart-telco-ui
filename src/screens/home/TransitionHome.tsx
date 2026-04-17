import { Package, Truck, CheckCircle2, Lock, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Link } from "@tanstack/react-router";

const steps = [
  { i: Package, l: "Ordered", d: "Apr 14", done: true },
  { i: Truck, l: "Shipped", d: "In transit", done: true, active: true },
  { i: CheckCircle2, l: "Activated", d: "Pending", done: false },
];

export function TransitionHome() {
  return (
    <div className="animate-fade-in">
      <AppHeader greeting="Almost there" />

      {/* Hero status */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elevated">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-glow/30 blur-2xl" />
          <p className="text-xs font-medium uppercase tracking-wider text-white/75">Order #SAF-29841</p>
          <h2 className="mt-1 text-xl font-semibold">Your SIM is on the way</h2>
          <p className="mt-1 text-sm text-white/80">Estimated delivery: Tomorrow, 2–6 PM</p>

          {/* Tracker */}
          <div className="mt-6 flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.l} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && <div className={`h-0.5 flex-1 ${steps[i - 1].done ? "bg-white" : "bg-white/20"}`} />}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      s.done ? "bg-white text-primary" : "bg-white/15 text-white"
                    } ${s.active ? "ring-4 ring-white/30" : ""}`}
                  >
                    <s.i className="h-4 w-4" />
                  </div>
                  {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${s.done && steps[i + 1].done ? "bg-white" : "bg-white/20"}`} />}
                </div>
                <p className="mt-2 text-[11px] font-semibold">{s.l}</p>
                <p className="text-[10px] text-white/65">{s.d}</p>
              </div>
            ))}
          </div>

          <Link to="/app/sim" className="mt-5 block w-full rounded-2xl bg-white py-3 text-center text-sm font-semibold text-primary">
            Activate SIM to unlock
          </Link>
        </div>
      </section>

      {/* What's coming */}
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">What you'll unlock</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { e: "📶", t: "Faster 4G+", s: "Premium speeds" },
            { e: "💰", t: "M-PESA", s: "Built-in wallet" },
            { e: "🎁", t: "Welcome 10GB", s: "Free on activation" },
            { e: "✨", t: "Daily rewards", s: "Bonus offers" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
              <p className="text-xl">{x.e}</p>
              <p className="mt-1.5 text-sm font-semibold">{x.t}</p>
              <p className="text-[11px] text-muted-foreground">{x.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Locked bundles */}
      <section className="mt-6 px-5 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Browse bundles</h3>
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Lock className="h-3 w-3" /> Locked
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { n: "Daily 1.5 GB", p: "ETB 49" },
            { n: "Weekly 8 GB + 30 min", p: "ETB 299" },
            { n: "Monthly 30 GB", p: "ETB 899" },
          ].map((b) => (
            <div key={b.n} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 opacity-80 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{b.n}</p>
                  <p className="text-xs text-muted-foreground">Available after activation</p>
                </div>
              </div>
              <p className="text-sm font-bold text-muted-foreground">{b.p}</p>
            </div>
          ))}
        </div>

        <Link to="/app/sim" className="mt-4 flex items-center justify-between rounded-2xl bg-foreground p-4 text-background">
          <div>
            <p className="text-sm font-semibold">Have your SIM already?</p>
            <p className="text-xs text-background/70">Activate in under 2 minutes</p>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
