import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LogOut, User, Bell, Shield, HelpCircle, CreditCard } from "lucide-react";
import { usePersona, personaMeta } from "@/store/persona";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { persona, logout } = usePersona();
  const navigate = useNavigate();
  const meta = persona ? personaMeta[persona] : null;

  return (
    <div className="animate-fade-in pb-6">
      <header className="px-5 pt-5">
        <h1 className="text-lg font-semibold">Profile</h1>
      </header>

      <section className="mt-4 px-5">
        <div className={`relative overflow-hidden rounded-3xl ${meta?.gradient ?? "bg-gradient-primary"} p-5 text-primary-foreground shadow-elevated`}>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur">
              A
            </div>
            <div>
              <p className="text-base font-semibold">Abel Tesfaye</p>
              <p className="text-xs text-white/75">+251 9•• ••• 412</p>
              <span className="mt-1 inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
                {meta ? `${meta.emoji} ${meta.label}` : "Guest"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {[
            { i: User, l: "Account details" },
            { i: CreditCard, l: "Payment methods" },
            { i: Bell, l: "Notifications" },
            { i: Shield, l: "Security & privacy" },
            { i: HelpCircle, l: "Help center" },
          ].map((r, i, arr) => (
            <button key={r.l} className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <r.i className="h-4 w-4" />
              </span>
              <p className="flex-1 text-sm font-medium">{r.l}</p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={() => { logout(); navigate({ to: "/" }); }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3 text-sm font-semibold text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">Safaricom Ethiopia · v1.0.0</p>
      </section>
    </div>
  );
}
