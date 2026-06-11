import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Wifi, Wallet, Smartphone, Coins, Check, AlertCircle, Sparkles } from "lucide-react";
import { getBundle, loyaltyPointsFor } from "@/lib/catalog";
import { useWallet, type PaymentMethod } from "@/store/wallet";

export const Route = createFileRoute("/app/buy/$bundleId")({
  component: BuyBundlePage,
});

function BuyBundlePage() {
  const { bundleId } = Route.useParams();
  const navigate = useNavigate();
  const bundle = getBundle(bundleId);
  const { airtime, mpesa, advanceLimit, advanceOwed, pay, earnPoints } = useWallet();
  const [method, setMethod] = useState<PaymentMethod>("airtime");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const points = useMemo(() => (bundle ? loyaltyPointsFor(bundle.price) : 0), [bundle]);
  const advanceAvailable = advanceLimit - advanceOwed;

  if (!bundle) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-sm text-muted-foreground">Bundle not found.</p>
        <Link to="/app/bundles" className="mt-3 inline-block text-sm font-semibold text-primary">Back to bundles</Link>
      </div>
    );
  }

  const methods: { key: PaymentMethod; label: string; sub: string; icon: typeof Wallet; enabled: boolean; reason?: string }[] = [
    { key: "airtime", label: "Airtime", sub: `Balance ETB ${airtime.toFixed(2)}`, icon: Smartphone, enabled: airtime >= bundle.price, reason: "Top up airtime first" },
    { key: "mpesa", label: "M-PESA Wallet", sub: `Balance ETB ${mpesa.toFixed(2)}`, icon: Wallet, enabled: mpesa >= bundle.price, reason: "Insufficient M-PESA balance" },
    { key: "advance", label: "Airtime Advance", sub: `Available ETB ${advanceAvailable.toFixed(2)}`, icon: Coins, enabled: advanceAvailable >= bundle.price, reason: "Exceeds your advance limit" },
  ];

  const handleConfirm = () => {
    setError(null);
    const res = pay(bundle.price, method);
    if (!res.ok) {
      setError(res.reason ?? "Payment failed");
      return;
    }
    earnPoints(points);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="animate-fade-in px-5 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Purchase complete</h1>
        <p className="mt-1 text-sm text-muted-foreground">{bundle.name} · {bundle.data}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" /> +{points} loyalty points earned
        </div>
        <div className="mt-8 grid gap-2">
          <Link to="/app/my-bundles" className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">View my bundles</Link>
          <button onClick={() => navigate({ to: "/app" })} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold">Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      <header className="flex items-center gap-3 px-5 pt-5">
        <button onClick={() => navigate({ to: "/app/bundles" })} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-semibold">Confirm purchase</h1>
      </header>

      <section className="mt-5 px-5">
        <div className="rounded-3xl border border-border bg-gradient-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wifi className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{bundle.name}</p>
              <p className="text-xs text-muted-foreground">{bundle.data} · {bundle.validity}</p>
            </div>
            <p className="text-base font-bold">ETB {bundle.price}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-primary/8 px-3 py-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Earn <span className="font-bold">{points} loyalty points</span> with this purchase
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="text-sm font-semibold">Pay with</h2>
        <div className="mt-3 space-y-2">
          {methods.map((m) => {
            const Icon = m.icon;
            const selected = method === m.key;
            return (
              <button
                key={m.key}
                onClick={() => m.enabled && setMethod(m.key)}
                disabled={!m.enabled}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  selected ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                } ${!m.enabled ? "opacity-50" : ""}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.enabled ? m.sub : m.reason}</p>
                </div>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                </span>
              </button>
            );
          })}
        </div>

        {method === "advance" && (
          <Link to="/app/advance" className="mt-3 flex items-center justify-between rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs">
            <span className="font-medium text-warning-foreground">Need a bigger advance? See advance options</span>
            <span className="font-semibold text-primary">Open →</span>
          </Link>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
      </section>

      <section className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">ETB {bundle.price}</span>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition-transform"
          >
            Confirm & pay
          </button>
        </div>
      </section>
      <div className="h-24" />
    </div>
  );
}
