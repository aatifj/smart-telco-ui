import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Mail, ChevronRight, Search } from "lucide-react";

export const Route = createFileRoute("/app/support")({
  component: SupportPage,
});

const faqs = [
  "How do I activate a bundle?",
  "How do I check my balance?",
  "What is M-PESA and how do I use it?",
  "How do I activate roaming?",
  "How do I order an eSIM?",
];

function SupportPage() {
  return (
    <div className="animate-fade-in pb-6">
      <header className="px-5 pt-5">
        <h1 className="text-lg font-semibold">Support</h1>
        <p className="text-xs text-muted-foreground">We're here to help, 24/7</p>
      </header>

      <section className="mt-5 px-5">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search help articles…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { i: MessageCircle, l: "Chat", c: "bg-primary/10 text-primary" },
            { i: Phone, l: "Call 700", c: "bg-info/10 text-info" },
            { i: Mail, l: "Email", c: "bg-warning/20 text-warning-foreground" },
          ].map((x) => (
            <button key={x.l} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-4 shadow-soft">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${x.c}`}>
                <x.i className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold">{x.l}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold">Popular questions</h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {faqs.map((q, i) => (
            <button key={q} className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${i < faqs.length - 1 ? "border-b border-border" : ""}`}>
              <p className="flex-1 text-sm">{q}</p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
