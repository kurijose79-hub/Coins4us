import { useCallback, useEffect, useRef, useState } from "react";

export type PlaybackStatus = "idle" | "playing" | "paused" | "finished";

interface UseSpeechPlayerOptions {
  sentences: string[];
  initialIndex?: number;
  voiceURI?: string;
  rate: number;
  pitch: number;
  onProgress?: (index: number) => void;
}

export function useSpeechPlayer({
  sentences,
  initialIndex = 0,
  voiceURI,
  rate,
  pitch,
  onProgress,
}: UseSpeechPlayerOptions) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(initialIndex, Math.max(sentences.length - 1, 0)),
  );
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const indexRef = useRef(currentIndex);
  const continueRef = useRef(false);
  const rateRef = useRef(rate);
  const pitchRef = useRef(pitch);
  const voiceURIRef = useRef(voiceURI);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    pitchRef.current = pitch;
  }, [pitch]);
  useEffect(() => {
    voiceURIRef.current = voiceURI;
  }, [voiceURI]);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    if (!supported) return;
    function loadVoices() {
      const list = window.speechSynthesis.getVoices();
      voicesRef.current = list;
      setVoices(list);
    }
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [supported]);

  const speakFromRef = useRef<(index: number) => void>(() => {});

  const speakFrom = useCallback(
    (index: number) => {
      if (!supported) return;
      window.speechSynthesis.cancel();

      if (index >= sentences.length) {
        continueRef.current = false;
        setStatus("finished");
        return;
      }

      continueRef.current = true;
      setStatus("playing");
      setCurrentIndex(index);
      onProgressRef.current?.(index);

      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.rate = rateRef.current;
      utterance.pitch = pitchRef.current;
      const voice = voicesRef.current.find((v) => v.voiceURI === voiceURIRef.current);
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (continueRef.current) speakFromRef.current(index + 1);
      };
      utterance.onerror = () => {
        continueRef.current = false;
        setStatus("idle");
      };

      window.speechSynthesis.speak(utterance);
    },
    [sentences, supported],
  );

  useEffect(() => {
    speakFromRef.current = speakFrom;
  }, [speakFrom]);

  const play = useCallback(() => {
    if (!supported) return;
    if (status === "paused") {
      continueRef.current = true;
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }
    const startIndex = status === "finished" ? 0 : indexRef.current;
    speakFrom(startIndex);
  }, [status, speakFrom, supported]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    continueRef.current = false;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, [supported]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, sentences.length - 1));
      if (status === "playing" || status === "paused") {
        speakFrom(clamped);
      } else {
        setCurrentIndex(clamped);
        onProgressRef.current?.(clamped);
      }
    },
    [sentences.length, status, speakFrom],
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    return () => {
      continueRef.current = false;
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { supported, currentIndex, status, voices, play, pause, stop, next, prev, goTo };
}
