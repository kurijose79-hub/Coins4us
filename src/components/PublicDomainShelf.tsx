import { PUBLIC_DOMAIN_BOOKS } from "../data/publicDomainBooks";
import type { Book } from "../types/book";

interface PublicDomainShelfProps {
  books: Book[];
  onAdd: (book: Book) => void;
  onOpen: (id: string) => void;
}

export function PublicDomainShelf({ books, onAdd, onOpen }: PublicDomainShelfProps) {
  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-neutral-900">
        Audiolibros gratis (dominio público)
      </h2>
      <p className="mb-4 text-sm text-neutral-500">
        Extractos de obras clásicas sin derechos de autor vigentes. Se leen con la voz que
        elegiste en tu Lab de voz.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_DOMAIN_BOOKS.map((pd) => {
          const existing = books.find((b) => b.sourceNote === pd.id);
          return (
            <div
              key={pd.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-5"
            >
              <div>
                <h3 className="line-clamp-2 text-base font-semibold text-neutral-900">
                  {pd.title}
                </h3>
                <p className="text-sm text-neutral-500">{pd.author}</p>
                <p className="mt-2 text-xs text-neutral-400">Fuente: {pd.source}</p>
              </div>
              {existing ? (
                <button
                  onClick={() => onOpen(existing.id)}
                  className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
                >
                  Escuchar
                </button>
              ) : (
                <button
                  onClick={() =>
                    onAdd({
                      id: crypto.randomUUID(),
                      title: pd.title,
                      author: pd.author,
                      series: pd.series,
                      source: "public-domain",
                      sourceNote: pd.id,
                      text: pd.text,
                      createdAt: Date.now(),
                      progressIndex: 0,
                    })
                  }
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  + Agregar a mi biblioteca
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
