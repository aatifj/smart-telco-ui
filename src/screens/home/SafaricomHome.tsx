import { Link } from "@tanstack/react-router";
import {
  Wifi, Phone, MessageSquare, Send, Wallet, ChevronRight, Plus, Sparkles, Lock, Users, Settings2, AlertTriangle, RefreshCw, ShieldCheck, ArrowRightLeft, QrCode, Banknote,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LifecycleBanner } from "@/components/LifecycleBanner";
import { PlayWinCard } from "@/components/PlayWinCard";
import { useLifecycleGuard } from "@/store/persona";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect, useCallback } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const quickActions = [
  { icon: Wifi, label: "Buy Data", color: "bg-primary/10 text-primary", to: "/app/bundles", restrict: true },
  { icon: Phone, label: "Buy Voice", color: "bg-info/10 text-info", to: "/app/bundles", restrict: true },
  { icon: MessageSquare, label: "Buy SMS", color: "bg-warning/15 text-warning-foreground", to: "/app/bundles", restrict: true },
  { icon: Send, label: "Send Airtime", color: "bg-accent text-accent-foreground", to: "/app/services", restrict: false },
  { icon: Wallet, label: "M-PESA", color: "bg-primary/10 text-primary", to: "/app/services", restrict: false },
];

const categories = ["Daily", "Weekly", "Monthly", "Unlimited", "Mega"];

const featured = [
  { name: "Daily Saver", data: "1.5 GB", price: "ETB 49", tag: "Popular" },
  { name: "Weekly Pro", data: "8 GB + 30 min", price: "ETB 299", tag: "Best value" },
  { name: "Mega Stream", data: "50 GB", price: "ETB 1,499", tag: "New" },
];

