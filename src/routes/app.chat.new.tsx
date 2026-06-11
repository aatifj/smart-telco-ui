import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Phone, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useChat } from "@/store/chat";

export const Route = createFileRoute("/app/chat/new")({
  component: NewChatPage,
});

function NewChatPage() {
  const navigate = useNavigate();
  const { peers, ensureThread } = useChat();
  const addPeer = useChat((s) => s.addPeer);
  const [raw, setRaw] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Strip everything but digits, keep up to 10 chars after normalization.
  const digits = useMemo(() => raw.replace(/\D/g, "").slice(-10), [raw]);
  const isValid = /^07\d{8}$/.test(digits);
  const formatted = digits
    ? digits.replace(/^(\d{0,4})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" "),
      )
    : "";

  const existing = peers.find((p) => p.phone.replace(/\D/g, "").slice(-10) === digits);

  const handleStart = () => {
    if (!isValid) {
      setError("Enter a valid Safaricom number (07XXXXXXXX).");
      return;
    }
    let peerId = existing?.id;
    if (!peerId) {
      const trimmedName = name.trim().slice(0, 60) || `+251 ${formatted}`;
      peerId = addPeer({
        name: trimmedName,
        phone: `+251 ${formatted}`,
      });
    }
    ensureThread(peerId);
    navigate({ to: "/app/chat/$peerId", params: { peerId } });
  };

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center gap-3 px-5 pt-5">
        <button
          onClick={() => navigate({ to: "/app/chat" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">New chat</h1>
          <p className="text-xs text-muted-foreground">Start a chat with a Safaricom number</p>
        </div>
      </header>

      <section className="mt-5 px-5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Phone number
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 shadow-soft focus-within:border-primary">
          <span className="flex items-center gap-1.5 rounded-xl bg-secondary px-2 py-1.5 text-xs font-semibold">
            <Phone className="h-3.5 w-3.5 text-primary" /> +251
          </span>
          <input
            inputMode="numeric"
            autoFocus
            value={formatted}
            onChange={(e) => {
              setRaw(e.target.value);
              setError(null);
            }}
            placeholder="07•• ••• •••"
            maxLength={13}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {raw && (
            <button
              onClick={() => setRaw("")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Safaricom Ethiopia numbers start with 07 and are 10 digits long.
        </p>
        {error && <p className="mt-1.5 text-[11px] font-medium text-destructive">{error}</p>}

        <label className="mt-5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Name (optional)
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Hanna T."
          maxLength={60}
          className="mt-2 w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm shadow-soft outline-none focus:border-primary"
        />

        {existing && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-info/30 bg-info/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xl">
              {existing.avatar}
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold">{existing.name} is already in your contacts</p>
              <p className="text-muted-foreground">Tap Start to continue your conversation.</p>
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!isValid}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <UserPlus className="h-4 w-4" />
          {existing ? `Open chat with ${existing.name}` : "Start chat"}
        </button>
      </section>

      <section className="mt-7 px-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Or pick a contact
        </p>
        <ul className="mt-2 divide-y divide-border rounded-2xl border border-border bg-card">
          {peers.slice(0, 5).map((p) => (
            <li key={p.id}>
              <Link
                to="/app/chat/$peerId"
                params={{ peerId: p.id }}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-lg">
                  {p.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{p.phone}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
