import { create } from "zustand";

export type PaymentMethod =
  | "airtime"
  | "mpesa"
  | "advance"
  | "cbe"
  | "awash"
  | "dashen"
  | "rewards";

/** Loyalty point to ETB conversion (10 pts = 1 ETB). */
export const POINTS_PER_ETB = 10;

interface WalletState {
  airtime: number;
  mpesa: number;
  loyaltyPoints: number;
  /** Outstanding airtime advance owed back to Safaricom. */
  advanceOwed: number;
  /** Maximum advance the customer is eligible for. */
  advanceLimit: number;
  /** Linked bank account balances (simulated). */
  banks: { cbe: number; awash: number; dashen: number };

  pay: (amount: number, method: PaymentMethod) => { ok: boolean; reason?: string };
  earnPoints: (points: number) => void;
  takeAdvance: (amount: number, fee: number) => { ok: boolean; reason?: string };
  repayAdvance: (amount: number) => void;
}

export const useWallet = create<WalletState>((set, get) => ({
  airtime: 248.5,
  mpesa: 1250,
  loyaltyPoints: 1840,
  advanceOwed: 0,
  advanceLimit: 250,
  banks: { cbe: 5400, awash: 3200, dashen: 1800 },

  pay: (amount, method) => {
    const s = get();
    if (method === "airtime") {
      if (s.airtime < amount) return { ok: false, reason: "Not enough airtime" };
      set({ airtime: +(s.airtime - amount).toFixed(2) });
    } else if (method === "mpesa") {
      if (s.mpesa < amount) return { ok: false, reason: "Not enough M-PESA balance" };
      set({ mpesa: +(s.mpesa - amount).toFixed(2) });
    } else if (method === "advance") {
      const available = s.advanceLimit - s.advanceOwed;
      if (available < amount) return { ok: false, reason: "Advance limit exceeded" };
      set({ advanceOwed: +(s.advanceOwed + amount).toFixed(2) });
    } else if (method === "cbe" || method === "awash" || method === "dashen") {
      const bal = s.banks[method];
      if (bal < amount) return { ok: false, reason: "Insufficient bank balance" };
      set({ banks: { ...s.banks, [method]: +(bal - amount).toFixed(2) } });
    } else if (method === "rewards") {
      const needed = Math.ceil(amount * POINTS_PER_ETB);
      if (s.loyaltyPoints < needed)
        return { ok: false, reason: `Need ${needed} points (have ${s.loyaltyPoints})` };
      set({ loyaltyPoints: s.loyaltyPoints - needed });
      return { ok: true };
    }
    return { ok: true };
  },
  earnPoints: (points) => set({ loyaltyPoints: get().loyaltyPoints + points }),
  takeAdvance: (amount, fee) => {
    const s = get();
    const total = amount + fee;
    const available = s.advanceLimit - s.advanceOwed;
    if (available < total) return { ok: false, reason: "Advance limit exceeded" };
    set({
      airtime: +(s.airtime + amount).toFixed(2),
      advanceOwed: +(s.advanceOwed + total).toFixed(2),
    });
    return { ok: true };
  },
  repayAdvance: (amount) =>
    set({ advanceOwed: Math.max(0, +(get().advanceOwed - amount).toFixed(2)) }),
}));
