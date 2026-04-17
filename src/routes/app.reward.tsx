import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Sparkles, Gift, Check } from "lucide-react";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/reward")({
  component: RewardCapturePage,
});

/**
 * Lead capture for Persona 2.
 * Validation: Ethio Telecom MSISDN must look like a real Ethiopian mobile.
 * Accepts 09XXXXXXXX, +2519XXXXXXXX, or 2519XXXXXXXX.
 */
const leadSchema = z.object({
  ethioNumber: z
    .string()
    .trim()
    .nonempty({ message: "Phone number is required" })
    .max(20, { message: "Phone number is too long" })
    .regex(/^(\+?251|0)?9\d{8}$/, {
      message: "Enter a valid Ethio Telecom number (e.g. 09XXXXXXXX)",
    }),
  fullName: z
    .string()
    .trim()
    .nonempty({ message: "Full name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(80, { message: "Name must be less than 80 characters" })
    .regex(/^[\p{L}\s'-]+$/u, { message: "Use letters only" }),
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .email({ message: "Enter a valid email address" })
    .max(120, { message: "Email is too long" }),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof leadSchema>, string>>;

function RewardCapturePage() {
  const navigate = useNavigate();
  const claimReward = usePersona((s) => s.claimReward);

  const [form, setForm] = useState({ ethioNumber: "", fullName: "", email: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof typeof form>(k: K, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof typeof form;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    claimReward(result.data);
    setTimeout(() => navigate({ to: "/app/reward/success" }), 350);
  };

  return (
    <div className="animate-fade-in pb-32">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Step 1 of 2
          </p>
          <h1 className="text-lg font-semibold">Unlock your reward</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="mt-3 flex gap-1.5 px-5">
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-border" />
      </div>

      {/* Reward preview */}
      <section className="mt-5 px-5">
        <div className="flex items-center gap-3 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 to-warning/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Gift className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">5 GB Free Data + 20 minutes</p>
            <p className="text-[11px] text-muted-foreground">
              Reserved for new Safaricom customers
            </p>
          </div>
          <Sparkles className="h-4 w-4 text-warning-foreground" />
        </div>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4 px-5" noValidate>
        <Field
          label="Ethio Telecom number"
          required
          value={form.ethioNumber}
          onChange={(v) => update("ethioNumber", v)}
          error={errors.ethioNumber}
          type="tel"
          placeholder="09XX XXX XXX"
          maxLength={20}
          inputMode="tel"
          autoComplete="tel"
        />
        <Field
          label="Full name"
          required
          value={form.fullName}
          onChange={(v) => update("fullName", v)}
          error={errors.fullName}
          placeholder="Abel Tesfaye"
          maxLength={80}
          autoComplete="name"
        />
        <Field
          label="Email address"
          required
          value={form.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          type="email"
          placeholder="you@example.com"
          maxLength={120}
          autoComplete="email"
        />

        <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
          By continuing you agree to be contacted about your Safaricom reward.
          We'll never share your details.
        </p>
      </form>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-card/95 p-4 pb-6 backdrop-blur-xl safe-bottom md:bottom-[calc(3rem+1px)] md:rounded-b-[2.25rem]">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-70"
        >
          {submitting ? "Reserving your reward..." : (
            <>Continue <Check className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, error, required, type = "text", placeholder,
  maxLength, inputMode, autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`mt-1.5 block w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
          error ? "border-destructive/60" : "border-border"
        }`}
      />
      {error && (
        <span className="mt-1 block text-[11px] font-medium text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
