import type { Book } from "../types/book";
import { parseBookText, estimateWordCount } from "../utils/parseBookText";
import { formatDate } from "../utils/format";

interface BookCardProps {
  book: Book;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const SOURCE_LABELS: Record<Book["source"], string> = {
  txt: "TXT",
  pdf: "PDF",
  paste: "Texto",
  "public-domain": "Dominio público",
};

export function BookCard({ book, onOpen, onDelete }: BookCardProps) {
  const { sentences } = parseBookText(book.text);
  const total = sentences.length || 1;
  const progressPercent = Math.min(100, Math.round((book.progressIndex / total) * 100));
  const wordCount = estimateWordCount(book.text);

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium uppercase text-neutral-500">
            {SOURCE_LABELS[book.source]}
          </span>
          <span className="text-xs text-neutral-400">{formatDate(book.createdAt)}</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900">{book.title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{wordCount.toLocaleString("es")} palabras</p>

        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-400">{progressPercent}% escuchado</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpen(book.id)}
          className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          {book.progressIndex > 0 ? "Continuar" : "Escuchar"}
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-500 transition hover:border-red-300 hover:text-red-500"
          aria-label="Eliminar libro"
          title="Eliminar libro"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
