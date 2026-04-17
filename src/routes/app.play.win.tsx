import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Wallet, Lock, Smartphone } from "lucide-react";
import { useGames } from "@/store/games";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/play/win")({
  validateSearch: (s: Record<string, unknown>) => ({ id: String(s.id ?? "") }),
  component: WinPage,
});

function WinPage() {
  const { id } = Route.useSearch();
  const reward = useGames((s) => s.rewards.find((r) => r.id === id));
  const persona = usePersona((s) => s.persona);
  const isExplorer = persona === "explorer" || persona === "transition";

  if (!reward) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Reward not found.</p>
          <Link to="/app/play" className="mt-4 inline-block rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Back to games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden pb-8">
      {/* Confetti dots */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-2 w-2 animate-pop rounded-sm"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 80}%`,
              backgroundColor: ["oklch(0.62 0.19 145)", "oklch(0.78 0.16 75)", "oklch(0.65 0.14 230)", "oklch(0.6 0.18 30)"][i % 4],
              animationDelay: `${(i % 8) * 60}ms`,
              transform: `rotate(${(i * 17) % 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative px-5 pt-10 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
          <Sparkles className="h-3 w-3" /> You won!
        </span>
        <h1 className="mt-4 animate-pop text-4xl font-bold leading-tight">{reward.label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">From {reward.source === "trivia" ? "the trivia quiz" : "the spin wheel"}</p>

        <div className="mt-7 rounded-3xl border border-border bg-gradient-card p-5 text-left shadow-elevated">
          {reward.locked ? (
            <>
              <div className="flex items-center gap-2 text-warning-foreground">
                <Lock className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">Locked reward</p>
              </div>
              <p className="mt-2 text-sm font-medium">
                Activate a Safaricom SIM to redeem this prize.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/app/sim" className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-glow">
                  <Smartphone className="h-3.5 w-3.5" /> Order SIM
                </Link>
                <Link to="/app/sim" className="flex items-center justify-center gap-1.5 rounded-2xl border border-primary/30 bg-card py-3 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Get eSIM
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-success">Credited to your wallet</p>
              <p className="mt-2 text-sm">
                Your reward is saved to <span className="font-semibold">My Rewards</span>{isExplorer ? "" : " — apply on your next bundle purchase"}.
              </p>
            </>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link to="/app/play/rewards" className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-sm font-semibold">
            <Wallet className="h-4 w-4" /> Wallet
          </Link>
          <Link to="/app/play" className="rounded-2xl bg-foreground py-3 text-sm font-semibold text-background">
            Play again
          </Link>
        </div>
      </div>
    </div>
  );
}
