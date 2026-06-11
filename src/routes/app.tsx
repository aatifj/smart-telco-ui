import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { useChat } from "@/store/chat";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { pathname } = useLocation();
  const hideFab = pathname.startsWith("/app/chat");
  const threads = useChat((s) => s.threads);
  const unread = Object.values(threads).reduce(
    (n, t) => n + t.messages.filter((m) => m.from === "peer" && m.ts > t.lastReadByMe).length,
    0,
  );

  return (
    <PhoneFrame>
      <div className="relative flex min-h-screen flex-col md:min-h-[calc(100vh-3rem)]">
        <main className="flex-1 overflow-y-auto pb-2">
          <Outlet />
        </main>

        {!hideFab && (
          <Link
            to="/app/chat"
            aria-label="Messages"
            className="absolute bottom-[84px] right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow ring-4 ring-background transition-transform active:scale-95"
            style={{ height: 56, width: 56 }}
          >
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
        )}

        <BottomNav />
      </div>
      <PersonaSwitcher />
    </PhoneFrame>
  );
}
