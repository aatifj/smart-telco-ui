import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Store as StoreIcon, Check } from "lucide-react";
import { useMarketplace, STORE_CATEGORIES, categoryEmoji, type StoreCategory } from "@/store/marketplace";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app/marketplace/create")({
  component: CreateStorePage,
});

function CreateStorePage() {
  const navigate = useNavigate();
  const persona = usePersona((s) => s.persona);
  const { createStore, myStoreId } = useMarketplace();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<StoreCategory>("Fashion");
  const [location, setLocation] = useState("Addis Ababa");
  const [whatsapp, setWhatsapp] = useState("+2517");

  if (persona !== "safaricom") {
    return (
      <div className="animate-fade-in p-5">
        <header className="flex items-center gap-3">
          <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Create store</h1>
        </header>
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <StoreIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-semibold">Safaricom customers only</p>
          <p className="mt-1 text-xs text-muted-foreground">Mini Stores are open to Persona 1 (Safaricom Existing Users). Switch persona to continue.</p>
        </div>
      </div>
    );
  }

  if (myStoreId) {
    return (
      <div className="animate-fade-in p-5">
        <header className="flex items-center gap-3">
          <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Create store</h1>
        </header>
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="text-sm font-semibold">You already have a store</p>
          <p className="mt-1 text-xs text-muted-foreground">You can manage it or add more products.</p>
          <Link
            to="/app/marketplace/manage"
            className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Manage my store
          </Link>
        </div>
      </div>
    );
  }

  const canSubmit = name.trim().length >= 2 && whatsapp.trim().length >= 8;

  return (
    <div className="animate-fade-in pb-10">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/marketplace" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Open your store</h1>
          <p className="text-xs text-muted-foreground">Takes less than a minute</p>
        </div>
      </header>

      <section className="mt-5 px-5">
        <div className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
              {categoryEmoji[category]}
            </div>
            <div>
              <p className="text-sm font-semibold">{name || "Your store name"}</p>
              <p className="text-xs text-white/80">{tagline || "Short tagline customers will see"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-4 px-5">
        <Field label="Store name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sara's Boutique"
            maxLength={40}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Tagline">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Short description"
            maxLength={60}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Category">
          <div className="grid grid-cols-4 gap-2">
            {STORE_CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-[10.5px] font-semibold transition-all ${
                    active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <span className="text-lg">{categoryEmoji[c]}</span>
                  <span className="text-center leading-tight">{c}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Location">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / area"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="WhatsApp / Contact number">
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+2517..."
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Customers will reach you here.</p>
        </Field>

        <button
          disabled={!canSubmit}
          onClick={() => {
            const id = createStore({ name, tagline, category, location, whatsapp });
            navigate({ to: "/app/marketplace/store/$storeId", params: { storeId: id } });
          }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <Check className="h-4 w-4" /> Create store
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
