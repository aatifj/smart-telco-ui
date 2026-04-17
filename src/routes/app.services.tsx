import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, Send, Globe, Tv, Wifi, Gift, Phone, Settings2 } from "lucide-react";

export const Route = createFileRoute("/app/services")({
  component: ServicesPage,
});

const services = [
  { i: Wallet, l: "M-PESA", c: "bg-primary/10 text-primary" },
  { i: Send, l: "Send Airtime", c: "bg-info/10 text-info" },
  { i: Globe, l: "Roaming", c: "bg-info/10 text-info", to: "/app/roaming" },
  { i: Tv, l: "Showmax", c: "bg-destructive/10 text-destructive" },
  { i: Wifi, l: "Home WiFi", c: "bg-primary/10 text-primary" },
  { i: Gift, l: "Send Bundle", c: "bg-warning/20 text-warning-foreground", to: "/app/gift" },
  { i: Phone, l: "Voicemail", c: "bg-secondary text-foreground" },
  { i: Settings2, l: "Manage line", c: "bg-secondary text-foreground" },
];

function ServicesPage() {
  return (
    <div className="animate-fade-in pb-6">
      <header className="px-5 pt-5">
        <h1 className="text-lg font-semibold">Services</h1>
        <p className="text-xs text-muted-foreground">Everything Safaricom in one place</p>
      </header>

      <section className="mt-5 px-5">
        <div className="grid grid-cols-3 gap-3">
          {services.map((s) =>
            s.to ? (
              <Link key={s.l} to={s.to} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.c}`}>
                  <s.i className="h-5 w-5" />
                </span>
                <p className="text-center text-[11.5px] font-semibold leading-tight">{s.l}</p>
              </Link>
            ) : (
              <div key={s.l} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.c}`}>
                  <s.i className="h-5 w-5" />
                </span>
                <p className="text-center text-[11.5px] font-semibold leading-tight">{s.l}</p>
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">Promotions</h3>
        <div className="mt-3 overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">Limited</span>
          <p className="mt-3 text-lg font-semibold">2x bonus on every top-up</p>
          <p className="mt-1 text-xs text-white/80">Top up ETB 100+ and get matching airtime free.</p>
          <button className="mt-4 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-primary">Top up now</button>
        </div>
      </section>
    </div>
  );
}
