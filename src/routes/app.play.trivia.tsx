import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, X, Lock } from "lucide-react";
import { useGames } from "@/store/games";
import { usePersona, useLifecycleGuard } from "@/store/persona";

export const Route = createFileRoute("/app/play/trivia")({
  component: TriviaPage,
});

interface Q { q: string; options: string[]; answer: number; }

const QUESTIONS: Q[] = [
  { q: "Which network offers eSIM in Ethiopia?", options: ["Safaricom Ethiopia", "Other operator", "None"], answer: 0 },
  { q: "What does 5G primarily enable?", options: ["Slower speeds", "Ultra-fast mobile data", "Only voice calls"], answer: 1 },
  { q: "Capital city of Ethiopia?", options: ["Adama", "Dire Dawa", "Addis Ababa"], answer: 2 },
  { q: "M-PESA is used for…", options: ["Mobile money", "Streaming movies", "Gaming"], answer: 0 },
  { q: "Which is a data unit?", options: ["Gigabyte", "Kilometre", "Litre"], answer: 0 },
];

function pickThree(): Q[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function TriviaPage() {
  const navigate = useNavigate();
  const persona = usePersona((s) => s.persona);
  const { isDeactivated, isSuspended } = useLifecycleGuard();
  const consumePlay = useGames((s) => s.consumePlay);
  const addReward = useGames((s) => s.addReward);

  const [questions] = useState<Q[]>(() => pickThree());
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [denied, setDenied] = useState<string | null>(null);

  const isExplorer = persona === "explorer" || persona === "transition";

  function start() {
    if (isDeactivated) {
      setDenied("Reactivate your SIM to play");
      return;
    }
    const ok = consumePlay();
    if (!ok) {
      setDenied("No free plays left today. Come back tomorrow!");
      return;
    }
    setStarted(true);
  }

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === questions[step].answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 < questions.length) {
        setStep((s) => s + 1);
        setPicked(null);
      } else {
        const finalScore = i === questions[step].answer ? score + 1 : score;
        const dataMb = finalScore === 3 ? 2048 : finalScore === 2 ? 500 : finalScore === 1 ? 100 : 0;
        if (dataMb > 0) {
          const r = addReward({
            kind: "data",
            amount: dataMb,
            label: dataMb >= 1024 ? `${(dataMb / 1024).toFixed(0)} GB Free Data` : `${dataMb} MB Free Data`,
            source: "trivia",
            locked: isExplorer,
          });
          navigate({ to: "/app/play/win", search: { id: r.id } });
        } else {
          navigate({ to: "/app/play" });
        }
      }
    }, 700);
  }

  if (!started) {
    return (
      <div className="animate-fade-in pb-8">
        <header className="flex items-center gap-3 px-5 py-4">
          <Link to="/app/play" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Trivia Quiz</h1>
        </header>
        <div className="px-5">
          <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">3 questions · 1 reward</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">Answer correctly to win free data</h2>
            <ul className="mt-4 space-y-1.5 text-xs text-white/85">
              <li>· 3/3 correct → 2 GB</li>
              <li>· 2/3 correct → 500 MB</li>
              <li>· 1/3 correct → 100 MB</li>
            </ul>
          </div>
          {denied && (
            <div className="mt-4 rounded-2xl border border-warning/40 bg-warning/15 p-3 text-center">
              <p className="text-xs font-semibold text-warning-foreground">{denied}</p>
            </div>
          )}
          <button
            onClick={start}
            disabled={isDeactivated}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {isDeactivated ? <><Lock className="h-4 w-4" /> Reactivate to play</> : "Start quiz"}
          </button>
          {isSuspended && (
            <p className="mt-2 text-center text-[11px] text-warning-foreground">
              Recharge to unlock your rewards.
            </p>
          )}
        </div>
      </div>
    );
  }

  const cur = questions[step];
  const pct = ((step + 1) / questions.length) * 100;

  return (
    <div className="animate-fade-in pb-8">
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/app/play" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Question {step + 1} of {questions.length}
          </p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      <section key={step} className="animate-pop px-5">
        <div className="rounded-3xl bg-gradient-card p-5 shadow-soft">
          <p className="text-base font-semibold leading-snug">{cur.q}</p>
        </div>

        <div className="mt-4 space-y-2.5">
          {cur.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === cur.answer;
            const showState = picked !== null;
            const tone = !showState
              ? "border-border bg-card hover:border-primary/40"
              : isCorrect
                ? "border-success bg-success/15"
                : isPicked
                  ? "border-destructive bg-destructive/10"
                  : "border-border bg-card opacity-60";

            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => choose(i)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all ${tone}`}
              >
                <span>{opt}</span>
                {showState && isCorrect && <Check className="h-4 w-4 text-success" />}
                {showState && isPicked && !isCorrect && <X className="h-4 w-4 text-destructive" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
