import json, numpy as np, wave, sys
SR=44100; T=json.load(open('timing.json')); C=json.loads(open('edits.js').read().split('=',1)[1].rstrip().rstrip(';'))
rng=np.random.default_rng(7)
def add(m,i,s,g=1.0):
    i=int(i)
    if i<0 or i>=len(m): return
    L=min(len(s),len(m)-i); m[i:i+L]+=s[:L]*g
def env(L,a,d): t=np.arange(L)/SR; return np.minimum(1,t/max(a,1e-4))*np.exp(-t*d)
def kick(): L=int(.35*SR); t=np.arange(L)/SR; f=45+90*np.exp(-t*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*7)
def snare(): L=int(.22*SR); t=np.arange(L)/SR; return (rng.standard_normal(L)*.7+np.sin(2*np.pi*190*t)*.5)*np.exp(-t*18)
def hat(o=False): L=int((.12 if o else .04)*SR); n=rng.standard_normal(L); n=np.diff(np.concatenate([[0],n])); return n*np.exp(-np.arange(L)/SR*(25 if o else 90))*.35
def saw(f,L): t=np.arange(L)/SR; return 2*((t*f)%1)-1
def bass(f,L): t=np.arange(L)/SR; return np.tanh(np.sin(2*np.pi*f*t)*2.2)*np.exp(-t*2.2)
def chord(fs,L): s=sum(saw(f,L)+saw(f*1.006,L) for f in fs)/len(fs)/2; k=np.ones(18)/18; s=np.convolve(s,k,'same'); return s*env(L,.005,7)
def boom(): L=int(1.2*SR); t=np.arange(L)/SR; return np.sin(2*np.pi*(38+50*np.exp(-t*6))*t)*np.exp(-t*3)+rng.standard_normal(L)*np.exp(-t*14)*.4
def whoosh(): L=int(.45*SR); n=rng.standard_normal(L); k=np.ones(40)/40; n=np.convolve(n,k,'same'); t=np.arange(L)/SR; return n*np.sin(np.pi*t/.45)**2*1.6
def roar(L): n=rng.standard_normal(L); k=np.ones(60)/60; n=np.convolve(n,k,'same'); t=np.arange(L)/SR; return n*np.minimum(1,t/.15)*np.exp(-t*.9)*2.5
def riser(L): t=np.arange(L)/SR; n=rng.standard_normal(L); k=np.ones(12)/12; n=np.convolve(n,k,'same'); return (n*.6+np.sin(2*np.pi*(200+900*(t/t[-1])**2)*t)*.3)*(t/t[-1])**2
prog=[(55,[220,261.6,329.6]),(43.65,[174.6,220,261.6]),(65.4,[261.6,329.6,392]),(49,[196,246.9,293.7])]
K,S,H,HO=kick(),snare(),hat(),hat(True)
for ID in sys.argv[1:]:
    tm=T[ID]; tot=tm['dur']+0.8; n=int(tot*SR); m=np.zeros(n); B=60/tm['bpm']; nb=int(tot/B)
    segs=tm['segs']; shots=C[ID]['shots']
    intro_end=segs[1]['start'] if len(segs)>1 else 2*B
    for b in range(nb):
        t0=b*B; full=t0>=intro_end-1e-3 and shots[min(len(shots)-1,[i for i,s in enumerate(segs) if s['start']<=t0+1e-3][-1])]['type']!='outro'
        root,ch=prog[(b//4)%4]
        if full:
            add(m,t0*SR,K,.9)
            if b%2==1: add(m,t0*SR,S,.55)
            for h in range(2): add(m,(t0+h*B/2)*SR,HO if h==1 and b%4==3 else H,.5)
            if b%2==0: add(m,t0*SR,bass(root,int(B*2*SR)),.45)
        else:
            add(m,t0*SR,H,.3)
        add(m,(t0+B/2)*SR,chord(ch,int(B*.45*SR)),.22 if full else .14)
    for i,s in enumerate(segs):
        if i>0: add(m,(s['start']-.3)*SR,whoosh(),.25); add(m,s['start']*SR,boom(),.5)
        st=shots[i]['type']
        if st in('goal','penalty','header','corner'):
            d=(segs[i+1]['start'] if i+1<len(segs) else tot)-s['start']; tg=s['start']+d*(0.72 if st in('header','corner') else 0.62)
            add(m,(tg-2*B)*SR,riser(int(2*B*SR)),.35); add(m,tg*SR,boom(),.8); add(m,tg*SR,roar(int(3*SR)),.5)
        if st in('crowd','celebrate','trophy'): add(m,s['start']*SR,roar(int(d*SR if False else 2.5*SR)),.35)
    t=np.arange(n)/SR; m*=np.clip((tot-t)/0.6,0,1); m=np.tanh(m*1.1)*.85
    st=np.stack([m,m],1); w=wave.open(f'audio/{ID}_bed.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close(); print(ID,'ok',round(tot,1))
