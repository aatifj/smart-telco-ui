import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gift, AlertTriangle, Sparkles, Wifi } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

const items = [
  { i: AlertTriangle, c: "bg-warning/20 text-warning-foreground", t: "Your data expires tomorrow", s: "1.2 GB remaining · Renew now to save 20%", time: "2h ago" },
  { i: Gift, c: "bg-primary/10 text-primary", t: "🎁 Free 500 MB unlocked", s: "Daily reward credited to your line", time: "5h ago" },
  { i: Sparkles, c: "bg-info/10 text-info", t: "New offer: Mega Stream 50 GB", s: "Get 50 GB at ETB 1,499 · Limited time", time: "Yesterday" },
  { i: Wifi, c: "bg-primary/10 text-primary", t: "Bundle activated", s: "Daily Saver 1.5 GB is now active", time: "2d ago" },
];

function NotificationsPage() {
  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </header>

      <section className="mt-5 space-y-2 px-5">
        {items.map((n, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.c}`}>
              <n.i className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{n.t}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.s}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
