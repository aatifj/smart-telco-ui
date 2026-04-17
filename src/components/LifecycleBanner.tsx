import { Link } from "@tanstack/react-router";
import { AlertTriangle, Lock, MapPin, Phone, Gift, ChevronRight } from "lucide-react";
import { useLifecycleGuard, usePersona } from "@/store/persona";

/**
 * Persistent lifecycle banner shown on home screens when the subscriber
 * line is suspended or deactivated. Only renders for Persona 1 & 3.
 */
export function LifecycleBanner() {
  const { isSuspended, isDeactivated } = useLifecycleGuard();
  const persona = usePersona((s) => s.persona);

  if (!isSuspended && !isDeactivated) return null;

  if (isSuspended) {
    return (
      <section className="px-5 pb-1">
        <div className="overflow-hidden rounded-3xl border border-warning/40 bg-warning/10 shadow-soft">
          <div className="flex items-start gap-3 p-4">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-warning/25 text-warning-foreground">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-warning-foreground">
                Your line is temporarily suspended
              </p>
              <p className="mt-0.5 text-xs text-warning-foreground/80">
                Top up your account to restore services.
              </p>
            </div>
          </div>

          {/* Reactivation offer */}
          <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl border border-warning/30 bg-card p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Gift className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold">Recharge ETB 100, get 20% bonus data</p>
              <p className="text-[11px] text-muted-foreground">Offer ends in 23h 14m · Reactivation only</p>
            </div>
            <button className="text-[11px] font-semibold text-primary">
              Details
            </button>
          </div>

          <div className="flex gap-2 px-4 pb-4">
            <button className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow">
              Top Up Now
            </button>
            <Link
              to="/app/support"
              className="flex h-11 items-center justify-center rounded-2xl border border-border bg-card px-4 text-xs font-semibold"
            >
              Help
            </Link>
          </div>

          {persona === "roaming" && (
            <div className="border-t border-warning/30 bg-warning/5 px-4 py-2.5">
              <p className="text-[11px] text-warning-foreground/90">
                💡 Top up while roaming and get bonus roaming data on reactivation.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Deactivated — full dominant card, blocks the rest of the screen above the fold
  return (
    <section className="px-5 pb-1">
      <div className="overflow-hidden rounded-3xl border border-destructive/40 bg-destructive/8 shadow-elevated">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <Lock className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">Your line is deactivated</p>
            <p className="mt-0.5 text-xs text-foreground/75">
              Please visit a Safaricom shop to reactivate your SIM.
              {persona === "roaming" && " Reactivation required before using roaming services."}
            </p>
          </div>
        </div>

        {/* Required documents hint */}
        <div className="mx-4 mb-3 rounded-2xl border border-border bg-card p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Bring with you
          </p>
          <ul className="mt-1.5 space-y-1 text-xs">
            <li>• Original national ID or passport</li>
            <li>• The SIM card (if available)</li>
            <li>• Account holder must visit in person</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 px-4 pb-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive py-3 text-sm font-semibold text-destructive-foreground">
            <MapPin className="h-4 w-4" />
            Find Nearest Safaricom Shop
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-2.5 text-xs font-semibold">
              <Phone className="h-3.5 w-3.5" /> Call care
            </button>
            <Link
              to="/app/support"
              className="flex items-center justify-center gap-1 rounded-2xl border border-border bg-card py-2.5 text-xs font-semibold"
            >
              Support <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Inline lock overlay for disabled action cards. */
export function RestrictedOverlay({ label = "Top up to unlock" }: { label?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-background/55 backdrop-blur-[1px]">
      <span className="flex items-center gap-1.5 rounded-full bg-foreground/85 px-3 py-1 text-[11px] font-semibold text-background shadow-soft">
        <Lock className="h-3 w-3" /> {label}
      </span>
    </div>
  );
}
