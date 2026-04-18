import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Gauge,
  Download,
  Upload,
  Activity,
  Sparkles,
  Smartphone,
  ChevronRight,
  Signal,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/app/speed")({
  component: SpeedPage,
});

type Step = "permission" | "loading" | "result";

interface SpeedResult {
  area: string;
  download: number;
  upload: number;
  latencyMs: number;
  quality: "Excellent" | "Good" | "Average";
  coverage: "4G+" | "4G" | "5G";
}

const AREAS = [
  { name: "Bole, Addis Ababa", dl: 48, ul: 18, lat: 22, q: "Excellent" as const, c: "5G" as const },
  { name: "Kazanchis, Addis Ababa", dl: 32, ul: 12, lat: 28, q: "Excellent" as const, c: "4G+" as const },
  { name: "Piassa, Addis Ababa", dl: 24, ul: 9, lat: 35, q: "Good" as const, c: "4G+" as const },
  { name: "Mekelle", dl: 18, ul: 7, lat: 42, q: "Good" as const, c: "4G" as const },
  { name: "Hawassa", dl: 15, ul: 6, lat: 48, q: "Average" as const, c: "4G" as const },
];

function pickArea(manual?: string): SpeedResult {
  const base = manual
    ? AREAS.find((a) => a.name.toLowerCase().includes(manual.toLowerCase())) ?? AREAS[2]
    : AREAS[Math.floor(Math.random() * 3)]; // bias toward strong areas for "current location"
  return {
    area: manual && !AREAS.some((a) => a.name.toLowerCase().includes(manual.toLowerCase())) ? manual : base.name,
    download: base.dl,
    upload: base.ul,
    latencyMs: base.lat,
    quality: base.q,
    coverage: base.c,
  };
}

