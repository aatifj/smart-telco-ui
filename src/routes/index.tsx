import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, ArrowRight, Smartphone, ShieldCheck } from "lucide-react";
import { usePersona, type Persona } from "@/store/persona";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safaricom Ethiopia — Self-Care" },
      { name: "description", content: "Manage your line, buy bundles, and stay connected — anywhere." },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const setPersona = usePersona((s) => s.setPersona);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const enter = (p: Persona) => {
    setPersona(p);
    navigate({ to: "/app" });
  };

  return (
    <PhoneFrame>
      <div className="relative flex min-h-screen flex-col md:min-h-[calc(100vh-3rem)]">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-hero px-6 pb-10 pt-12 text-primary-foreground">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <span className="text-base font-black">S</span>
              </div>
              <span className="text-sm font-semibold tracking-wide">Safaricom Ethiopia</span>
            </div>
            <h1 className="mt-8 text-[28px] font-semibold leading-tight">
              Your line.<br />Your data. <span className="text-primary-glow">Simplified.</span>
            </h1>
            <p className="mt-2 text-sm text-white/75">
              Sign in to buy bundles, manage M-PESA, and stay connected.
            </p>
          </div>
        </div>

        <div className="-mt-6 flex-1 rounded-t-3xl bg-card px-5 pb-8 pt-6 shadow-card">
          {step === "phone" ? (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Phone number</label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="flex items-center gap-1.5 border-r border-border pr-3 text-sm font-semibold">
                    🇪🇹 +251
                  </span>
                  <input
                    inputMode="tel"
                    placeholder="9•• ••• •••"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep("otp")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all active:scale-[0.99]"
              >
                Send OTP <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "Google", e: "G" },
                  { l: "Apple", e: "" },
                  { l: "Facebook", e: "f" },
                ].map((s) => (
                  <button
                    key={s.l}
                    onClick={() => enter("explorer")}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-background py-3.5 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    <span className="text-lg font-bold">{s.e}</span>
                    {s.l}
                  </button>
                ))}
              </div>

              <button
                onClick={() => enter("explorer")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <Smartphone className="h-4 w-4" /> Explore as Guest
              </button>

              <div className="mt-2 rounded-2xl border border-border bg-secondary/50 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Demo · jump to persona
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => enter("safaricom")} className="rounded-lg bg-card px-2 py-2 font-medium shadow-soft">🟢 Safaricom</button>
                  <button onClick={() => enter("explorer")} className="rounded-lg bg-card px-2 py-2 font-medium shadow-soft">✨ Explorer</button>
                  <button onClick={() => enter("roaming")} className="rounded-lg bg-card px-2 py-2 font-medium shadow-soft">🌍 Roaming</button>
                  <button onClick={() => enter("diaspora")} className="rounded-lg bg-card px-2 py-2 font-medium shadow-soft">💚 Diaspora</button>
                  <button onClick={() => enter("transition")} className="col-span-2 rounded-lg bg-card px-2 py-2 font-medium shadow-soft">📦 New SIM (transition)</button>
                </div>
              </div>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Secured by Safaricom Ethiopia
              </p>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <button
                onClick={() => setStep("phone")}
                className="text-xs font-medium text-muted-foreground"
              >
                ← Change number
              </button>
              <div>
                <h2 className="text-lg font-semibold">Verify your number</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> Code sent to +251 {phone || "9•• ••• •••"}
                </p>
              </div>
              <div className="flex justify-between gap-3">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => {
                      const next = [...otp];
                      next[i] = e.target.value.slice(-1);
                      setOtp(next);
                    }}
                    className="h-14 w-full rounded-2xl border border-border bg-background text-center text-xl font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ))}
              </div>
              <div className="space-y-2.5">
                <button
                  onClick={() => enter("safaricom")}
                  className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Verify & Continue
                </button>
                <button
                  onClick={() => enter("roaming")}
                  className="w-full rounded-2xl border border-border bg-card py-3 text-xs font-medium text-muted-foreground"
                >
                  🌍 Simulate roaming detection
                </button>
                <button
                  onClick={() => enter("transition")}
                  className="w-full rounded-2xl border border-border bg-card py-3 text-xs font-medium text-muted-foreground"
                >
                  📦 Simulate new-SIM activation
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Didn't get a code? <span className="font-semibold text-primary">Resend in 0:42</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
