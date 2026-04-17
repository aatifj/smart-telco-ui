import { Link, useLocation } from "@tanstack/react-router";
import { Home, Package, Sparkles, LifeBuoy, User } from "lucide-react";

const items: Array<{ to: string; label: string; icon: typeof Home; exact?: boolean }> = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/bundles", label: "Bundles", icon: Package },
  { to: "/app/services", label: "Services", icon: Sparkles },
  { to: "/app/support", label: "Support", icon: LifeBuoy },
  { to: "/app/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 z-30 mt-auto safe-bottom border-t border-border bg-card/95 backdrop-blur-xl">
      <ul className="grid grid-cols-5 px-1 pb-1 pt-2">
        {items.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to as string}
                className="group flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-colors"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-all ${
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                </span>
                <span
                  className={`text-[10.5px] font-medium tracking-wide transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
