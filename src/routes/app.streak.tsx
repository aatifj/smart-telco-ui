import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, Check, Lock, Gift, Sparkles, Trophy, CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { useStreak, STREAK_MILESTONES, nextMilestone, formatReward } from "@/store/streak";

export const Route = createFileRoute("/app/streak")({
  component: StreakPage,
});

function StreakPage() {
  const currentStreak = useStreak((s) => s.currentStreak);
  const bestStreak = useStreak((s) => s.bestStreak);
  const totalDays = useStreak((s) => s.totalDays);
  const lastCheckIn = useStreak((s) => s.lastCheckIn);
  const claimed = useStreak((s) => s.claimedMilestones);
  const pending = useStreak((s) => s.pendingMilestones);

  const next = nextMilestone(currentStreak);
  const progressToNext = next ? Math.min(100, (currentStreak / next.days) * 100) : 100;

  const last7 = useMemo(() => {
    const days: { label: string; date: string; done: boolean }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const diff = lastCheckIn ? Math.round((new Date(lastCheckIn).getTime() - d.getTime()) / 86400000) : -1;
      // Mark done if this date is within currentStreak window ending at lastCheckIn
      const done = lastCheckIn !== null && diff >= 0 && diff < currentStreak;
      days.push({ label: d.toLocaleDateString(undefined, { weekday: "narrow" }), date: iso, done });
    }
    return days;
  }, [lastCheckIn, currentStreak]);

  return (
    <div className="animate-fade-in pb-12">
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/app" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Daily Streak</h1>
          <p className="text-[11px] text-muted-foreground">Open the app every day to earn free data</p>
        </div>
      </header>

      {/* Hero card */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warning via-primary to-primary/80 p-6 text-primary-foreground shadow-glow">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              <p className="text-xs font-medium uppercase tracking-wider text-white/85">Current streak</p>
            </div>
            <p className="mt-1 text-5xl font-bold">{currentStreak}<span className="ml-1 text-base font-medium text-white/80">days</span></p>
            <p className="mt-1 text-xs text-white/80">
              {next
                ? `${next.days - currentStreak} day${next.days - currentStreak === 1 ? "" : "s"} until ${formatReward(next.dataMB)} reward`
                : "You've claimed every milestone — legend!"}
            </p>

            {next && (
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/80">
                  <span>{currentStreak} / {next.days}</span>
                  <span>{formatReward(next.dataMB)}</span>
                </div>
              </div>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/65">Best</p>
                <p className="mt-0.5 text-lg font-semibold">{bestStreak}d</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/65">Total</p>
                <p className="mt-0.5 text-lg font-semibold">{totalDays}d</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/65">Claimed</p>
                <p className="mt-0.5 text-lg font-semibold">{claimed.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last 7 days */}
      <section className="mt-6 px-5">
        <div className="mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">This week</h2>
        </div>
        <div className="flex items-center justify-between gap-1.5 rounded-2xl border border-border bg-card p-3 shadow-soft">
          {last7.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold ${
                  d.done
                    ? "bg-gradient-to-br from-warning to-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {d.done ? <Check className="h-4 w-4" /> : <Flame className="h-3.5 w-3.5 opacity-40" />}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="mt-6 px-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Milestones</h2>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {claimed.length}/{STREAK_MILESTONES.length} unlocked
          </p>
        </div>
        <ul className="space-y-2">
          {STREAK_MILESTONES.map((m) => {
            const isClaimed = claimed.includes(m.days);
            const isReady = pending.includes(m.days);
            const isLocked = currentStreak < m.days && !isReady && !isClaimed;
            const percent = Math.min(100, (currentStreak / m.days) * 100);
            return (
              <li
                key={m.days}
                className={`relative overflow-hidden rounded-2xl border p-4 shadow-soft transition-all ${
                  isReady
                    ? "border-warning bg-gradient-to-br from-warning/20 via-card to-card"
                    : isClaimed
                      ? "border-success/40 bg-success/5"
                      : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isReady
                        ? "bg-gradient-to-br from-warning to-primary text-primary-foreground shadow-glow"
                        : isClaimed
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isClaimed ? (
                      <Check className="h-5 w-5" />
                    ) : isReady ? (
                      <Gift className="h-5 w-5" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Flame className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{m.days}-day streak</p>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {formatReward(m.dataMB)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{m.label}</p>
                    {!isClaimed && !isReady && (
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary/70 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {isReady && (
                    <button
                      onClick={() => handleClaim(m.days)}
                      className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95"
                    >
                      Claim
                    </button>
                  )}
                  {isClaimed && (
                    <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success">
                      Claimed
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {m.days - currentStreak}d left
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-6 px-5">
        <div className="rounded-2xl border border-dashed border-border bg-card p-4 text-[11px] text-muted-foreground">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> How streaks work
          </p>
          <ul className="mt-2 space-y-1">
            <li>• Open the Safaricom app every day to keep your streak alive.</li>
            <li>• Miss a day and your streak resets to 1.</li>
            <li>• Claim free data rewards as you reach each milestone.</li>
            <li>• Rewards land in your Rewards wallet instantly.</li>
          </ul>
        </div>
      </section>

      {/* Celebration overlay */}
      {celebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-6 backdrop-blur-sm animate-fade-in"
          onClick={() => setCelebration(null)}
        >
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-warning via-primary to-primary/80 p-6 text-center text-primary-foreground shadow-glow">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
                <Gift className="h-8 w-8" />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-white/85">Reward unlocked</p>
              <p className="mt-1 text-3xl font-bold">{formatReward(celebration.mb)}</p>
              <p className="mt-1 text-sm text-white/85">{celebration.label}</p>
              <p className="mt-3 text-[11px] text-white/75">Added to your Rewards wallet.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCelebration(null)}
                  className="rounded-2xl bg-white/15 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur"
                >
                  Keep going
                </button>
                <Link
                  to="/app/play/rewards"
                  className="rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-primary"
                >
                  View rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
