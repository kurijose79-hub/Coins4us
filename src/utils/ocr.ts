import { createWorker } from "tesseract.js";
import workerUrl from "tesseract.js/dist/worker.min.js?url";

export async function recognizeImages(
  files: File[],
  onProgress?: (fileIndex: number, total: number, progress: number) => void,
): Promise<string> {
  try {
    const worker = await createWorker("spa+eng", undefined, { workerPath: workerUrl });
    try {
      const texts: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const { data } = await worker.recognize(files[i]);
        texts.push(data.text.trim());
        onProgress?.(i + 1, files.length, 1);
      }
      return texts.filter(Boolean).join("\n\n");
    } finally {
      await worker.terminate();
    }
  } catch {
    throw new Error(
      "No se pudo cargar el motor de reconocimiento de texto. Revisa tu conexión a internet e inténtalo de nuevo.",
    );
  }
}
