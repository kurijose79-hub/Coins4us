import { useMemo } from "react";
import type { Book, VoicePrefs } from "../types/book";
import { parseBookText } from "../utils/parseBookText";
import { estimateSecondsForSentences, formatDuration } from "../utils/format";
import { PUBLIC_DOMAIN_BOOKS } from "../data/publicDomainBooks";
import { ComingSoonCard } from "./ComingSoonCard";

interface AnalyticsViewProps {
  books: Book[];
  prefs: VoicePrefs;
  onOpen: (id: string) => void;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}

export function AnalyticsView({ books, prefs, onOpen }: AnalyticsViewProps) {
  const stats = useMemo(() => {
    let totalSeconds = 0;
    let finishedCount = 0;
    let startedCount = 0;

    for (const book of books) {
      const { sentences } = parseBookText(book.text);
      const consumed = sentences.slice(0, book.progressIndex).map((s) => s.text);
      totalSeconds += estimateSecondsForSentences(consumed, prefs.rate);
      if (book.progressIndex > 0) startedCount += 1;
      if (sentences.length > 0 && book.progressIndex >= sentences.length - 1) {
        finishedCount += 1;
      }
    }

    return { totalSeconds, finishedCount, startedCount };
  }, [books, prefs.rate]);

  const notStarted = books.filter((b) => b.progressIndex === 0);
  const unaddedPublicDomain = PUBLIC_DOMAIN_BOOKS.filter(
    (pd) => !books.some((b) => b.sourceNote === pd.id),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Libros en tu biblioteca" value={String(books.length)} />
        <StatCard label="Libros empezados" value={String(stats.startedCount)} />
        <StatCard label="Libros terminados" value={String(stats.finishedCount)} />
        <StatCard label="Tiempo escuchado" value={formatDuration(stats.totalSeconds)} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Recomendados para ti</h2>
        {notStarted.length === 0 && unaddedPublicDomain.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Ya empezaste todos tus libros. Agrega uno nuevo desde Crear o Biblioteca.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notStarted.map((book) => (
              <button
                key={book.id}
                onClick={() => onOpen(book.id)}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left text-sm hover:bg-neutral-50"
              >
                <p className="font-medium text-neutral-800">{book.title}</p>
                <p className="text-xs text-neutral-400">Aún no lo empiezas</p>
              </button>
            ))}
            {unaddedPublicDomain.map((pd) => (
              <div
                key={pd.id}
                className="rounded-lg border border-dashed border-neutral-300 bg-white/60 px-4 py-3 text-sm"
              >
                <p className="font-medium text-neutral-800">{pd.title}</p>
                <p className="text-xs text-neutral-400">
                  Disponible gratis en Biblioteca → Dominio público
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <ComingSoonCard
        icon="🤖"
        title="Asistente de lectura (preguntas sobre tus libros)"
        description="Pregúntale sobre lo que has leído: personajes, tramas, resúmenes de capítulos. No recomienda libros nuevos, solo responde sobre tu propia lectura."
        requirement="requiere conectar una API de IA conversacional"
      />
    </div>
  );
}
