import { create } from "zustand";

export type GameRewardKind = "data" | "voice" | "sms" | "discount";

export interface GameReward {
  id: string;
  kind: GameRewardKind;
  label: string; // e.g. "100 MB Free Data"
  amount: number; // MB / minutes / sms / % discount
  wonAt: number;
  source: "spin" | "trivia" | "scratch" | "streak";
  redeemed: boolean;
  locked: boolean; // true for Persona 2 until they activate a SIM
}

interface GamesState {
  playsToday: number;
  maxPlaysPerDay: number;
  streakDays: number;
  lastPlayDay: string | null; // YYYY-MM-DD
  rewards: GameReward[];
  level: "Beginner" | "Explorer" | "Pro";
  xp: number;
  consumePlay: () => boolean;
  addReward: (r: Omit<GameReward, "id" | "wonAt" | "redeemed">) => GameReward;
  redeemReward: (id: string) => void;
  unlockAll: () => void;
  resetDaily: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const computeLevel = (xp: number): GamesState["level"] =>
  xp >= 500 ? "Pro" : xp >= 150 ? "Explorer" : "Beginner";

export const useGames = create<GamesState>((set, get) => ({
  playsToday: 0,
  maxPlaysPerDay: 3,
  streakDays: 0,
  lastPlayDay: null,
  rewards: [],
  level: "Beginner",
  xp: 0,

  consumePlay: () => {
    const { playsToday, maxPlaysPerDay, lastPlayDay, streakDays } = get();
    const day = today();
    // reset if day changed
    if (lastPlayDay !== day) {
      const wasYesterday =
        lastPlayDay &&
        new Date(day).getTime() - new Date(lastPlayDay).getTime() === 86400000;
      set({
        playsToday: 0,
        lastPlayDay: day,
        streakDays: wasYesterday ? streakDays + 1 : 1,
      });
    }
    if (get().playsToday >= maxPlaysPerDay) return false;
    set((s) => ({ playsToday: s.playsToday + 1 }));
    return true;
  },

  addReward: (r) => {
    const reward: GameReward = {
      ...r,
      id: Math.random().toString(36).slice(2, 10),
      wonAt: Date.now(),
      redeemed: false,
    };
    set((s) => {
      const xp = s.xp + (r.kind === "data" ? Math.min(r.amount, 200) : 25);
      return { rewards: [reward, ...s.rewards], xp, level: computeLevel(xp) };
    });
    return reward;
  },

  redeemReward: (id) =>
    set((s) => ({
      rewards: s.rewards.map((r) => (r.id === id ? { ...r, redeemed: true } : r)),
    })),

  unlockAll: () =>
    set((s) => ({ rewards: s.rewards.map((r) => ({ ...r, locked: false })) })),

  resetDaily: () => set({ playsToday: 0, lastPlayDay: today() }),
}));
