import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Disc3, Brain, Sparkles, Wallet, Flame, Trophy, Lock } from "lucide-react";
import { usePersona } from "@/store/persona";
import { useGames } from "@/store/games";
import { LifecycleBanner } from "@/components/LifecycleBanner";

export const Route = createFileRoute("/app/play")({
  component: PlayHubPage,
});

function PlayHubPage() {
  const persona = usePersona((s) => s.persona);
  const { playsToday, maxPlaysPerDay, streakDays, level, xp, rewards } = useGames();
  const remaining = Math.max(0, maxPlaysPerDay - playsToday);
  const isExplorer = persona === "explorer" || persona === "transition";

  // primary game per persona; both personas can access both, but order differs
  const games = isExplorer
    ? [
        { to: "/app/play/trivia", icon: Brain, title: "Trivia Quiz", sub: "Answer 3 questions", tag: "Recommended" },
        { to: "/app/play/spin", icon: Disc3, title: "Spin the Wheel", sub: "1 spin, instant prize", tag: null },
      ]
    : [
        { to: "/app/play/spin", icon: Disc3, title: "Spin the Wheel", sub: "1 spin, instant prize", tag: "Recommended" },
        { to: "/app/play/trivia", icon: Brain, title: "Trivia Quiz", sub: "Answer 3 questions", tag: null },
      ];

  const xpToNext = level === "Beginner" ? 150 : level === "Explorer" ? 500 : 1000;
  const pct = Math.min(100, (xp / xpToNext) * 100);

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/app" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Play & Win</h1>
          <p className="text-[11px] text-muted-foreground">Daily games · free rewards</p>
        </div>
      </header>

      <LifecycleBanner />

      {/* Progress card */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-warning/40 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75">Your level</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                <Trophy className="h-5 w-5 text-warning" /> {level}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75">Streak</p>
              <p className="mt-1 flex items-center justify-end gap-1 text-xl font-semibold">
                <Flame className="h-5 w-5 text-warning" /> {streakDays}d
              </p>
            </div>
          </div>
          <div className="relative mt-4">
            <div className="flex items-center justify-between text-[10px] font-medium text-white/80">
              <span>{xp} XP</span>
              <span>{xpToNext} XP</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="relative mt-4 flex items-center justify-between rounded-2xl bg-white/15 px-3 py-2 backdrop-blur">
            <span className="text-xs font-medium">Free plays today</span>
            <span className="text-sm font-bold">{remaining}/{maxPlaysPerDay}</span>
          </div>
        </div>
      </section>

      {/* Game tiles */}
      <section className="mt-5 px-5">
        <h2 className="text-sm font-semibold">Choose a game</h2>
        <div className="mt-3 space-y-2.5">
          {games.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-card p-4 shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <g.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold">{g.title}</p>
                  {g.tag && (
                    <span className="rounded-full bg-warning/25 px-1.5 py-0.5 text-[9px] font-bold uppercase text-warning-foreground">
                      {g.tag}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{g.sub}</p>
              </div>
              <Sparkles className="h-4 w-4 text-warning" />
            </Link>
          ))}
        </div>
      </section>

      {/* Rewards wallet teaser */}
      <section className="mt-5 px-5">
        <Link
          to="/app/play/rewards"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/20 text-warning-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">My Rewards</p>
            <p className="text-[11px] text-muted-foreground">
              {rewards.length === 0
                ? "Win a prize to start your wallet"
                : `${rewards.length} reward${rewards.length > 1 ? "s" : ""} · ${rewards.filter((r) => r.locked).length} locked`}
            </p>
          </div>
          {rewards.some((r) => r.locked) && <Lock className="h-4 w-4 text-muted-foreground" />}
        </Link>
      </section>
    </div>
  );
}
