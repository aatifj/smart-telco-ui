import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Smartphone, Truck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/sim")({
  component: SimPage,
});

function SimPage() {
  const [tab, setTab] = useState<"esim" | "physical">("esim");
  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Get a Safaricom SIM</h1>
      </header>

      <div className="mt-5 px-5">
        <div className="flex gap-2 rounded-2xl bg-secondary p-1">
          <button onClick={() => setTab("esim")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold ${tab === "esim" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>
            eSIM (instant)
          </button>
          <button onClick={() => setTab("physical")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold ${tab === "physical" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>
            Physical SIM
          </button>
        </div>
      </div>

      <section className="mt-5 px-5">
        {tab === "esim" ? (
          <div className="rounded-3xl border border-border bg-gradient-card p-5 shadow-soft">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Smartphone className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold">Activate eSIM in 5 minutes</p>
            <p className="mt-1 text-xs text-muted-foreground">Works with iPhone XS+ and most modern Android devices.</p>

            <ul className="mt-4 space-y-2 text-xs">
              {["Verify ID with passport / Fayda", "Choose your number", "Scan QR to install eSIM"].map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>

            <button className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
              Continue · ETB 99
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-gradient-card p-5 shadow-soft">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-info/10 text-info">
              <Truck className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold">Free home delivery</p>
            <p className="mt-1 text-xs text-muted-foreground">Delivered within 24 hours in Addis Ababa.</p>

            <div className="mt-4 space-y-2.5">
              <input placeholder="Full name" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              <input placeholder="Delivery address" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              <input placeholder="ID / Fayda number" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
              <CheckCircle2 className="h-4 w-4" /> Order SIM · Free
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