function SpeedPage() {
  const [step, setStep] = useState<Step>("permission");
  const [manual, setManual] = useState("");
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [animatedDl, setAnimatedDl] = useState(0);
  const [animatedUl, setAnimatedUl] = useState(0);

  function startCheck(manualLocation?: string) {
    setStep("loading");
    const r = pickArea(manualLocation);
    setTimeout(() => {
      setResult(r);
      setStep("result");
    }, 1800);
  }

  // Animate numbers on result
  useEffect(() => {
    if (step !== "result" || !result) return;
    let start: number | null = null;
    const duration = 900;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setAnimatedDl(Math.round(result.download * ease));
      setAnimatedUl(Math.round(result.upload * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [step, result]);

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          to="/app"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold leading-tight">Network speed near you</h1>
          <p className="text-[11px] text-muted-foreground">Based on network analytics in your area</p>
        </div>
      </header>

      {step === "permission" && (
        <PermissionStep
          manual={manual}
          setManual={setManual}
          onAllow={() => startCheck()}
          onManual={() => manual.trim() && startCheck(manual.trim())}
        />
      )}

      {step === "loading" && <LoadingStep />}

      {step === "result" && result && (
        <ResultStep result={result} animatedDl={animatedDl} animatedUl={animatedUl} />
      )}
    </div>
  );
}

function PermissionStep({
  manual,
  setManual,
  onAllow,
  onManual,
}: {
  manual: string;
  setManual: (v: string) => void;
  onAllow: () => void;
  onManual: () => void;
}) {
  return (
    <section className="mt-6 px-5">
      <div className="rounded-3xl border border-border bg-gradient-card p-6 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapPin className="h-7 w-7" />
        </div>
        <p className="mt-4 text-base font-semibold">Allow location access</p>
        <p className="mt-1 text-xs text-muted-foreground">
          We'll check Safaricom network performance in your area
        </p>

        <button
          onClick={onAllow}
          className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Allow location
        </button>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4 space-y-2 text-left">
          <label className="text-xs font-medium text-muted-foreground">Enter location manually</label>
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="e.g. Bole, Addis Ababa"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={onManual}
            disabled={!manual.trim()}
            className="w-full rounded-2xl border border-border bg-card py-3 text-sm font-semibold disabled:opacity-50"
          >
            Check this area
          </button>
        </div>
      </div>
    </section>
  );
}

function LoadingStep() {
  return (
    <section className="mt-10 px-5">
      <div className="flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="absolute inset-3 animate-pulse rounded-full bg-primary/30" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
            <Gauge className="h-10 w-10 animate-spin" style={{ animationDuration: "1.6s" }} />
          </div>
        </div>
        <p className="mt-6 text-sm font-semibold">Analyzing network performance…</p>
        <p className="mt-1 text-xs text-muted-foreground">Reading nearby cell-site analytics</p>
      </div>
    </section>
  );
}

function ResultStep({
  result,
  animatedDl,
  animatedUl,
}: {
  result: SpeedResult;
  animatedDl: number;
  animatedUl: number;
}) {
  const navigate = useNavigate();
  const qualityTone =
    result.quality === "Excellent"
      ? { dot: "bg-success", text: "text-success", ring: "ring-success/30" }
      : result.quality === "Good"
        ? { dot: "bg-warning", text: "text-warning-foreground", ring: "ring-warning/30" }
        : { dot: "bg-destructive", text: "text-destructive", ring: "ring-destructive/30" };

  // Gauge progress (cap at 60 Mbps for visual)
  const pct = Math.min(1, result.download / 60);
  const circ = 2 * Math.PI * 52;

  const headline =
    result.quality === "Excellent"
      ? "Blazing fast speeds available in your area"
      : result.quality === "Good"
        ? "Strong and stable connectivity where you are"
        : "Reliable coverage available near you";

  return (
    <div className="px-5">
      {/* Hero gauge */}
      <section className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-6 text-primary-foreground shadow-elevated">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">
          <MapPin className="h-3.5 w-3.5" /> Performance in {result.area}
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.18)" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="white"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                style={{ transition: "stroke-dashoffset 900ms ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold leading-none">{animatedDl}</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">Mbps</span>
            </div>
          </div>
        </div>

        <div
          className={`mx-auto mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur ring-1 ${qualityTone.ring}`}
        >
          <span className={`h-2 w-2 rounded-full ${qualityTone.dot}`} />
          {result.quality} · {result.coverage} coverage
        </div>
      </section>

      {/* Stat row */}
      <section className="mt-3 grid grid-cols-3 gap-2">
        <StatCard icon={Download} label="Download" value={`${animatedDl}`} unit="Mbps" />
        <StatCard icon={Upload} label="Upload" value={`${animatedUl}`} unit="Mbps" />
        <StatCard icon={Activity} label="Latency" value={`${result.latencyMs}`} unit="ms" />
      </section>

      {/* Comparison */}
      <section className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Signal className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold">Up to 2× faster than typical networks here</p>
          <p className="text-[11px] text-muted-foreground">{headline}</p>
        </div>
      </section>

      {/* Conversion CTAs */}
      <section className="mt-5 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-warning/10 p-5 shadow-soft">
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning-foreground">
          <Sparkles className="h-3 w-3" /> Activate today
        </span>
        <p className="mt-2 text-base font-semibold leading-tight">
          Get a free welcome bundle when you join
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Enjoy high-speed browsing, streaming, and gaming with Safaricom.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate({ to: "/app/sim" })}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            <Smartphone className="h-3.5 w-3.5" /> Get Safaricom SIM
          </button>
          <button
            onClick={() => navigate({ to: "/app/sim" })}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-primary/30 bg-card py-3 text-xs font-semibold text-primary"
          >
            <Zap className="h-3.5 w-3.5" /> Order eSIM
          </button>
        </div>

        <Link
          to="/app/reward"
          className="mt-3 flex items-center justify-between rounded-2xl bg-foreground px-4 py-3 text-background"
        >
          <span className="text-xs font-semibold">Claim your free bundle first</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: typeof Download;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-soft">
      <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-2 text-sm font-bold">
        {value} <span className="text-[10px] font-medium text-muted-foreground">{unit}</span>
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
