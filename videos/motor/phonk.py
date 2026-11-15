# beat estilo "aura"/phonk: cowbell melódico, 808 distorsionado, hats rápidos, ~140 BPM
import numpy as np, wave, sys
SR=44100; BPM=float(sys.argv[2]) if len(sys.argv)>2 else 140; B=60/BPM; dur=float(sys.argv[1]); n=int(dur*SR)
rng=np.random.default_rng(int(BPM)); m=np.zeros(n)
def add(i,s,g=1):
    i=int(i); 
    if i>=n: return
    L=min(len(s),n-i); m[i:i+L]+=s[:L]*g
t=lambda L: np.arange(L)/SR
def cowbell(f):
    L=int(.22*SR); x=t(L); s=(np.sign(np.sin(2*np.pi*f*x))+np.sign(np.sin(2*np.pi*f*1.48*x)))*0.5
    return s*np.exp(-x*14)
def b808(f,ln):
    L=int(ln*SR); x=t(L); fr=f*(1+1.5*np.exp(-x*30)); s=np.sin(2*np.pi*np.cumsum(fr)/SR); return np.tanh(s*4)*np.exp(-x*1.6)
def kick(): L=int(.3*SR); x=t(L); return np.sin(2*np.pi*np.cumsum(50+120*np.exp(-x*35))/SR)*np.exp(-x*9)
def snare(): L=int(.25*SR); x=t(L); return (rng.standard_normal(L)*.8+np.sin(2*np.pi*200*x)*.4)*np.exp(-x*16)
def hat(): L=int(.04*SR); s=np.diff(np.r_[0,rng.standard_normal(L)]); return s*np.exp(-t(L)*90)*.3
mel=[0,3,7,10,7,3,5,3, 0,3,7,12,10,7,5,3]; root=277.2  # C#
bass=[69.3,69.3,61.7,65.4]
nb=int(dur/B*4)+1
for k in range(nb):
    s16=k*B/4*SR; beat=k//4
    if k%2==0: add(s16,cowbell(root*2**(mel[(k//2)%16]/12)),.32)
    add(s16,hat(),.9 if k%4 else .5)
    if k%4==0 and beat%2==0: add(s16,kick(),.9)
    if k%8==4: add(s16,snare(),.6)
    if k%16==0: add(s16,b808(bass[(k//16)%4],B*3.6),.75)
m=np.tanh(m*1.3); m/=np.abs(m).max()+1e-9; m*=0.85
w=wave.open(sys.argv[3],'w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
