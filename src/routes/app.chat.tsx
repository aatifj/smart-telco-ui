import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageSquarePlus, Search } from "lucide-react";
import { useState } from "react";
import { useChat, formatChatTime } from "@/store/chat";

export const Route = createFileRoute("/app/chat")({
  component: ChatListPage,
});

function ChatListPage() {
  const navigate = useNavigate();
  const { peers, threads } = useChat();
  const [q, setQ] = useState("");

  const items = peers
    .map((p) => {
      const t = threads[p.id];
      const last = t?.messages[t.messages.length - 1];
      const unread = t ? t.messages.filter((m) => m.from === "peer" && m.ts > t.lastReadByMe).length : 0;
      return { peer: p, last, unread, lastTs: last?.ts ?? 0 };
    })
    .filter((i) => i.peer.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.lastTs - a.lastTs);

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center gap-3 px-5 pt-5">
        <button
          onClick={() => navigate({ to: "/app" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Messages</h1>
          <p className="text-xs text-muted-foreground">Chat with other Safaricom users</p>
        </div>
        <Link
          to="/app/chat/new"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
          aria-label="New chat"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Link>
      </header>

      <div className="mt-4 px-5">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search contacts"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <ul className="mt-3 divide-y divide-border px-2">
        {items.map(({ peer, last, unread }) => (
          <li key={peer.id}>
            <Link
              to="/app/chat/$peerId"
              params={{ peerId: peer.id }}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-secondary/40"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-2xl">
                {peer.avatar}
                {peer.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{peer.name}</p>
                  {last && (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatChatTime(last.ts)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-muted-foreground">
                    {last
                      ? `${last.from === "me" ? "You: " : ""}${last.text}`
                      : "Tap to start a conversation"}
                  </p>
                  {unread > 0 && (
                    <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
