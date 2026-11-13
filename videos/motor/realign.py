import json, subprocess, re, sys
S = json.load(open('scripts.json')); TM = json.load(open('timing.json'))
for k in sys.argv[1:]:
    f = f'audio/{k}.mp3'
    r = subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=n=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    m = re.findall(r'Duration: (\d+):(\d+):([\d.]+)', r)[0]; dur = int(m[1])*60 + float(m[2])
    t0 = en[0] if st and st[0] < 0.05 else 0.0
    tail = st[-1] if st and len(st) > len(en) else dur
    sil = [(s, e) for s, e in zip(st, en) if s > t0 + 0.2 and e < tail - 0.1]
    lines = S[k]; n = len(lines); L = [len(x) for x in lines]; rate = (tail - t0) / sum(L)
    B = [(t0, t0)] + sil  # candidate boundaries; index 0 = start
    INF = 1e18; M = len(sil)
    # dp[i][j]: lines 0..i-1 placed, boundary after line i-1 is sil j (1..M)
    dp = [[INF]*(M+1) for _ in range(n)]; par = [[-1]*(M+1) for _ in range(n)]
    def segcost(a, b, i):
        start = B[a][1]; end = B[b][0] if b <= M else tail
        d = end - start; exp = L[i] * rate
        return abs(d - exp) * 1.0 + (3.0 if d < 0.6 * exp else 0)
    dp[0][0] = 0
    for i in range(1, n):
        for j in range(1, M+1):
            best = INF
            for jp in range(0, j):
                if dp[i-1][jp] >= INF: continue
                c = dp[i-1][jp] + segcost(jp, j, i-1) - 1.5 * (B[j][1] - B[j][0])
                if c < best: best = c; par[i][j] = jp
            dp[i][j] = best
    bestj, bestc = None, INF
    for j in range(1, M+1):
        if dp[n-1][j] < INF:
            c = dp[n-1][j] + segcost(j, M+1, n-1)
            if c < bestc: bestc, bestj = c, j
    bounds = [bestj]; i = n-1; j = bestj
    while i > 1: j = par[i][j]; bounds.append(j); i -= 1
    bounds.reverse()
    starts = [t0] + [B[b][1] for b in bounds]; ends = [B[b][0] for b in bounds] + [tail]
    TM[k]['segs'] = [{'text': lines[q], 'start': round(starts[q], 3), 'end': round(ends[q], 3)} for q in range(n)]
    print(k, [(round(starts[q],2), round(ends[q],2), L[q]) for q in range(n)])
json.dump(TM, open('timing.json','w'), ensure_ascii=False, indent=1)
