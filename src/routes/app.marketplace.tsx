import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Heart, Plus, MapPin, Sparkles, TrendingUp, Store as StoreIcon, Star, Settings2 } from "lucide-react";
import { useMarketplace, STORE_CATEGORIES, type StoreCategory } from "@/store/marketplace";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/marketplace")({
  component: MarketplaceHome,
});

function MarketplaceHome() {
  const persona = usePersona((s) => s.persona);
  const { stores, favorites, myStoreId } = useMarketplace();
  const [cat, setCat] = useState<StoreCategory | "All">("All");
  const [q, setQ] = useState("");

  const isOwner = persona === "safaricom";

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return stores.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (!ql) return true;
      return (
        s.name.toLowerCase().includes(ql) ||
        s.tagline.toLowerCase().includes(ql) ||
        s.category.toLowerCase().includes(ql)
      );
    });
  }, [stores, cat, q]);

  const featured = stores.filter((s) => s.featured);
  const trending = stores.filter((s) => s.trending);

  return (
    <div className="animate-fade-in pb-8">
      <header className="px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Marketplace</h1>
            <p className="text-xs text-muted-foreground">Discover local mini stores</p>
          </div>
          <Link
            to="/app/marketplace/favorites"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
            aria-label="Saved stores"
          >
            <Heart className="h-4 w-4" />
          </Link>
        </div>

        <Link
          to="/app/marketplace/search"
          className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onClick={(e) => e.preventDefault()}
            placeholder="Search stores, products…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </Link>
      </header>

      {/* Owner CTA */}
      <section className="mt-5 px-5">
        {isOwner ? (
          myStoreId ? (
            <Link
              to="/app/marketplace/manage"
              className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-soft"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                <Settings2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Manage my store</p>
                <p className="text-xs text-muted-foreground">Add products, edit storefront</p>
              </div>
            </Link>
          ) : (
            <Link
              to="/app/marketplace/create"
              className="flex items-center gap-3 rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <StoreIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Open your mini store</p>
                <p className="text-xs text-white/80">Free for Safaricom customers</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary">Create</span>
            </Link>
          )
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Join Safaricom to sell</p>
              <p className="text-xs text-muted-foreground">Switch to a Safaricom number to open a store.</p>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {(["All", ...STORE_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as StoreCategory | "All")}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured carousel */}
      {cat === "All" && !q && (
        <section className="mt-6">
          <div className="flex items-center justify-between px-5">
            <h3 className="text-sm font-semibold">Featured stores</h3>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
            {featured.map((s) => (
              <Link
                key={s.id}
                to="/app/marketplace/store/$storeId"
                params={{ storeId: s.id }}
                className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className={`${s.banner} flex h-24 items-end p-3 text-3xl`}>
                  <span className="drop-shadow">{s.emoji}</span>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{s.tagline}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="font-semibold text-foreground">{s.rating || "New"}</span>
                    {s.reviews > 0 && <span>· {s.reviews}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {cat === "All" && !q && (
        <section className="mt-5 px-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Trending now</h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 space-y-2">
            {trending.map((s) => (
              <StoreRow key={s.id} store={s} isFav={favorites.includes(s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* All / filtered list */}
      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">
          {cat === "All" ? "All stores" : `${cat} stores`}
          <span className="ml-2 text-xs font-normal text-muted-foreground">({filtered.length})</span>
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to="/app/marketplace/store/$storeId"
              params={{ storeId: s.id }}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className={`${s.banner} flex h-20 items-end justify-between p-2 text-2xl`}>
                <span>{s.emoji}</span>
                {favorites.includes(s.id) && (
                  <Heart className="h-4 w-4 fill-white text-white drop-shadow" />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-[13px] font-semibold">{s.name}</p>
                <p className="truncate text-[10.5px] text-muted-foreground">{s.category}</p>
                <div className="mt-1.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{s.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">No stores match your filters.</p>
        )}
      </section>

      {isOwner && myStoreId && (
        <Link
          to="/app/marketplace/add-product"
          className="fixed bottom-28 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow md:bottom-16"
        >
          <Plus className="h-4 w-4" /> Add product
        </Link>
      )}
    </div>
  );
}

function StoreRow({ store, isFav }: { store: ReturnType<typeof useMarketplace.getState>["stores"][number]; isFav: boolean }) {
  return (
    <Link
      to="/app/marketplace/store/$storeId"
      params={{ storeId: store.id }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
    >
      <div className={`${store.banner} flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-primary-foreground`}>
        {store.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold">{store.name}</p>
          {isFav && <Heart className="h-3 w-3 shrink-0 fill-destructive text-destructive" />}
        </div>
        <p className="truncate text-[11px] text-muted-foreground">{store.tagline}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {store.rating || "New"}
        </div>
        <p className="text-[10px] text-muted-foreground">{store.category}</p>
      </div>
    </Link>
  );
}
