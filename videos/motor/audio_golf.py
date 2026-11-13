import json, numpy as np, wave
SR = 44100; T = json.load(open('timing.json')); rng = np.random.default_rng(5)
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR); m = ((f >= lo) & (f <= hi)).astype(float); m = np.convolve(m, np.ones(200)/200, mode='same'); return np.fft.irfft(X*m, n=len(x))
def pluck(freq, dur, amp=0.3):
    N = int(SR/freq); buf = rng.uniform(-1, 1, N); out = np.zeros(int(dur*SR))
    for i in range(len(out)): out[i] = buf[i % N]; buf[i % N] = 0.5*(buf[i % N] + buf[(i+1) % N])*0.996
    return out*amp
def add(mix, i, s):
    if i >= len(mix): return
    L = min(len(s), len(mix)-i); mix[i:i+L] += s[:L]
def save(name, mix):
    st = np.stack([mix, mix], 1); w = wave.open(f'audio/{name}_bed.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close(); print(name, 'ok')
def starts(id): return [s['start']-0.15 for s in T[id]['segs']][1:]
# ---- g2d: cheerful pluck loop
tot = T['g2d']['dur'] + 0.8; n = int(tot*SR); t = np.arange(n)/SR; mix = np.zeros(n)
chords = [[261.6, 329.6, 392.0], [196.0, 246.9, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 349.2]]
beat = 60/104; cache = {}
for k in range(int(tot/(beat/2))):
    ch = chords[(k//8) % 4]; f = ch[k % 3] * (2 if k % 4 == 3 else 1)
    if f not in cache: cache[f] = pluck(f, 0.6, 0.16)
    add(mix, int(k*beat/2*SR), cache[f])
for k in range(int(tot/beat)):
    L = int(0.25*SR); tl = np.arange(L)/SR; add(mix, int(k*beat*SR), np.sin(2*np.pi*(55+70*np.exp(-tl*35))*tl)*np.exp(-tl*12)*(0.22 if k % 2 == 0 else 0.0))
    if k % 2 == 1: add(mix, int(k*beat*SR), band(rng.standard_normal(int(0.1*SR)), 3000, 9000)*np.exp(-np.arange(int(0.1*SR))/SR*40)*0.05)
for tt in starts('g2d'):
    L = int(0.25*SR); tl = np.arange(L)/SR; add(mix, int((tt+0.1)*SR), np.sin(2*np.pi*(500+700*tl*4)*tl)*np.exp(-tl*18)*0.18)
for si in [5, 6, 7]:  # bird chirps
    t0 = T['g2d']['segs'][si]['start']
    for c in range(6):
        L = int(0.09*SR); tl = np.arange(L)/SR; f0 = 2600 + 900*np.sin(c)
        add(mix, int((t0 + 0.3 + c*0.35)*SR), np.sin(2*np.pi*(f0 + 1500*tl/0.09)*tl)*np.sin(np.pi*tl/0.09)*0.07)
t8 = T['g2d']['segs'][8]['start']
L = int(2.5*SR); tl = np.arange(L)/SR; add(mix, int((t8+1.2)*SR), band(rng.standard_normal(L), 300, 3500)*np.clip(tl/0.3, 0, 1)*np.exp(-tl*1.2)*0.08)
mix *= np.clip((tot-t)/1.0, 0, 1)*np.clip(t/0.3, 0, 1); save('g2d', np.tanh(mix*1.3)*0.8)
# ---- g3d: wind + cinematic
tot = T['g3d']['dur'] + 0.8; n = int(tot*SR); t = np.arange(n)/SR; mix = np.zeros(n)
wind = band(rng.standard_normal(n), 80, 900); wind /= np.abs(wind).max(); mix += wind*0.07*(0.7+0.3*np.sin(2*np.pi*t*0.15))
pad = sum(np.sin(2*np.pi*f*t)*a for f, a in [(55, 0.05), (82.4, 0.035), (110, 0.025), (164.8, 0.015)]); mix += pad*(0.6+0.4*np.sin(2*np.pi*t/8))
segs = T['g3d']['segs']; st = [0] + starts('g3d')
for tt in st[1:]:
    L = int(1.2*SR); tl = np.arange(L)/SR; add(mix, int(tt*SR), np.sin(2*np.pi*(40+60*np.exp(-tl*18))*tl)*np.exp(-tl*3.5)*0.5)
d4 = st[5]-st[4]; imp = st[4] + (0.15+0.8*0.62)*d4
L = int(0.5*SR); tl = np.arange(L)/SR; add(mix, int((imp-0.35)*SR), band(rng.standard_normal(L), 400, 4000)*np.sin(np.pi*tl/0.5)**2*0.25)
L = int(0.3*SR); tl = np.arange(L)/SR; add(mix, int(imp*SR), (band(rng.standard_normal(L), 1500, 8000)*0.8 + np.sin(2*np.pi*1800*tl)*0.3)*np.exp(-tl*40)*0.9)
L = int(5*SR); tl = np.arange(L)/SR; add(mix, int((imp+0.1)*SR), band(rng.standard_normal(L), 600, 3000)*np.exp(-tl*1.0)*0.05)
d6 = st[7]-st[6]; ent = st[6] + 0.85*d6
for k, f in enumerate([2400, 1800]):
    L = int(0.12*SR); tl = np.arange(L)/SR; add(mix, int((ent+k*0.09)*SR), np.sin(2*np.pi*f*tl)*np.exp(-tl*35)*0.35)
L = int(4*SR); tl = np.arange(L)/SR; add(mix, int((ent+0.1)*SR), band(rng.standard_normal(L), 300, 4000)*np.clip(tl/0.4, 0, 1)*np.exp(-tl*0.8)*0.3)
for k in range(int(tot/0.6)):
    if k*0.6 < st[4]: continue
    L = int(0.3*SR); tl = np.arange(L)/SR; add(mix, int(k*0.6*SR), np.sin(2*np.pi*(50+90*np.exp(-tl*30))*tl)*np.exp(-tl*9)*(0.22 if k % 2 == 0 else 0.12))
mix *= np.clip((tot-t)/1.2, 0, 1)*np.clip(t/0.4, 0, 1); save('g3d', np.tanh(mix*1.2)*0.8)
