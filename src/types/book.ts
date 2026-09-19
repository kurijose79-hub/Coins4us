export type BookSource = "txt" | "pdf" | "paste" | "public-domain";

export interface Book {
  id: string;
  title: string;
  author?: string;
  series?: string;
  source: BookSource;
  sourceNote?: string;
  text: string;
  createdAt: number;
  progressIndex: number;
}

export interface VoicePrefs {
  voiceURI?: string;
  rate: number;
  pitch: number;
}

export interface AppSettings {
  uiLanguage: string;
}
