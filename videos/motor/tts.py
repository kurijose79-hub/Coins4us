# Kokoro (gratis, Apache-2.0) por frase -> audio/<id>.mp3 + timing exacto
import sys, json, numpy as np, soundfile as sf, subprocess, os
from kokoro_onnx import Kokoro
K = Kokoro(os.path.join(os.path.dirname(__file__), '../kmodel/kokoro-v1.0.onnx'), os.path.join(os.path.dirname(__file__), '../kmodel/voices-v1.0.bin'))
VOICE, SPEED, GAP, LEAD = 'em_alex', float(os.environ.get('SPD', '0.95')), float(os.environ.get('GAP', '0.55')), 0.25
S = json.load(open('scripts.json')); T = json.load(open('timing.json'))
for ID in sys.argv[1:]:
    parts, segs, t = [np.zeros(int(LEAD * 24000))], [], LEAD
    for ln in S[ID]:
        a, sr = K.create(ln, voice=VOICE, speed=SPEED, lang='es')
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 600): nz[-1] + 1200] if len(nz) else a
        d = len(a) / sr; segs.append({'text': ln, 'start': round(t, 2), 'end': round(t + d, 2)}); parts += [a, np.zeros(int(GAP * sr))]; t += d + GAP
    au = np.concatenate(parts); sf.write(f'audio/{ID}.wav', au, 24000)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'audio/{ID}.wav', '-ar', '44100', '-b:a', '192k', f'audio/{ID}.mp3'], check=True)
    T[ID] = {'dur': round(t, 2), 'segs': segs, 'voice': 'kokoro_' + VOICE}; json.dump(T, open('timing.json', 'w'), ensure_ascii=False, indent=1)
    print(ID, round(t, 1), flush=True)
