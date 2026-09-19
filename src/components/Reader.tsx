import { useEffect, useMemo, useRef } from "react";
import type { Book, VoicePrefs } from "../types/book";
import { parseBookText } from "../utils/parseBookText";
import { useSpeechPlayer } from "../hooks/useSpeechPlayer";
import { estimateRemainingSeconds, formatDuration } from "../utils/format";

interface ReaderProps {
  book: Book;
  prefs: VoicePrefs;
  onBack: () => void;
  onProgress: (index: number) => void;
  onPrefsChange: (prefs: VoicePrefs) => void;
}

export function Reader({ book, prefs, onBack, onProgress, onPrefsChange }: ReaderProps) {
  const { paragraphs, sentences } = useMemo(() => parseBookText(book.text), [book.text]);
  const sentenceTexts = useMemo(() => sentences.map((s) => s.text), [sentences]);
  const activeRef = useRef<HTMLSpanElement | null>(null);

  const { supported, currentIndex, status, voices, play, pause, stop, next, prev, goTo } =
    useSpeechPlayer({
      sentences: sentenceTexts,
      initialIndex: book.progressIndex,
      voiceURI: prefs.voiceURI,
      rate: prefs.rate,
      pitch: prefs.pitch,
      onProgress,
    });

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

  const remainingSeconds = estimateRemainingSeconds(
    sentenceTexts.slice(currentIndex + 1),
    prefs.rate,
  );

  if (!supported) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Tu navegador no soporta síntesis de voz (Web Speech API). Prueba con Chrome, Edge o Safari
        recientes.
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="w-fit text-sm text-neutral-500 hover:text-neutral-800">
        ← Volver a la biblioteca
      </button>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-neutral-900">{book.title}</h2>
        <p className="text-sm text-neutral-500">
          Frase {Math.min(currentIndex + 1, sentenceTexts.length)} de {sentenceTexts.length} ·{" "}
          {status === "finished" ? "Terminado" : `${formatDuration(remainingSeconds)} restantes`}
        </p>
      </div>

      <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 leading-relaxed text-neutral-800">
        {paragraphs.map((paragraphSentences, pIdx) => (
          <p key={pIdx} className="mb-4">
            {paragraphSentences.map((sentenceText, sIdx) => {
              const idx = globalIndex++;
              const isActive = idx === currentIndex;
              return (
                <span
                  key={sIdx}
                  ref={isActive ? activeRef : undefined}
                  onClick={() => goTo(idx)}
                  className={`cursor-pointer rounded px-0.5 ${
                    isActive ? "bg-amber-200" : "hover:bg-neutral-100"
                  }`}
                >
                  {sentenceText}{" "}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="rounded-full border border-neutral-200 p-3 hover:bg-neutral-50"
            aria-label="Frase anterior"
          >
            ⏮
          </button>
          {status === "playing" ? (
            <button
              onClick={pause}
              className="rounded-full bg-neutral-900 p-4 text-white hover:bg-neutral-700"
              aria-label="Pausar"
            >
              ⏸
            </button>
          ) : (
            <button
              onClick={play}
              className="rounded-full bg-amber-400 p-4 text-neutral-950 hover:bg-amber-300"
              aria-label="Reproducir"
            >
              ▶
            </button>
          )}
          <button
            onClick={stop}
            className="rounded-full border border-neutral-200 p-3 hover:bg-neutral-50"
            aria-label="Detener"
          >
            ⏹
          </button>
          <button
            onClick={next}
            className="rounded-full border border-neutral-200 p-3 hover:bg-neutral-50"
            aria-label="Frase siguiente"
          >
            ⏭
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-neutral-500">
              Voz
            </label>
            <select
              value={prefs.voiceURI ?? ""}
              onChange={(e) => onPrefsChange({ ...prefs, voiceURI: e.target.value || undefined })}
              className="w-full rounded-lg border border-neutral-300 px-2 py-2 text-sm"
            >
              <option value="">Predeterminada del navegador</option>
              {voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-neutral-500">
              Velocidad: {prefs.rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={prefs.rate}
              onChange={(e) => onPrefsChange({ ...prefs, rate: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-neutral-500">
              Tono: {prefs.pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={prefs.pitch}
              onChange={(e) => onPrefsChange({ ...prefs, pitch: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
