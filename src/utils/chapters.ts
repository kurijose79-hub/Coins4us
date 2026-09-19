import type { ParsedBook } from "./parseBookText";

export interface Chapter {
  title: string;
  startIndex: number;
}

const CHAPTER_REGEX =
  /^(cap[ií]tulo|chapter|chapitre|capitolo|kapitel|hoofdstuk)\b/i;

export function detectChapters(parsed: ParsedBook): Chapter[] {
  const chapters: Chapter[] = [];
  let sentenceIndex = 0;

  for (const paragraphSentences of parsed.paragraphs) {
    const firstSentence = (paragraphSentences[0] ?? "").trim();
    const looksLikeHeading =
      paragraphSentences.length <= 2 &&
      firstSentence.length < 80 &&
      CHAPTER_REGEX.test(firstSentence);

    if (looksLikeHeading) {
      chapters.push({ title: firstSentence, startIndex: sentenceIndex });
    }
    sentenceIndex += paragraphSentences.length;
  }

  if (chapters.length === 0) {
    chapters.push({ title: "Capítulo 1", startIndex: 0 });
  }

  return chapters;
}

export function findChapterIndex(chapters: Chapter[], sentenceIndex: number): number {
  let result = 0;
  chapters.forEach((chapter, i) => {
    if (sentenceIndex >= chapter.startIndex) result = i;
  });
  return result;
}
