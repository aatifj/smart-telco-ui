import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Phone, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat, formatChatTime } from "@/store/chat";

export const Route = createFileRoute("/app/chat/$peerId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { peerId } = Route.useParams();
  const navigate = useNavigate();
  const { peers, threads, sendMessage, ensureThread, markRead } = useChat();
  const peer = peers.find((p) => p.id === peerId);
  const [text, setText] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureThread(peerId);
    markRead(peerId);
  }, [peerId, ensureThread, markRead]);

  const thread = threads[peerId];

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [thread?.messages.length]);

  if (!peer) {
    return (
      <div className="p-6">
        <p className="text-sm">Contact not found.</p>
        <button onClick={() => navigate({ to: "/app/chat" })} className="mt-3 text-sm text-primary">
          Back to messages
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(peerId, text);
    setText("");
  };

  return (
    <div className="flex h-[100dvh] animate-fade-in flex-col">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button
          onClick={() => navigate({ to: "/app/chat" })}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xl">
          {peer.avatar}
          {peer.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{peer.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {peer.online ? "Online" : "Offline"} · {peer.phone}
          </p>
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-label="Call"
        >
          <Phone className="h-4 w-4" />
        </button>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-secondary/30 px-4 py-4">
        <div className="mx-auto max-w-md space-y-2">
          {thread?.messages.map((m, i) => {
            const prev = thread.messages[i - 1];
            const showTime = !prev || m.ts - prev.ts > 5 * 60 * 1000;
            const mine = m.from === "me";
            return (
              <div key={m.id}>
                {showTime && (
                  <p className="my-2 text-center text-[10px] text-muted-foreground">
                    {formatChatTime(m.ts)}
                  </p>
                )}
                <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-soft ${
                      mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-card text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
          {(!thread || thread.messages.length === 0) && (
            <p className="mt-10 text-center text-xs text-muted-foreground">
              Say hello to {peer.name} 👋
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card px-3 py-2.5 pb-[max(env(safe-area-inset-bottom),0.625rem)]">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Message"
            className="max-h-32 flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
