import type { Book } from "../types/book";
import { BookCard } from "./BookCard";
import { PublicDomainShelf } from "./PublicDomainShelf";

interface LibraryProps {
  books: Book[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
  onAddPublicDomain: (book: Book) => void;
}

function groupBySeries(books: Book[]): { series: Map<string, Book[]>; standalone: Book[] } {
  const series = new Map<string, Book[]>();
  const standalone: Book[] = [];
  for (const book of books) {
    if (book.series) {
      const group = series.get(book.series) ?? [];
      group.push(book);
      series.set(book.series, group);
    } else {
      standalone.push(book);
    }
  }
  return { series, standalone };
}

export function Library({
  books,
  onOpen,
  onDelete,
  onOpenAddModal,
  onAddPublicDomain,
}: LibraryProps) {
  const { series, standalone } = groupBySeries(books);
  const sortedStandalone = standalone.slice().sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col gap-10">
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-white/50 py-16 text-center">
          <p className="text-lg font-medium text-neutral-700">Tu biblioteca está vacía</p>
          <p className="max-w-sm text-sm text-neutral-500">
            Sube un archivo .txt o .pdf, pega un texto, o agrega uno de los audiolibros gratis de
            abajo para empezar.
          </p>
          <button
            onClick={onOpenAddModal}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
          >
            + Agregar mi primer libro
          </button>
        </div>
      ) : (
        <>
          {Array.from(series.entries()).map(([seriesName, seriesBooks]) => (
            <section key={seriesName}>
              <h2 className="mb-3 text-lg font-semibold text-neutral-900">{seriesName}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {seriesBooks.map((book) => (
                  <BookCard key={book.id} book={book} onOpen={onOpen} onDelete={onDelete} />
                ))}
              </div>
            </section>
          ))}

          {sortedStandalone.length > 0 && (
            <section>
              {series.size > 0 && (
                <h2 className="mb-3 text-lg font-semibold text-neutral-900">Otros libros</h2>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedStandalone.map((book) => (
                  <BookCard key={book.id} book={book} onOpen={onOpen} onDelete={onDelete} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <PublicDomainShelf books={books} onAdd={onAddPublicDomain} onOpen={onOpen} />
    </div>
  );
}
