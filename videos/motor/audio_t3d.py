import json, numpy as np, wave, sys
SR = 44100; ev = json.load(open('events.json')); rng = np.random.default_rng(21)
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR); m = ((f >= lo) & (f <= hi)).astype(float); m = np.convolve(m, np.ones(200)/200, mode='same'); return np.fft.irfft(X*m, n=len(x))
def add(mix, i, s):
    if i >= len(mix): return
    L = min(len(s), len(mix)-i); mix[i:i+L] += s[:L]
for id in sys.argv[1:]:
    e = ev[id]; n = int(e['total']*SR); t = np.arange(n)/SR; mix = np.zeros(n)
    crowd = band(rng.standard_normal(n), 300, 2500); crowd /= np.abs(crowd).max(); mix += crowd*0.05
    for k in range(int(e['total']/0.85)):
        L = int(0.07*SR); tl = np.arange(L)/SR; add(mix, int(k*0.85*SR), (np.sin(2*np.pi*850*tl) + 0.6*rng.standard_normal(L))*np.exp(-tl*80)*0.18)
    renv = np.zeros(n); clap = band(rng.standard_normal(n), 800, 6000) * (0.6 + 0.4*np.sign(np.sin(2*np.pi*7*t)))
    for tt, a in e['roars']: renv = np.maximum(renv, np.clip((t-tt+0.1)/0.3, 0, 1)*np.exp(-np.clip(t-tt-0.2, 0, None)/1.8)*0.25*a)
    mix += clap/np.abs(clap).max()*renv
    for tt in e['cuts']:
        L = int(1.0*SR); tl = np.arange(L)/SR; add(mix, int(tt*SR), np.sin(2*np.pi*(42+60*np.exp(-tl*18))*tl)*np.exp(-tl*4)*0.4)
    mix += (np.sin(2*np.pi*65.4*t)+0.5*np.sin(2*np.pi*98*t))*0.04*(0.6+0.4*np.sin(2*np.pi*t/6))
    mix *= np.clip((e['total']-t)/1.0, 0, 1)*np.clip(t/0.3, 0, 1); mix = np.tanh(mix*1.2)*0.8
    st = np.stack([mix, mix], 1); w = wave.open(f'audio/{id}_bed.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close(); print(id, 'ok')
