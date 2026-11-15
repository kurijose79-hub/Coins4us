# Chatterbox multilingüe (MIT) clonando el tono de Alex -> audio/<id>.mp3 + timing
import sys, json, numpy as np, subprocess, os, time
import torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
M = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
REF = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../muestra_em_alex.wav')
GAP, LEAD = 0.4, 0.25
S = json.load(open('scripts.json'))
for ID in sys.argv[1:]:
    if os.path.exists(f'audio/{ID}.mp3') and ID in json.load(open('timing.json')): print('skip', ID); continue  # SKIPDONE
    t0 = time.time(); sr = M.sr; parts = [np.zeros(int(LEAD * sr))]; segs = []; t = LEAD
    for ln in S[ID]:
        a = M.generate(ln, language_id='es', audio_prompt_path=REF, exaggeration=0.55, cfg_weight=0.5).squeeze().numpy()
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 400): nz[-1] + 1600] if len(nz) else a
        d = len(a) / sr; segs.append({'text': ln, 'start': round(t, 2), 'end': round(t + d, 2)}); parts += [a, np.zeros(int(GAP * sr))]; t += d + GAP
    au = np.concatenate(parts).astype(np.float32); ta.save(f'audio/{ID}.wav', torch.from_numpy(au).unsqueeze(0), sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'audio/{ID}.wav', '-ar', '44100', '-b:a', '192k', f'audio/{ID}.mp3'], check=True)
    T = json.load(open('timing.json')); T[ID] = {'dur': round(t, 2), 'segs': segs, 'voice': 'chatterbox_alex'}; json.dump(T, open('timing.json', 'w'), ensure_ascii=False, indent=1)
    print(ID, round(t, 1), 's audio,', round(time.time() - t0), 's cpu', flush=True)
