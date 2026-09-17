import { useState } from "react";
import type { Mode } from "../types/session";

export interface SetupValues {
  exercise: string;
  mode: Mode;
  seconds: number;
  minMs: number;
  maxMs: number;
}

interface Props {
  initial: SetupValues;
  suggestions: string[];
  onStart: (values: SetupValues) => void;
}

export function ExerciseSetup({ initial, suggestions, onStart }: Props) {
  const [exercise, setExercise] = useState(initial.exercise);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [seconds, setSeconds] = useState(initial.seconds);
  const [minMs, setMinMs] = useState(initial.minMs);
  const [maxMs, setMaxMs] = useState(initial.maxMs);

  const canStart = exercise.trim().length > 0 && (mode === "fixed" ? seconds > 0 : minMs > 0 && maxMs >= minMs);

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canStart) return;
        onStart({ exercise: exercise.trim(), mode, seconds, minMs, maxMs });
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="exercise" className="text-sm font-medium text-neutral-600">
          Ejercicio
        </label>
        <input
          id="exercise"
          list="exercise-suggestions"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Ej. Escalera de agilidad"
          className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          autoFocus
        />
        <datalist id="exercise-suggestions">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-600">Modo</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("fixed")}
            className={`rounded-xl border-2 px-4 py-4 text-left transition ${
              mode === "fixed"
                ? "border-emerald-500 bg-emerald-50"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <div className="text-base font-semibold text-neutral-800">Tiempo fijo</div>
            <div className="text-sm text-neutral-500">Cuenta regresiva segura</div>
          </button>
          <button
            type="button"
            onClick={() => setMode("reaction")}
            className={`rounded-xl border-2 px-4 py-4 text-left transition ${
              mode === "reaction"
                ? "border-emerald-500 bg-emerald-50"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <div className="text-base font-semibold text-neutral-800">Reacción</div>
            <div className="text-sm text-neutral-500">Espera al azar, pica rápido</div>
          </button>
        </div>
      </div>

      {mode === "fixed" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="seconds" className="text-sm font-medium text-neutral-600">
            Segundos asegurados
          </label>
          <input
            id="seconds"
            type="number"
            min={1}
            max={600}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="minMs" className="text-sm font-medium text-neutral-600">
              Espera mínima (seg)
            </label>
            <input
              id="minMs"
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={minMs / 1000}
              onChange={(e) => setMinMs(Math.round(Number(e.target.value) * 1000))}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxMs" className="text-sm font-medium text-neutral-600">
              Espera máxima (seg)
            </label>
            <input
              id="maxMs"
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={maxMs / 1000}
              onChange={(e) => setMaxMs(Math.round(Number(e.target.value) * 1000))}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!canStart}
        className="rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Comenzar
      </button>
    </form>
  );
}
