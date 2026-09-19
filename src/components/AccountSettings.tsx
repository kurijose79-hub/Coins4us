import { useMemo, useState } from "react";
import type { AppSettings, VoicePrefs } from "../types/book";
import { LANGUAGES } from "../data/languages";
import { useVoices } from "../hooks/useVoices";

interface AccountSettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  prefs: VoicePrefs;
  onPrefsChange: (prefs: VoicePrefs) => void;
}

const CONNECTIONS = [
  { id: "kindle", label: "Kindle", icon: "📖" },
  { id: "google-books", label: "Google Books", icon: "📗" },
  { id: "drive", label: "Google Drive", icon: "🗂️" },
];

export function AccountSettings({
  settings,
  onSettingsChange,
  prefs,
  onPrefsChange,
}: AccountSettingsProps) {
  const [voiceLanguage, setVoiceLanguage] = useState(settings.uiLanguage);
  const voices = useVoices();
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const filteredVoices = useMemo(
    () => voices.filter((v) => v.lang.toLowerCase().startsWith(voiceLanguage)),
    [voices, voiceLanguage],
  );
  const selectedLanguage = LANGUAGES.find((l) => l.code === voiceLanguage);

  function previewVoice(voiceURI?: string) {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      selectedLanguage?.sample ?? "Esta es una muestra de esta voz.",
    );
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) utterance.voice = voice;
    utterance.rate = prefs.rate;
    utterance.pitch = prefs.pitch;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">Idioma</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Elige tu idioma preferido para la app y para filtrar voces en el Lab de voz.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSettingsChange({ ...settings, uiLanguage: lang.code });
                setVoiceLanguage(lang.code);
              }}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                settings.uiLanguage === lang.code
                  ? "border-amber-400 bg-amber-50 font-medium text-neutral-900"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span aria-hidden>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">Lab de voz</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Elige y previsualiza una de las voces instaladas en tu navegador o sistema operativo
          para usarla como predeterminada al escuchar tus audiolibros.
        </p>

        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm text-neutral-600">Filtrar por idioma:</label>
          <select
            value={voiceLanguage}
            onChange={(e) => setVoiceLanguage(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {!supported ? (
          <p className="text-sm text-red-500">
            Tu navegador no soporta síntesis de voz (Web Speech API).
          </p>
        ) : filteredVoices.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No hay voces instaladas para este idioma en tu dispositivo. Se usará la voz
            predeterminada del sistema.
          </p>
        ) : (
          <ul className="mb-4 flex flex-col gap-2">
            {filteredVoices.map((voice) => (
              <li
                key={voice.voiceURI}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  prefs.voiceURI === voice.voiceURI
                    ? "border-amber-400 bg-amber-50"
                    : "border-neutral-200"
                }`}
              >
                <div>
                  <p className="font-medium text-neutral-800">{voice.name}</p>
                  <p className="text-xs text-neutral-400">{voice.lang}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => previewVoice(voice.voiceURI)}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium hover:bg-neutral-50"
                  >
                    ▶ Probar
                  </button>
                  <button
                    onClick={() => onPrefsChange({ ...prefs, voiceURI: voice.voiceURI })}
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${
                      prefs.voiceURI === voice.voiceURI
                        ? "bg-amber-400 text-neutral-950"
                        : "bg-neutral-900 text-white hover:bg-neutral-700"
                    }`}
                  >
                    {prefs.voiceURI === voice.voiceURI ? "Seleccionada" : "Usar esta voz"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-neutral-500">
              Velocidad predeterminada: {prefs.rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={prefs.rate}
              onChange={(e) => onPrefsChange({ ...prefs, rate: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-neutral-500">
              Tono predeterminado: {prefs.pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={prefs.pitch}
              onChange={(e) => onPrefsChange({ ...prefs, pitch: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-neutral-300 bg-white/60 p-5">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">Clonar tu voz</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Grabar un video tuyo leyendo un texto para crear una voz personalizada requiere un
          servicio de clonación de voz por IA (como ElevenLabs) conectado por API — esto no se
          puede hacer solo en el navegador. Todavía no hay una API conectada en esta app.
        </p>
        <button
          disabled
          className="cursor-not-allowed rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500"
        >
          Próximamente — requiere conectar una API de voz
        </button>
      </section>

      <section className="rounded-xl border border-dashed border-neutral-300 bg-white/60 p-5">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">Conectar apps</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Conectar cuentas externas (Kindle, Google Books, Drive) requiere autorización OAuth con
          un backend, que esta app todavía no tiene configurado.
        </p>
        <div className="flex flex-wrap gap-2">
          {CONNECTIONS.map((c) => (
            <button
              key={c.id}
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500"
            >
              <span aria-hidden>{c.icon}</span>
              Conectar {c.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
