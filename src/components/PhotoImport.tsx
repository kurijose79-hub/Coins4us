import { useRef, useState } from "react";
import type { Book } from "../types/book";
import { recognizeImages } from "../utils/ocr";

interface PhotoImportProps {
  onCreate: (book: Book) => void;
}

interface PhotoItem {
  file: File;
  previewUrl: string;
}

export function PhotoImport({ onCreate }: PhotoImportProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [recognizing, setRecognizing] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function addPhotos(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const items = Array.from(fileList).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...items]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => {
      const copy = prev.slice();
      URL.revokeObjectURL(copy[idx].previewUrl);
      copy.splice(idx, 1);
      return copy;
    });
  }

  function movePhoto(idx: number, dir: -1 | 1) {
    setPhotos((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = prev.slice();
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  }

  async function handleRecognize() {
    if (photos.length === 0) {
      setError("Agrega al menos una foto.");
      return;
    }
    setError(null);
    setRecognizing(true);
    try {
      const recognized = await recognizeImages(
        photos.map((p) => p.file),
        (fileIndex, total) => setProgressLabel(`Leyendo foto ${fileIndex} de ${total}…`),
      );
      setText((prev) => (prev ? prev + "\n\n" + recognized : recognized));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el texto de las fotos.");
    } finally {
      setRecognizing(false);
      setProgressLabel("");
    }
  }

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("No hay texto reconocido todavía. Agrega fotos y reconoce el texto primero.");
      return;
    }
    onCreate({
      id: crypto.randomUUID(),
      title: title.trim() || "Libro desde fotos",
      source: "photo",
      text: trimmed,
      createdAt: Date.now(),
      progressIndex: 0,
    });
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPhotos([]);
    setText("");
    setTitle("");
    setError(null);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          📷
        </span>
        <h3 className="text-lg font-semibold text-neutral-900">Tomar foto del libro</h3>
      </div>
      <p className="mt-1 mb-4 text-sm text-neutral-500">
        Toma una foto de cada página que quieras escuchar (un capítulo o el libro completo). El
        texto se reconoce directamente en tu navegador: las fotos nunca se suben a un servidor.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => addPhotos(e.target.files)}
        className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
      />

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div
              key={p.previewUrl}
              className="relative overflow-hidden rounded-lg border border-neutral-200"
            >
              <img src={p.previewUrl} alt={`Página ${i + 1}`} className="h-24 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-1 py-0.5 text-xs text-white">
                <button onClick={() => movePhoto(i, -1)} aria-label="Mover antes">
                  ↑
                </button>
                <span>{i + 1}</span>
                <button onClick={() => movePhoto(i, 1)} aria-label="Mover después">
                  ↓
                </button>
                <button onClick={() => removePhoto(i)} className="text-red-300" aria-label="Quitar">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleRecognize}
          disabled={recognizing || photos.length === 0}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:opacity-50"
        >
          {recognizing ? progressLabel || "Reconociendo…" : "Reconocer texto"}
        </button>
        {photos.length > 0 && (
          <span className="text-xs text-neutral-400">{photos.length} foto(s) agregadas</span>
        )}
      </div>

      {text && (
        <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del libro o capítulo"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Texto reconocido (revísalo y corrige errores de OCR antes de guardar)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSave}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Agregar a mi biblioteca
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
