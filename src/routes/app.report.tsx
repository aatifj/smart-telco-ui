import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, MapPin, Signal, Smartphone, CheckCircle2, AlertTriangle, Clock, Phone } from "lucide-react";
import { useIssues, issueMeta, type IssueType } from "@/store/issues";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/report")({
  component: ReportPage,
});

type Step = 1 | 2 | 3 | 4;

function ReportPage() {
  const navigate = useNavigate();
  const addIssue = useIssues((s) => s.addIssue);
  const issues = useIssues((s) => s.issues);
  const { isSuspended, isDeactivated } = useLifecycleGuard();

  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Bole, Addis Ababa");
  const [when, setWhen] = useState<"now" | "earlier">("now");
  const [callback, setCallback] = useState(false);
  const [callbackNumber, setCallbackNumber] = useState("+251 7•• ••• 412");
  const [callbackSlot, setCallbackSlot] = useState("ASAP");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  function submit() {
    if (!type) return;
    const issue = addIssue({
      type,
      description,
      location,
      when,
      callback,
      callbackNumber: callback ? callbackNumber : undefined,
      callbackSlot: callback ? callbackSlot : undefined,
    });
    setSubmittedRef(issue.ref);
    setStep(4);
  }

  if (isDeactivated) {
    return (
      <div className="animate-fade-in pb-6">
        <Header title="Report a Problem" onBack={() => navigate({ to: "/app" })} />
        <div className="mx-5 mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-3 text-sm font-semibold">Line deactivated</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please visit a Safaricom shop for assistance.
          </p>
          <Link to="/app/support" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      <Header title="Report a Problem" onBack={() => (step > 1 && step < 4 ? setStep((step - 1) as Step) : navigate({ to: "/app" }))} />

      {step < 4 && (
        <div className="px-5">
          <Stepper step={step} />
        </div>
      )}

      {isSuspended && step < 4 && (
        <div className="mx-5 mt-3 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-foreground" />
          <p className="text-xs text-warning-foreground">
            Your line is suspended. Some issues may be due to inactive status.
          </p>
        </div>
      )}

      {/* Step 1: Type */}
      {step === 1 && (
        <section className="mt-5 px-5">
          <h2 className="text-base font-semibold">What's the issue?</h2>
          <p className="text-xs text-muted-foreground">Pick the area you're having trouble with.</p>
          <div className="mt-4 space-y-2">
            {(Object.keys(issueMeta) as IssueType[]).map((t) => {
              const m = issueMeta[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                  }`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${m.tone}`}>
                    {m.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {t === "voice" && "Dropped calls, can't dial out"}
                      {t === "data" && "Slow internet, no connection"}
                      {t === "sms" && "Can't send or receive SMS"}
                    </p>
                  </div>
                  <span className={`h-5 w-5 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`} />
                </button>
              );
            })}
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

      {/* Step 2: Details */}
      {step === 2 && (
        <section className="mt-5 px-5">
          <h2 className="text-base font-semibold">Tell us more</h2>
          <p className="text-xs text-muted-foreground">Optional details help us resolve faster.</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="e.g. No data after 8pm in my area"
                className="mt-1.5 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">{description.length}/300</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Location</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
                <MapPin className="h-4 w-4 text-primary" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Auto-detected — tap to edit</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">When did this happen?</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(["now", "earlier"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWhen(w)}
                    className={`rounded-2xl border px-3 py-2.5 text-xs font-semibold capitalize ${
                      when === w ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
                    }`}
                  >
                    {w === "now" ? "Right now" : "Earlier today"}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto context */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Captured automatically</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <ContextItem icon={Signal} label="Network" value="4G+" />
                <ContextItem icon={SignalBars} label="Signal" value="Strong" />
                <ContextItem icon={Smartphone} label="Device" value="Android" />
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

      {/* Step 3: Callback + submit */}
      {step === 3 && (
        <section className="mt-5 px-5">
          <h2 className="text-base font-semibold">Need a callback?</h2>
          <p className="text-xs text-muted-foreground">We can have an agent reach out to you.</p>

          <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Request a callback</p>
                  <p className="text-[11px] text-muted-foreground">From Safaricom support</p>
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
                  <label className="text-xs font-semibold">Confirm phone number</label>
                  <input
                    value={callbackNumber}
                    onChange={(e) => setCallbackNumber(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">Preferred time</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {["ASAP", "Within 1 hour", "This afternoon", "Tomorrow"].map((s) => (
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

          {/* Quick fixes hint */}
          <div className="mt-4 rounded-2xl border border-info/20 bg-info/5 p-4">
            <p className="text-xs font-semibold text-info">Try a quick fix first</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Many issues clear up by reconfiguring your internet settings or toggling airplane mode.
            </p>
            <Link to="/app/apn" className="mt-2 inline-flex text-[11px] font-semibold text-info">
              Fix internet settings →
            </Link>
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
          <div className="rounded-3xl bg-gradient-primary p-6 text-center text-primary-foreground shadow-glow">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-3 text-lg font-semibold">Your issue has been reported</p>
            <p className="mt-1 text-xs text-white/80">
              {callback ? "Our team will call you shortly." : "We'll investigate and update you."}
            </p>
            <div className="mt-4 inline-flex flex-col rounded-2xl bg-white/15 px-4 py-2 backdrop-blur">
              <span className="text-[10px] uppercase tracking-wider text-white/70">Reference</span>
              <span className="text-sm font-bold tracking-wide">{submittedRef}</span>
            </div>
            <p className="mt-3 text-[11px] text-white/75">Estimated response: under 2 hours</p>
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

          {/* Tracking */}
          {issues.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">My reported issues</h3>
              <div className="mt-3 space-y-2">
                {issues.slice(0, 5).map((i) => {
                  const m = issueMeta[i.type];
                  return (
                    <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${m.tone}`}>
                        {m.emoji}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{m.label}</p>
                        <p className="text-[11px] text-muted-foreground">{i.ref} • {i.location}</p>
                      </div>
                      <StatusPill status={i.status} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-5">
      <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground">We've got you — quick & supportive</p>
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

function SignalBars(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="14" width="3" height="6" rx="1" />
      <rect x="9" y="10" width="3" height="10" rx="1" />
      <rect x="15" y="6" width="3" height="14" rx="1" />
    </svg>
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
