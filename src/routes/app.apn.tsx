import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Wifi,
  Smartphone,
  Apple,
  CheckCircle2,
  Loader2,
  Download,
  ChevronDown,
  RefreshCw,
  Plane,
  LifeBuoy,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/apn")({
  component: ApnPage,
});

type Device = "android" | "iphone";
type Phase = "idle" | "pushing" | "success";

function ApnPage() {
  const { isSuspended, isDeactivated, isRestricted } = useLifecycleGuard();
  const [device, setDevice] = useState<Device>("android");
  const [phase, setPhase] = useState<Phase>("idle");
  const [openTrouble, setOpenTrouble] = useState(false);

  function pushSettings() {
    if (isRestricted) return;
    setPhase("pushing");
    setTimeout(() => setPhase("success"), 2200);
  }

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
          <h1 className="text-lg font-semibold leading-tight">Internet settings</h1>
          <p className="text-[11px] text-muted-foreground">One-tap APN configuration</p>
        </div>
      </header>

      {/* Lifecycle gating */}
      {isRestricted && (
        <section className="mt-5 px-5">
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 ${
              isDeactivated
                ? "border-destructive/30 bg-destructive/10"
                : "border-warning/40 bg-warning/15"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDeactivated ? "bg-destructive/20 text-destructive" : "bg-warning/30 text-warning-foreground"
              }`}
            >
              {isDeactivated ? <Lock className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {isDeactivated ? "Line deactivated" : "Line suspended"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isDeactivated
                  ? "Reactivate your SIM to configure internet settings."
                  : "Your line is suspended. Please top up to restore internet services."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Detection card */}
      <section className="mt-5 px-5">
        <div className="rounded-3xl border border-border bg-gradient-card p-5 shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Detected
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {device === "android" ? <Smartphone className="h-5 w-5" /> : <Apple className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold">{device === "android" ? "Android device" : "iPhone"}</p>
                <p className="text-[11px] text-success">🟢 Safaricom SIM detected</p>
              </div>
            </div>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success">
              Ready
            </span>
          </div>

          {/* Device toggle */}
          <div className="mt-4 flex gap-2 rounded-2xl bg-secondary p-1">
            <button
              onClick={() => {
                setDevice("android");
                setPhase("idle");
              }}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                device === "android" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              Android
            </button>
            <button
              onClick={() => {
                setDevice("iphone");
                setPhase("idle");
              }}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                device === "iphone" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              iPhone
            </button>
          </div>
        </div>
      </section>

      {/* Action area */}
      <section className="mt-4 px-5">
        {phase === "success" ? (
          <SuccessCard />
        ) : phase === "pushing" ? (
          <PushingCard device={device} />
        ) : device === "android" ? (
          <AndroidCard onPush={pushSettings} disabled={isRestricted} />
        ) : (
          <IphoneCard onPush={pushSettings} disabled={isRestricted} />
        )}
      </section>

      {/* Troubleshooting */}
      <section className="mt-5 px-5">
        <button
          onClick={() => setOpenTrouble((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-soft"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground">
              <LifeBuoy className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Still not working?</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${openTrouble ? "rotate-180" : ""}`}
          />
        </button>
        {openTrouble && (
          <div className="mt-2 space-y-2">
            <TroubleStep icon={RefreshCw} title="Restart your phone" desc="Reboots the radio and re-applies settings." />
            <TroubleStep icon={Plane} title="Toggle airplane mode" desc="Turn on for 10s, then off again." />
            <Link
              to="/app/support"
              className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-3.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Contact support</p>
                <p className="text-[11px] text-muted-foreground">We'll help you get back online.</p>
              </div>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function AndroidCard({ onPush, disabled }: { onPush: () => void; disabled: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <Wifi className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold">Push APN settings</p>
          <p className="text-[11px] text-muted-foreground">
            We'll configure your device automatically over the air.
          </p>
        </div>
      </div>
      <button
        onClick={onPush}
        disabled={disabled}
        className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
      >
        Push APN settings
      </button>
    </div>
  );
}

function IphoneCard({ onPush, disabled }: { onPush: () => void; disabled: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
          <Apple className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold">Install configuration profile</p>
          <p className="text-[11px] text-muted-foreground">Follow the guided steps below.</p>
        </div>
      </div>

      <ol className="mt-4 space-y-2 text-xs">
        {[
          "Tap 'Download Profile' below",
          "Open Settings → Profile Downloaded",
          "Install and enter your passcode",
          "Restart your iPhone to apply",
        ].map((s, i) => (
          <li key={s} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <button
        onClick={onPush}
        disabled={disabled}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> Download profile
      </button>
    </div>
  );
}

function PushingCard({ device }: { device: Device }) {
  return (
    <div className="rounded-3xl border border-border bg-gradient-card p-6 text-center shadow-soft">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-semibold">Applying settings…</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {device === "android"
          ? "Sending APN configuration to your device."
          : "Preparing your iOS profile."}
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-success/15 via-card to-primary/10 p-6 text-center shadow-elevated">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground shadow-glow">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="mt-4 text-base font-semibold">Your internet settings are updated</p>
      <p className="mt-1 text-xs text-muted-foreground">You're ready to enjoy high-speed data.</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          to="/app/bundles"
          className="rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-glow"
        >
          Buy a bundle
        </Link>
        <Link
          to="/app"
          className="rounded-2xl border border-border bg-card py-3 text-xs font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function TroubleStep({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof RefreshCw;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
