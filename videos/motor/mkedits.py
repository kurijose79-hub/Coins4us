import json
B=60/128  # beat
T={
 'ARG':{'name':'Argentina','abbr':'ARG','shirt':'#75aadb','stripes':'#ffffff','alt':'#75aadb','shorts':'#111111','socks':'#ffffff','num':'#111111','numStroke':'#ffffff','keeper':'#b8e04a'},
 'ENG':{'name':'Inglaterra','abbr':'ING','shirt':'#ffffff','alt':'#1d2a5b','shorts':'#1d2a5b','socks':'#ffffff','num':'#1d2a5b','numStroke':'#ffffff','keeper':'#d8322b'},
 'FRA':{'name':'Francia','abbr':'FRA','shirt':'#1d2a5b','alt':'#1d2a5b','shorts':'#ffffff','socks':'#c8102e','num':'#ffffff','numStroke':'#c8102e','keeper':'#e8d33a'},
 'RMA':{'name':'Real Madrid','abbr':'RMA','shirt':'#ffffff','alt':'#f2c200','shorts':'#ffffff','socks':'#ffffff','num':'#1c1c1c','numStroke':'#f2c200','keeper':'#2c8f45'},
 'JUV':{'name':'Juventus','abbr':'JUV','shirt':'#111111','stripes':'#ffffff','alt':'#111111','shorts':'#ffffff','socks':'#111111','num':'#ffffff','numStroke':'#111','keeper':'#e8d33a'},
 'LEV':{'name':'Leverkusen','abbr':'B04','shirt':'#e32221','alt':'#111111','shorts':'#111111','socks':'#e32221','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'BAR':{'name':'Barcelona','abbr':'BAR','shirt':'#a50044','stripes':'#004d98','alt':'#a50044','shorts':'#004d98','socks':'#a50044','num':'#f2c200','numStroke':'#111','keeper':'#e8d33a'},
 'ESP':{'name':'España','abbr':'ESP','shirt':'#c8102e','alt':'#c8102e','shorts':'#1d2a5b','socks':'#1d2a5b','num':'#f2c200','numStroke':'#111','keeper':'#e8d33a'},
 'NED':{'name':'Países Bajos','abbr':'NED','shirt':'#ff6600','alt':'#ff6600','shorts':'#ff6600','socks':'#ff6600','num':'#111111','numStroke':'#fff','keeper':'#2c8f45'},
 'MCI':{'name':'Man City','abbr':'MCI','shirt':'#6cabdd','alt':'#6cabdd','shorts':'#ffffff','socks':'#6cabdd','num':'#ffffff','numStroke':'#1c2c5b','keeper':'#e8d33a'},
 'QPR':{'name':'QPR','abbr':'QPR','shirt':'#1d5ba4','stripes':'#ffffff','alt':'#1d5ba4','shorts':'#ffffff','socks':'#ffffff','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'MEX':{'name':'México','abbr':'MEX','shirt':'#006847','alt':'#006847','shorts':'#ffffff','socks':'#c8102e','num':'#ffffff','numStroke':'#c8102e','keeper':'#e8d33a'},
 'GER':{'name':'Alemania','abbr':'GER','shirt':'#ffffff','alt':'#111111','shorts':'#111111','socks':'#ffffff','num':'#111111','numStroke':'#fff','keeper':'#2c8f45'},
 'CAZ':{'name':'Cruz Azul','abbr':'CAZ','shirt':'#1b4fa0','alt':'#1b4fa0','shorts':'#1b4fa0','socks':'#1b4fa0','num':'#ffffff','numStroke':'#c8102e','keeper':'#111111'},
 'AME':{'name':'América','abbr':'AME','shirt':'#ffd400','alt':'#ffd400','shorts':'#1c2c6b','socks':'#ffd400','num':'#1c2c6b','numStroke':'#ffffff','keeper':'#2c8f45'},
 'PER':{'name':'Perú','abbr':'PER','shirt':'#ffffff','alt':'#d91023','shorts':'#ffffff','socks':'#ffffff','num':'#d91023','numStroke':'#111','keeper':'#e8d33a'},
 'DEN':{'name':'Dinamarca','abbr':'DEN','shirt':'#c8102e','alt':'#c8102e','shorts':'#ffffff','socks':'#c8102e','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'LIV':{'name':'Liverpool','abbr':'LIV','shirt':'#c8102e','alt':'#c8102e','shorts':'#c8102e','socks':'#c8102e','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
}
G=lambda b,**k: dict(dict(type='goal',big=[[0,None],[0.62,b]],flashes=1,shake=1,shakeAt=0.62),**k)
E={
 'e01':(['ARG','ENG'],'MÉXICO 86 · CUARTOS','',[
   (4,'MÉXICO 86',dict(type='intro',big='MÉXICO 86',score=[0,0],clock="0'")),
   (4,'MARADONA',dict(type='lineup',team=0,score=[1,0],clock="55'")),
   (6,'DESDE MEDIO CAMPO',G('¡GOOOL!',team=0,idx=9,dist=34,sz=-6,score=[[0,[1,0]],[0.6,[2,0]]],clock="55'")),
   (4,'EL GOL DEL SIGLO',dict(type='celebrate',team=0,score=[2,0],clock="55'",big='EL GOL\nDEL SIGLO',bigSize=130)),
   (4,'D10S',dict(type='crowd',score=[2,1],clock='FINAL')),
   (6,'CAMPEONES DEL MUNDO',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[2,1],clock='FINAL',big=[[0,None],[0.5,'1986']])),
   (4,'',dict(type='outro'))]),
 'e02':(['ARG','FRA'],'FINAL · CATAR 2022','',[
   (4,'LA FINAL MÁS LOCA',dict(type='intro',big='CATAR 2022',score=[0,0],clock="0'")),
   (5,'2-0',G('2-0',team=0,idx=10,dist=10,sz=-3,score=[[0,[1,0]],[0.6,[2,0]]],clock="36'")),
   (5,'2-2 EN 97 SEGUNDOS',dict(type='penalty',team=1,side=-1,idx=9,outcome='goal',tz=-2.5,score=[[0,[2,0]],[0.6,[2,1]],[0.85,[2,2]]],big=[[0,None],[0.85,'2-2']],clock="81'",flashes=1,shake=1)),
   (5,'3-2 MESSI',G('3-2',team=0,idx=9,dist=6,sz=2,loft=0.2,ty=0.6,tz=-1.5,kDive=2,cam='goal',score=[[0,[2,2]],[0.6,[3,2]]],clock="108'")),
   (5,'3-3 MBAPPÉ',dict(type='penalty',team=1,side=-1,idx=9,outcome='goal',tz=2.6,ty=0.5,cam='goal',score=[[0,[3,2]],[0.6,[3,3]]],big=[[0,None],[0.62,'3-3']],clock="118'",flashes=1,shake=1)),
   (4,'EL DIBU',dict(type='save',team=1,idx=8,side=-1,cam='goal',big=[[0,None],[0.5,'¡ATAJADA!']],score=[3,3],clock="120+3'",shake=1,shakeAt=0.42)),
   (6,'¡CAMPEONES!',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=['3 (4)','3 (2)'],clock='FINAL',flashes=2,big=[[0,None],[0.45,'¡CAMPEONES!']])),
   (4,'',dict(type='outro'))]),
 'e03':(['RMA','JUV'],'CHAMPIONS · TURÍN 2018','',[
   (4,'TURÍN 2018',dict(type='intro',big='TURÍN 2018',score=[1,0],clock="64'")),
   (4,'CRISTIANO',dict(type='lineup',team=0,score=[1,0],clock="64'")),
   (6,'¡CHILENA!',dict(type='header',team=0,score=[[0,[1,0]],[0.7,[2,0]]],big=[[0,None],[0.72,'¡CHILENA!']],clock="64'",flashes=2,shake=1,shakeAt=0.7)),
   (4,'EL ESTADIO RIVAL APLAUDE',dict(type='crowd',scarf='#111111',score=[2,0],clock="64'",big='APLAUSOS',bigSize=140)),
   (4,'SIUUU',dict(type='celebrate',team=0,score=[2,0],clock="64'",noSad=True,big='SIUUU')),
   (4,'',dict(type='outro'))]),
 'e04':(['RMA','LEV'],'FINAL CHAMPIONS · GLASGOW 2002','',[
   (4,'GLASGOW 2002',dict(type='intro',big='GLASGOW 2002',score=[1,1],clock="45'")),
   (4,'ZIDANE',dict(type='lineup',team=0,score=[1,1],clock="45'")),
   (6,'DE VOLEA',G('¡VOLEA!',team=0,idx=9,dist=16,sz=3,loft=1.6,ty=2.1,tz=-2.4,kDive=2.5,score=[[0,[1,1]],[0.6,[2,1]]],clock="45'")),
   (4,'ZURDA',G('ZURDA',team=0,idx=9,dist=16,sz=3,loft=1.6,ty=2.1,tz=-2.4,kDive=2.5,cam='goal',score=[[0,[1,1]],[0.6,[2,1]]],clock="45'")),
   (6,'LA NOVENA',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[2,1],clock='FINAL',big=[[0,None],[0.45,'LA 9ª']])),
   (4,'',dict(type='outro'))]),
 'e05':(['BAR','RMA'],'BERNABÉU · 2005','',[
   (4,'BERNABÉU 2005',dict(type='intro',big='BERNABÉU',score=[0,0],clock="0'")),
   (4,'RONALDINHO',dict(type='lineup',team=0,score=[1,0],clock="58'")),
   (5,'UNO',G('¡GOL!',team=0,idx=10,dist=20,sz=-10,score=[[0,[1,0]],[0.6,[2,0]]],clock="58'")),
   (5,'Y OTRO',G('¡OTRO!',team=0,idx=10,dist=18,sz=8,tz=-2.4,kDive=2,score=[[0,[2,0]],[0.6,[3,0]]],clock="77'")),
   (5,'EL BERNABÉU DE PIE',dict(type='crowd',scarf='#ffffff',score=[3,0],clock="77'",big='DE PIE',bigSize=150)),
   (4,'OVACIÓN',dict(type='celebrate',team=0,score=[3,0],clock='FINAL',big='OVACIÓN')),
   (4,'',dict(type='outro'))]),
 'e06':(['ESP','NED'],'FINAL MUNDIAL · 2010','',[
   (4,'SUDÁFRICA 2010',dict(type='intro',big='2010',score=[0,0],clock="116'")),
   (4,'MINUTO 116',dict(type='stat',team=0,score=[0,0],clock="116'",big="116'")),
   (6,'INIESTA',G('¡INIESTA!',team=0,idx=7,dist=12,sz=-4,score=[[0,[0,0]],[0.6,[1,0]]],clock="116'")),
   (4,'DE TU CASA',dict(type='celebrate',team=0,score=[1,0],clock="116'",big='¡GOOOL!')),
   (6,'CAMPEONES',dict(type='trophy',team=0,idx=7,lift=True,confetti=True,score=[1,0],clock='FINAL',big=[[0,None],[0.45,'CAMPEONES']])),
   (4,'',dict(type='outro'))]),
 'e07':(['MCI','QPR'],'ÚLTIMA JORNADA · 2012','',[
   (4,'PERDÍAN 1-2',dict(type='intro',big='1-2',score=[1,2],clock="90'")),
   (5,'92: EMPATE',G('2-2',team=0,idx=8,dist=6,sz=1,score=[[0,[1,2]],[0.6,[2,2]]],clock="90+2'")),
   (5,'93:20',dict(type='stat',team=0,score=[2,2],clock="90+3'",big='93:20')),
   (6,'¡AGÜEROOO!',G('¡AGÜEROOO!',team=0,idx=9,dist=8,sz=-3,score=[[0,[2,2]],[0.6,[3,2]]],clock="93:20")),
   (5,'CAMPEONES POR DIFERENCIA DE GOLES',dict(type='celebrate',team=0,confetti=True,score=[3,2],clock='FINAL',big='¡CAMPEONES!',bigSize=140)),
   (4,'',dict(type='outro'))]),
 'e08':(['MEX','FRA'],'MUNDIAL 2010 · POLOKWANE','',[
   (4,'MÉXICO VS FRANCIA',dict(type='intro',big='MÉXICO\nVS FRANCIA',score=[0,0],clock="0'")),
   (4,'CHICHARITO',dict(type='lineup',team=0,score=[0,0],clock="64'")),
   (6,'MANO A MANO',G('¡CHICHARITO!',team=0,idx=9,dist=9,sz=-2,score=[[0,[0,0]],[0.6,[1,0]]],clock="64'")),
   (5,'BLANCO DE PENAL',dict(type='penalty',team=0,idx=8,outcome='goal',tz=2.4,score=[[0,[1,0]],[0.6,[2,0]]],big=[[0,None],[0.62,'2-0']],clock="79'",flashes=1,shake=1)),
   (5,'¡VIVA MÉXICO!',dict(type='crowd',scarf='#006847',score=[2,0],clock='FINAL',big='¡VIVA MÉXICO!',bigSize=120)),
   (4,'',dict(type='outro'))]),
 'e09':(['MEX','GER'],'MUNDIAL 2018 · MOSCÚ','',[
   (4,'VS EL CAMPEÓN',dict(type='intro',big='MÉXICO\nVS ALEMANIA',score=[0,0],clock="0'")),
   (4,'CONTRAGOLPE',dict(type='lineup',team=0,score=[0,0],clock="35'")),
   (6,'¡CHUCKY LOZANO!',G('¡CHUCKY!',team=0,idx=10,dist=12,sz=-5,score=[[0,[0,0]],[0.6,[1,0]]],clock="35'")),
   (5,'SISMO EN MÉXICO',dict(type='crowd',scarf='#006847',score=[1,0],clock="35'",big='¡SISMO!',bigSize=170,shake=2,shakeAt=0.3)),
   (5,'1-0 AL CAMPEÓN',dict(type='celebrate',team=0,score=[1,0],clock='FINAL',big='1-0')),
   (4,'',dict(type='outro'))]),
 'e10':(['LIV','BAR'],'SEMIFINAL CHAMPIONS · 2019','',[
   (4,'PERDÍAN 3-0',dict(type='intro',big='0-3',score=[0,0],clock="0'")),
   (5,'REMONTADA',G('1-0',team=0,idx=9,dist=6,sz=1,score=[[0,[0,0]],[0.6,[1,0]]],clock="7'")),
   (5,'2-0 · 3-0',G('3-0',team=0,idx=8,dist=10,sz=-2,score=[[0,[2,0]],[0.6,[3,0]]],clock="56'")),
   (6,'¡CÓRNER RÁPIDO!',dict(type='corner',team=0,score=[[0,[3,0]],[0.75,[4,0]]],big=[[0,None],[0.78,'4-0']],clock="79'",flashes=2,shake=1,shakeAt=0.78)),
   (5,'ANFIELD',dict(type='crowd',scarf='#c8102e',score=[4,0],clock='FINAL',big='ANFIELD',bigSize=160)),
   (4,'',dict(type='outro'))]),
 'e11':(['CAZ','AME'],'FINAL CLAUSURA 2013','',[
   (4,'FINAL CLAUSURA 2013',dict(type='intro',big='CRUZ AZUL\nVS AMÉRICA',score=[2,0],clock="85'")),
   (4,'AMÉRICA PERDÍA 2-0',dict(type='stat',team=1,score=[2,0],clock="88'",big='2-0')),
   (5,"88': MOSQUERA",G('2-1',team=1,idx=4,dist=7,sz=-2,score=[[0,[2,0]],[0.6,[2,1]]],clock="88'")),
   (4,'ÚLTIMA JUGADA',dict(type='stat',team=1,score=[2,1],clock="90+3'",big="90+3'")),
   (6,'SUBE EL PORTERO',dict(type='header',team=1,idx=0,score=[[0,[2,1]],[0.7,[2,2]]],big=[[0,None],[0.72,'¡MOISÉS!']],clock="90+3'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'¡CABEZAZO DE MOISÉS!',dict(type='header',team=1,idx=0,cam='goal',score=[[0,[2,1]],[0.7,[2,2]]],big=[[0,None],[0.72,'¡GOOOL!']],clock="90+3'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'CAMPEÓN EN PENALES',dict(type='trophy',team=1,idx=0,lift=True,confetti=True,score=['2 (2)','2 (4)'],clock='FINAL',big=[[0,None],[0.45,'¡CAMPEÓN!']])),
   (4,'',dict(type='outro'))]),
 'e12':(['CAZ','AME'],'FINAL CLAUSURA 2013','',[
   (4,'PARA DON RICHARD',dict(type='intro',big='SE ACABA HASTA\nEL ÚLTIMO MINUTO',bigSize=96,score=[2,0],clock="80'")),
   (4,"MINUTO 80: '¿YA PERDIÓ SU AMÉRICA?'",dict(type='crowd',scarf='#1b4fa0',score=[2,0],clock="80'",big="80'",bigSize=170)),
   (5,"88': MOSQUERA",G('2-1',team=1,idx=4,dist=7,sz=-2,score=[[0,[2,0]],[0.6,[2,1]]],clock="88'")),
   (6,"90+3': SUBE MOISÉS",dict(type='header',team=1,idx=0,score=[[0,[2,1]],[0.7,[2,2]]],big=[[0,None],[0.72,'¡MOISÉS!']],clock="90+3'",flashes=2,shake=1,shakeAt=0.7)),
   (6,'CAMPEÓN EN PENALES',dict(type='trophy',team=1,idx=0,lift=True,confetti=True,score=['2 (2)','2 (4)'],clock='FINAL',big=[[0,None],[0.45,'¡CAMPEÓN!']])),
   (5,'EN MEMORIA DE DON RICHARD',dict(type='crowd',scarf='#ffd400',score=['2 (2)','2 (4)'],clock='FINAL',big='POR DON\nRICHARD',bigSize=130)),
   (4,'',dict(type='outro'))]),
 'e13':(['PER','DEN'],'MUNDIAL 2018 · SARANSK','',[
   (4,'¿Y SI LE DAN QUEQUE?',dict(type='intro',big='PERÚ\nVS DINAMARCA',score=[0,0],clock="0'")),
   (4,'ADVÍNCULA',dict(type='lineup',team=0,score=[0,0],clock="60'")),
   (4,'YA ERA EL MÁS RÁPIDO',dict(type='stat',team=0,score=[0,1],clock="60'",big='TURBO')),
   (4,'+ UN QUEQUE...',dict(type='stat',team=0,score=[0,1],clock="70'",big='+ QUEQUE',bigSize=150)),
   (6,'¡ADVÍNCULA IMPARABLE!',G('¡GOOOL!',team=0,idx=2,dist=22,sz=-8,score=[[0,[0,1]],[0.6,[1,1]]],clock="70'")),
   (5,'¡Y OTRO!',G('¡OTRO!',team=0,idx=2,dist=18,sz=6,tz=-2.4,kDive=2,score=[[0,[1,1]],[0.6,[2,1]]],clock="88'")),
   (5,'PERÚ GANA EL PARTIDO',dict(type='crowd',scarf='#d91023',score=[2,1],clock='FINAL',big='¡ARRIBA PERÚ!',bigSize=120)),
   (4,'',dict(type='outro'))]),
}
cfgs={}; tim=json.load(open('timing.json'))
for k,(tm,label,_,shots) in E.items():
    t=0.0; segs=[]; out=[]
    for beats,cap,sh in shots:
        d=beats*B; segs.append({'text':cap or ' ','start':round(t,3),'end':round(t+d-0.1,3)}); t+=d; out.append(sh)
    cfgs[k]=dict(sport='soccer',label=label,teams=[T[tm[0]],T[tm[1]]],crowd=[T[tm[0]]['shirt'],'#ffffff',T[tm[1]]['shirt'],T[tm[0]]['shirt']],confetti=[T[tm[0]]['shirt'],'#ffffff','#ffd700'],series='EDITS ⚽ ¿CÓMO DEPORTES?',outroSub='+ EDITS DE FUTBOL',grade='contrast(1.15) saturate(1.35)',shots=out)
    tim[k]={'dur':round(t-0.8,3),'segs':segs,'bpm':128}
json.dump(tim,open('timing.json','w'),ensure_ascii=False,indent=1)
open('edits.js','w').write('export const CONFIGS = '+json.dumps(cfgs,ensure_ascii=False)+';\n')
print({k:round(v['dur']+0.8,1) for k,v in tim.items() if k.startswith('e') and k[1:].isdigit()})
