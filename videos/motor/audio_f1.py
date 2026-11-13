import json, numpy as np, wave
SR = 44100; ev = json.load(open('events_f1.json')); rng = np.random.default_rng(3)
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR); m = ((f >= lo) & (f <= hi)).astype(float); m = np.convolve(m, np.ones(200)/200, mode='same'); return np.fft.irfft(X*m, n=len(x))
for id, e in ev.items():
    n = int(e['total']*SR); t = np.arange(n)/SR; mix = np.zeros(n)
    crowd = band(rng.standard_normal(n), 300, 2500); crowd /= np.abs(crowd).max(); mix += crowd*0.06
    # engine layer
    f0 = np.full(n, 160.0); amp = np.zeros(n)
    for a, b, lvl, kind in e['engine']:
        i0, i1 = int(a*SR), min(n, int(b*SR)); tl = t[i0:i1]-a
        if kind == 'pass': f0[i0:i1] = 230 + 70*np.sin(2*np.pi*tl/2.6) + 25*np.sin(2*np.pi*tl*0.9)
        elif kind == 'launch': f0[i0:i1] = 120 + np.minimum(tl*90, 330) - 60*((tl*1.4) % 1 > 0.85)
        else: f0[i0:i1] = 200 + 140*np.abs(np.sin(2*np.pi*tl*0.7))
        amp[i0:i1] = lvl
    amp = np.convolve(amp, np.ones(4410)/4410, mode='same')
    ph = 2*np.pi*np.cumsum(f0)/SR
    eng = sum(np.sin(k*ph)/k**0.8 for k in range(1, 9)) + 0.3*np.sign(np.sin(ph))
    eng = eng/np.abs(eng).max()
    passenv = 0.55 + 0.45*np.sin(2*np.pi*t/2.6)**2
    mix += eng*amp*0.13*passenv
    renv = np.zeros(n); roar = band(rng.standard_normal(n), 300, 4000); roar /= np.abs(roar).max()
    for tt, a in e['roars']: renv = np.maximum(renv, np.clip((t-tt+0.15)/0.35, 0, 1)*np.exp(-np.clip(t-tt-0.2, 0, None)/2.0)*0.35*a)
    mix += roar*renv
    for tt in e['booms']:
        i = int(tt*SR); L = min(int(2.5*SR), n-i); tl = np.arange(L)/SR
        nb = band(rng.standard_normal(L), 20, 900); nb /= np.abs(nb).max()
        mix[i:i+L] += (nb*0.9*np.exp(-tl*2.2) + np.sin(2*np.pi*(38+50*np.exp(-tl*10))*tl)*np.exp(-tl*2.5)*0.8)
    for tt in e['cuts']:
        i = int(tt*SR); L = min(int(1.0*SR), n-i); tl = np.arange(L)/SR
        mix[i:i+L] += np.sin(2*np.pi*(42+60*np.exp(-tl*18))*tl)*np.exp(-tl*4)*0.45
    beat = 0.6
    for k in range(int(e['total']/beat)):
        i = int(k*beat*SR); L = int(0.3*SR)
        if i+L > n: break
        tl = np.arange(L)/SR; mix[i:i+L] += np.sin(2*np.pi*(50+90*np.exp(-tl*30))*tl)*np.exp(-tl*9)*(0.28 if k % 2 == 0 else 0.15)
    mix += (np.sin(2*np.pi*55*t)+0.5*np.sin(2*np.pi*82.4*t))*0.04
    mix *= np.clip((e['total']-t)/1.2, 0, 1)*np.clip(t/0.4, 0, 1); mix = np.tanh(mix*1.2)*0.8
    st = np.stack([mix, mix], 1); w = wave.open(f'audio/{id}_bed.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close(); print(id, 'ok')
