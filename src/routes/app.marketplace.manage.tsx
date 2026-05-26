import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2, Eye, Store as StoreIcon, ToggleLeft, ToggleRight } from "lucide-react";
import { useMarketplace } from "@/store/marketplace";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/marketplace/manage")({
  component: ManageStorePage,
});

const MAX_PRODUCTS = 10;

function ManageStorePage() {
  const navigate = useNavigate();
  const persona = usePersona((s) => s.persona);
  const { stores, products, myStoreId, removeProduct, updateProduct, deleteStore } = useMarketplace();

  if (persona !== "safaricom") {
    return <NotAllowed />;
  }

  const store = stores.find((s) => s.id === myStoreId);
  if (!store) {
    return (
      <div className="animate-fade-in p-5">
        <header className="flex items-center gap-3">
          <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">My store</h1>
        </header>
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
          <StoreIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold">You haven't opened a store yet</p>
          <Link
            to="/app/marketplace/create"
            className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Create store
          </Link>
        </div>
      </div>
    );
  }

  const myProducts = products.filter((p) => p.storeId === store.id);
  const atLimit = myProducts.length >= MAX_PRODUCTS;

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-3">
          <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Manage store</h1>
        </div>
        <Link
          to="/app/marketplace/store/$storeId"
          params={{ storeId: store.id }}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </Link>
      </header>

      <section className="mt-4 px-5">
        <div className={`${store.banner} flex items-center gap-3 rounded-3xl p-4 text-primary-foreground shadow-elevated`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
            {store.emoji}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{store.name}</p>
            <p className="text-[11px] text-white/80">{store.tagline}</p>
            <p className="mt-1 text-[10px] text-white/70">{store.category} · {store.location}</p>
          </div>
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Products</h3>
            <p className="text-[11px] text-muted-foreground">{myProducts.length} of {MAX_PRODUCTS}</p>
          </div>
          <Link
            to="/app/marketplace/add-product"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              atLimit ? "bg-muted text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground shadow-glow"
            }`}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {myProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
              <p className="text-sm font-semibold">No products yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Add up to {MAX_PRODUCTS} products to your store.</p>
            </div>
          )}
          {myProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                {p.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  {!p.available && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase text-muted-foreground">Sold out</span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-primary">ETB {p.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => updateProduct(p.id, { available: !p.available })}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground"
                aria-label="Toggle availability"
              >
                {p.available ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5" />}
              </button>
              <button
                onClick={() => removeProduct(p.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (confirm("Close your mini store? This removes all your products.")) {
              deleteStore(store.id);
              navigate({ to: "/app/marketplace" });
            }
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3 text-xs font-semibold text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Close my store
        </button>
      </section>
    </div>
  );
}

function NotAllowed() {
  return (
    <div className="animate-fade-in p-5">
      <header className="flex items-center gap-3">
        <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">My store</h1>
      </header>
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
        <p className="text-sm font-semibold">Safaricom customers only</p>
        <p className="mt-1 text-xs text-muted-foreground">Switch to a Safaricom persona to manage a store.</p>
      </div>
    </div>
  );
}
