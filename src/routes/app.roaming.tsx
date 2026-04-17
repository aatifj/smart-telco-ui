import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/app/roaming")({
  component: RoamingPage,
});

function RoamingPage() {
  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Roaming packs</h1>
      </header>

      <section className="mt-5 px-5">
        <div className="rounded-2xl bg-info/10 p-4 text-sm">
          <p className="font-semibold">📍 Currently in Kenya</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Activate a pack to save up to 80% on rates.</p>
        </div>
      </section>

      <div className="mt-5 space-y-2 px-5">
        {[
          { n: "Daily 500 MB", d: "Valid 24 hrs", p: "299" },
          { n: "Daily 1 GB + 30 min", d: "Valid 24 hrs", p: "499" },
          { n: "Weekly 3 GB", d: "Valid 7 days", p: "1,499" },
          { n: "Weekly 5 GB + 100 min", d: "Valid 7 days", p: "2,299" },
          { n: "Monthly 10 GB", d: "Valid 30 days", p: "4,999" },
          { n: "Unlimited Roam", d: "Valid 7 days · fair use", p: "3,999" },
          { n: "Mega 30 GB", d: "Valid 30 days", p: "9,999" },
        ].map((b) => (
          <div key={b.n} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div>
              <p className="text-sm font-semibold">{b.n}</p>
              <p className="text-xs text-muted-foreground">{b.d}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">ETB {b.p}</p>
              <button className="mt-0.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Activate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
