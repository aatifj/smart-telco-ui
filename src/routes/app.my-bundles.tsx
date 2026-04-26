import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, RefreshCw, Repeat, Settings2, X, Check, Wallet, Smartphone, Clock, Lock,
} from "lucide-react";
import { useBundles, formatExpiry, type ActiveBundle } from "@/store/bundles";
import { useLifecycleGuard } from "@/store/persona";
import { LifecycleBanner } from "@/components/LifecycleBanner";

export const Route = createFileRoute("/app/my-bundles")({
  component: MyBundlesPage,
});

function MyBundlesPage() {
  const { bundles, toggleAutoRenew, renew } = useBundles();
  const { isRestricted, isSuspended, isDeactivated } = useLifecycleGuard();
  const navigate = useNavigate();
  const [renewing, setRenewing] = useState<ActiveBundle | null>(null);
  const [paySource, setPaySource] = useState<"airtime" | "mpesa">("airtime");
  const [confirmed, setConfirmed] = useState<{ name: string; ref: string } | null>(null);

  const handleConfirmRenew = () => {
    if (!renewing) return;
    renew(renewing.id);
    const ref = `RN-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmed({ name: renewing.name, ref });
    setRenewing(null);
  };

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center gap-3 px-5 pt-5">
        <button onClick={() => navigate({ to: "/app" })} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">My Bundles</h1>
          <p className="text-xs text-muted-foreground">Renew, auto-renew or change your active plans</p>
        </div>
      </header>

      <LifecycleBanner />

      {isRestricted && (
        <section className="px-5 pt-3">
          <div className="rounded-2xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            {isDeactivated
              ? "Please visit the nearest Safaricom shop to reactivate your SIM."
              : "Top up to reactivate your line and renew bundles."}
          </div>
        </section>
      )}

      <section className="mt-4 space-y-3 px-5">
        {bundles.map((b) => {
          const dataPct = b.data ? Math.min(100, (b.data.used / b.data.total) * 100) : 0;
          const voicePct = b.voice ? Math.min(100, (b.voice.used / b.voice.total) * 100) : 0;
          const expiryLabel = formatExpiry(b.expiresAt);
          const isExpired = b.expired || b.expiresAt <= Date.now();
          return (
            <div
              key={b.id}
              className={`rounded-2xl border bg-card p-4 shadow-soft ${
                isExpired ? "border-destructive/30" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{b.name}</p>
                    {isExpired ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">Expired</span>
                    ) : b.autoRenew ? (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">Auto-renew</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{b.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">ETB {b.renewPrice}</p>
                  <p className="text-[10px] text-muted-foreground">renews</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {b.data && (
                  <UsageBar
                    label="Data"
                    used={`${b.data.used} ${b.data.unit}`}
                    total={`${b.data.total} ${b.data.unit}`}
                    pct={dataPct}
                  />
                )}
                {b.voice && (
                  <UsageBar
                    label="Voice"
                    used={`${b.voice.used} min`}
                    total={`${b.voice.total} min`}
                    pct={voicePct}
                  />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> {expiryLabel}
                </span>
                <span className="text-muted-foreground">{b.validityDays}-day cycle</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  disabled={isRestricted}
                  onClick={() => setRenewing(b)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                >
                  {isRestricted ? <Lock className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Renew now
                </button>
                <Link
                  to="/app/bundles"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold"
                >
                  <Repeat className="h-3.5 w-3.5" /> Change bundle
                </Link>
              </div>

              <button
                disabled={isRestricted}
                onClick={() => toggleAutoRenew(b.id)}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-xs disabled:opacity-50"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Auto-renew
                </span>
                <span
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    b.autoRenew ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-hidden
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      b.autoRenew ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
              {b.autoRenew && (
                <p className="mt-1.5 text-[10.5px] text-muted-foreground">
                  We'll renew this bundle automatically before expiry if you have enough balance.
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* Renew confirmation drawer */}
      {renewing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setRenewing(null)}>
          <div
            className="w-full max-w-md animate-fade-in rounded-t-3xl bg-card p-5 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold">Renew {renewing.name}</p>
                <p className="text-xs text-muted-foreground">{renewing.detail}</p>
              </div>
              <button onClick={() => setRenewing(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-secondary/40 p-3 text-xs">
              <Row k="Bundle" v={renewing.name} />
              <Row k="Validity" v={`${renewing.validityDays} day${renewing.validityDays > 1 ? "s" : ""}`} />
              <Row k="Price" v={`ETB ${renewing.renewPrice}`} bold />
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pay with</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {([
                { id: "airtime", label: "Airtime", sub: "ETB 248.50", icon: Smartphone },
                { id: "mpesa", label: "M-PESA", sub: "ETB 1,820.00", icon: Wallet },
              ] as const).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPaySource(p.id)}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left ${
                    paySource === p.id ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <p.icon className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{p.label}</p>
                    <p className="text-[10px] text-muted-foreground">{p.sub}</p>
                  </div>
                  {paySource === p.id && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmRenew}
              className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Confirm renewal · ETB {renewing.renewPrice}
            </button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-fade-in rounded-3xl bg-card p-6 text-center shadow-elevated">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-7 w-7" />
            </div>
            <p className="mt-3 text-base font-semibold">Bundle renewed successfully</p>
            <p className="mt-1 text-xs text-muted-foreground">{confirmed.name} is active again</p>
            <p className="mt-2 text-[11px] text-muted-foreground">Reference {confirmed.ref}</p>
            <button
              onClick={() => setConfirmed(null)}
              className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UsageBar({ label, used, total, pct }: { label: string; used: string; total: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-medium">{used} <span className="text-muted-foreground">/ {total}</span></span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${pct >= 90 ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={bold ? "font-semibold" : ""}>{v}</span>
    </div>
  );
}
