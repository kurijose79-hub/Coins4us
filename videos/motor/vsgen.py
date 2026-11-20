import json,re
def tm(name,abbr,shirt,shorts,num,alt=None):
    return {"name":name,"abbr":abbr,"shirt":shirt,"alt":alt or shirt,"shorts":shorts,"socks":shorts,"num":num,"numStroke":num,"keeper":"#222222"}
def vs(big,vals,win,sc,clock,**k):
    d={"type":"versus","bigY":520,"vals":vals,"win":win,"big":big,"bigSize":k.pop('bs',110),"score":sc,"clock":clock}
    if 'noBars' not in k: d["countUp"]=True
    d.update(k); return d
def S(a,b): return [[0,a],[0.6,b]]
V={}; L={}
V['vtj']={"sport":"soccer","label":"¿QUIÉN ES MEJOR?","series":"TIGER VS JACK · 3D","teams":[tm("Tiger","TIGER","#c8102e","#111111","#c8102e"),tm("Jack","JACK","#f2c200","#2d6a4f","#f2c200")],
 "numbers":[[1,2,3,4,5,6,7,8,9,10,11]]*2,"crowd":["#c8102e","#111111","#f2c200","#2d6a4f"],"confetti":["#c8102e","#f2c200","#ffffff","#2d6a4f"],
 "shots":[vs("TIGER vs JACK",[1,1],None,[0,0],"LOS NÚMEROS",noBars=True,bs=130,r0=20,r1=13),
  vs("MAJORS",[15,18],1,S([0,0],[0,1]),"RONDA 1",bs=130),
  vs("VICTORIAS\nPGA TOUR",[82,73],0,S([0,1],[1,1]),"RONDA 2",a0=0.3,a1=-0.2),
  vs("CHAQUETAS VERDES\n(MASTERS)",[5,6],1,S([1,1],[1,2]),"RONDA 3",bs=95),
  vs("2º LUGAR\nEN MAJORS",[7,19],1,S([1,2],[1,3]),"RONDA 4",a0=-0.3,a1=0.2),
  vs("CORTES SEGUIDOS",[142,105],0,S([1,3],[2,3]),"RONDA 5",bs=100),
  vs("4 MAJORS SEGUIDOS\n(TIGER SLAM)",[1,1],0,S([2,3],[3,3]),"RONDA 6",noBars=True,bs=95,a0=0.5,a1=0.3,r0=13,r1=11),
  vs([[0,None],[0.1,"¡EMPATE!"]],[3,3],2,[3,3],"FINAL",txt=["3","3"],confetti=True,bs=170,r0=20,r1=15),
  {"type":"outro"}]}
L['vtj']=["¿Quién es el mejor golfista de la historia: Tiger Woods o Jack Nicklaus? Vamos con los números.",
 "Majors: Jack, dieciocho. Tiger, quince.","Victorias en el PGA Tour: Tiger, ochenta y dos. Jack, setenta y tres.",
 "Chaquetas verdes del Masters: Jack, seis. Tiger, cinco.","Segundos lugares en majors: Jack, diecinueve. Tiger, siete.",
 "Cortes seguidos: Tiger, ciento cuarenta y dos. Jack, ciento cinco.","Tiger ganó cuatro majors seguidos: el Tiger Slam. Jack nunca lo logró.",
 "Tres a tres. Empate total.","¿Tiger o Jack? Comenta con un tigre… o con un oso dorado."]
V['vnf']={"sport":"soccer","label":"¿QUIÉN ES MEJOR?","series":"NADAL VS FEDERER · 3D","teams":[tm("Nadal","NADAL","#f28c28","#ffffff","#f28c28"),tm("Federer","FEDERER","#ffffff","#c8102e","#ffffff")],
 "numbers":[[1,2,3,4,5,6,7,8,9,10,11]]*2,"crowd":["#f28c28","#ffffff","#c8102e","#2a5a3a"],"confetti":["#f28c28","#ffd700","#ffffff","#c8102e"],
 "shots":[vs("NADAL vs FEDERER",[1,1],None,[0,0],"LOS NÚMEROS",noBars=True,bs=115,r0=20,r1=13),
  vs("GRAND SLAMS",[22,20],0,S([0,0],[1,0]),"RONDA 1",bs=120),
  vs("WIMBLEDON",[2,8],1,S([1,0],[1,1]),"RONDA 2",bs=130,a0=0.3,a1=-0.2),
  vs("ROLAND GARROS",[14,1],0,S([1,1],[2,1]),"RONDA 3",bs=115),
  vs("TÍTULOS",[92,103],1,S([2,1],[2,2]),"RONDA 4",bs=130,a0=-0.3,a1=0.2),
  vs("SEMANAS\nNÚMERO 1",[209,310],1,S([2,2],[2,3]),"RONDA 5"),
  vs("CARA A CARA",[24,16],0,S([2,3],[3,3]),"RONDA 6",bs=120,a0=0.3,a1=-0.3),
  vs("ORO OLÍMPICO\nINDIVIDUAL",[1,0],0,S([3,3],[4,3]),"RONDA 7",noBars=True,bs=100,a0=-0.5,a1=-0.3,r0=13,r1=11),
  vs([[0,None],[0.1,"¡NADAL 4-3!"]],[4,3],0,[4,3],"FINAL",txt=["4","3"],confetti=True,bs=150,r0=20,r1=15),
  {"type":"outro"}]}
