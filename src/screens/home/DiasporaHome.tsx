import { Heart, Send, CreditCard, Plus, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Link } from "@tanstack/react-router";

const family = [
  { n: "Mama", p: "+251 91• ••• 234", a: "M", c: "bg-primary/15 text-primary" },
  { n: "Dawit", p: "+251 92• ••• 119", a: "D", c: "bg-info/15 text-info" },
  { n: "Selam", p: "+251 93• ••• 778", a: "S", c: "bg-warning/25 text-warning-foreground" },
  { n: "Kebede", p: "+251 94• ••• 332", a: "K", c: "bg-destructive/15 text-destructive" },
];

const giftBundles = [
  { n: "Family Data", d: "10 GB · 30 days", p: "ETB 599" },
  { n: "Stay Connected", d: "5 GB + 100 min", p: "ETB 399" },
  { n: "Mega Gift", d: "30 GB · 30 days", p: "ETB 1,499" },
];

export function DiasporaHome() {
  return (
    <div className="animate-fade-in">
      <AppHeader greeting="Welcome home" />

      {/* Hero */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-diaspora p-5 text-primary-foreground shadow-elevated">
          <div className="absolute -right-8 -bottom-8 text-[160px] opacity-10">💚</div>
          <Heart className="h-5 w-5 fill-white/30" />
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Send airtime home
          </h2>
          <p className="mt-1.5 text-sm text-white/85">
            Stay connected with family in Ethiopia — instantly, from anywhere.
          </p>
          <Link to="/app/gift" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-foreground">
            <Send className="h-4 w-4" /> Send now
          </Link>
        </div>
      </section>

      {/* Family list */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Your family</h3>
          <button className="text-xs font-semibold text-primary">+ Add</button>
        </div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          <button className="flex min-w-[64px] flex-col items-center gap-1.5">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">New</span>
          </button>
          {family.map((f) => (
            <button key={f.n} className="flex min-w-[64px] flex-col items-center gap-1.5">
              <span className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${f.c}`}>
                {f.a}
              </span>
              <span className="text-[11px] font-medium">{f.n}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Gift bundles */}
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">Bundle gifts</h3>
        <div className="mt-3 space-y-2">
          {giftBundles.map((b, i) => (
            <div key={b.n} className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-card p-4 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary text-lg">
                🎁
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{b.n}</p>
                <p className="text-xs text-muted-foreground">{b.d}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{b.p}</p>
                <button className="mt-0.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  {i === 0 ? "Gift" : "Send"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pay methods */}
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">Payment methods</h3>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-14 items-center justify-center rounded-lg bg-foreground text-[10px] font-bold text-background">VISA</span>
            <div>
              <p className="text-sm font-semibold">•••• 4421</p>
              <p className="text-xs text-muted-foreground">Expires 09/27</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-primary">Change</button>
        </div>
        <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border py-3 text-xs font-medium text-muted-foreground">
          <CreditCard className="h-4 w-4" /> Add new card
        </button>
      </section>

      {/* History */}
      <section className="mt-6 px-5 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent transfers</h3>
          <button className="flex items-center gap-0.5 text-xs font-semibold text-primary">
            All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { n: "Mama", d: "5 GB Bundle · Yesterday", a: "$12.50" },
            { n: "Dawit", d: "Airtime ETB 200 · 3d ago", a: "$4.20" },
          ].map((t) => (
            <div key={t.n + t.d} className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-soft">
              <div>
                <p className="text-sm font-semibold">To {t.n}</p>
                <p className="text-xs text-muted-foreground">{t.d}</p>
              </div>
              <p className="text-sm font-bold">{t.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
