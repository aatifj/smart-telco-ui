import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft, Globe, Signal, Smartphone, CheckCircle2, AlertTriangle, Clock, Phone,
  MessageCircle, Wifi as WifiIcon,
} from "lucide-react";
import { useIssues, type IssueType } from "@/store/issues";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/roaming/report")({
  component: RoamingReportPage,
});

type Step = 1 | 2 | 3 | 4;
type RoamIssueType = IssueType | "registration";

const roamIssueMeta: Record<RoamIssueType, { label: string; emoji: string; tone: string; sub: string }> = {
  voice: { label: "Voice Roaming", emoji: "📞", tone: "bg-info/10 text-info", sub: "Cannot make/receive calls" },
  data: { label: "Data Roaming", emoji: "🌐", tone: "bg-primary/10 text-primary", sub: "No internet / slow speeds" },
  sms: { label: "SMS Roaming", emoji: "💬", tone: "bg-warning/15 text-warning-foreground", sub: "OTP not received / failing" },
  registration: { label: "Network Registration", emoji: "🔌", tone: "bg-destructive/10 text-destructive", sub: "&quot;No service&quot; / can&apos;t connect" },
};

const roamingContext = {
  country: "United Arab Emirates",
  flag: "🇦🇪",
  operator: "Etisalat (Partner)",
  network: "4G",
  signal: "Strong",
};

