import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type StoreCategory =
  | "Electronics"
  | "Fashion"
  | "Beauty"
  | "Food"
  | "Accessories"
  | "Services"
  | "Digital Products"
  | "Other";

export const STORE_CATEGORIES: StoreCategory[] = [
  "Electronics",
  "Fashion",
  "Beauty",
  "Food",
  "Accessories",
  "Services",
  "Digital Products",
  "Other",
];

export const categoryEmoji: Record<StoreCategory, string> = {
  Electronics: "📱",
  Fashion: "👗",
  Beauty: "💄",
  Food: "🍲",
  Accessories: "👜",
  Services: "🛠️",
  "Digital Products": "💾",
  Other: "🏷️",
};

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number; // ETB
  emoji: string;
  available: boolean;
  createdAt: number;
}

export interface MiniStore {
  id: string;
  ownerPhone: string; // demo: links a store to its owner
  isMine?: boolean;
  name: string;
  tagline: string;
  category: StoreCategory;
  emoji: string;
  banner: string; // tailwind gradient class
  rating: number;
  reviews: number;
  location: string;
  whatsapp: string;
  phone: string;
  trending?: boolean;
  featured?: boolean;
  createdAt: number;
}

const banners = [
  "bg-gradient-primary",
  "bg-gradient-hero",
  "bg-gradient-roaming",
  "bg-gradient-diaspora",
  "bg-gradient-to-br from-warning to-destructive",
  "bg-gradient-to-br from-info to-primary",
];

