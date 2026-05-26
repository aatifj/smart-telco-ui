import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useMarketplace, PRODUCT_EMOJIS } from "@/store/marketplace";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/marketplace/add-product")({
  component: AddProductPage,
});

const MAX_PRODUCTS = 10;

function AddProductPage() {
  const navigate = useNavigate();
  const persona = usePersona((s) => s.persona);
  const { myStoreId, products, addProduct } = useMarketplace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [emoji, setEmoji] = useState(PRODUCT_EMOJIS[0]);

  if (persona !== "safaricom" || !myStoreId) {
    return (
      <div className="animate-fade-in p-5">
        <header className="flex items-center gap-3">
          <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Add product</h1>
        </header>
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="text-sm font-semibold">No store yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Open a mini store first to add products.</p>
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

  const count = products.filter((p) => p.storeId === myStoreId).length;
  const atLimit = count >= MAX_PRODUCTS;
  const priceNum = parseFloat(price);
  const canSubmit = name.trim().length >= 2 && Number.isFinite(priceNum) && priceNum > 0 && !atLimit;

  return (
    <div className="animate-fade-in pb-10">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/marketplace/manage" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Add product</h1>
          <p className="text-xs text-muted-foreground">{count} of {MAX_PRODUCTS} used</p>
        </div>
      </header>

      {atLimit && (
        <div className="mx-5 mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
          You've reached the {MAX_PRODUCTS}-product limit. Remove a product to add another.
        </div>
      )}

      <section className="mt-5 px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
            {emoji}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{name || "Product name"}</p>
            <p className="text-[11px] text-muted-foreground">{description || "Short description"}</p>
            <p className="mt-1 text-xs font-bold text-primary">
              ETB {priceNum > 0 ? priceNum.toLocaleString() : "0"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-4 px-5">
        <Field label="Product name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Netela Shawl"
            maxLength={40}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is it?"
            maxLength={120}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Price (ETB)">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0"
            inputMode="decimal"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Pick an icon">
          <div className="grid grid-cols-8 gap-1.5">
            {PRODUCT_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`flex h-9 items-center justify-center rounded-lg border text-lg ${
                  emoji === e ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>

        <button
          disabled={!canSubmit}
          onClick={() => {
            addProduct({ storeId: myStoreId, name, description, price: priceNum, emoji });
            navigate({ to: "/app/marketplace/manage" });
          }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <Check className="h-4 w-4" /> Save product
        </button>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