function RoamingReportPage() {
  const navigate = useNavigate();
  const addIssue = useIssues((s) => s.addIssue);
  const issues = useIssues((s) => s.issues);
  const { isSuspended, isDeactivated } = useLifecycleGuard();

  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<RoamIssueType | null>(null);
  const [description, setDescription] = useState("");
  const [when, setWhen] = useState<"now" | "earlier">("now");
  const [callback, setCallback] = useState(false);
  const [useAlt, setUseAlt] = useState(false);
  const [primaryNumber] = useState("+251 7•• ••• 412");
  const [altNumber, setAltNumber] = useState("");
  const [callbackSlot, setCallbackSlot] = useState("ASAP");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  function submit() {
    if (!type) return;
    // map registration -> data for storage compatibility
    const storedType: IssueType = type === "registration" ? "data" : type;
    const issue = addIssue({
      type: storedType,
      description: `[Roaming · ${roamingContext.country}] ${description}`,
      location: `${roamingContext.country} · ${roamingContext.operator}`,
      when,
      callback,
      callbackNumber: callback ? (useAlt && altNumber ? altNumber : primaryNumber) : undefined,
      callbackSlot: callback ? callbackSlot : undefined,
    });
    setSubmittedRef(issue.ref);
    setStep(4);
  }

  if (isDeactivated) {
    return (
      <div className="animate-fade-in pb-6">
        <Header onBack={() => navigate({ to: "/app" })} />
        <div className="mx-5 mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-3 text-sm font-semibold">Reactivate to use roaming</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your SIM is deactivated. Reactivate to use roaming services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      <Header onBack={() => (step > 1 && step < 4 ? setStep((step - 1) as Step) : navigate({ to: "/app" }))} />

      {/* Roaming context banner — always visible */}
      <section className="px-5">
        <div className="rounded-2xl border border-info/30 bg-gradient-to-br from-info/10 via-card to-card p-3.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roamingContext.flag}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold">{roamingContext.country}</p>
              <p className="text-[10px] text-muted-foreground">
                {roamingContext.operator} · {roamingContext.network} · Signal {roamingContext.signal}
              </p>
            </div>
            <Globe className="h-4 w-4 text-info" />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Captured automatically to help resolve your issue faster
          </p>
        </div>
      </section>

      {step < 4 && (
        <div className="px-5">
          <Stepper step={step} />
        </div>
      )}

      {isSuspended && step < 4 && (
        <div className="mx-5 mt-3 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-foreground" />
          <p className="text-xs text-warning-foreground">
            Your line is suspended — roaming services are unavailable. You can still report and request a callback.
          </p>
        </div>
      )}

      {/* Step 1: Type */}
      {step === 1 && (
        <section className="mt-5 px-5">
          <h2 className="text-base font-semibold">What's the issue?</h2>
          <p className="text-xs text-muted-foreground">Pick the area you're having trouble with abroad.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(Object.keys(roamIssueMeta) as RoamIssueType[]).map((t) => {
              const m = roamIssueMeta[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition ${
                    active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                  }`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${m.tone}`}>
                    {m.emoji}
                  </span>
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-[11px] leading-tight text-muted-foreground" dangerouslySetInnerHTML={{ __html: m.sub }} />
                </button>
              );
            })}
          </div>

          {/* Known issues hint */}
          <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Known in your area</p>
            <p className="mt-1 text-xs">No reported outages on {roamingContext.operator} right now.</p>
          </div>

          <button
            disabled={!type}
            onClick={() => setStep(2)}
            className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Continue
          </button>
        </section>
      )}

      {/* Step 2: Details + troubleshooting */}
      {step === 2 && (
        <section className="mt-5 px-5">
          <h2 className="text-base font-semibold">Tell us more</h2>
          <p className="text-xs text-muted-foreground">Try these quick fixes first — many issues resolve in seconds.</p>

          <div className="mt-3 rounded-2xl border border-info/20 bg-info/5 p-4">
            <p className="text-xs font-semibold text-info">Try these fixes first</p>
            <ul className="mt-2 space-y-1.5 text-[11px] text-foreground">
              <li className="flex gap-2"><span>•</span>Enable data roaming in device settings</li>
              <li className="flex gap-2"><span>•</span>Restart your device</li>
              <li className="flex gap-2"><span>•</span>Manually select a partner network</li>
            </ul>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="e.g. No data since this morning at the hotel"
                className="mt-1.5 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">{description.length}/300</p>
            </div>

            <div>
              <label className="text-xs font-semibold">When did this happen?</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(["now", "earlier"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWhen(w)}
                    className={`rounded-2xl border px-3 py-2.5 text-xs font-semibold ${
                      when === w ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
                    }`}
                  >
                    {w === "now" ? "Right now" : "Earlier today"}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto context recap */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Captured automatically</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <ContextItem icon={Globe} label="Country" value={roamingContext.flag + " " + (roamingContext.country.split(" ")[0])} />
                <ContextItem icon={WifiIcon} label="Network" value={roamingContext.network} />
                <ContextItem icon={Signal} label="Signal" value={roamingContext.signal} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                <ContextItem icon={Smartphone} label="Device" value="iPhone 14" />
                <ContextItem icon={Globe} label="Operator" value={roamingContext.operator.split(" ")[0]} />
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            Continue
          </button>
        </section>
      )}

      {/* Step 3: Contact options */}
      {step === 3 && (
        <section className="mt-5 px-5">
          <h2 className="text-base font-semibold">How should we reach you?</h2>
          <p className="text-xs text-muted-foreground">Pick the option that works best while you're abroad.</p>

          {/* Callback */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Request a callback</p>
                  <p className="text-[11px] text-muted-foreground">Safaricom will call you back</p>
                </div>
              </div>
              <button
                onClick={() => setCallback(!callback)}
                className={`relative h-6 w-11 rounded-full transition ${callback ? "bg-primary" : "bg-muted"}`}
                aria-pressed={callback}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${callback ? "left-5" : "left-0.5"}`} />
              </button>
            </div>

            {callback && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div>
                  <p className="text-xs font-semibold">Preferred contact number</p>
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={() => setUseAlt(false)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                        !useAlt ? "border-primary bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold">Safaricom number</p>
                        <p className="text-[11px] text-muted-foreground">{primaryNumber}</p>
                      </div>
                      <span className={`h-4 w-4 rounded-full border-2 ${!useAlt ? "border-primary bg-primary" : "border-border"}`} />
                    </button>
                    <button
                      onClick={() => setUseAlt(true)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                        useAlt ? "border-primary bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-semibold">Alternate number</p>
                        <p className="text-[11px] text-muted-foreground">Recommended while abroad</p>
                      </div>
                      <span className={`h-4 w-4 rounded-full border-2 ${useAlt ? "border-primary bg-primary" : "border-border"}`} />
                    </button>
                    {useAlt && (
                      <input
                        value={altNumber}
                        onChange={(e) => setAltNumber(e.target.value)}
                        placeholder="+971 5• ••• ••••"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold">Preferred time</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {["ASAP", "Within 1 hour", "This evening", "Tomorrow"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setCallbackSlot(s)}
                        className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-semibold ${
                          callbackSlot === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alternative support */}
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Or chat with us (data-based)</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold">Live chat</p>
                  <p className="text-[10px] text-muted-foreground">In-app, free on roaming</p>
                </div>
              </button>
              <button className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold">WhatsApp</p>
                  <p className="text-[10px] text-muted-foreground">+251 700 700 700</p>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={submit}
            className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            Submit Issue
          </button>
        </section>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && submittedRef && (
        <section className="mt-5 px-5">
          <div className="rounded-3xl bg-gradient-roaming p-6 text-center text-primary-foreground shadow-elevated">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-3 text-lg font-semibold">Your roaming issue has been reported</p>
            <p className="mt-1 text-xs text-white/80">
              {callback ? "Our team will contact you shortly." : "We'll investigate and update you."}
            </p>
            <div className="mt-4 inline-flex flex-col rounded-2xl bg-white/15 px-4 py-2 backdrop-blur">
              <span className="text-[10px] uppercase tracking-wider text-white/70">Reference</span>
              <span className="text-sm font-bold tracking-wide">{submittedRef}</span>
            </div>
            <p className="mt-3 text-[11px] text-white/75">Estimated response: under 1 hour</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link to="/app" className="rounded-full border border-border bg-card py-3 text-center text-sm font-semibold">
              Back to home
            </Link>
            <button
              onClick={() => {
                setStep(1);
                setType(null);
                setDescription("");
                setCallback(false);
                setSubmittedRef(null);
              }}
              className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Report another
            </button>
          </div>

          {issues.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">My roaming issues</h3>
              <div className="mt-3 space-y-2">
                {issues.slice(0, 5).map((i) => (
                  <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info text-lg">
                      ✈️
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{i.ref}</p>
                      <p className="text-[11px] text-muted-foreground">{i.location}</p>
                    </div>
                    <StatusPill status={i.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-center gap-3 px-5 pb-4 pt-5">
      <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div>
        <h1 className="text-lg font-semibold">Report Roaming Issue</h1>
        <p className="text-xs text-muted-foreground">Fast support while you're abroad</p>
      </div>
    </header>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="mt-4 flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
              step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {n}
          </div>
          {n < 3 && <div className={`h-1 flex-1 rounded-full ${step > n ? "bg-primary" : "bg-muted"}`} />}
        </div>
      ))}
    </div>
  );
}

function ContextItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-2">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
      <p className="text-[11px] font-semibold">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "submitted" | "in_progress" | "resolved" }) {
  const map = {
    submitted: { label: "Submitted", cls: "bg-info/10 text-info" },
    in_progress: { label: "In progress", cls: "bg-warning/15 text-warning-foreground" },
    resolved: { label: "Resolved", cls: "bg-success/10 text-success" },
  } as const;
  const m = map[status];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.cls}`}>{m.label}</span>;
}
