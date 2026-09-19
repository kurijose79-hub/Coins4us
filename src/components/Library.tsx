import type { Book } from "../types/book";
import { BookCard } from "./BookCard";

interface LibraryProps {
  books: Book[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onAddBook: () => void;
}

export function Library({ books, onOpen, onDelete, onAddBook }: LibraryProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-white/50 py-20 text-center">
        <p className="text-lg font-medium text-neutral-700">Tu biblioteca está vacía</p>
        <p className="max-w-sm text-sm text-neutral-500">
          Sube un archivo .txt o .pdf, o pega el texto de un libro para convertirlo en audiolibro.
        </p>
        <button
          onClick={onAddBook}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
        >
          + Agregar mi primer libro
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((book) => (
          <BookCard key={book.id} book={book} onOpen={onOpen} onDelete={onDelete} />
        ))}
    </div>
  );
}
