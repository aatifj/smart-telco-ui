import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Gift, ShieldCheck, Zap, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useStreak, STREAK_MILESTONES, formatReward } from "@/store/streak";
import { useGames } from "@/store/games";

export const Route = createFileRoute("/app/streak/claim/$days")({
  component: ClaimConfirmPage,
});

function ClaimConfirmPage() {
  const { days } = Route.useParams();
  const navigate = useNavigate();
  const daysNum = parseInt(days, 10);

  const milestone = STREAK_MILESTONES.find((m) => m.days === daysNum);
  const pending = useStreak((s) => s.pendingMilestones);
  const claimMilestone = useStreak((s) => s.claimMilestone);
  const addReward = useGames((s) => s.addReward);

  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const isPending = pending.includes(daysNum);

  if (!milestone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">Invalid milestone.</p>
        <Link to="/app/streak" className="mt-4 text-sm font-semibold text-primary">
          Back to streaks
        </Link>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!isPending || claiming) return;
    setClaiming(true);
    setTimeout(() => {
      const m = claimMilestone(daysNum);
      if (m) {
        addReward({
          kind: "data",
          label: `${formatReward(m.dataMB)} Streak Reward`,
          amount: m.dataMB,
          source: "streak",
          locked: false,
        });
      }
      setClaiming(false);
      setClaimed(true);
    }, 600);
  };

  return (
    <div className="animate-fade-in flex min-h-screen flex-col pb-6">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => navigate({ to: "/app/streak" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">Claim reward</h1>
          <p className="text-[11px] text-muted-foreground">Review before confirming</p>
        </div>
      </header>

      {/* Reward card */}
      <section className="px-5 pt-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warning via-primary to-primary/80 p-6 text-primary-foreground shadow-glow">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <Gift className="h-7 w-7" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-white/85">
              {milestone.days}-day streak unlocked
            </p>
            <p className="mt-1 text-4xl font-bold">{formatReward(milestone.dataMB)}</p>
            <p className="mt-1 text-sm text-white/85">{milestone.label}</p>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="mt-5 px-5">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Instant delivery</p>
              <p className="text-[11px] text-muted-foreground">Added to your Rewards wallet immediately</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Free data bundle</p>
              <p className="text-[11px] text-muted-foreground">Redeem anytime from your Rewards wallet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning-foreground">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">No expiry on reward</p>
              <p className="text-[11px] text-muted-foreground">Stays in your wallet until you activate it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm area */}
      {!claimed ? (
        <div className="mt-auto px-5 pt-8">
          <button
            onClick={handleConfirm}
            disabled={!isPending || claiming}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {claiming ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <>
                <Gift className="h-4 w-4" />
                Confirm claim
              </>
            )}
          </button>
          <button
            onClick={() => navigate({ to: "/app/streak" })}
            className="mt-3 block w-full rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          {!isPending && (
            <p className="mt-3 text-center text-[11px] text-destructive">
              This reward is no longer available to claim.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-auto px-5 pt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <p className="mt-3 text-lg font-semibold">Reward claimed!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatReward(milestone.dataMB)} added to your Rewards wallet.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              to="/app/streak"
              className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold"
            >
              Back to streaks
            </Link>
            <Link
              to="/app/play/rewards"
              className="rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              View rewards
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
