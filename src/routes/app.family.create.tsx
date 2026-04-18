import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { useFamily } from "@/store/family";

export const Route = createFileRoute("/app/family/create")({
  component: CreateFamily,
});

function CreateFamily() {
  const navigate = useNavigate();
  const createFamily = useFamily((s) => s.createFamily);
  const [name, setName] = useState("");

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/family" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Create Family</h1>
      </header>

      <section className="mt-6 px-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Users className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-center text-base font-semibold">Name your family group</h2>
        <p className="mt-1 text-center text-xs text-muted-foreground">You're the owner. Add up to 8 members.</p>

        <div className="mt-6 space-y-2.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Family name (optional)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tesfaye Family"
            maxLength={40}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={() => {
            createFamily(name);
            navigate({ to: "/app/family/add" });
          }}
          className="mt-6 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Continue
        </button>
      </section>
    </div>
  );
}
