import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { usePersona, personaMeta } from "@/store/persona";
import safaricomLogo from "@/assets/safaricom-logo.png";

export function AppHeader({ greeting = "Selam" }: { greeting?: string }) {
  const persona = usePersona((s) => s.persona);
  const meta = persona ? personaMeta[persona] : null;
  return (
    <>
      {/* Brand bar */}
      <div className="flex items-center justify-between px-5 pt-3">
        <img
          src={safaricomLogo}
          alt="Safaricom Ethiopia"
          width={140}
          height={28}
          loading="lazy"
          className="h-7 w-auto object-contain"
        />
      </div>

      <header className="flex items-center justify-between px-5 pt-2 pb-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {greeting}
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-foreground">
            {meta ? `${meta.emoji} ${meta.label}` : "Welcome"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/app/search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link
            to="/app/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </Link>
        </div>
      </header>
    </>
  );
}

