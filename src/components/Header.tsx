interface HeaderProps {
  onAddBook: () => void;
  showAdd: boolean;
}

export function Header({ onAddBook, showAdd }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Audio<span className="text-amber-400">libros</span>
          </h1>
          <p className="text-sm text-neutral-400">Convierte tus libros en audiolibros con voz del navegador</p>
        </div>
        {showAdd && (
          <button
            onClick={onAddBook}
            className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
          >
            + Agregar libro
          </button>
        )}
      </div>
    </header>
  );
}
