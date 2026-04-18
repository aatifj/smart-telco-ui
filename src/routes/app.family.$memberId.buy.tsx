import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Gift } from "lucide-react";
import { useFamily, memberInitials } from "@/store/family";

export const Route = createFileRoute("/app/family/$memberId/buy")({
  component: BuyForMember,
  notFoundComponent: () => (
    <div className="px-5 pt-10 text-center">
      <p className="text-sm">Member not found</p>
      <Link to="/app/family" className="mt-3 inline-block text-xs font-semibold text-primary">Back</Link>
    </div>
  ),
});

const bundles = [
  { id: "d1", name: "Daily Saver", desc: "1.5 GB · 1 day", price: 49, dataGb: 1.5, voiceMin: 0 },
  { id: "w1", name: "Weekly Pro", desc: "8 GB + 30 min · 7 days", price: 299, dataGb: 8, voiceMin: 30 },
  { id: "m1", name: "Monthly Max", desc: "25 GB + 100 min · 30 days", price: 899, dataGb: 25, voiceMin: 100 },
  { id: "u1", name: "Mega Stream", desc: "50 GB · 30 days", price: 1499, dataGb: 50, voiceMin: 0 },
];

function BuyForMember() {
  const { memberId } = Route.useParams();
  const navigate = useNavigate();
  const member = useFamily((s) => s.members.find((m) => m.id === memberId));
  const topUp = useFamily((s) => s.topUpMember);
  const [selected, setSelected] = useState(bundles[1].id);
  const [done, setDone] = useState(false);

  if (!member) throw notFound();
  const bundle = bundles.find((b) => b.id === selected)!;

  const purchase = () => {
    topUp(member.id, bundle.dataGb, bundle.voiceMin);
    setDone(true);
    setTimeout(() => navigate({ to: "/app/family/$memberId", params: { memberId: member.id } }), 1300);
  };

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">Bundle sent</h2>
        <p className="mt-1 text-sm text-muted-foreground">{bundle.name} delivered to {member.nickname}.</p>
        <p className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">Paid by you · ETB {bundle.price}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-6">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/app/family/$memberId" params={{ memberId: member.id }} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Buy for {member.nickname.split(" ")[0]}</h1>
      </header>

      <section className="mt-4 px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${member.avatarColor}`}>
            {memberInitials(member.nickname)}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">{member.nickname}</p>
            <p className="text-[11px] text-muted-foreground">{member.phone}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            <Gift className="-mt-0.5 mr-1 inline h-3 w-3" /> Paid by you
          </span>
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="text-sm font-semibold">Choose a bundle</p>
        <div className="mt-3 space-y-2">
          {bundles.map((b) => {
            const active = b.id === selected;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-primary" : "border-border"}`}>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">{b.desc}</p>
                </div>
                <p className="text-sm font-bold">ETB {b.price}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-2xl bg-secondary p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Charged to your balance</span>
            <span className="font-semibold">ETB 248.50</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Bundle</span>
            <span className="font-semibold">- ETB {bundle.price}</span>
          </div>
        </div>
        <button
          onClick={purchase}
          className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Send bundle · ETB {bundle.price}
        </button>
      </section>
    </div>
  );
}
