async function extractTextFromPdf(file: File): Promise<string> {
  const [pdfjsLib, { default: pdfWorkerUrl }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => ("str" in item ? item.str : ""));
    pageTexts.push(strings.join(" "));
  }

  return pageTexts.join("\n\n");
}

export function fileNameToTitle(fileName: string): string {
  return fileName.replace(/\.[^./]+$/, "").replace(/[_-]+/g, " ").trim();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "txt" || file.type === "text/plain") {
    return file.text();
  }

  if (extension === "pdf" || file.type === "application/pdf") {
    return extractTextFromPdf(file);
  }

  throw new Error(
    "Formato no soportado. Sube un archivo .txt o .pdf, o pega el texto manualmente.",
  );
}
