import type { Book } from "../types/book";
import { ComingSoonCard } from "./ComingSoonCard";
import { YoutubeImport } from "./YoutubeImport";
import { PhotoImport } from "./PhotoImport";

interface CreateHubProps {
  onAddBook: () => void;
  onCreate: (book: Book) => void;
}

export function CreateHub({ onAddBook, onCreate }: CreateHubProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            📄
          </span>
          <h3 className="text-lg font-semibold text-neutral-900">Subir archivo o pegar texto</h3>
        </div>
        <p className="mt-1 mb-4 text-sm text-neutral-500">
          Convierte un libro que ya tienes (.txt, .pdf) o un texto pegado en un audiolibro
          reproducible con voz.
        </p>
        <button
          onClick={onAddBook}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
        >
          + Agregar libro
        </button>
      </div>

      <PhotoImport onCreate={onCreate} />
      <YoutubeImport onCreate={onCreate} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ComingSoonCard
          icon="🪄"
          title="Crear audiolibro con IA"
          description='Describe lo que quieres ("un audiolibro sobre... con 3 capítulos de 10 minutos") y que la IA lo escriba y narre por ti.'
          requirement="requiere conectar una API de generación de texto (por ejemplo, la API de Claude)"
        />
        <ComingSoonCard
          icon="🌐"
          title="Traducción"
          description="Sube un libro en un idioma y conviértelo en audiolibro en otro idioma, ya traducido."
          requirement="requiere conectar una API de traducción o de IA"
        />
      </div>
    </div>
  );
}
