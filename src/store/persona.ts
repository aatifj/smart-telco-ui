import { create } from "zustand";

export type Persona =
  | "safaricom" // Persona 1
  | "explorer" // Persona 2
  | "roaming" // Persona 3
  | "diaspora" // Persona 4
  | "transition"; // Persona 5

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

interface PersonaState {
  persona: Persona | null;
  isAuthed: boolean;
  setPersona: (p: Persona) => void;
  logout: () => void;
}

export const usePersona = create<PersonaState>((set) => ({
  persona: null,
  isAuthed: false,
  setPersona: (p) => set({ persona: p, isAuthed: true }),
  logout: () => set({ persona: null, isAuthed: false }),
}));
