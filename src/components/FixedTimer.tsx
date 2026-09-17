import { useEffect, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";

interface Props {
  exercise: string;
  seconds: number;
  onDone: () => void;
  onCancel: () => void;
}

export function FixedTimer({ exercise, seconds, onDone, onCancel }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const { play, vibrate } = useSound();
  const lastBeepRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    setFinished(false);
    setRemaining(seconds);
    lastBeepRef.current = null;
    const start = Date.now();
    const total = seconds * 1000;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, Math.ceil((total - elapsed) / 1000));
      setRemaining(left);
      if (left !== lastBeepRef.current) {
        lastBeepRef.current = left;
        if (left > 0 && left <= 3) {
          play("tick", 100);
          vibrate(40);
        }
      }
      if (elapsed >= total) {
        clearInterval(id);
        play("end", 400);
        vibrate([120, 60, 120]);
        setFinished(true);
        onDoneRef.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [seconds, runId, play, vibrate]);

  const progress = 1 - remaining / seconds;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="text-center">
        <div className="text-sm font-medium uppercase tracking-wide text-neutral-500">Ejercicio</div>
        <div className="text-2xl font-bold text-neutral-800">{exercise}</div>
      </div>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={radius} strokeWidth="12" className="fill-none stroke-neutral-200" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            strokeLinecap="round"
            className="fill-none stroke-emerald-500 transition-[stroke-dashoffset] duration-100 ease-linear"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <div className="absolute text-6xl font-black tabular-nums text-neutral-800">{remaining}</div>
      </div>

      {finished && (
        <div className="text-xl font-bold text-emerald-600">¡Tiempo!</div>
      )}

      <div className="flex gap-3">
        {finished && (
          <button
            onClick={() => setRunId((n) => n + 1)}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700"
          >
            Repetir
          </button>
        )}
        <button
          onClick={onCancel}
          className="rounded-xl border border-neutral-300 px-6 py-3 text-base font-medium text-neutral-600 hover:bg-neutral-100"
        >
          {finished ? "Nuevo ejercicio" : "Cancelar"}
        </button>
      </div>
    </div>
  );
}
