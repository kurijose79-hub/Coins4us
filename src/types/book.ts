export type BookSource = "txt" | "pdf" | "paste";

export interface Book {
  id: string;
  title: string;
  author?: string;
  source: BookSource;
  text: string;
  createdAt: number;
  progressIndex: number;
  voiceURI?: string;
  rate?: number;
  pitch?: number;
}

export interface VoicePrefs {
  voiceURI?: string;
  rate: number;
  pitch: number;
}
