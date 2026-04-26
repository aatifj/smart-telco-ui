import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ShieldCheck, IdCard, Camera, Upload, Check, ChevronRight, Lock,
  AlertTriangle, FileCheck2, ScanLine,
} from "lucide-react";
import { useFayda, faydaStatusMeta, type FaydaProfile } from "@/store/fayda";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/fayda")({
  component: FaydaPage,
});

type Step = "intro" | "form" | "scan" | "selfie" | "review" | "status";

function FaydaPage() {
  const navigate = useNavigate();
  const { submission, submit, setStatus } = useFayda();
  const { isDeactivated } = useLifecycleGuard();

  const [step, setStep] = useState<Step>(submission ? "status" : "intro");
  const [profile, setProfile] = useState<FaydaProfile>({
    faydaId: submission?.profile.faydaId ?? "",
    fullName: submission?.profile.fullName ?? "Abel Tesfaye",
    dob: submission?.profile.dob ?? "",
    phone: submission?.profile.phone ?? "+251 7•• ••• 412",
    email: submission?.profile.email ?? "",
    altPhone: submission?.profile.altPhone ?? "",
    address: submission?.profile.address ?? "",
    idScanned: submission?.profile.idScanned ?? false,
    selfieDone: submission?.profile.selfieDone ?? false,
  });

  if (isDeactivated) {
    return (
      <div className="animate-fade-in p-5">
        <Header back="/app/profile" title="Update with Fayda ID" />
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Your line is deactivated. Please visit the nearest Safaricom shop to reactivate before updating your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      <Header back={step === "intro" || step === "status" ? "/app/profile" : undefined} onBack={step !== "intro" && step !== "status" ? () => setStep(prevStep(step)) : undefined} title="Update with Fayda ID" />

      {step !== "status" && step !== "intro" && (
        <div className="mt-3 flex items-center gap-1.5 px-5">
          {(["form", "scan", "selfie", "review"] as Step[]).map((s, i) => {
            const order = ["form", "scan", "selfie", "review"];
            const idx = order.indexOf(step);
            const done = i < idx;
            const active = i === idx;
            return (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${done || active ? "bg-primary" : "bg-muted"}`}
              />
            );
          })}
        </div>
      )}

      {step === "intro" && <IntroStep onNext={() => setStep("form")} />}
      {step === "form" && <FormStep profile={profile} setProfile={setProfile} onNext={() => setStep("scan")} />}
      {step === "scan" && (
        <ScanStep
          done={profile.idScanned}
          onScan={() => setProfile({ ...profile, idScanned: true })}
          onNext={() => setStep("selfie")}
        />
      )}
      {step === "selfie" && (
        <SelfieStep
          done={profile.selfieDone}
          onCapture={() => setProfile({ ...profile, selfieDone: true })}
          onNext={() => setStep("review")}
        />
      )}
      {step === "review" && (
        <ReviewStep
          profile={profile}
          onSubmit={() => {
            submit(profile);
            setStep("status");
          }}
        />
      )}
      {step === "status" && submission && (
        <StatusStep
          onCorrect={() => setStep("form")}
          onSimulate={(s, reason) => setStatus(s, reason)}
          onHome={() => navigate({ to: "/app" })}
        />
      )}
    </div>
  );
}

function prevStep(s: Step): Step {
  const order: Step[] = ["intro", "form", "scan", "selfie", "review", "status"];
  return order[Math.max(0, order.indexOf(s) - 1)];
}

function Header({ back, onBack, title }: { back?: string; onBack?: () => void; title: string }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-5">
      {onBack ? (
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
      ) : back ? (
        <Link to={back} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : null}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-[11px] text-muted-foreground">Secure SIM re-registration</p>
      </div>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
        <ShieldCheck className="h-4 w-4" />
      </span>
    </header>
  );
}

function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <section className="mt-4 px-5">
      <div className="overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <span className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
          Required by NCA
        </span>
        <p className="mt-3 text-lg font-semibold leading-tight">
          Re-register your SIM with your Fayda ID
        </p>
        <p className="mt-1 text-xs text-white/80">
          Use Ethiopia's national digital ID to keep your Safaricom profile current and secure.
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {[
          { i: IdCard, t: "Enter your Fayda ID details", s: "ID number, name and date of birth" },
          { i: ScanLine, t: "Scan or upload your Fayda ID", s: "Front side, well-lit and clear" },
          { i: Camera, t: "Quick selfie verification", s: "Used only for identity match" },
          { i: FileCheck2, t: "Review and submit", s: "We'll notify you when verified" },
        ].map((s) => (
          <div key={s.t} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.i className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{s.t}</p>
              <p className="text-[11px] text-muted-foreground">{s.s}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border bg-secondary/40 p-3 text-[11px] text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 text-success" />
        Your information is securely handled for identity verification only.
      </div>

      <button onClick={onNext} className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
        Get started
      </button>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function FormStep({ profile, setProfile, onNext }: { profile: FaydaProfile; setProfile: (p: FaydaProfile) => void; onNext: () => void }) {
  const valid = profile.faydaId.trim().length >= 6 && profile.fullName.trim() && profile.dob && profile.phone.trim();
  return (
    <section className="mt-5 space-y-3 px-5">
      <Field label="Fayda ID number" value={profile.faydaId} onChange={(v) => setProfile({ ...profile, faydaId: v })} placeholder="e.g. 1234 5678 9012" />
      <Field label="Full name" value={profile.fullName} onChange={(v) => setProfile({ ...profile, fullName: v })} placeholder="As shown on Fayda ID" />
      <Field label="Date of birth" value={profile.dob} onChange={(v) => setProfile({ ...profile, dob: v })} type="date" />
      <Field label="Safaricom number" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} placeholder="+251 7•• ••• •••" />

      <div className="pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Optional</p>
      </div>
      <Field label="Email address" value={profile.email ?? ""} onChange={(v) => setProfile({ ...profile, email: v })} placeholder="[email protected]" />
      <Field label="Alternate phone" value={profile.altPhone ?? ""} onChange={(v) => setProfile({ ...profile, altPhone: v })} placeholder="+251 ..." />
      <Field label="Address / city" value={profile.address ?? ""} onChange={(v) => setProfile({ ...profile, address: v })} placeholder="Bole, Addis Ababa" />

      <button
        disabled={!valid}
        onClick={onNext}
        className="mt-3 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        Continue
      </button>
    </section>
  );
}

function ScanStep({ done, onScan, onNext }: { done: boolean; onScan: () => void; onNext: () => void }) {
  return (
    <section className="mt-5 px-5">
      <p className="text-sm font-semibold">Scan or upload your Fayda ID</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Front side · place inside the frame</p>

      <div className={`mt-4 flex aspect-[4/3] items-center justify-center rounded-3xl border-2 border-dashed ${done ? "border-success bg-success/5" : "border-border bg-secondary/30"}`}>
        {done ? (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-6 w-6" />
            </div>
            <p className="mt-2 text-sm font-semibold">Document captured</p>
            <p className="text-[11px] text-muted-foreground">fayda-id-front.jpg</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <ScanLine className="mx-auto h-10 w-10" />
            <p className="mt-2 text-xs">Align ID inside the frame</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onScan} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground">
          <ScanLine className="h-4 w-4" /> Scan now
        </button>
        <button onClick={onScan} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-xs font-semibold">
          <Upload className="h-4 w-4" /> Upload photo
        </button>
      </div>

      <button
        disabled={!done}
        onClick={onNext}
        className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        Continue
      </button>
    </section>
  );
}

function SelfieStep({ done, onCapture, onNext }: { done: boolean; onCapture: () => void; onNext: () => void }) {
  return (
    <section className="mt-5 px-5">
      <p className="text-sm font-semibold">Selfie verification</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Optional — helps us verify your identity faster</p>

      <div className={`mt-4 mx-auto flex aspect-square w-56 items-center justify-center rounded-full border-2 border-dashed ${done ? "border-success bg-success/5" : "border-border bg-secondary/30"}`}>
        {done ? (
          <Check className="h-10 w-10 text-success" />
        ) : (
          <Camera className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      <button onClick={onCapture} className="mt-5 w-full rounded-2xl border border-border bg-card py-3 text-xs font-semibold">
        {done ? "Retake selfie" : "Capture selfie"}
      </button>
      <button
        onClick={onNext}
        className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        {done ? "Continue" : "Skip for now"}
      </button>
    </section>
  );
}

function ReviewStep({ profile, onSubmit }: { profile: FaydaProfile; onSubmit: () => void }) {
  return (
    <section className="mt-5 px-5">
      <p className="text-sm font-semibold">Review your details</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Make sure everything matches your Fayda ID</p>

      <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-4">
        <Row k="Fayda ID" v={profile.faydaId || "—"} />
        <Row k="Full name" v={profile.fullName} />
        <Row k="Date of birth" v={profile.dob || "—"} />
        <Row k="Safaricom number" v={profile.phone} />
        {profile.email && <Row k="Email" v={profile.email} />}
        {profile.altPhone && <Row k="Alternate phone" v={profile.altPhone} />}
        {profile.address && <Row k="Address" v={profile.address} />}
        <Row k="ID scan" v={profile.idScanned ? "Uploaded" : "Missing"} />
        <Row k="Selfie" v={profile.selfieDone ? "Captured" : "Skipped"} />
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-2xl border border-border bg-secondary/40 p-3 text-[11px] text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-success" />
        Your information is securely handled for identity verification.
      </div>

      <button
        onClick={onSubmit}
        className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        Submit for verification
      </button>
    </section>
  );
}

function StatusStep({ onCorrect, onSimulate, onHome }: { onCorrect: () => void; onSimulate: (s: ReturnType<typeof useFayda.getState>["submission"] extends infer T ? T extends { status: infer S } ? S : never : never, reason?: string) => void; onHome: () => void }) {
  const submission = useFayda((s) => s.submission)!;
  const meta = faydaStatusMeta[submission.status];
  return (
    <section className="mt-5 px-5">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileCheck2 className="h-7 w-7" />
        </div>
        <p className="mt-3 text-center text-base font-semibold">
          Your Fayda ID profile update has been submitted
        </p>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          Reference {submission.ref}
        </p>
        <div className="mt-4 flex justify-center">
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${meta.tone}`}>
            {meta.emoji} {meta.label}
          </span>
        </div>
      </div>

      {/* Verification timeline */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification status</p>
        <ol className="mt-3 space-y-3">
          {[
            { k: "submitted", l: "Submitted" },
            { k: "under_review", l: "Under review" },
            { k: "verified", l: "Verified" },
          ].map((s, i) => {
            const order = ["submitted", "under_review", "verified"];
            const cur = order.indexOf(submission.status);
            const done = cur >= i;
            return (
              <li key={s.k} className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <p className={`text-sm ${done ? "font-semibold" : "text-muted-foreground"}`}>{s.l}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Expected next step: {submission.status === "verified" ? "Profile updated — no action needed." : submission.status === "rejected" ? "Re-upload documents or correct details." : "We'll notify you within 24-48 hours."}
        </p>
      </div>

      {submission.status === "rejected" && (
        <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">Needs correction</p>
              <p className="mt-0.5 text-xs text-foreground/80">
                {submission.rejectionReason ?? "ID image was unclear. Please re-upload a clearer photo of the front side."}
              </p>
            </div>
          </div>
          <button onClick={onCorrect} className="mt-3 w-full rounded-xl bg-destructive py-2.5 text-xs font-semibold text-destructive-foreground">
            Fix & resubmit
          </button>
        </div>
      )}

      {/* Demo controls */}
      <div className="mt-5 rounded-2xl border border-dashed border-border bg-secondary/30 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Demo · simulate status</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button onClick={() => onSimulate("under_review")} className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium">Under review</button>
          <button onClick={() => onSimulate("verified")} className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium">Verified</button>
          <button onClick={() => onSimulate("rejected", "ID photo unclear")} className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium">Reject</button>
        </div>
      </div>

      <button onClick={onHome} className="mt-5 flex w-full items-center justify-center gap-1 rounded-2xl border border-border bg-card py-3 text-xs font-semibold">
        Back to home <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
