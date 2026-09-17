import type { HistoryEntry } from "../types/session";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString("es", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resultLabel(entry: HistoryEntry): string {
  if (entry.mode === "fixed") return `${entry.result} s`;
  if (entry.falseStart) return "Falsa salida";
  return `${entry.result} ms`;
}

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
}

export function HistoryList({ history, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Historial</h2>
        <button onClick={onClear} className="text-sm text-neutral-400 hover:text-rose-500">
          Borrar
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {history.slice(0, 12).map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3"
          >
            <div>
              <div className="font-medium text-neutral-800">{entry.exercise}</div>
              <div className="text-xs text-neutral-400">{formatTime(entry.timestamp)}</div>
            </div>
            <div
              className={`text-lg font-bold tabular-nums ${
                entry.falseStart ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {resultLabel(entry)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
