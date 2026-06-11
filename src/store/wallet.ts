import { create } from "zustand";

export type PaymentMethod = "airtime" | "mpesa" | "advance";

interface WalletState {
  airtime: number;
  mpesa: number;
  loyaltyPoints: number;
  /** Outstanding airtime advance owed back to Safaricom. */
  advanceOwed: number;
  /** Maximum advance the customer is eligible for. */
  advanceLimit: number;

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
