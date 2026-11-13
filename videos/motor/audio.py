import json, numpy as np, wave, sys
SR = 44100
ev = json.load(open('events.json'))
rng = np.random.default_rng(7)
def lp(x, a):  # one-pole lowpass via cumulative filter
    from numpy import zeros
    y = np.empty_like(x); acc = 0.0
    # vectorized approx using scipy-less IIR: use FFT filter instead
    return y
def fft_band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR)
    m = ((f >= lo) & (f <= hi)).astype(float)
    # soft edges
    m = np.convolve(m, np.ones(200)/200, mode='same')
    return np.fft.irfft(X * m, n=len(x))
for id, e in ev.items():
    n = int(e['total'] * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    crowd = fft_band(noise, 250, 2500); crowd /= np.abs(crowd).max()
    mod = 0.75 + 0.25 * np.sin(2*np.pi*0.13*t) * np.sin(2*np.pi*0.31*t+1)
    env = np.full(n, 0.10) * mod
    roar = fft_band(rng.standard_normal(n), 300, 4000); roar /= np.abs(roar).max()
    renv = np.zeros(n)
    for tt, amp in e['roars']:
        a = np.clip((t - tt + 0.15) / 0.35, 0, 1) * np.exp(-np.clip(t - tt - 0.2, 0, None) / 2.2)
        renv = np.maximum(renv, a * 0.42 * amp)
    mix = crowd * env + roar * renv
    # cinematic hits at cuts
    for tt in e['cuts']:
        i = int(tt * SR); L = int(1.2 * SR)
        if i + L > n: L = n - i
        tl = np.arange(L) / SR
        hit = np.sin(2*np.pi*(42 + 60*np.exp(-tl*18))*tl) * np.exp(-tl*4.0) * 0.55
        mix[i:i+L] += hit
    # driving beat (low drums) 100 bpm
    bpm = 100; beat = 60 / bpm
    for k in range(int(e['total'] / beat)):
        tt = k * beat; i = int(tt * SR); L = int(0.35 * SR)
        if i + L > n: break
        tl = np.arange(L) / SR
        kick = np.sin(2*np.pi*(50 + 90*np.exp(-tl*30))*tl) * np.exp(-tl*9) * (0.32 if k % 2 == 0 else 0.18)
        mix[i:i+L] += kick
        if k % 4 == 2:
            sn = fft_band(rng.standard_normal(L), 1500, 7000) * np.exp(-tl*18) * 0.06
            mix[i:i+L] += sn
    # pulse pad
    pad = (np.sin(2*np.pi*55*t) + 0.5*np.sin(2*np.pi*82.5*t)) * 0.05 * (0.6 + 0.4*np.sin(2*np.pi*t/beat/4))
    mix += pad
    fade = np.clip((e['total'] - t) / 1.2, 0, 1) * np.clip(t / 0.4, 0, 1)
    mix *= fade
    mix = np.tanh(mix * 1.2) * 0.8
    st = np.stack([mix, mix], 1)
    w = wave.open(f'audio/{id}_bed.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
    print(id, 'ok')
