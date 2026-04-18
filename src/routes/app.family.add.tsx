import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, UserPlus } from "lucide-react";
import { z } from "zod";
import { useFamily } from "@/store/family";

export const Route = createFileRoute("/app/family/add")({
  component: AddMember,
});

const schema = z.object({
  nickname: z.string().trim().min(1, "Add a nickname").max(30),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?251|0)?9\d{8}$/, "Enter a valid Safaricom number"),
});

function AddMember() {
  const navigate = useNavigate();
  const addMember = useFamily((s) => s.addMember);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ nickname?: string; phone?: string }>({});
  const [success, setSuccess] = useState(false);

  const submit = () => {
    const res = schema.safeParse({ nickname, phone });
    if (!res.success) {
      const fe: typeof errors = {};
      res.error.issues.forEach((i) => { fe[i.path[0] as "nickname" | "phone"] = i.message; });
      setErrors(fe);
      return;
    }
    addMember(res.data);
    setSuccess(true);
    setTimeout(() => navigate({ to: "/app/family" }), 1100);
  };

  if (success) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">Member added</h2>
        <p className="mt-1 text-sm text-muted-foreground">{nickname} can now share your family pool.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/family" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Add Member</h1>
      </header>

      <section className="mt-6 px-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10 text-info">
          <UserPlus className="h-7 w-7" />
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Nickname</label>
            <input
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setErrors((p) => ({ ...p, nickname: undefined })); }}
              placeholder="Son, Wife, Mom…"
              maxLength={30}
              className={`mt-1.5 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${errors.nickname ? "border-destructive" : "border-border"}`}
            />
            {errors.nickname && <p className="mt-1 text-[11px] text-destructive">{errors.nickname}</p>}
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Safaricom number</label>
            <input
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
              placeholder="09•• ••• •••"
              inputMode="tel"
              maxLength={15}
              className={`mt-1.5 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${errors.phone ? "border-destructive" : "border-border"}`}
            />
            {errors.phone && <p className="mt-1 text-[11px] text-destructive">{errors.phone}</p>}
          </div>
          <button className="w-full rounded-2xl border border-border bg-card py-3 text-xs font-semibold text-foreground">
            📇 Choose from contacts
          </button>
        </div>

        <button
          onClick={submit}
          className="mt-6 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Add Member
        </button>
      </section>
    </div>
  );
}
