export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 seg";
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours > 0) return `${hours} h ${remMinutes} min`;
  if (minutes > 0) return `${minutes} min`;
  return `${Math.max(1, Math.round(totalSeconds))} seg`;
}

const AVERAGE_WORDS_PER_MINUTE = 150;

export function estimateSecondsForSentences(sentences: string[], rate: number): number {
  const words = sentences.reduce(
    (sum, sentence) => sum + sentence.trim().split(/\s+/).filter(Boolean).length,
    0,
  );
  const minutes = words / (AVERAGE_WORDS_PER_MINUTE * rate);
  return minutes * 60;
}
