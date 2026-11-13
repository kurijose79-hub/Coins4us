import json, subprocess, re
S = json.load(open('scripts.json'))
out = {}
for k, lines in S.items():
    r = subprocess.run(['ffmpeg','-hide_banner','-i',f'audio/{k}.mp3','-af','silencedetect=n=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    dur = float(re.findall(r'Duration: (\d+):(\d+):([\d.]+)', r)[0][2]) + 60*float(re.findall(r'Duration: (\d+):(\d+):([\d.]+)', r)[0][1])
    sil = [(s, e) for s, e in zip(st, en) if s > 0.05 and e < dur - 0.05]
    # expected boundaries by chars
    L = [len(x) for x in lines]; tot = sum(L); cum = 0; exp = []
    for l in L[:-1]:
        cum += l; exp.append(cum / tot * dur)
    n, m = len(exp), len(sil)
    INF = 1e18
    # dp[i][j]: best cost assigning first i boundaries using silences < j ; prefer long silences
    dp = [[INF]*(m+1) for _ in range(n+1)]; ch = [[None]*(m+1) for _ in range(n+1)]
    for j in range(m+1): dp[0][j] = 0
    for i in range(1, n+1):
        for j in range(1, m+1):
            dp[i][j] = dp[i][j-1]; ch[i][j] = ('skip',)
            s, e = sil[j-1]; mid = (s+e)/2
            c = dp[i-1][j-1] + abs(mid - exp[i-1]) - 4*(e-s)
            if c < dp[i][j]: dp[i][j] = c; ch[i][j] = ('take',)
    sel = []; i, j = n, m
    while i > 0:
        if ch[i][j][0] == 'take': sel.append(sil[j-1]); i -= 1
        j -= 1
    sel.reverse()
    segs = []
    starts = [0.0] + [e for s, e in sel]
    ends = [s for s, e in sel] + [dur]
    lead = st[0] if st and st[0] < 0.05 and en else 0
    for idx, line in enumerate(lines):
        a = starts[idx]; b = ends[idx]
        if idx == 0 and en and st[0] < 0.05: a = en[0]
        segs.append({'text': line, 'start': round(a, 3), 'end': round(b, 3)})
    out[k] = {'dur': round(dur, 3), 'segs': segs}
    print(k, dur, [(round(s['start'],2), round(s['end'],2)) for s in segs])
json.dump(out, open('timing.json', 'w'), ensure_ascii=False, indent=1)
