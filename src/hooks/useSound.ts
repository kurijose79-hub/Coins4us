import { useCallback, useRef } from "react";

type Kind = "tick" | "go" | "end" | "error";

const FREQ: Record<Kind, number> = {
  tick: 440,
  go: 880,
  end: 660,
  error: 180,
};

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((kind: Kind, durationMs = 150) => {
    try {
      if (!ctxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctxRef.current = new AudioCtx();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = FREQ[kind];
      osc.type = kind === "error" ? "sawtooth" : "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + durationMs / 1000,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Web Audio unavailable; fail silently.
    }
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { play, vibrate };
}
