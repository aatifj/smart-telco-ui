import { create } from "zustand";

export type Persona =
  | "safaricom" // Persona 1
  | "explorer" // Persona 2
  | "roaming" // Persona 3
  | "diaspora" // Persona 4
  | "transition"; // Persona 5

export type Lifecycle = "active" | "suspended" | "deactivated";

export const personaMeta: Record<
  Persona,
  { label: string; tag: string; emoji: string; gradient: string }
> = {
  safaricom: {
    label: "Safaricom User",
    tag: "Existing customer",
    emoji: "🟢",
    gradient: "bg-gradient-primary",
  },
  explorer: {
    label: "Explorer",
    tag: "Non-Safaricom",
    emoji: "✨",
    gradient: "bg-gradient-hero",
  },
  roaming: {
    label: "Roaming",
    tag: "Outside Ethiopia",
    emoji: "🌍",
    gradient: "bg-gradient-roaming",
  },
  diaspora: {
    label: "Diaspora",
    tag: "Sending home",
    emoji: "💚",
    gradient: "bg-gradient-diaspora",
  },
  transition: {
    label: "New SIM",
    tag: "Activation pending",
    emoji: "📦",
    gradient: "bg-gradient-hero",
  },
};

export const lifecycleMeta: Record<
  Lifecycle,
  { label: string; emoji: string; tone: string }
> = {
  active: { label: "Active", emoji: "🟢", tone: "text-success" },
  suspended: { label: "Suspended", emoji: "🟡", tone: "text-warning-foreground" },
  deactivated: { label: "Deactivated", emoji: "🔴", tone: "text-destructive" },
};

interface PersonaState {
  persona: Persona | null;
  lifecycle: Lifecycle;
  isAuthed: boolean;
  setPersona: (p: Persona) => void;
  setLifecycle: (l: Lifecycle) => void;
  logout: () => void;
}

export const usePersona = create<PersonaState>((set) => ({
  persona: null,
  lifecycle: "active",
  isAuthed: false,
  setPersona: (p) => set({ persona: p, isAuthed: true }),
  setLifecycle: (l) => set({ lifecycle: l }),
  logout: () => set({ persona: null, isAuthed: false, lifecycle: "active" }),
}));

/** Lifecycle restrictions only apply to Persona 1 (safaricom) and Persona 3 (roaming). */
export function useLifecycleGuard() {
  const persona = usePersona((s) => s.persona);
  const lifecycle = usePersona((s) => s.lifecycle);
  const applies = persona === "safaricom" || persona === "roaming";
  return {
    lifecycle: applies ? lifecycle : ("active" as Lifecycle),
    isSuspended: applies && lifecycle === "suspended",
    isDeactivated: applies && lifecycle === "deactivated",
    isRestricted: applies && lifecycle !== "active",
  };
}
