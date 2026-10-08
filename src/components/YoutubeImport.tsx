import { useState } from "react";
import type { Book } from "../types/book";

const YOUTUBE_TRANSCRIPT_URL =
  "https://gnjduwpxcfmfksxxwugi.supabase.co/functions/v1/youtube-transcript";

interface YoutubeImportProps {
  onCreate: (book: Book) => void;
}

export function YoutubeImport({ onCreate }: YoutubeImportProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Pega la URL de un video de YouTube.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(YOUTUBE_TRANSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo importar el video.");
      }
      onCreate({
        id: crypto.randomUUID(),
        title: data.title || "Video de YouTube",
        source: "youtube",
        sourceNote: trimmed,
        text: data.text,
        createdAt: Date.now(),
        progressIndex: 0,
      });
      setUrl("");
    } catch (err) {
      if (err instanceof TypeError) {
        setError("No se pudo conectar con el servicio de importación. Revisa tu conexión a internet.");
      } else {
        setError(err instanceof Error ? err.message : "No se pudo importar el video.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          🔗
        </span>
        <h3 className="text-lg font-semibold text-neutral-900">Importar de YouTube</h3>
      </div>
      <p className="mt-1 mb-4 text-sm text-neutral-500">
        Pega la URL de un video que tenga subtítulos o transcripción y la convierto en audiolibro.
        Solo se extrae el texto de los subtítulos (no se descarga el video ni el audio), así que
        solo funciona con videos que tengan subtítulos activados.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        />
        <button
          onClick={handleImport}
          disabled={loading}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:opacity-50"
        >
          {loading ? "Importando…" : "Importar"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
