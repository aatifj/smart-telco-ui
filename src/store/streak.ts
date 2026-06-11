import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StreakMilestone {
  /** Required consecutive days */
  days: number;
  /** Reward in megabytes */
  dataMB: number;
  /** Short display label */
  label: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, dataMB: 25, label: "Warm-up" },
  { days: 7, dataMB: 50, label: "One week strong" },
  { days: 14, dataMB: 100, label: "Two-week pro" },
  { days: 30, dataMB: 100, label: "30-day champion" },
  { days: 60, dataMB: 200, label: "60-day legend" },
  { days: 90, dataMB: 500, label: "Quarterly star" },
  { days: 180, dataMB: 1024, label: "Half-year hero" },
  { days: 365, dataMB: 3072, label: "Yearly icon" },
];

const today = () => new Date().toISOString().slice(0, 10);
const dayDiff = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

interface StreakState {
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  lastCheckIn: string | null; // YYYY-MM-DD
  claimedMilestones: number[]; // days values already claimed
  /** Milestones the user just reached but hasn't claimed yet */
  pendingMilestones: number[];
  checkIn: () => { reachedMilestone: StreakMilestone | null; alreadyChecked: boolean };
  claimMilestone: (days: number) => StreakMilestone | null;
  reset: () => void;
}

export const useStreak = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      bestStreak: 0,
      totalDays: 0,
      lastCheckIn: null,
      claimedMilestones: [],
      pendingMilestones: [],

      checkIn: () => {
        const day = today();
        const { lastCheckIn, currentStreak, bestStreak, totalDays, claimedMilestones, pendingMilestones } = get();

        if (lastCheckIn === day) {
          return { reachedMilestone: null, alreadyChecked: true };
        }

        let nextStreak = 1;
        if (lastCheckIn) {
          const diff = dayDiff(lastCheckIn, day);
          if (diff === 1) nextStreak = currentStreak + 1;
        }

        const reached = STREAK_MILESTONES.find(
          (m) => m.days === nextStreak && !claimedMilestones.includes(m.days),
        );

        set({
          currentStreak: nextStreak,
          bestStreak: Math.max(bestStreak, nextStreak),
          totalDays: totalDays + 1,
          lastCheckIn: day,
          pendingMilestones: reached
            ? Array.from(new Set([...pendingMilestones, reached.days]))
            : pendingMilestones,
        });

        return { reachedMilestone: reached ?? null, alreadyChecked: false };
      },

      claimMilestone: (days) => {
        const milestone = STREAK_MILESTONES.find((m) => m.days === days);
        if (!milestone) return null;
        const { claimedMilestones, pendingMilestones } = get();
        if (claimedMilestones.includes(days)) return null;
        set({
          claimedMilestones: [...claimedMilestones, days],
          pendingMilestones: pendingMilestones.filter((d) => d !== days),
        });
        return milestone;
      },

      reset: () =>
        set({
          currentStreak: 0,
          bestStreak: 0,
          totalDays: 0,
          lastCheckIn: null,
          claimedMilestones: [],
          pendingMilestones: [],
        }),
    }),
    {
      name: "safaricom-streak-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function nextMilestone(currentStreak: number): StreakMilestone | null {
  return STREAK_MILESTONES.find((m) => m.days > currentStreak) ?? null;
}

export function formatReward(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1)} GB`;
  }
  return `${mb} MB`;
}