L['vnf']=["¿Quién es mejor: Rafa Nadal o Roger Federer? Vamos con los números.",
 "Grand Slams: Nadal, veintidós. Federer, veinte.","Wimbledon: Federer, ocho. Nadal, dos.","Roland Garros: Nadal, catorce. Federer, uno.",
 "Títulos en su carrera: Federer, ciento tres. Nadal, noventa y dos.","Semanas como número uno: Federer, trescientas diez. Nadal, doscientas nueve.",
 "Cara a cara: Nadal ganó veinticuatro partidos. Federer, dieciséis.","Oro olímpico en individuales: Nadal lo ganó en Pekín. Federer, nunca.",
 "Cuatro a tres. Gana Nadal… por muy poco.","¿Nadal o Federer? Comenta con un toro… o con una raqueta."]
V['vjk']={"sport":"soccer","label":"¿QUIÉN ES MEJOR?","series":"JORDAN VS KOBE · 3D","teams":[tm("Jordan","JORDAN","#ce1141","#ce1141","#ffffff"),tm("Kobe","KOBE","#fdb927","#fdb927","#552583")],
 "numbers":[[1,2,3,4,5,6,7,8,9,23,11],[1,2,3,4,5,6,7,8,9,24,11]],"crowd":["#ce1141","#000000","#fdb927","#552583"],"confetti":["#ce1141","#fdb927","#552583","#ffffff"],
 "shots":[vs("JORDAN vs KOBE",[1,1],None,[0,0],"LOS NÚMEROS",noBars=True,bs=125,r0=20,r1=13),
  vs("ANILLOS",[6,5],0,S([0,0],[1,0]),"RONDA 1",bs=140),
  vs("MVP",[5,1],0,S([1,0],[2,0]),"RONDA 2",bs=150,a0=0.3,a1=-0.2),
  vs("MVP DE\nLAS FINALES",[6,2],0,S([2,0],[3,0]),"RONDA 3"),
  vs("PUNTOS",[32292,33643],1,S([3,0],[3,1]),"RONDA 4",txt=["32,292","33,643"],bs=140,a0=-0.3,a1=0.2),
  vs("ALL-STAR",[14,18],1,S([3,1],[3,2]),"RONDA 5",bs=140),
  vs("TÍTULOS DE\nMÁXIMO ANOTADOR",[10,2],0,S([3,2],[4,2]),"RONDA 6",bs=95,a0=0.3,a1=-0.3),
  vs([[0,None],[0.1,"¡JORDAN 4-2!"]],[4,2],0,[4,2],"FINAL",txt=["4","2"],confetti=True,bs=150,r0=20,r1=15),
  {"type":"outro"}]}
L['vjk']=["¿Quién es mejor: Michael Jordan o Kobe Bryant? Vamos con los números.",
 "Anillos de campeón: Jordan, seis. Kobe, cinco.","MVP de la temporada: Jordan, cinco. Kobe, uno.","MVP de las Finales: Jordan, seis. Kobe, dos.",
 "Puntos en su carrera: Kobe, treinta y tres mil seiscientos. Jordan, treinta y dos mil trescientos.","Juegos de Estrellas: Kobe, dieciocho. Jordan, catorce.",
 "Títulos de máximo anotador: Jordan, diez. Kobe, dos.","Cuatro a dos. Gana Jordan.","¿Jordan o Kobe? Comenta con un veintitrés… o con un veinticuatro."]
for k in V: assert len(V[k]['shots'])==len(L[k]),k
add="".join(f"  {k}: {json.dumps(v,ensure_ascii=False)},\n" for k,v in V.items())
for f in ['configs.js','configs.mjs']:
    s=open(f).read(); s=re.sub(r"\n  (vtj|vnf|vjk): .*", "", s)
    i=s.rstrip().rfind('};'); s=s[:i]+add+s[i:]; open(f,'w').write(s)
sj=json.load(open('scripts.json')); sj.update(L); json.dump(sj,open('scripts.json','w'),ensure_ascii=False,indent=1)
print('ok')
