import { useState } from "react";
import { Layers, Check } from "lucide-react";
import {
  usePersona,
  personaMeta,
  lifecycleMeta,
  type Persona,
  type Lifecycle,
} from "@/store/persona";
import { useNavigate } from "@tanstack/react-router";

const order: Persona[] = ["safaricom", "explorer", "roaming", "diaspora", "transition"];
const lifecycles: Lifecycle[] = ["active", "suspended", "deactivated"];

export function PersonaSwitcher() {
  const [open, setOpen] = useState(false);
  const { persona, setPersona, lifecycle, setLifecycle } = usePersona();
  const navigate = useNavigate();
  const lifecycleApplies = persona === "safaricom" || persona === "roaming";

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-elevated transition-transform hover:scale-105 md:bottom-12 md:right-[calc(50%-260px)]"
        aria-label="Switch persona"
      >
        <Layers className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] animate-slide-up rounded-t-3xl bg-card p-5 shadow-elevated md:rounded-3xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border md:hidden" />
            <h3 className="text-base font-semibold">Preview persona</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Demo tool — switch between the 5 dynamic UI states.
            </p>
            <ul className="mt-4 space-y-2">
              {order.map((p) => {
                const m = personaMeta[p];
                const active = p === persona;
                return (
                  <li key={p}>
                    <button
                      onClick={() => {
                        setPersona(p);
                        setOpen(false);
                        navigate({ to: "/app" });
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${m.gradient} text-primary-foreground shadow-soft`}>
                        {m.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.tag}</p>
                      </div>
                      {active && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Lifecycle state — applies only to Persona 1 & 3 */}
            <div className="mt-5 rounded-2xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">Subscriber lifecycle</p>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {lifecycleApplies ? "Persona 1 & 3" : "N/A for this persona"}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {lifecycles.map((l) => {
                  const m = lifecycleMeta[l];
                  const active = l === lifecycle;
                  return (
                    <button
                      key={l}
                      disabled={!lifecycleApplies}
                      onClick={() => {
                        setLifecycle(l);
                        setOpen(false);
                      }}
                      className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-[11px] font-semibold transition-all disabled:opacity-40 ${
                        active && lifecycleApplies
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <span className="text-base leading-none">{m.emoji}</span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