export function SafaricomHome() {
  const { isRestricted, isSuspended, isDeactivated } = useLifecycleGuard();
  const blockPurchase = isRestricted;

  return (
    <div className="animate-fade-in">
      <AppHeader greeting={isDeactivated ? "Line deactivated" : isSuspended ? "Line suspended" : "Selam, Abel"} />

      <LifecycleBanner />

      {/* Balance carousel */}
      <section className="px-5">
        <Carousel
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {/* Main balance slide */}
            <CarouselItem className="pl-4 basis-full">
              <div className={`relative overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-glow ${
                isDeactivated ? "bg-gradient-to-br from-destructive to-destructive/70" :
                isSuspended ? "bg-gradient-to-br from-warning-foreground/90 to-warning-foreground/70" :
                "bg-gradient-primary"
              }`}>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/75">Main balance</p>
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                      Prepaid
                    </span>
                  </div>
                  <p className="mt-2 text-3xl font-semibold">ETB 248.50</p>
                  <p className="text-xs text-white/70">+251 7•• ••• 412</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                    {[
                      { l: "Data", v: "12.4 GB", sub: "of 20 GB" },
                      { l: "Voice", v: "84 min", sub: "remaining" },
                      { l: "SMS", v: "120", sub: "remaining" },
                    ].map((b) => (
                      <div key={b.l}>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/65">{b.l}</p>
                        <p className="mt-1 text-base font-semibold">{b.v}</p>
                        <p className="text-[10px] text-white/65">{b.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link to="/app/bundles" className="rounded-xl bg-white px-3 py-2.5 text-center text-xs font-semibold text-primary">
                      Top up
                    </Link>
                    <Link to="/app/diy" className="rounded-xl bg-white/15 px-3 py-2.5 text-center text-xs font-semibold text-white backdrop-blur">
                      Build combo
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* M-PESA balance slide */}
            <CarouselItem className="pl-4 basis-full">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-success to-success/80 p-5 text-success-foreground shadow-glow">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/75">M-PESA Wallet</p>
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <p className="mt-2 text-3xl font-semibold">ETB 1,250.00</p>
                  <p className="text-xs text-white/70">Available for transfers & payments</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                    {[
                      { l: "Sent today", v: "ETB 300", sub: "3 transactions" },
                      { l: "Received", v: "ETB 500", sub: "2 transactions" },
                      { l: "Cash out", v: "ETB 0", sub: "Agent visits" },
                    ].map((b) => (
                      <div key={b.l}>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/65">{b.l}</p>
                        <p className="mt-1 text-base font-semibold">{b.v}</p>
                        <p className="text-[10px] text-white/65">{b.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Link to="/app/services" className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white px-2 py-2.5 text-center text-[10px] font-semibold text-success">
                      <ArrowRightLeft className="h-4 w-4" />
                      Send
                    </Link>
                    <Link to="/app/services" className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/15 px-2 py-2.5 text-center text-[10px] font-semibold text-white backdrop-blur">
                      <QrCode className="h-4 w-4" />
                      Pay
                    </Link>
                    <Link to="/app/services" className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/15 px-2 py-2.5 text-center text-[10px] font-semibold text-white backdrop-blur">
                      <Banknote className="h-4 w-4" />
                      Withdraw
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>

      {/* Quick actions */}
      <section className="mt-6 px-5">
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((a) => {
            const locked = blockPurchase && a.restrict;
            const content = (
              <>
                <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${a.color} ${locked ? "opacity-45" : ""}`}>
                  <a.icon className="h-5 w-5" />
                  {locked && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-background">
                      <Lock className="h-2.5 w-2.5" />
                    </span>
                  )}
                </span>
                <span className={`text-center text-[10.5px] font-medium leading-tight ${locked ? "text-muted-foreground" : "text-foreground"}`}>
                  {a.label}
                </span>
              </>
            );
            return locked ? (
              <button
                key={a.label}
                disabled
                className="flex flex-col items-center gap-1.5"
                aria-label={`${a.label} — locked, top up to unlock`}
              >
                {content}
              </button>
            ) : (
              <Link key={a.label} to={a.to} className="flex flex-col items-center gap-1.5">
                {content}
              </Link>
            );
          })}
        </div>
        {blockPurchase && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            {isDeactivated ? "Visit a Safaricom shop to reactivate." : "Top up to unlock purchases."}
          </p>
        )}
      </section>

      {/* Bundle categories */}
      <section className="mt-7">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-base font-semibold">Data bundles</h2>
          {!blockPurchase && (
            <Link to="/app/bundles" className="flex items-center gap-0.5 text-xs font-semibold text-primary">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5">
          {categories.map((c, i) => (
            <button
              key={c}
              disabled={blockPurchase}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium disabled:opacity-50 ${
                i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
          {featured.map((b) => (
            <div key={b.name} className={`relative min-w-[170px] rounded-2xl border border-border bg-gradient-card p-4 shadow-soft ${blockPurchase ? "opacity-60" : ""}`}>
              <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{b.tag}</span>
              <p className="mt-3 text-sm font-semibold">{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.data}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-base font-bold text-foreground">{b.price}</p>
                <button
                  disabled={blockPurchase}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
                >
                  {blockPurchase ? <Lock className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family & Friends */}
      <section className="mt-6 px-5">
        {isDeactivated ? (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4 opacity-70">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Family & Friends</p>
              <p className="text-xs text-muted-foreground">Reactivate your SIM to manage your family.</p>
            </div>
          </div>
        ) : (
          <Link
            to="/app/family"
            className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-info/10 via-card to-card p-4 shadow-soft"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-info/15 text-info">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Manage Your Family</p>
              <p className="text-xs text-muted-foreground">Share bundles, track usage, stay connected.</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-info/10 px-2.5 py-1 text-[10px] font-semibold text-info">
              4 members <ChevronRight className="h-3 w-3" />
            </span>
          </Link>
        )}
      </section>

      {/* Internet settings (APN) — quick utility */}
      <section className="mt-6 px-5">
        {isDeactivated ? (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4 opacity-70">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Fix internet settings</p>
              <p className="text-xs text-muted-foreground">Reactivate your SIM to configure internet.</p>
            </div>
          </div>
        ) : (
          <Link
            to="/app/apn"
            className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-4 shadow-soft"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Settings2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Fix internet settings</p>
              <p className="text-xs text-muted-foreground">
                Automatically configure your device for the best experience.
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
              Configure <ChevronRight className="h-3 w-3" />
            </span>
          </Link>
        )}
      </section>

      {/* Report a problem */}
      <section className="mt-6 px-5">
        <Link
          to="/app/report"
          className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-warning/10 via-card to-card p-4 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/20 text-warning-foreground">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Having network issues?</p>
            <p className="text-xs text-muted-foreground">Report voice, data, or SMS problems.</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-[10px] font-semibold text-warning-foreground">
            Report <ChevronRight className="h-3 w-3" />
          </span>
        </Link>
      </section>

      {/* My Bundles / Renewal */}
      <section className="mt-6 px-5">
        <Link
          to="/app/my-bundles"
          className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">My bundles · Weekly Pro</p>
            <p className="text-xs text-muted-foreground">Renews in 3d · Auto-renew on</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            Renew <ChevronRight className="h-3 w-3" />
          </span>
        </Link>
      </section>

      {/* Fayda ID re-registration banner */}
      <section className="mt-6 px-5">
        <Link
          to="/app/fayda"
          className="flex items-center gap-3 rounded-2xl border border-success/30 bg-gradient-to-br from-success/10 via-card to-card p-4 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/15 text-success">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Update your profile with Fayda ID</p>
            <p className="text-xs text-muted-foreground">Complete re-registration to keep your account active.</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success">
            Start <ChevronRight className="h-3 w-3" />
          </span>
        </Link>
      </section>

      {/* Play & Win */}
      <div className="mt-6">
        <PlayWinCard />
      </div>

      {/* DIY teaser */}
      <section className="mt-6 px-5">
        {blockPurchase ? (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4 opacity-70">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Build your own combo</p>
              <p className="text-xs text-muted-foreground">
                {isDeactivated ? "Reactivate your SIM to use the DIY builder." : "Top up to unlock the DIY builder."}
              </p>
            </div>
          </div>
        ) : (
          <Link
            to="/app/diy"
            className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-transparent p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Build your own combo</p>
              <p className="text-xs text-muted-foreground">Mix data, voice & SMS — pay only for what you need.</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </section>

      {/* Recommendations */}
      <section className="mt-6 px-5 pb-6">
        <h3 className="text-sm font-semibold">Recommended for you</h3>
        <div className="mt-3 space-y-2">
          {[
            { t: "Night Owl 5GB", s: "Midnight – 7 AM • ETB 39", c: "🌙" },
            { t: "Social Pack", s: "WhatsApp + TikTok 3GB • ETB 99", c: "💬" },
          ].map((r) => (
            <div key={r.t} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg">{r.c}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.t}</p>
                <p className="text-xs text-muted-foreground">{r.s}</p>
              </div>
              <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Buy</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
