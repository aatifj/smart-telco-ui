import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Wifi, Phone, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/diy")({
  component: DIYPage,
});

function Slider({
  icon: Icon, label, unit, value, setValue, max, step, color,
}: {
  icon: typeof Wifi; label: string; unit: string;
  value: number; setValue: (v: number) => void; max: number; step: number; color: string;
}) {
  const pct = (value / max) * 100;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold">{label}</p>
        </div>
        <p className="text-base font-bold">{value} <span className="text-xs font-medium text-muted-foreground">{unit}</span></p>
      </div>
      <div className="relative mt-4 h-1.5 rounded-full bg-secondary">
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        <input
          type="range" min={0} max={max} step={step} value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-soft"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DIYPage() {
  const [data, setData] = useState(5);
  const [voice, setVoice] = useState(60);
  const [sms, setSms] = useState(50);
  const { isRestricted, isSuspended, isDeactivated } = useLifecycleGuard();

  const price = useMemo(() => Math.round(data * 35 + voice * 0.8 + sms * 0.3), [data, voice, sms]);

  if (isRestricted) {
    return (
      <div className="animate-fade-in pb-6">
        <header className="flex items-center gap-3 px-5 pt-5">
          <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Build your combo</h1>
            <p className="text-xs text-muted-foreground">Currently unavailable</p>
          </div>
        </header>

        <section className="mt-6 px-5">
          <div className={`overflow-hidden rounded-3xl border p-5 text-center shadow-soft ${
            isDeactivated ? "border-destructive/40 bg-destructive/8" : "border-warning/40 bg-warning/10"
          }`}>
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
              isDeactivated ? "bg-destructive/15 text-destructive" : "bg-warning/25 text-warning-foreground"
            }`}>
              {isDeactivated ? <Lock className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </div>
            <p className="mt-3 text-base font-semibold">
              {isDeactivated ? "Your line is deactivated" : "Your line is suspended"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isDeactivated
                ? "Visit a Safaricom shop to reactivate before building combos."
                : "Top up to unlock the DIY bundle builder."}
            </p>
            <Link
              to="/app"
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              {isDeactivated ? "Find nearest shop" : isSuspended ? "Top Up Now" : "Back home"}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-32">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Build your combo</h1>
          <p className="text-xs text-muted-foreground">Mix exactly what you need</p>
        </div>
      </header>

      <section className="mt-5 px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <Sparkles className="h-5 w-5 text-white/70" />
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/70">Your custom combo</p>
          <p className="mt-1 text-4xl font-semibold">ETB {price.toLocaleString()}</p>
          <p className="mt-1 text-xs text-white/75">{data} GB · {voice} min · {sms} SMS · valid 30 days</p>
        </div>
      </section>

      <section className="mt-5 space-y-3 px-5">
        <Slider icon={Wifi} label="Data" unit="GB" value={data} setValue={setData} max={50} step={1} color="bg-primary/15 text-primary" />
        <Slider icon={Phone} label="Voice" unit="min" value={voice} setValue={setVoice} max={500} step={10} color="bg-info/15 text-info" />
        <Slider icon={MessageSquare} label="SMS" unit="msgs" value={sms} setValue={setSms} max={500} step={10} color="bg-warning/25 text-warning-foreground" />
      </section>

      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-card/95 p-4 pb-6 backdrop-blur-xl safe-bottom md:bottom-[calc(3rem+1px)] md:rounded-b-[2.25rem]">
        <button className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
          Create my combo · ETB {price.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
