export interface FlatSentence {
  text: string;
  paragraphIndex: number;
}

export interface ParsedBook {
  paragraphs: string[][];
  sentences: FlatSentence[];
}

function splitParagraphIntoSentences(paragraph: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter(navigator.language || "es", {
        granularity: "sentence",
      });
      const parts = Array.from(segmenter.segment(paragraph), (s) => s.segment.trim()).filter(
        Boolean,
      );
      if (parts.length > 0) return parts;
    } catch {
      // fall through to regex fallback
    }
  }
  return paragraph
    .split(/(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÑ¿¡"“(0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseBookText(rawText: string): ParsedBook {
  const normalized = rawText.replace(/\r\n?/g, "\n").trim();
  const rawParagraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const source = rawParagraphs.length > 0 ? rawParagraphs : [normalized];

  const paragraphs: string[][] = [];
  const sentences: FlatSentence[] = [];

  source.forEach((paragraph, paragraphIndex) => {
    let sentenceTexts = splitParagraphIntoSentences(paragraph);
    if (sentenceTexts.length === 0) sentenceTexts = [paragraph];
    paragraphs.push(sentenceTexts);
    sentenceTexts.forEach((text) => sentences.push({ text, paragraphIndex }));
  });

  return { paragraphs, sentences };
}

export function estimateWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
