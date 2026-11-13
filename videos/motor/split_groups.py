import json, subprocess, re
S = json.load(open('scripts.json')); TM = json.load(open('timing.json'))
groups = [['t01','t02','t03','t04','t05'],['t06','t07','t08','t09','t10'],['t11','t12','t13','t14','t15']]
for gi, gp in enumerate(groups):
    f = f'audio/tg{gi}.mp3'
    r = subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=n=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    m = re.findall(r'Duration: (\d+):(\d+):([\d.]+)', r)[0]; dur = int(m[1])*60 + float(m[2])
    sil = [(s, e) for s, e in zip(st, en) if s > 0.05 and e < dur - 0.05]
    lines = [l for k in gp for l in S[k]]
    L = [len(x) for x in lines]; tot = sum(L); cum = 0; exp = []
    for l in L[:-1]: cum += l; exp.append(cum / tot * dur)
    # stronger prior: boundaries between videos prefer long silences
    n, M = len(exp), len(sil); INF = 1e18
    dp = [[INF]*(M+1) for _ in range(n+1)]; ch = [[0]*(M+1) for _ in range(n+1)]
    for j in range(M+1): dp[0][j] = 0
    for i in range(1, n+1):
        for j in range(1, M+1):
            dp[i][j] = dp[i][j-1]; ch[i][j] = 0
            s, e = sil[j-1]; c = dp[i-1][j-1] + abs((s+e)/2 - exp[i-1]) - 4*(e-s)
            if c < dp[i][j]: dp[i][j] = c; ch[i][j] = 1
    sel = []; i, j = n, M
    while i > 0:
        if ch[i][j]: sel.append(sil[j-1]); i -= 1
        j -= 1
    sel.reverse()
    starts = [en[0] if st and st[0] < 0.05 else 0.0] + [e for s, e in sel]; ends = [s for s, e in sel] + [dur]
    for vi, k in enumerate(gp):
        a, b = 7*vi, 7*vi + 6
        cut0 = 0.0 if vi == 0 else (sel[a-1][0] + sel[a-1][1]) / 2 + 0.05
        cut1 = dur if vi == len(gp)-1 else (sel[b][0] + sel[b][1]) / 2
        cut0 = max(0, starts[a] - 0.15) if vi > 0 else 0.0
        cut1 = min(dur, ends[b] + 0.35)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',f'{cut0:.3f}','-to',f'{cut1:.3f}','-i',f,'-c:a','libmp3lame','-q:a','2',f'audio/{k}.mp3'], check=True)
        segs = [{'text': lines[a+q], 'start': round(starts[a+q]-cut0, 3), 'end': round(ends[a+q]-cut0, 3)} for q in range(7)]
        TM[k] = {'dur': round(cut1-cut0, 3), 'segs': segs}
        print(k, round(cut1-cut0,2), [(s['start'], s['end']) for s in segs][:7])
json.dump(TM, open('timing.json','w'), ensure_ascii=False, indent=1)
