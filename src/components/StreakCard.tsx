import { Link } from "@tanstack/react-router";
import { Flame, ChevronRight, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useStreak, nextMilestone, formatReward } from "@/store/streak";

export function StreakCard() {
  const currentStreak = useStreak((s) => s.currentStreak);
  const pending = useStreak((s) => s.pendingMilestones);
  const checkIn = useStreak((s) => s.checkIn);
  const [justChecked, setJustChecked] = useState(false);

  useEffect(() => {
    const res = checkIn();
    if (!res.alreadyChecked) setJustChecked(true);
  }, [checkIn]);

  const next = nextMilestone(currentStreak);
  const hasPending = pending.length > 0;
  const progress = next ? Math.min(100, (currentStreak / next.days) * 100) : 100;

  return (
    <Link
      to="/app/streak"
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-warning/15 via-card to-card p-4 shadow-soft transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] hover:shadow-elevated"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-warning/20 blur-2xl" />
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-warning to-warning/70 text-warning-foreground shadow-glow">
        <Flame className="h-6 w-6" />
        {hasPending && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-card">
            {pending.length}
          </span>
        )}
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            {currentStreak} day{currentStreak === 1 ? "" : "s"} streak
          </p>
          {justChecked && (
            <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">
              +1 today
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {hasPending
            ? "Reward ready to claim"
            : next
              ? `${next.days - currentStreak} day${next.days - currentStreak === 1 ? "" : "s"} to ${formatReward(next.dataMB)}`
              : "All milestones unlocked"}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-warning to-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="relative flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-[10px] font-semibold text-warning-foreground">
        {hasPending ? <Gift className="h-3 w-3" /> : null}
        {hasPending ? "Claim" : "View"}
        <ChevronRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
