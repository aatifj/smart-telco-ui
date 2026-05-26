import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, MapPin, Star } from "lucide-react";
import { useMarketplace, STORE_CATEGORIES, type StoreCategory } from "@/store/marketplace";

export const Route = createFileRoute("/app/marketplace/search")({
  component: SearchPage,
});

function SearchPage() {
  const { stores, products } = useMarketplace();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<StoreCategory | "All">("All");

  const ql = q.trim().toLowerCase();

  const storeMatches = useMemo(
    () =>
      stores.filter((s) => {
        if (cat !== "All" && s.category !== cat) return false;
        if (!ql) return cat !== "All";
        return s.name.toLowerCase().includes(ql) || s.tagline.toLowerCase().includes(ql);
      }),
    [stores, ql, cat],
  );

  const productMatches = useMemo(() => {
    if (!ql) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(ql) || p.description.toLowerCase().includes(ql))
      .slice(0, 12);
  }, [products, ql]);

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stores or products"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {(["All", ...STORE_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as StoreCategory | "All")}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="mt-5 px-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Stores ({storeMatches.length})
        </h3>
        <div className="mt-3 space-y-2">
          {storeMatches.map((s) => (
            <Link
              key={s.id}
              to="/app/marketplace/store/$storeId"
              params={{ storeId: s.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
            >
              <div className={`${s.banner} flex h-12 w-12 items-center justify-center rounded-2xl text-xl`}>
                {s.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{s.tagline}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {s.location}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {s.rating || "New"}
              </div>
            </Link>
          ))}
          {storeMatches.length === 0 && (
            <p className="text-xs text-muted-foreground">No stores found.</p>
          )}
        </div>
      </section>

      {productMatches.length > 0 && (
        <section className="mt-6 px-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Products ({productMatches.length})
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {productMatches.map((p) => (
              <Link
                key={p.id}
                to="/app/marketplace/product/$productId"
                params={{ productId: p.id }}
                className="rounded-2xl border border-border bg-card p-3 shadow-soft"
              >
                <div className="flex h-16 w-full items-center justify-center rounded-xl bg-secondary text-3xl">
                  {p.emoji}
                </div>
                <p className="mt-2 truncate text-[12.5px] font-semibold">{p.name}</p>
                <p className="text-[11px] font-bold text-primary">ETB {p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
