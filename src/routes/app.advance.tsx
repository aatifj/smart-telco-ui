import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Coins, Check, AlertCircle, Info } from "lucide-react";
import { advanceOptions } from "@/lib/catalog";
import { useWallet } from "@/store/wallet";

export const Route = createFileRoute("/app/advance")({
  component: AdvancePage,
});

function AdvancePage() {
  const navigate = useNavigate();
  const { advanceLimit, advanceOwed, airtime, takeAdvance, repayAdvance, mpesa } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const available = advanceLimit - advanceOwed;

  const handleTake = (id: string) => {
    setError(null); setSuccess(null);
    const opt = advanceOptions.find((o) => o.id === id);
    if (!opt) return;
    const res = takeAdvance(opt.amount, opt.fee);
    if (!res.ok) { setError(res.reason ?? "Could not take advance"); return; }
    setSuccess(`ETB ${opt.amount} added to your airtime`);
  };

  const handleRepay = () => {
    setError(null); setSuccess(null);
    if (mpesa < advanceOwed) { setError("Not enough M-PESA balance to repay"); return; }
    // simulate: deduct from mpesa + clear owed
    useWallet.setState({ mpesa: +(mpesa - advanceOwed).toFixed(2) });
    repayAdvance(advanceOwed);
    setSuccess("Advance repaid in full");
  };

  return (
    <div className="animate-fade-in pb-10">
      <header className="flex items-center gap-3 px-5 pt-5">
        <button onClick={() => navigate({ to: "/app" })} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-semibold">Airtime Advance</h1>
      </header>

      <section className="mt-5 px-5">
        <div className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/75">
            <Coins className="h-4 w-4" /> Advance account
          </div>
          <p className="mt-2 text-3xl font-semibold">ETB {available.toFixed(2)}</p>
          <p className="text-xs text-white/70">available of ETB {advanceLimit.toFixed(2)} limit</p>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-3 text-xs backdrop-blur-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/65">Owed</p>
              <p className="mt-1 text-base font-semibold">ETB {advanceOwed.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/65">Airtime</p>
              <p className="mt-1 text-base font-semibold">ETB {airtime.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </section>

      {advanceOwed > 0 && (
        <section className="mt-4 px-5">
          <button
            onClick={handleRepay}
            className="flex w-full items-center justify-between rounded-2xl border border-success/30 bg-success/10 p-3.5 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-success">Repay ETB {advanceOwed.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Settle from M-PESA wallet</p>
            </div>
            <span className="rounded-full bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground">Repay</span>
          </button>
        </section>
      )}

      <section className="mt-5 px-5">
        <h2 className="text-sm font-semibold">Get airtime advance</h2>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Info className="h-3 w-3" /> Repay automatically on next top-up. Service fee applies.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {advanceOptions.map((o) => {
            const total = o.amount + o.fee;
            const canTake = total <= available;
            return (
              <button
                key={o.id}
                onClick={() => handleTake(o.id)}
                disabled={!canTake}
                className={`rounded-2xl border p-4 text-left shadow-soft transition-all ${
                  canTake ? "border-border bg-card hover:border-primary" : "border-border bg-muted/40 opacity-60"
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Advance</p>
                <p className="mt-1 text-2xl font-bold">ETB {o.amount}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Fee ETB {o.fee} · repay in {o.repayDays}d</p>
                <span className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                  Total ETB {total}
                </span>
              </button>
            );
          })}
        </div>

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 p-3 text-xs text-success">
            <Check className="h-4 w-4" /> {success}
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <Link to="/app/bundles" className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-semibold">Use advance to buy a bundle</p>
            <p className="text-xs text-muted-foreground">Pick a data bundle and pay with advance</p>
          </div>
          <span className="text-sm font-semibold text-primary">Browse →</span>
        </Link>
      </section>
    </div>
  );
}
