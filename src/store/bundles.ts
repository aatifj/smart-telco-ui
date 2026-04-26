import { create } from "zustand";

export type BundleKind = "data" | "voice" | "sms" | "combo";

export interface ActiveBundle {
  id: string;
  name: string;
  kind: BundleKind;
  /** Display detail (e.g. "8 GB + 30 min"). */
  detail: string;
  /** Used + total per resource (whichever apply). */
  data?: { used: number; total: number; unit: "GB" | "MB" };
  voice?: { used: number; total: number };
  sms?: { used: number; total: number };
  /** Expiry timestamp (ms). */
  expiresAt: number;
  /** Renewal price in ETB. */
  renewPrice: number;
  validityDays: number;
  autoRenew: boolean;
  expired?: boolean;
}

interface BundlesState {
  bundles: ActiveBundle[];
  toggleAutoRenew: (id: string) => void;
  renew: (id: string) => void;
}

const now = Date.now();
const day = 1000 * 60 * 60 * 24;

export const useBundles = create<BundlesState>((set, get) => ({
  bundles: [
    {
      id: "b1",
      name: "Weekly Pro",
      kind: "combo",
      detail: "8 GB + 30 min",
      data: { used: 4.6, total: 8, unit: "GB" },
      voice: { used: 12, total: 30 },
      expiresAt: now + day * 3 + 1000 * 60 * 60 * 6,
      renewPrice: 299,
      validityDays: 7,
      autoRenew: true,
    },
    {
      id: "b2",
      name: "Daily Saver",
      kind: "data",
      detail: "1.5 GB",
      data: { used: 1.2, total: 1.5, unit: "GB" },
      expiresAt: now + 1000 * 60 * 60 * 8,
      renewPrice: 49,
      validityDays: 1,
      autoRenew: false,
    },
    {
      id: "b3",
      name: "Social Pack",
      kind: "data",
      detail: "WhatsApp + TikTok 3 GB",
      data: { used: 3, total: 3, unit: "GB" },
      expiresAt: now - day,
      renewPrice: 99,
      validityDays: 7,
      autoRenew: false,
      expired: true,
    },
  ],
  toggleAutoRenew: (id) =>
    set({
      bundles: get().bundles.map((b) =>
        b.id === id ? { ...b, autoRenew: !b.autoRenew } : b,
      ),
    }),
  renew: (id) =>
    set({
      bundles: get().bundles.map((b) =>
        b.id === id
          ? {
              ...b,
              expiresAt: Date.now() + day * b.validityDays,
              expired: false,
              data: b.data ? { ...b.data, used: 0 } : undefined,
              voice: b.voice ? { ...b.voice, used: 0 } : undefined,
              sms: b.sms ? { ...b.sms, used: 0 } : undefined,
            }
          : b,
      ),
    }),
}));

export function formatExpiry(ts: number) {
  const diff = ts - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h left`;
}
