import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MapPin, Star } from "lucide-react";
import { useMarketplace } from "@/store/marketplace";

export const Route = createFileRoute("/app/marketplace/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { stores, favorites, toggleFavorite } = useMarketplace();
  const saved = stores.filter((s) => favorites.includes(s.id));

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Saved stores</h1>
          <p className="text-xs text-muted-foreground">{saved.length} favorite{saved.length === 1 ? "" : "s"}</p>
        </div>
      </header>

      <section className="mt-5 space-y-3 px-5">
        {saved.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">No favorites yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Tap the heart on any store to save it.</p>
            <Link
              to="/app/marketplace"
              className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Browse marketplace
            </Link>
          </div>
        ) : (
          saved.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <Link to="/app/marketplace/store/$storeId" params={{ storeId: s.id }}>
                <div className={`${s.banner} h-20`} />
              </Link>
              <div className="flex items-start gap-3 p-3">
                <div className="-mt-8 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-card text-2xl shadow-soft">
                  {s.emoji}
                </div>
                <Link
                  to="/app/marketplace/store/$storeId"
                  params={{ storeId: s.id }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{s.tagline}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" /> {s.rating || "New"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.location}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFavorite(s.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
