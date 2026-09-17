import { useMemo, useState } from "react";
import { ExerciseSetup, type SetupValues } from "./components/ExerciseSetup";
import { FixedTimer } from "./components/FixedTimer";
import { ReactionTrainer } from "./components/ReactionTrainer";
import { HistoryList } from "./components/HistoryList";
import { useHistory } from "./hooks/useHistory";
import type { HistoryEntry } from "./types/session";

const DEFAULT_SETUP: SetupValues = {
  exercise: "",
  mode: "fixed",
  seconds: 10,
  minMs: 2000,
  maxMs: 6000,
};

function App() {
  const { history, addEntry, clearHistory } = useHistory();
  const [config, setConfig] = useState<SetupValues>(DEFAULT_SETUP);
  const [running, setRunning] = useState(false);

  const suggestions = useMemo(
    () => Array.from(new Set(history.map((h) => h.exercise))).slice(0, 10),
    [history],
  );

  const backToSetup = () => setRunning(false);

  const recordFixed = () => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      exercise: config.exercise,
      mode: "fixed",
      timestamp: Date.now(),
      result: config.seconds,
    };
    addEntry(entry);
  };

  const recordReaction = (reactionMs: number | null, falseStart: boolean) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      exercise: config.exercise,
      mode: "reaction",
      timestamp: Date.now(),
      result: reactionMs ?? 0,
      falseStart,
    };
    addEntry(entry);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-8">
      <header className="mb-8 flex w-full max-w-md flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-black text-neutral-800">Pies en Reacción</h1>
        <p className="text-neutral-500">Entrena tu trabajo de pies: tiempo fijo o reacción al azar</p>
      </header>

      <main className="flex w-full max-w-md flex-1 flex-col items-center gap-8">
        {!running && (
          <ExerciseSetup
            initial={config}
            suggestions={suggestions}
            onStart={(values) => {
              setConfig(values);
              setRunning(true);
            }}
          />
        )}

        {running && (
          <div className="flex w-full flex-col items-center gap-4">
            <button
              onClick={backToSetup}
              className="self-start text-sm font-medium text-neutral-500 hover:text-neutral-700"
            >
              ← Cambiar ejercicio
            </button>

            {config.mode === "fixed" ? (
              <FixedTimer
                key={`fixed-${config.exercise}-${config.seconds}`}
                exercise={config.exercise}
                seconds={config.seconds}
                onDone={recordFixed}
                onCancel={backToSetup}
              />
            ) : (
              <ReactionTrainer
                key={`reaction-${config.exercise}-${config.minMs}-${config.maxMs}`}
                exercise={config.exercise}
                minMs={config.minMs}
                maxMs={config.maxMs}
                onResult={recordReaction}
                onCancel={backToSetup}
              />
            )}
          </div>
        )}

        {!running && <HistoryList history={history} onClear={clearHistory} />}
      </main>
    </div>
  );
}

export default App;
