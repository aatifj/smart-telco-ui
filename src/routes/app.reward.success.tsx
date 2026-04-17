import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CheckCircle2, Gift, Smartphone, Sparkles, Lock, ChevronRight } from "lucide-react";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/reward/success")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const { reward } = usePersona.getState();
      if (!reward) throw redirect({ to: "/app/reward" });
    }
  },
  component: RewardSuccessPage,
});

function RewardSuccessPage() {
  const reward = usePersona((s) => s.reward);
  if (!reward) return null;

  return (
    <div className="animate-fade-in pb-6">
      {/* Hero */}
      <section className="px-5 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elevated">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-warning/40 blur-2xl" />
          <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary-glow/30 blur-2xl" />

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
              Step 2 of 2
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">
              🎉 Your reward is ready!
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Hi {reward.fullName.split(" ")[0]} — we've reserved a welcome bundle for you.
            </p>
          </div>
        </div>
      </section>

      {/* Reward bundle card */}
      <section className="mt-5 px-5">
        <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-warning/15 shadow-soft">
          <div className="flex items-start gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Gift className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">
                <Sparkles className="h-3 w-3" /> Welcome reward
              </span>
              <p className="mt-1.5 text-xl font-semibold">
                {reward.bundle.dataGb} GB Free Data + {reward.bundle.voiceMin} minutes
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Valid for {reward.validForDays} days after signup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-5 py-3">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[11px] font-medium text-muted-foreground">
              Redeem after activating your Safaricom SIM
            </p>
          </div>
        </div>
      </section>

      {/* Next step */}
      <section className="mt-5 px-5">
        <h3 className="text-sm font-semibold">Claim your SIM</h3>
        <div className="mt-3 space-y-2">
          <Link
            to="/app/sim"
            className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-glow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Order Safaricom SIM</p>
              <p className="text-xs text-white/80">Free delivery in Addis</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Link
            to="/app/sim"
            className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-card p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Get eSIM instantly</p>
              <p className="text-xs text-muted-foreground">Activate in under 5 minutes</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </section>

      <section className="mt-6 px-5">
        <Link
          to="/app"
          className="block w-full rounded-2xl border border-border bg-card py-3 text-center text-sm font-semibold"
        >
          Back to home
        </Link>
      </section>
    </div>
  );
}
