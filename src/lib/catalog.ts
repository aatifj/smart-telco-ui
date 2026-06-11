// Central product catalog with loyalty points per item.
// Loyalty rule: 1 point per ETB 10 (rounded up), with small minimums.

export type Category = "Daily" | "Weekly" | "Monthly" | "Unlimited" | "Mega";

export interface BundleProduct {
  id: string;
  name: string;
  data: string;
  category: Category;
  price: number; // ETB
  validity: string;
  tag?: string;
  icon?: string;
}

export const bundleCatalog: BundleProduct[] = [
  { id: "daily-mini", name: "Daily Mini", data: "500 MB", category: "Daily", price: 19, validity: "24 hrs", icon: "📶" },
  { id: "daily-saver", name: "Daily Saver", data: "1.5 GB", category: "Daily", price: 49, validity: "24 hrs", tag: "Popular", icon: "📶" },
  { id: "daily-plus", name: "Daily Plus", data: "3 GB + 30 min", category: "Daily", price: 99, validity: "24 hrs", icon: "📶" },
  { id: "daily-mega", name: "Daily Mega", data: "5 GB", category: "Daily", price: 149, validity: "24 hrs", tag: "Best value", icon: "📶" },
  { id: "weekly-pro", name: "Weekly Pro", data: "8 GB + 30 min", category: "Weekly", price: 299, validity: "7 days", tag: "Best value", icon: "📅" },
  { id: "mega-stream", name: "Mega Stream", data: "50 GB", category: "Mega", price: 1499, validity: "30 days", tag: "New", icon: "🎬" },
  { id: "night-owl", name: "Night Owl", data: "5 GB · 12am–7am", category: "Daily", price: 39, validity: "24 hrs", icon: "🌙" },
  { id: "social-pack", name: "Social Pack", data: "WhatsApp + TikTok 3 GB", category: "Weekly", price: 99, validity: "7 days", icon: "💬" },
];

export function loyaltyPointsFor(priceEtb: number): number {
  // 1 point per ETB 10, min 1 point
  return Math.max(1, Math.ceil(priceEtb / 10));
}

export function getBundle(id: string): BundleProduct | undefined {
  return bundleCatalog.find((b) => b.id === id);
}

export interface AdvanceOption {
  id: string;
  amount: number; // ETB advanced
  fee: number; // service fee in ETB
  repayDays: number;
}

export const advanceOptions: AdvanceOption[] = [
  { id: "adv-25", amount: 25, fee: 3, repayDays: 7 },
  { id: "adv-50", amount: 50, fee: 5, repayDays: 7 },
  { id: "adv-100", amount: 100, fee: 9, repayDays: 14 },
  { id: "adv-250", amount: 250, fee: 20, repayDays: 14 },
];
