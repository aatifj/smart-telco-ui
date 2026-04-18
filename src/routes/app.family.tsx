import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Users, ChevronRight, Wifi, Phone, Lock, AlertTriangle, Bell } from "lucide-react";
import { useFamily, memberInitials } from "@/store/family";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/family")({
  component: FamilyDashboard,
});

function FamilyDashboard() {
  const navigate = useNavigate();
  const { created, familyName, members } = useFamily();
  const { isRestricted, isSuspended, isDeactivated } = useLifecycleGuard();

  const totals = members.reduce(
    (acc, m) => ({
      data: acc.data + m.dataUsedGb,
      dataLimit: acc.dataLimit + m.dataLimitGb,
      voice: acc.voice + m.voiceUsedMin,
      voiceLimit: acc.voiceLimit + m.voiceLimitMin,
    }),
    { data: 0, dataLimit: 0, voice: 0, voiceLimit: 0 },
  );

  if (!created) {
    return (
      <div className="animate-fade-in pb-6">
        <header className="flex items-center gap-3 px-5 pt-5">
          <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Family</h1>
        </header>
        <section className="px-5 pt-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Users className="h-9 w-9" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Create a Family Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share bundles, track usage, and manage up to 8 lines from one place.
          </p>
          <Link
            to="/app/family/create"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Create Family Account
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <Link to="/app" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold leading-tight">{familyName}</h1>
            <p className="text-[11px] text-muted-foreground">{members.length} members</p>
          </div>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <Bell className="h-4 w-4" />
        </button>
      </header>

      {/* Lifecycle banner */}
      {isRestricted && (
        <section className="mt-4 px-5">
          <div className={`flex items-start gap-3 rounded-2xl border p-3.5 ${isDeactivated ? "border-destructive/30 bg-destructive/5" : "border-warning/40 bg-warning/10"}`}>
            <AlertTriangle className={`mt-0.5 h-4 w-4 ${isDeactivated ? "text-destructive" : "text-warning-foreground"}`} />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {isDeactivated ? "Reactivate your SIM to access family management" : "Top up to continue managing your family"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {isDeactivated ? "Visit a Safaricom shop to restore the owner line." : "Bundle purchases for members are paused until top-up."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Owner summary */}
      <section className="mt-4 px-5">
        <div className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75">Family pool · this month</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-white/70">Data used</p>
              <p className="mt-1 text-lg font-semibold">{totals.data.toFixed(1)} GB</p>
              <p className="text-[10px] text-white/70">of {totals.dataLimit.toFixed(0)} GB</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-white/70">Voice used</p>
              <p className="mt-1 text-lg font-semibold">{totals.voice} min</p>
              <p className="text-[10px] text-white/70">of {totals.voiceLimit} min</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">Owner balance</p>
              <p className="text-base font-semibold">ETB 248.50</p>
            </div>
            <Link to="/app/bundles" className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-primary">
              Top up
            </Link>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Members</h2>
          <Link
            to="/app/family/add"
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isDeactivated ? "pointer-events-none bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
            }`}
          >
            <Plus className="h-3.5 w-3.5" /> Add member
          </Link>
        </div>

        <div className="mt-3 space-y-2.5">
          {members.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              No members yet. Add your first family line.
            </p>
          )}
          {members.map((m) => {
            const dataPct = m.dataLimitGb > 0 ? Math.min(100, (m.dataUsedGb / m.dataLimitGb) * 100) : 0;
            const high = dataPct >= 80;
            return (
              <button
                key={m.id}
                onClick={() => navigate({ to: "/app/family/$memberId", params: { memberId: m.id } })}
                className="w-full rounded-2xl border border-border bg-card p-3.5 text-left shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${m.avatarColor}`}>
                    {memberInitials(m.nickname)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{m.nickname}</p>
                    <p className="text-[11px] text-muted-foreground">{m.phone} · {m.lastActive}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    Data <span className={`font-semibold ${high ? "text-destructive" : "text-foreground"}`}>
                      {m.dataUsedGb.toFixed(1)} / {m.dataLimitGb} GB
                    </span>
                  </span>
                  <span className="text-muted-foreground">Voice <span className="font-semibold text-foreground">{m.voiceUsedMin}/{m.voiceLimitMin} min</span></span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full ${high ? "bg-destructive" : "bg-primary"}`} style={{ width: `${dataPct}%` }} />
                </div>
                {high && (
                  <p className="mt-2 text-[10.5px] font-medium text-destructive">⚠️ {m.nickname.split(" ")[0]} has used {Math.round(dataPct)}% of data</p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick actions footer */}
      {members.length > 0 && !isDeactivated && (
        <section className="mt-6 px-5">
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/app/family/add"
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add member
            </Link>
            <Link
              to="/app/family"
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              <Wifi className="h-3.5 w-3.5" /> Buy shared data
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
