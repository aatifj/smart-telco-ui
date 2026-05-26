import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Share2, Star, MapPin, Phone, MessageCircle, Settings2 } from "lucide-react";
import { useMarketplace } from "@/store/marketplace";

export const Route = createFileRoute("/app/marketplace/store/$storeId")({
  component: StorefrontPage,
});

function StorefrontPage() {
  const { storeId } = Route.useParams();
  const { stores, products, favorites, toggleFavorite, myStoreId } = useMarketplace();

  const store = stores.find((s) => s.id === storeId);
  if (!store) {
    return (
      <div className="animate-fade-in p-5">
        <Link to="/app/marketplace" className="text-sm text-primary">← Back to marketplace</Link>
        <p className="mt-6 text-center text-sm text-muted-foreground">Store not found.</p>
      </div>
    );
  }

  const items = products.filter((p) => p.storeId === store.id);
  const isFav = favorites.includes(store.id);
  const isMine = myStoreId === store.id;
  const waLink = `https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`;
  const telLink = `tel:${store.phone.replace(/[^0-9+]/g, "")}`;

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: store.name, text: store.tagline, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("Store link copied");
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Banner */}
      <div className={`${store.banner} relative h-40`}>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleFavorite(store.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur"
              aria-label="Save"
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Header card */}
      <section className="-mt-10 px-5">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-elevated">
          <div className="flex items-start gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl shadow-soft">
              {store.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-semibold">{store.name}</h1>
                {isMine && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Mine</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{store.tagline}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {store.rating || "New"}
                  {store.reviews > 0 && <span className="font-normal text-muted-foreground">({store.reviews})</span>}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {store.location}
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  {store.category}
                </span>
              </div>
            </div>
          </div>

          {isMine ? (
            <Link
              to="/app/marketplace/manage"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
            >
              <Settings2 className="h-3.5 w-3.5" /> Manage store
            </Link>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <a
                href={telLink}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-2.5 text-xs font-semibold"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Products</h3>
          <span className="text-xs text-muted-foreground">{items.length}</span>
        </div>

        {items.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-card p-6 text-center">
            <p className="text-sm font-semibold">No products yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Check back soon.</p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {items.map((p) => (
              <Link
                key={p.id}
                to="/app/marketplace/product/$productId"
                params={{ productId: p.id }}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className="relative flex h-24 items-center justify-center bg-secondary text-4xl">
                  {p.emoji}
                  {!p.available && (
                    <span className="absolute right-2 top-2 rounded-full bg-foreground/80 px-2 py-0.5 text-[9px] font-semibold uppercase text-background">
                      Sold out
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[12.5px] font-semibold">{p.name}</p>
                  <p className="truncate text-[10.5px] text-muted-foreground">{p.description}</p>
                  <p className="mt-1 text-xs font-bold text-primary">ETB {p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
