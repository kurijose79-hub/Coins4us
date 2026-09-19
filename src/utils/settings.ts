import type { AppSettings } from "../types/book";

const SETTINGS_KEY = "audiolibros:settings";

const DEFAULT_SETTINGS: AppSettings = { uiLanguage: "es" };

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    // ignore malformed settings
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
