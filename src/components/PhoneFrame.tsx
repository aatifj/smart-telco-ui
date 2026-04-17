import { ReactNode } from "react";

/**
 * Mobile-first frame. On small screens it fills the viewport.
 * On larger screens it renders as a centered phone-style canvas
 * for desktop preview of the mobile UI.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[oklch(0.96_0.01_150)] md:bg-[oklch(0.94_0.012_150)]">
      <div className="mx-auto min-h-screen w-full max-w-[440px] bg-background md:my-6 md:min-h-[calc(100vh-3rem)] md:rounded-[2.25rem] md:shadow-elevated md:overflow-hidden md:border md:border-border">
        {children}
      </div>
    </div>
  );
}
