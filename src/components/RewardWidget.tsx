import { Link } from "@tanstack/react-router";
import { Lock, Sparkles, Smartphone, ChevronRight, Clock } from "lucide-react";
import { usePersona } from "@/store/persona";

/**
 * Persistent locked reward widget shown on Explorer + Transition home
 * once a Persona 2 user has captured their lead.
 *
 * - Persona 2 (explorer): shows "Locked – Activate Safaricom SIM to redeem"
 *   + Order SIM / Get eSIM CTAs.
 * - Persona 5 (transition): shows "Ready to redeem after activation" with a
 *   single Activate CTA — copy reflects the post-purchase journey.
 */
export function RewardWidget() {
  const reward = usePersona((s) => s.reward);
  const persona = usePersona((s) => s.persona);
  if (!reward) return null;

  const daysLeft = Math.max(
    0,
    reward.validForDays - Math.floor((Date.now() - reward.claimedAt) / (1000 * 60 * 60 * 24)),
  );
  const isTransition = persona === "transition";

  return (
    <section className="px-5">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/8 via-card to-warning/10 p-5 shadow-elevated">
        {/* gold accent glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-warning/30 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Your reward bundle
            </span>
            <p className="mt-2 text-2xl font-semibold leading-tight">
              {reward.bundle.dataGb} GB <span className="text-warning-foreground">+ {reward.bundle.voiceMin} min</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Free welcome bundle for {reward.fullName.split(" ")[0]}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-soft">
            <Lock className="h-4 w-4" />
          </div>
        </div>

        {/* Status pill */}
        <div className="relative mt-4 flex items-center gap-2 rounded-2xl bg-background/70 p-2.5 backdrop-blur-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/20 text-warning-foreground">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <p className="flex-1 text-xs font-medium">
            {isTransition
              ? "Ready to redeem after activation"
              : "Locked — Activate Safaricom SIM to redeem"}
          </p>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
            <Clock className="h-3 w-3" /> {daysLeft}d left
          </span>
        </div>

        {/* CTAs */}
        {isTransition ? (
          <Link
            to="/app/sim"
            className="relative mt-4 flex items-center justify-center gap-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Activate SIM to redeem <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="relative mt-4 grid grid-cols-2 gap-2">
            <Link
              to="/app/sim"
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              <Smartphone className="h-3.5 w-3.5" /> Order SIM
            </Link>
            <Link
              to="/app/sim"
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-primary/30 bg-card py-3 text-xs font-semibold text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" /> Get eSIM
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
