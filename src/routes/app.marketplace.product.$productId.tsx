import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Phone, Heart, Star } from "lucide-react";
import { useMarketplace } from "@/store/marketplace";

export const Route = createFileRoute("/app/marketplace/product/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { products, stores, favorites, toggleFavorite } = useMarketplace();

  const product = products.find((p) => p.id === productId);
  const store = product ? stores.find((s) => s.id === product.storeId) : undefined;

  if (!product || !store) {
    return (
      <div className="animate-fade-in p-5">
        <Link to="/app/marketplace" className="text-sm text-primary">← Back to marketplace</Link>
        <p className="mt-6 text-center text-sm text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const isFav = favorites.includes(store.id);
  const waLink = `https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (ETB ${product.price.toLocaleString()}) from your store on Safaricom Marketplace.`,
  )}`;
  const telLink = `tel:${store.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="animate-fade-in pb-32">
      <div className={`${store.banner} relative`}>
        <div className="flex items-center justify-between p-4">
          <Link
            to="/app/marketplace/store/$storeId"
            params={{ storeId: store.id }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            onClick={() => toggleFavorite(store.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-white" : ""}`} />
          </button>
        </div>
        <div className="flex h-48 items-center justify-center text-8xl">{product.emoji}</div>
      </div>

      <section className="px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {store.category}
            </p>
            <h1 className="mt-1 text-lg font-semibold">{product.name}</h1>
          </div>
          {!product.available && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
              Sold out
            </span>
          )}
        </div>
        <p className="mt-2 text-2xl font-bold text-primary">ETB {product.price.toLocaleString()}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {product.description || "No description provided."}
        </p>
      </section>

      {/* Seller card */}
      <section className="mt-5 px-5">
        <Link
          to="/app/marketplace/store/$storeId"
          params={{ storeId: store.id }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
        >
          <div className={`${store.banner} flex h-12 w-12 items-center justify-center rounded-2xl text-xl`}>
            {store.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{store.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{store.tagline}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {store.rating || "New"}
          </div>
        </Link>
      </section>

      {/* Sticky contact bar */}
      <div className="fixed bottom-20 left-1/2 z-40 w-full max-w-[420px] -translate-x-1/2 px-5 md:bottom-8">
        <div className="grid grid-cols-2 gap-2 rounded-3xl border border-border bg-card/95 p-2 shadow-elevated backdrop-blur">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold ${
              product.available ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground pointer-events-none"
            }`}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={telLink}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3 text-sm font-semibold"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </div>
    </div>
  );
}
