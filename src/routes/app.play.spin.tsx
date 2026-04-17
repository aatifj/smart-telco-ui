import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, Lock } from "lucide-react";
import { useGames, type GameReward } from "@/store/games";
import { usePersona } from "@/store/persona";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/play/spin")({
  component: SpinPage,
});

const SLICES: Array<{ label: string; kind: GameReward["kind"]; amount: number; color: string }> = [
  { label: "100 MB",   kind: "data",     amount: 100,  color: "oklch(0.62 0.19 145)" },
  { label: "20 min",   kind: "voice",    amount: 20,   color: "oklch(0.65 0.14 230)" },
  { label: "500 MB",   kind: "data",     amount: 500,  color: "oklch(0.55 0.18 148)" },
  { label: "10% off",  kind: "discount", amount: 10,   color: "oklch(0.78 0.16 75)" },
  { label: "1 GB",     kind: "data",     amount: 1024, color: "oklch(0.45 0.16 148)" },
  { label: "30 SMS",   kind: "sms",      amount: 30,   color: "oklch(0.6 0.18 30)" },
  { label: "200 MB",   kind: "data",     amount: 200,  color: "oklch(0.72 0.18 148)" },
  { label: "Try again",kind: "discount", amount: 0,    color: "oklch(0.7 0.02 150)" },
];

function SpinPage() {
  const navigate = useNavigate();
  const persona = usePersona((s) => s.persona);
  const { isDeactivated, isSuspended } = useLifecycleGuard();
  const consumePlay = useGames((s) => s.consumePlay);
  const addReward = useGames((s) => s.addReward);
  const playsToday = useGames((s) => s.playsToday);
  const max = useGames((s) => s.maxPlaysPerDay);

  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof SLICES[number] | null>(null);
  const [denied, setDenied] = useState<string | null>(null);

  const isExplorer = persona === "explorer" || persona === "transition";

  function spin() {
    if (isDeactivated) {
      setDenied("Reactivate your SIM to continue playing");
      return;
    }
    const ok = consumePlay();
    if (!ok) {
      setDenied("No free plays left today. Come back tomorrow!");
      return;
    }
    setDenied(null);
    setResult(null);
    const winIdx = Math.floor(Math.random() * SLICES.length);
    const slice = 360 / SLICES.length;
    const target = 360 * 6 + (360 - winIdx * slice - slice / 2);
    setSpinning(true);
    setAngle(target);
    setTimeout(() => {
      setSpinning(false);
      const won = SLICES[winIdx];
      setResult(won);
      if (won.amount > 0) {
        const r = addReward({
          kind: won.kind,
          amount: won.amount,
          label: `${won.label} ${won.kind === "data" ? "Free Data" : won.kind === "voice" ? "Voice" : won.kind === "sms" ? "SMS" : "Discount"}`,
          source: "spin",
          locked: isExplorer,
        });
        setTimeout(() => navigate({ to: "/app/play/win", search: { id: r.id } }), 900);
      }
    }, 4200);
  }

  const slice = 360 / SLICES.length;

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/app/play" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Spin the Wheel</h1>
          <p className="text-[11px] text-muted-foreground">{max - playsToday} free spin(s) left today</p>
        </div>
      </header>

      <div className="relative mx-auto mt-2 flex h-[300px] w-[300px] items-center justify-center">
        {/* Pointer */}
        <div className="absolute -top-1 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[18px] border-x-transparent border-t-foreground drop-shadow-md" />
        {/* Wheel */}
        <div
          className="relative h-[280px] w-[280px] rounded-full border-4 border-foreground shadow-elevated"
          style={{
            background: `conic-gradient(${SLICES.map((s, i) => `${s.color} ${i * slice}deg ${(i + 1) * slice}deg`).join(", ")})`,
            transform: `rotate(${angle}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.21, 1)" : "none",
          }}
        >
          {SLICES.map((s, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-left text-[11px] font-bold text-white drop-shadow"
              style={{
                transform: `rotate(${i * slice + slice / 2}deg) translateX(38px)`,
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
        {/* Center */}
        <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-elevated ring-4 ring-foreground">
          <Sparkles className="h-5 w-5 text-warning-foreground" />
        </div>
      </div>

      {result && result.amount === 0 && !spinning && (
        <p className="mt-6 animate-pop text-center text-sm font-semibold text-muted-foreground">
          So close! Try again tomorrow.
        </p>
      )}

      {denied && (
        <div className="mx-5 mt-6 rounded-2xl border border-warning/40 bg-warning/15 p-3 text-center">
          <p className="text-xs font-semibold text-warning-foreground">{denied}</p>
        </div>
      )}

      <div className="mt-8 px-5">
        <button
          onClick={spin}
          disabled={spinning || isDeactivated}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {isDeactivated ? <><Lock className="h-4 w-4" /> Reactivate to play</> : spinning ? "Spinning…" : "SPIN"}
        </button>
        {isSuspended && (
          <p className="mt-2 text-center text-[11px] text-warning-foreground">
            You can play, but recharge to redeem rewards.
          </p>
        )}
      </div>
    </div>
  );
}
