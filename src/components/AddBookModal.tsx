import { useRef, useState } from "react";
import type { Book, BookSource } from "../types/book";
import { extractTextFromFile, fileNameToTitle } from "../utils/extractText";

interface AddBookModalProps {
  onClose: () => void;
  onCreate: (book: Book) => void;
}

type Tab = "file" | "paste";

export function AddBookModal({ onClose, onCreate }: AddBookModalProps) {
  const [tab, setTab] = useState<Tab>("file");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState<BookSource>("paste");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const extractedText = await extractTextFromFile(file);
      if (!extractedText.trim()) {
        throw new Error("No se pudo extraer texto de este archivo.");
      }
      setText(extractedText);
      setTitle((current) => current || fileNameToTitle(file.name));
      setSource(file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "txt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    const trimmedTitle = title.trim() || "Libro sin título";
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Agrega el texto del libro subiendo un archivo o pegándolo manualmente.");
      return;
    }
    const book: Book = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      source: tab === "paste" ? "paste" : source,
      text: trimmedText,
      createdAt: Date.now(),
      progressIndex: 0,
    };
    onCreate(book);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Agregar libro</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 border-b border-neutral-200 px-5 pt-3">
          <button
            onClick={() => setTab("file")}
            className={`rounded-t-lg px-3 py-2 text-sm font-medium ${
              tab === "file"
                ? "border-b-2 border-amber-400 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Subir archivo
          </button>
          <button
            onClick={() => setTab("paste")}
            className={`rounded-t-lg px-3 py-2 text-sm font-medium ${
              tab === "paste"
                ? "border-b-2 border-amber-400 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Pegar texto
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del libro"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          {tab === "file" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Archivo (.txt o .pdf)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,text/plain,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
              />
              {loading && <p className="mt-2 text-sm text-neutral-500">Extrayendo texto…</p>}
              {!loading && text && (
                <p className="mt-2 text-sm text-emerald-600">
                  Texto listo ({text.trim().split(/\s+/).length.toLocaleString("es")} palabras).
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Texto del libro
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                placeholder="Pega aquí el contenido del libro…"
                className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:opacity-50"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
