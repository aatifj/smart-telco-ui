import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Check, Sparkles, Smartphone, Wallet } from "lucide-react";
import { useGames } from "@/store/games";
import { usePersona, useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/play/rewards")({
  component: RewardsWalletPage,
});

function RewardsWalletPage() {
  const rewards = useGames((s) => s.rewards);
  const redeem = useGames((s) => s.redeemReward);
  const persona = usePersona((s) => s.persona);
  const { isSuspended, isDeactivated } = useLifecycleGuard();
  const isExplorer = persona === "explorer" || persona === "transition";

  const active = rewards.filter((r) => !r.locked && !r.redeemed);
  const locked = rewards.filter((r) => r.locked);
  const used = rewards.filter((r) => r.redeemed);

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/app/play" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">My Rewards</h1>
          <p className="text-[11px] text-muted-foreground">Game wins · welcome bonuses</p>
        </div>
      </header>

      {rewards.length === 0 && (
        <div className="mx-5 rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold">No rewards yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Play a game to win free data</p>
          <Link to="/app/play" className="mt-4 inline-block rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Play now
          </Link>
        </div>
      )}

      {active.length > 0 && (
        <section className="px-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available ({active.length})</h2>
          <div className="space-y-2">
            {active.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-card p-4 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/15 text-success">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">From {r.source}</p>
                </div>
                <button
                  disabled={isSuspended || isDeactivated}
                  onClick={() => redeem(r.id)}
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
                >
                  {isSuspended || isDeactivated ? "Locked" : "Redeem"}
                </button>
              </div>
            ))}
          </div>
          {isSuspended && (
            <p className="mt-2 text-[11px] text-warning-foreground">Recharge to unlock your rewards.</p>
          )}
        </section>
      )}

      {locked.length > 0 && (
        <section className="mt-5 px-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Locked ({locked.length})</h2>
          <div className="space-y-2">
            {locked.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-[11px] text-muted-foreground">Activate Safaricom SIM to redeem</p>
                </div>
              </div>
            ))}
          </div>
          {isExplorer && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/app/sim" className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-glow">
                <Smartphone className="h-3.5 w-3.5" /> Order SIM
              </Link>
              <Link to="/app/sim" className="flex items-center justify-center gap-1.5 rounded-2xl border border-primary/30 bg-card py-3 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Get eSIM
              </Link>
            </div>
          )}
        </section>
      )}

      {used.length > 0 && (
        <section className="mt-5 px-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Redeemed</h2>
          <div className="space-y-2">
            {used.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 opacity-60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-through">{r.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
