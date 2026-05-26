import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export interface RewardLead {
  ethioNumber: string;
  fullName: string;
  email: string;
  claimedAt: number; // epoch ms
  validForDays: number;
  bundle: { dataGb: number; voiceMin: number };
}

interface PersonaState {
  persona: Persona | null;
  lifecycle: Lifecycle;
  isAuthed: boolean;
  reward: RewardLead | null;
  setPersona: (p: Persona) => void;
  setLifecycle: (l: Lifecycle) => void;
  claimReward: (lead: Omit<RewardLead, "claimedAt" | "validForDays" | "bundle">) => void;
  clearReward: () => void;
  logout: () => void;
}

export const usePersona = create<PersonaState>((set) => ({
  persona: null,
  lifecycle: "active",
  isAuthed: false,
  reward: null,
  setPersona: (p) => set({ persona: p, isAuthed: true }),
  setLifecycle: (l) => set({ lifecycle: l }),
  claimReward: (lead) =>
    set({
      reward: {
        ...lead,
        claimedAt: Date.now(),
        validForDays: 7,
        bundle: { dataGb: 5, voiceMin: 20 },
      },
    }),
  clearReward: () => set({ reward: null }),
  logout: () => set({ persona: null, isAuthed: false, lifecycle: "active", reward: null }),
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
