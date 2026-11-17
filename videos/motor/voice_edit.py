# Voz (Chatterbox, tono Alex) sobre los edits 3D: una línea por toma + cierre, mezclada sobre el beat.
import sys, json, os, subprocess, numpy as np, torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
M = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
REF = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../muestra_em_alex.wav')
VD = '/home/user/Coins4us/videos/edits_cuadrada'
T = json.load(open('timing.json'))
import re
def nice(s):
    s = re.sub(r'(\d+)-(\d+)', r'\1 a \2', s.replace('\n', ' ')).strip().lower()
    return s[:1].upper() + s[1:]
for ID in sys.argv[1:]:
    VD = '/home/user/Coins4us/videos/edits_cuadrada' if os.path.exists(f'/home/user/Coins4us/videos/edits_cuadrada/{ID}.mp4') else '/home/user/Coins4us/videos/edits_fut'
    src = f'{VD}/{ID}.mp4'
    if not os.path.exists(src) or os.path.exists(f'{VD}/{ID}.voz'): print('skip', ID); continue
    segs = T[ID]['segs']; sr = M.sr; total = T[ID]['dur'] + 0.8
    out = np.zeros(int((total + 1) * sr), np.float32); prev = 0.0
    for i, s in enumerate(segs):
        txt = s['text'].strip() or ('Síguenos para la parte dos.' if i == len(segs) - 1 else '')
        if not txt: continue
        a = M.generate(nice(txt), language_id='es', audio_prompt_path=REF, exaggeration=0.35, cfg_weight=0.3).squeeze().numpy()
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 300): nz[-1] + 1200] if len(nz) else a
        st = max(s['start'] + 0.05, prev + 0.08); i0 = int(st * sr); i1 = min(len(out), i0 + len(a))
        out[i0:i1] += a[:i1 - i0]; prev = st + len(a) / sr
    ta.save(f'audio/{ID}_voz.wav', torch.from_numpy(out).unsqueeze(0), sr)
    tmp = f'{VD}/{ID}.tmpv.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-i', f'audio/{ID}_voz.wav', '-filter_complex',
        '[0:a]volume=0.28[b];[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,equalizer=f=3000:t=q:w=1:g=2,volume=1.7[v];[b][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]',
        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tmp], check=True)
    os.replace(tmp, src); open(f'{VD}/{ID}.voz', 'w').write('ok')
    print('voz', ID, flush=True)
