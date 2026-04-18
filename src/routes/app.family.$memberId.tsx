import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Trash2, Wifi, BarChart3, Phone, MessageSquare } from "lucide-react";
import { useFamily, memberInitials } from "@/store/family";
import { useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/family/$memberId")({
  component: MemberDetail,
  notFoundComponent: () => (
    <div className="px-5 pt-10 text-center">
      <p className="text-sm">Member not found</p>
      <Link to="/app/family" className="mt-3 inline-block text-xs font-semibold text-primary">Back to family</Link>
    </div>
  ),
});

function MemberDetail() {
  const { memberId } = Route.useParams();
  const navigate = useNavigate();
  const { isDeactivated, isSuspended } = useLifecycleGuard();
  const member = useFamily((s) => s.members.find((m) => m.id === memberId));
  const removeMember = useFamily((s) => s.removeMember);
  const [confirm, setConfirm] = useState(false);

  if (!member) throw notFound();

  const dataPct = member.dataLimitGb > 0 ? Math.min(100, (member.dataUsedGb / member.dataLimitGb) * 100) : 0;
  const voicePct = member.voiceLimitMin > 0 ? Math.min(100, (member.voiceUsedMin / member.voiceLimitMin) * 100) : 0;
  const smsPct = member.smsLimit > 0 ? Math.min(100, (member.smsUsed / member.smsLimit) * 100) : 0;
  const blocked = isDeactivated || isSuspended;

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center justify-between px-5 pt-5">
        <Link to="/app/family" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button
          onClick={() => setConfirm(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </header>

      <section className="mt-2 px-5 text-center">
        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-base font-bold ${member.avatarColor}`}>
          {memberInitials(member.nickname)}
        </span>
        <h1 className="mt-3 text-lg font-semibold">{member.nickname}</h1>
        <p className="text-xs text-muted-foreground">{member.phone}</p>
      </section>

      {/* Usage bars */}
      <section className="mt-6 px-5">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <UsageRow icon={Wifi} label="Data" used={`${member.dataUsedGb.toFixed(1)} GB`} total={`${member.dataLimitGb} GB`} pct={dataPct} alert={dataPct >= 80} />
          <UsageRow icon={Phone} label="Voice" used={`${member.voiceUsedMin} min`} total={`${member.voiceLimitMin} min`} pct={voicePct} />
          <UsageRow icon={MessageSquare} label="SMS" used={`${member.smsUsed}`} total={`${member.smsLimit}`} pct={smsPct} />
        </div>
      </section>

      {/* 7-day trend mock */}
      <section className="mt-5 px-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Data usage · 7 days</p>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {[0.4, 0.6, 0.3, 0.8, 0.5, 0.9, 0.7].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${v * 100}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            {["M","T","W","T","F","S","S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="mt-6 px-5">
        <button
          disabled={blocked}
          onClick={() => navigate({ to: "/app/family/$memberId/buy", params: { memberId: member.id } })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <Wifi className="h-4 w-4" /> Buy bundle for {member.nickname.split(" ")[0]}
        </button>
        {blocked && (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {isDeactivated ? "Reactivate your SIM to continue." : "Top up your line to send bundles."}
          </p>
        )}
      </section>

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center" onClick={() => setConfirm(false)}>
          <div className="w-full max-w-sm rounded-t-3xl bg-card p-5 shadow-elevated md:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold">Remove {member.nickname}?</p>
            <p className="mt-1 text-xs text-muted-foreground">They will lose access to the shared family pool.</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button onClick={() => setConfirm(false)} className="rounded-2xl border border-border py-3 text-xs font-semibold">Cancel</button>
              <button
                onClick={() => { removeMember(member.id); navigate({ to: "/app/family" }); }}
                className="rounded-2xl bg-destructive py-3 text-xs font-semibold text-destructive-foreground"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsageRow({ icon: Icon, label, used, total, pct, alert }: { icon: typeof Wifi; label: string; used: string; total: string; pct: number; alert?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="ml-auto text-xs">
          <span className={`font-semibold ${alert ? "text-destructive" : "text-foreground"}`}>{used}</span>
          <span className="text-muted-foreground"> / {total}</span>
        </p>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full ${alert ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
