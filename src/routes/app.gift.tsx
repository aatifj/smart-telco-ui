import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/gift")({
  component: GiftPage,
});

function GiftPage() {
  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Send a gift home</h1>
      </header>

      <section className="mt-5 px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Choose recipient</p>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-primary bg-primary/5 p-3.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary font-bold">M</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Mama</p>
            <p className="text-xs text-muted-foreground">+251 91• ••• 234</p>
          </div>
          <button className="text-xs font-semibold text-primary">Change</button>
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Choose what to send</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { t: "Airtime", e: "💰" },
            { t: "Bundle", e: "🎁", active: true },
          ].map((x) => (
            <button key={x.t} className={`rounded-2xl border p-4 text-left ${x.active ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <p className="text-2xl">{x.e}</p>
              <p className="mt-1 text-sm font-semibold">{x.t}</p>
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {[
            { n: "Family Data", d: "10 GB · 30 days", p: "$5.99" },
            { n: "Stay Connected", d: "5 GB + 100 min", p: "$3.99" },
            { n: "Mega Gift", d: "30 GB · 30 days", p: "$14.99" },
          ].map((b, i) => (
            <div key={b.n} className={`flex items-center justify-between rounded-2xl border bg-card p-3.5 shadow-soft ${i === 0 ? "border-primary" : "border-border"}`}>
              <div>
                <p className="text-sm font-semibold">{b.n}</p>
                <p className="text-xs text-muted-foreground">{b.d}</p>
              </div>
              <p className="text-sm font-bold">{b.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3. Pay with</p>
        <button className="mt-2 flex w-full items-center justify-between rounded-2xl border border-border bg-card p-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-12 items-center justify-center rounded-md bg-foreground text-[10px] font-bold text-background">VISA</span>
            <p className="text-sm font-semibold">•••• 4421</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </section>

      <section className="mt-6 px-5">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
          <Heart className="h-4 w-4 fill-white" /> Send $5.99 to Mama
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Stay connected with your family ❤️</p>
      </section>
    </div>
  );
}