const seedStores: MiniStore[] = [
  {
    id: "s1",
    ownerPhone: "+251 9•• ••• 110",
    name: "Habesha Habesha Boutique",
    tagline: "Handwoven cultural wear",
    category: "Fashion",
    emoji: "👗",
    banner: banners[1],
    rating: 4.8,
    reviews: 126,
    location: "Bole, Addis Ababa",
    whatsapp: "+251911000110",
    phone: "+251911000110",
    trending: true,
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: "s2",
    ownerPhone: "+251 9•• ••• 220",
    name: "TechHub Addis",
    tagline: "Phones, chargers & accessories",
    category: "Electronics",
    emoji: "📱",
    banner: banners[5],
    rating: 4.6,
    reviews: 88,
    location: "Piassa, Addis Ababa",
    whatsapp: "+251911000220",
    phone: "+251911000220",
    trending: true,
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: "s3",
    ownerPhone: "+251 9•• ••• 330",
    name: "Sheger Spice Kitchen",
    tagline: "Authentic injera & wot",
    category: "Food",
    emoji: "🍲",
    banner: banners[4],
    rating: 4.9,
    reviews: 312,
    location: "Kazanchis",
    whatsapp: "+251911000330",
    phone: "+251911000330",
    trending: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    id: "s4",
    ownerPhone: "+251 9•• ••• 440",
    name: "Lalibela Crafts",
    tagline: "Handmade leather & jewelry",
    category: "Accessories",
    emoji: "👜",
    banner: banners[3],
    rating: 4.7,
    reviews: 54,
    location: "Lalibela",
    whatsapp: "+251911000440",
    phone: "+251911000440",
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "s5",
    ownerPhone: "+251 9•• ••• 550",
    name: "Glow by Hanan",
    tagline: "Organic skincare studio",
    category: "Beauty",
    emoji: "💄",
    banner: banners[0],
    rating: 4.5,
    reviews: 41,
    location: "Sarbet",
    whatsapp: "+251911000550",
    phone: "+251911000550",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "s6",
    ownerPhone: "+251 9•• ••• 660",
    name: "FixIt Pro Services",
    tagline: "Home repair & plumbing",
    category: "Services",
    emoji: "🛠️",
    banner: banners[2],
    rating: 4.4,
    reviews: 22,
    location: "Citywide",
    whatsapp: "+251911000660",
    phone: "+251911000660",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
];

const seedProducts: Product[] = [
  { id: "p1", storeId: "s1", name: "Netela Shawl", description: "Hand-spun cotton with tilet trim.", price: 1800, emoji: "🧣", available: true, createdAt: Date.now() },
  { id: "p2", storeId: "s1", name: "Habesha Kemis", description: "Traditional women's dress, custom sizing.", price: 4500, emoji: "👗", available: true, createdAt: Date.now() },
  { id: "p3", storeId: "s1", name: "Men's Bernos", description: "Wool cloak for ceremonies.", price: 6200, emoji: "🧥", available: false, createdAt: Date.now() },
  { id: "p4", storeId: "s2", name: "Fast Charger 25W", description: "USB-C, original quality.", price: 950, emoji: "🔌", available: true, createdAt: Date.now() },
  { id: "p5", storeId: "s2", name: "Bluetooth Earbuds", description: "Noise isolation, 24h battery.", price: 2400, emoji: "🎧", available: true, createdAt: Date.now() },
  { id: "p6", storeId: "s2", name: "Phone Stand", description: "Aluminum desk stand.", price: 480, emoji: "📱", available: true, createdAt: Date.now() },
  { id: "p7", storeId: "s3", name: "Doro Wot Family Pack", description: "Serves 4 — with injera.", price: 850, emoji: "🍗", available: true, createdAt: Date.now() },
  { id: "p8", storeId: "s3", name: "Shiro Combo", description: "Hot shiro with fresh injera.", price: 250, emoji: "🥘", available: true, createdAt: Date.now() },
  { id: "p9", storeId: "s4", name: "Leather Tote", description: "Hand-stitched, full-grain.", price: 3800, emoji: "👜", available: true, createdAt: Date.now() },
  { id: "p10", storeId: "s4", name: "Silver Cross Pendant", description: "Lalibela-style silver.", price: 2200, emoji: "✨", available: true, createdAt: Date.now() },
  { id: "p11", storeId: "s5", name: "Honey Face Serum", description: "100% natural Ethiopian honey.", price: 690, emoji: "🍯", available: true, createdAt: Date.now() },
  { id: "p12", storeId: "s6", name: "Plumbing Call-Out", description: "Same-day fix, parts extra.", price: 500, emoji: "🔧", available: true, createdAt: Date.now() },
];

interface MarketplaceState {
  stores: MiniStore[];
  products: Product[];
  favorites: string[]; // store ids
  myStoreId: string | null;

  createStore: (input: { name: string; tagline: string; category: StoreCategory; location: string; whatsapp: string }) => string;
  updateStore: (id: string, patch: Partial<MiniStore>) => void;
  deleteStore: (id: string) => void;

  addProduct: (input: { storeId: string; name: string; description: string; price: number; emoji?: string }) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  toggleFavorite: (storeId: string) => void;
}

export const useMarketplace = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      stores: seedStores,
      products: seedProducts,
      favorites: ["s1", "s3"],
      myStoreId: null,

      createStore: ({ name, tagline, category, location, whatsapp }) => {
        const id = `s_${Date.now()}`;
        const store: MiniStore = {
          id,
          ownerPhone: "+251 7•• ••• 412",
          isMine: true,
          name: name.trim() || "My Store",
          tagline: tagline.trim() || "Welcome to my store",
          category,
          emoji: categoryEmoji[category],
          banner: banners[Math.floor(Math.random() * banners.length)],
          rating: 0,
          reviews: 0,
          location: location.trim() || "Addis Ababa",
          whatsapp,
          phone: whatsapp,
          createdAt: Date.now(),
        };
        set({ stores: [store, ...get().stores], myStoreId: id });
        return id;
      },
      updateStore: (id, patch) =>
        set({ stores: get().stores.map((s) => (s.id === id ? { ...s, ...patch } : s)) }),
      deleteStore: (id) =>
        set({
          stores: get().stores.filter((s) => s.id !== id),
          products: get().products.filter((p) => p.storeId !== id),
          myStoreId: get().myStoreId === id ? null : get().myStoreId,
        }),

      addProduct: ({ storeId, name, description, price, emoji }) =>
        set({
          products: [
            ...get().products,
            {
              id: `p_${Date.now()}`,
              storeId,
              name: name.trim() || "New product",
              description: description.trim(),
              price: Number.isFinite(price) ? price : 0,
              emoji: emoji || "📦",
              available: true,
              createdAt: Date.now(),
            },
          ],
        }),
      updateProduct: (id, patch) =>
        set({ products: get().products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),
      removeProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),

      toggleFavorite: (storeId) => {
        const f = get().favorites;
        set({ favorites: f.includes(storeId) ? f.filter((s) => s !== storeId) : [...f, storeId] });
      },
    }),
    {
      name: "marketplace-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      ),
    },
  ),
);

export const PRODUCT_EMOJIS = ["📦", "👗", "🧥", "👜", "🎧", "🔌", "📱", "💻", "⌚", "👟", "🍲", "🍰", "🍯", "💄", "🧴", "💍", "✨", "🛠️", "🔧", "📚", "🎮", "🎨"];
