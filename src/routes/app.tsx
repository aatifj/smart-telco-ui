import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { usePersona } from "@/store/persona";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isAuthed = usePersona.getState().isAuthed;
      if (!isAuthed) throw redirect({ to: "/" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col md:min-h-[calc(100vh-3rem)]">
        <main className="flex-1 overflow-y-auto pb-2">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <PersonaSwitcher />
    </PhoneFrame>
  );
}
