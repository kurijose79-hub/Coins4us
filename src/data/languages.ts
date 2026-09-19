export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
  sample: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "es", label: "Español", flag: "🇪🇸", sample: "Esta es una muestra de esta voz leyendo en español." },
  { code: "en", label: "English", flag: "🇬🇧", sample: "This is a sample of this voice reading in English." },
  { code: "pt", label: "Português", flag: "🇵🇹", sample: "Esta é uma amostra desta voz lendo em português." },
  { code: "fr", label: "Français", flag: "🇫🇷", sample: "Ceci est un exemple de cette voix lisant en français." },
  { code: "it", label: "Italiano", flag: "🇮🇹", sample: "Questo è un esempio di questa voce che legge in italiano." },
  { code: "de", label: "Deutsch", flag: "🇩🇪", sample: "Dies ist ein Beispiel für diese Stimme beim Lesen auf Deutsch." },
  { code: "zh", label: "中文 (Mandarín)", flag: "🇨🇳", sample: "这是这个语音朗读中文的示例。" },
  { code: "ja", label: "日本語", flag: "🇯🇵", sample: "これはこの音声が日本語を読む例です。" },
  { code: "ko", label: "한국어", flag: "🇰🇷", sample: "이것은 이 음성이 한국어를 읽는 예입니다." },
  { code: "ru", label: "Русский", flag: "🇷🇺", sample: "Это пример чтения этим голосом на русском языке." },
  { code: "ar", label: "العربية", flag: "🇸🇦", sample: "هذا مثال على قراءة هذا الصوت باللغة العربية." },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", sample: "Dit is een voorbeeld van deze stem die Nederlands leest." },
];

export function getLanguageLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}
