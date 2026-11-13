import json, numpy as np, wave, sys
SR = 44100; T = json.load(open('timing.json')); rng = np.random.default_rng(11)
def pluck(freq, dur, amp):
    N = int(SR/freq); buf = rng.uniform(-1, 1, N); out = np.zeros(int(dur*SR))
    for i in range(len(out)): out[i] = buf[i % N]; buf[i % N] = 0.5*(buf[i % N] + buf[(i+1) % N])*0.996
    return out*amp
def add(mix, i, s):
    if i >= len(mix) or i < 0: return
    L = min(len(s), len(mix)-i); mix[i:i+L] += s[:L]
cache = {}
chords = [[261.6, 329.6, 392.0], [196.0, 246.9, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 349.2]]
for ID in sys.argv[1:]:
    tot = T[ID]['dur'] + 0.8; n = int(tot*SR); t = np.arange(n)/SR; mix = np.zeros(n); beat = 60/104
    for k in range(int(tot/(beat/2))):
        f = chords[(k//8) % 4][k % 3] * (2 if k % 4 == 3 else 1)
        if f not in cache: cache[f] = pluck(f, 0.6, 0.15)
        add(mix, int(k*beat/2*SR), cache[f])
    for k in range(int(tot/beat)):
        L = int(0.25*SR); tl = np.arange(L)/SR
        if k % 2 == 0: add(mix, int(k*beat*SR), np.sin(2*np.pi*(55+70*np.exp(-tl*35))*tl)*np.exp(-tl*12)*0.2)
    for k in range(int(tot/0.75)):  # ball pok
        L = int(0.06*SR); tl = np.arange(L)/SR
        add(mix, int((k*0.75+0.02)*SR), (np.sin(2*np.pi*900*tl) + 0.5*rng.standard_normal(L))*np.exp(-tl*90)*0.12)
    for s in T[ID]['segs'][1:]:
        L = int(0.25*SR); tl = np.arange(L)/SR; add(mix, int((s['start']-0.05)*SR), np.sin(2*np.pi*(500+700*tl*4)*tl)*np.exp(-tl*18)*0.15)
    mix *= np.clip((tot-t)/1.0, 0, 1)*np.clip(t/0.3, 0, 1); mix = np.tanh(mix*1.3)*0.8
    st = np.stack([mix, mix], 1); w = wave.open(f'audio/{ID}_bed.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close(); print(ID, 'ok')
