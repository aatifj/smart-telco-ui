import { Link } from "@tanstack/react-router";
import { Gamepad2, ChevronRight, Flame } from "lucide-react";
import { useGames } from "@/store/games";

export function PlayWinCard() {
  const playsToday = useGames((s) => s.playsToday);
  const max = useGames((s) => s.maxPlaysPerDay);
  const streak = useGames((s) => s.streakDays);
  const remaining = Math.max(0, max - playsToday);

  return (
    <section className="px-5">
      <Link
        to="/app/play"
        className="relative block overflow-hidden rounded-3xl border border-warning/40 bg-gradient-to-br from-warning/25 via-card to-primary/10 p-4 shadow-soft"
      >
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-warning/40 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-warning to-primary text-primary-foreground shadow-glow">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold">Play & Win Data Bundles 🎁</p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Answer, play, and win free data
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="relative mt-3 flex items-center justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{remaining > 0 ? `${remaining} free play${remaining > 1 ? "s" : ""} today` : "Come back tomorrow"}</span>
              <span>{playsToday}/{max}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-warning transition-all"
                style={{ width: `${(playsToday / max) * 100}%` }}
              />
            </div>
          </div>
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-warning/20 px-2 py-1 text-[10px] font-bold text-warning-foreground">
              <Flame className="h-3 w-3" /> {streak}d
            </span>
          )}
        </div>
      </Link>
    </section>
  );
}
