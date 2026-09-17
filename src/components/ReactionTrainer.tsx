import { useCallback, useEffect, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";

type Phase = "idle" | "waiting" | "go" | "result";

interface Props {
  exercise: string;
  minMs: number;
  maxMs: number;
  onResult: (reactionMs: number | null, falseStart: boolean) => void;
  onCancel: () => void;
}

function rating(ms: number): string {
  if (ms < 200) return "Reflejo excelente";
  if (ms < 300) return "Muy bien";
  if (ms < 450) return "Bien";
  return "Sigue practicando";
}

export function ReactionTrainer({ exercise, minMs, maxMs, onResult, onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [falseStart, setFalseStart] = useState(false);
  const { play, vibrate } = useSound();
  const goAtRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const startRound = useCallback(() => {
    setFalseStart(false);
    setReactionMs(null);
    setPhase("waiting");
    const delay = minMs + Math.random() * Math.max(0, maxMs - minMs);
    timeoutRef.current = window.setTimeout(() => {
      goAtRef.current = performance.now();
      setPhase("go");
      play("go", 200);
      vibrate(50);
    }, delay);
  }, [minMs, maxMs, play, vibrate]);

  const handleTap = () => {
    if (phase === "waiting") {
      window.clearTimeout(timeoutRef.current);
      setFalseStart(true);
      setPhase("result");
      play("error", 300);
      vibrate([80, 40, 80]);
      onResult(null, true);
      return;
    }
    if (phase === "go") {
      const ms = Math.round(performance.now() - goAtRef.current);
      setReactionMs(ms);
      setPhase("result");
      onResult(ms, false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="text-center">
        <div className="text-sm font-medium uppercase tracking-wide text-neutral-500">Ejercicio</div>
        <div className="text-2xl font-bold text-neutral-800">{exercise}</div>
      </div>

      {phase === "idle" && (
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-neutral-600">
            Cuando toques "Empezar", espera la señal verde. En cuanto aparezca, pica la pantalla lo más
            rápido posible. Si picas antes de tiempo, es falsa salida.
          </p>
          <button
            onClick={startRound}
            className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white hover:bg-emerald-700"
          >
            Empezar
          </button>
        </div>
      )}

      {(phase === "waiting" || phase === "go") && (
        <button
          onPointerDown={handleTap}
          className={`flex h-72 w-full items-center justify-center rounded-2xl text-3xl font-black text-white transition-colors ${
            phase === "waiting" ? "bg-rose-500" : "bg-emerald-500"
          }`}
        >
          {phase === "waiting" ? "Espera..." : "¡YA! PICA"}
        </button>
      )}

      {phase === "result" && (
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          {falseStart ? (
            <>
              <div className="text-2xl font-bold text-rose-600">Falsa salida</div>
              <p className="text-neutral-600">Picaste antes de la señal. ¡Inténtalo de nuevo!</p>
            </>
          ) : (
            <>
              <div className="text-5xl font-black tabular-nums text-neutral-800">{reactionMs} ms</div>
              <div className="text-lg font-semibold text-emerald-600">{rating(reactionMs ?? 0)}</div>
            </>
          )}
          <div className="flex gap-3">
            <button
              onClick={startRound}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700"
            >
              Repetir
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl border border-neutral-300 px-6 py-3 text-base font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Nuevo ejercicio
            </button>
          </div>
        </div>
      )}

      {phase !== "result" && (
        <button
          onClick={onCancel}
          className="rounded-xl border border-neutral-300 px-6 py-3 text-base font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
