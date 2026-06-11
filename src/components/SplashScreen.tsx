import { useEffect, useState } from "react";
import safaricomLogo from "@/assets/safaricom-logo.png";

export function SplashScreen({ duration = 1800 }: { duration?: number }) {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), duration);
    const t2 = setTimeout(() => setPhase("done"), duration + 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-hero transition-all duration-500 ease-out ${
        phase === "out" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ambient glows */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center gap-6 animate-pop">
        <div className="rounded-3xl bg-white/10 px-8 py-6 backdrop-blur-md ring-1 ring-white/20 shadow-glow">
          <img
            src={safaricomLogo}
            alt="Safaricom Ethiopia"
            width={320}
            height={80}
            className="h-20 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
          The better option
        </p>
      </div>
    </div>
  );
}
