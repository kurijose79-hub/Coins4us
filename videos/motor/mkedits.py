import json
B=60/128  # beat
T={
 'ARG':{'name':'Argentina','abbr':'ARG','shirt':'#75aadb','stripes':'#ffffff','alt':'#75aadb','shorts':'#111111','socks':'#ffffff','num':'#111111','numStroke':'#ffffff','keeper':'#b8e04a'},
 'ENG':{'name':'Inglaterra','abbr':'ING','shirt':'#ffffff','alt':'#1d2a5b','shorts':'#1d2a5b','socks':'#ffffff','num':'#1d2a5b','numStroke':'#ffffff','keeper':'#d8322b'},
 'FRA':{'name':'Francia','abbr':'FRA','shirt':'#1d2a5b','alt':'#1d2a5b','shorts':'#ffffff','socks':'#c8102e','num':'#ffffff','numStroke':'#c8102e','keeper':'#e8d33a'},
 'RMA':{'name':'Real Madrid','abbr':'RMA','shirt':'#ffffff','alt':'#f2c200','shorts':'#ffffff','socks':'#ffffff','num':'#1c1c1c','numStroke':'#f2c200','keeper':'#2c8f45'},
 'JUV':{'name':'Juventus','abbr':'JUV','shirt':'#111111','stripes':'#ffffff','alt':'#111111','shorts':'#ffffff','socks':'#111111','num':'#ffffff','numStroke':'#111','keeper':'#e8d33a'},
 'ITA':{'name':'Italia','abbr':'ITA','shirt':'#1f5fbf','alt':'#1f5fbf','shorts':'#ffffff','socks':'#1f5fbf','num':'#ffffff','numStroke':'#1d2a5b','keeper':'#e8d33a'},
 'BAY':{'name':'Bayern','abbr':'FCB','shirt':'#dc052d','alt':'#dc052d','shorts':'#dc052d','socks':'#dc052d','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'WOB':{'name':'Wolfsburgo','abbr':'WOB','shirt':'#65b32e','alt':'#65b32e','shorts':'#ffffff','socks':'#65b32e','num':'#ffffff','numStroke':'#111','keeper':'#e8d33a'},
 'TUR':{'name':'Turquía','abbr':'TUR','shirt':'#e30a17','alt':'#e30a17','shorts':'#ffffff','socks':'#e30a17','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'KOR':{'name':'Corea del Sur','abbr':'KOR','shirt':'#c8102e','alt':'#c8102e','shorts':'#1d2a5b','socks':'#c8102e','num':'#ffffff','numStroke':'#111','keeper':'#e8d33a'},
 'URS':{'name':'URSS','abbr':'URS','shirt':'#c8102e','alt':'#c8102e','shorts':'#ffffff','socks':'#c8102e','num':'#ffffff','numStroke':'#111','keeper':'#111111'},
 'MIL':{'name':'Milan','abbr':'MIL','shirt':'#fb090b','stripes':'#111111','alt':'#fb090b','shorts':'#ffffff','socks':'#111111','num':'#ffffff','numStroke':'#111','keeper':'#e8d33a'},
 'ATM':{'name':'Atlético','abbr':'ATM','shirt':'#cb3524','stripes':'#ffffff','alt':'#cb3524','shorts':'#1d2a5b','socks':'#cb3524','num':'#1d2a5b','numStroke':'#fff','keeper':'#2c8f45'},
 'LEI':{'name':'Leicester','abbr':'LEI','shirt':'#003090','alt':'#003090','shorts':'#ffffff','socks':'#003090','num':'#ffffff','numStroke':'#fdbe11','keeper':'#2c8f45'},
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
 'SPA':{'name':'São Paulo','abbr':'SAO','shirt':'#ffffff','alt':'#d8322b','shorts':'#ffffff','socks':'#ffffff','num':'#d8322b','numStroke':'#111','keeper':'#e8d33a'},
 'COR':{'name':'Corinthians','abbr':'COR','shirt':'#111111','alt':'#111111','shorts':'#ffffff','socks':'#111111','num':'#ffffff','numStroke':'#111','keeper':'#8a8a8a'},
 'PUM':{'name':'Pumas','abbr':'PUM','shirt':'#1d2a5b','alt':'#c9a227','shorts':'#1d2a5b','socks':'#c9a227','num':'#c9a227','numStroke':'#111','keeper':'#ff3fa4'},
 'PAR':{'name':'Paraguay','abbr':'PAR','shirt':'#d8322b','stripes':'#ffffff','alt':'#d8322b','shorts':'#1d2a5b','socks':'#d8322b','num':'#1d2a5b','numStroke':'#fff','keeper':'#e8d33a'},
 'WBA':{'name':'West Brom','abbr':'WBA','shirt':'#1d2a5b','stripes':'#ffffff','alt':'#1d2a5b','shorts':'#ffffff','socks':'#ffffff','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'BRA':{'name':'Brasil','abbr':'BRA','shirt':'#f5d020','alt':'#f5d020','shorts':'#1d4fa0','socks':'#ffffff','num':'#1a7a3a','numStroke':'#fff','keeper':'#555555'},
 'GET':{'name':'Getafe','abbr':'GET','shirt':'#1d4fa0','alt':'#1d4fa0','shorts':'#1d4fa0','socks':'#1d4fa0','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'TCH':{'name':'Checoslovaquia','abbr':'TCH','shirt':'#d8322b','alt':'#d8322b','shorts':'#ffffff','socks':'#1d4fa0','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'MUN':{'name':'Man United','abbr':'MUN','shirt':'#d8322b','alt':'#d8322b','shorts':'#ffffff','socks':'#111111','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'WIM':{'name':'Wimbledon','abbr':'WIM','shirt':'#1d2a5b','alt':'#f5d020','shorts':'#1d2a5b','socks':'#1d2a5b','num':'#f5d020','numStroke':'#111','keeper':'#2c8f45'},
 'STK':{'name':'Stoke','abbr':'STK','shirt':'#d8322b','stripes':'#ffffff','alt':'#d8322b','shorts':'#ffffff','socks':'#ffffff','num':'#ffffff','numStroke':'#111','keeper':'#e8d33a'},
 'SOU':{'name':'Southampton','abbr':'SOU','shirt':'#d8322b','stripes':'#ffffff','alt':'#d8322b','shorts':'#111111','socks':'#ffffff','num':'#111','numStroke':'#fff','keeper':'#2c8f45'},
 'SWE':{'name':'Suecia','abbr':'SWE','shirt':'#f5d020','alt':'#f5d020','shorts':'#1d4fa0','socks':'#f5d020','num':'#1d4fa0','numStroke':'#fff','keeper':'#2c8f45'},
 'COL':{'name':'Colombia','abbr':'COL','shirt':'#f5d020','alt':'#f5d020','shorts':'#1d2a5b','socks':'#d8322b','num':'#1d2a5b','numStroke':'#fff','keeper':'#2c8f45'},
 'URU':{'name':'Uruguay','abbr':'URU','shirt':'#6cabdd','alt':'#6cabdd','shorts':'#111111','socks':'#111111','num':'#111111','numStroke':'#fff','keeper':'#e8d33a'},
 'VAL':{'name':'Valencia','abbr':'VAL','shirt':'#ffffff','alt':'#ff7a00','shorts':'#111111','socks':'#111111','num':'#111111','numStroke':'#ff7a00','keeper':'#2c8f45'},
 'CRO':{'name':'Croacia','abbr':'CRO','shirt':'#ffffff','stripes':'#d8322b','alt':'#d8322b','shorts':'#ffffff','socks':'#1d2a5b','num':'#1d2a5b','numStroke':'#fff','keeper':'#e8d33a'},
 'USA':{'name':'Estados Unidos','abbr':'USA','shirt':'#ffffff','alt':'#1d2a5b','shorts':'#1d2a5b','socks':'#ffffff','num':'#1d2a5b','numStroke':'#d8322b','keeper':'#e8d33a'},
 'CMP':{'name':'Compostela','abbr':'COM','shirt':'#ffffff','alt':'#3c8fc4','shorts':'#3c8fc4','socks':'#ffffff','num':'#3c8fc4','numStroke':'#111','keeper':'#2c8f45'},
 'POM':{'name':'Portsmouth','abbr':'POR','shirt':'#1d4fa0','alt':'#1d4fa0','shorts':'#ffffff','socks':'#d8322b','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
 'CDP':{'name':'Cómo Deportes','abbr':'CDP','shirt':'#ffd400','alt':'#111111','shorts':'#111111','socks':'#ffd400','num':'#111111','numStroke':'#fff','keeper':'#d8322b'},
 'FAN':{'name':'Seguidores','abbr':'FANS','shirt':'#1d4fa0','alt':'#1d4fa0','shorts':'#ffffff','socks':'#1d4fa0','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'},
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
 'e14':(['SPA','COR'],'BRASILEIRÃO','',[
   (4,'¿Y EL PORTERO?',dict(type='intro',hook=True,big='¿Y EL\nPORTERO?',bigSize=190,score=[0,0],clock="70'")),
   (7,'VA A TIRAR EL TIRO LIBRE',G('¡GOLAZO!',team=0,idx=0,dist=24,sz=-4,tz=-2.4,ty=1.9,kDive=2,score=[[0,[0,0]],[0.6,[1,0]]],clock="70'")),
   (5,'ROGÉRIO CENI',G('¡CENI!',team=0,idx=0,dist=24,sz=-4,tz=-2.4,ty=1.9,kDive=2,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="70'")),
   (5,'UN PORTERO CON 131 GOLES',dict(type='stat',team=0,score=[1,0],clock="70'",big='131 GOLES',bigSize=150)),
   (5,'',dict(type='outro'))]),
 'e15':(['PUM','AME'],'LIGA MX · AÑOS 90','',[
   (4,'¿EL PORTERO DE DELANTERO?',dict(type='intro',hook=True,big='¿EL PORTERO\nDE DELANTERO?',bigSize=130,score=[0,0],clock="60'")),
   (7,'JORGE CAMPOS',G('¡GOOOL!',team=0,idx=0,dist=12,sz=-3,score=[[0,[0,0]],[0.6,[1,0]]],clock="60'")),
   (5,'CON SU UNIFORME DE COLORES',dict(type='celebrate',team=0,score=[1,0],clock="60'",big='¡CAMPOS!',bigSize=160)),
   (5,'PORTERO Y DELANTERO',dict(type='stat',team=0,score=[1,0],clock='FINAL',big='LOS DOS',bigSize=160)),
   (5,'',dict(type='outro'))]),
 'e16':(['PAR','ARG'],'ELIMINATORIAS','',[
   (4,'¿EL PORTERO TIRA EL PENAL?',dict(type='intro',hook=True,big='¿EL PORTERO\nTIRA EL PENAL?',bigSize=130,score=[0,0],clock="80'")),
   (7,'CHILAVERT',dict(type='penalty',team=0,idx=0,outcome='goal',tz=2.4,score=[[0,[0,0]],[0.6,[1,0]]],big=[[0,None],[0.62,'¡GOL!']],clock="80'",flashes=1,shake=1)),
   (5,'Y REGRESA CORRIENDO A SU ARCO',dict(type='celebrate',team=0,score=[1,0],clock="80'",big='¡CHILA!',bigSize=170)),
   (5,'MÁS DE 60 GOLES DE PORTERO',dict(type='stat',team=0,score=[1,0],clock='FINAL',big='+60 GOLES',bigSize=150)),
   (5,'',dict(type='outro'))]),
 'e17':(['WBA','LIV'],'PREMIER LEAGUE · 2021','',[
   (4,'¿QUIÉN REMATÓ?',dict(type='intro',hook=True,big='¿QUIÉN\nREMATÓ?',bigSize=190,score=[1,1],clock="90+5'")),
   (7,'ÚLTIMO CÓRNER',dict(type='header',team=1,idx=0,score=[[0,[1,1]],[0.7,[1,2]]],big=[[0,None],[0.72,'¡EL PORTERO!']],bigSize=130,clock="90+5'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'ALISSON DE CABEZA',dict(type='header',team=1,idx=0,cam='goal',score=[[0,[1,1]],[0.7,[1,2]]],big=[[0,None],[0.72,'¡ALISSON!']],clock="90+5'",flashes=1,shake=1,shakeAt=0.7)),
   (5,'MINUTO 95',dict(type='celebrate',team=1,score=[1,2],clock='FINAL',big="90+5'",bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e18':(['MEX','BRA'],'MUNDIAL 2014 · FORTALEZA','',[
   (4,'¿CÓMO LO PARÓ?',dict(type='intro',hook=True,big='¿CÓMO\nLO PARÓ?',bigSize=190,score=[0,0],clock="26'")),
   (7,'NEYMAR DE CABEZA',dict(type='save',team=1,idx=9,side=-1,cam='goal',big=[[0,None],[0.5,'¡OCHOA!']],score=[0,0],clock="26'",shake=1,shakeAt=0.42)),
   (5,'Y OTRA',dict(type='save',team=1,idx=9,side=-1,double=True,big=[[0,None],[0.5,'¡OTRA!']],score=[0,0],clock="68'",shake=1,shakeAt=0.42)),
   (5,'0-0 CONTRA BRASIL',dict(type='crowd',scarf='#006847',score=[0,0],clock='FINAL',big='¡MEMO!',bigSize=180)),
   (5,'',dict(type='outro'))]),
 'e19':(['GET','BAR'],'COPA DEL REY · 2007','',[
   (4,'¿A CUÁNTOS DRIBLÓ?',dict(type='intro',hook=True,big='¿A CUÁNTOS\nDRIBLÓ?',bigSize=160,score=[0,0],clock="28'")),
   (7,'DESDE MEDIO CAMPO',G('¡GOLAZO!',team=1,idx=10,dist=34,sz=-6,score=[[0,[0,0]],[0.6,[0,1]]],clock="28'")),
   (5,'MESSI CON 19 AÑOS',dict(type='celebrate',team=1,score=[0,1],clock="28'",big='MESSI',bigSize=180)),
   (5,'5 RIVALES Y EL PORTERO',dict(type='stat',team=1,score=[0,1],clock="28'",big='5 + 🧤',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e20':(['TCH','GER'],'FINAL EUROCOPA · 1976','',[
   (4,'¿POR EL CENTRO?',dict(type='intro',hook=True,big='¿POR EL\nCENTRO?',bigSize=190,score=['2 (4)','2 (3)'],clock='PENALES')),
   (7,'EL PORTERO SE TIRA…',dict(type='penalty',team=0,idx=9,outcome='goal',tz=0,ty=1.4,side=1,score=[[0,['2 (4)','2 (3)']],[0.6,['2 (5)','2 (3)']]],big=[[0,None],[0.62,'¡SUAVECITO!']],clock='PENALES',flashes=1,shake=1)),
   (5,'ANTONÍN PANENKA',dict(type='celebrate',team=0,confetti=True,score=['2 (5)','2 (3)'],clock='FINAL',big='PANENKA',bigSize=170)),
   (5,'ASÍ NACIÓ EL PENAL "A LO PANENKA"',dict(type='stat',team=0,score=['2 (5)','2 (3)'],clock='FINAL',big='1976',bigSize=190)),
   (5,'',dict(type='outro'))]),
 'e21':(['FRA','BRA'],'TORNEO DE FRANCIA · 1997','',[
   (4,'¿CÓMO SE CURVÓ?',dict(type='intro',hook=True,big='¿CÓMO SE\nCURVÓ?',bigSize=180,score=[0,0],clock="21'")),
   (7,'TIRO LIBRE DE 35 METROS',G('¡GOLAZO!',team=1,idx=3,dist=34,sz=-10,tz=2.4,ty=1.0,kDive=2,score=[[0,[0,0]],[0.6,[0,1]]],clock="21'")),
   (5,'ROBERTO CARLOS',G('¡R. CARLOS!',team=1,idx=3,dist=34,sz=-10,tz=2.4,ty=1.0,kDive=2,cam='goal',score=[[0,[0,0]],[0.6,[0,1]]],clock="21'")),
   (5,'EL PORTERO NI SE MOVIÓ',dict(type='stat',team=1,score=[0,1],clock="21'",big='¡FÍSICA!',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e22':(['WIM','MUN'],'PREMIER LEAGUE · 1996','',[
   (4,'¿DESDE MEDIO CAMPO?',dict(type='intro',hook=True,big='¿DESDE\nMEDIO CAMPO?',bigSize=150,score=[0,2],clock="89'")),
   (7,'VE AL PORTERO ADELANTADO',G('¡GOLAZO!',team=1,idx=7,dist=34,sz=4,loft=1.4,score=[[0,[0,2]],[0.6,[0,3]]],clock="89'")),
   (5,'DAVID BECKHAM',dict(type='celebrate',team=1,score=[0,3],clock="89'",big='BECKHAM',bigSize=170)),
   (5,'TENÍA 21 AÑOS',dict(type='stat',team=1,score=[0,3],clock='FINAL',big='21 AÑOS',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e23':(['STK','SOU'],'PREMIER LEAGUE · 2013','',[
   (4,'¿GOL DEL PORTERO?',dict(type='intro',hook=True,big='¿GOL DEL\nPORTERO?',bigSize=180,score=[0,0],clock="0'")),
   (7,'DESPEJA DESDE SU ÁREA',G('¡GOOOL!',team=0,idx=0,dist=34,sz=0,loft=1.8,score=[[0,[0,0]],[0.6,[1,0]]],clock="0:13")),
   (5,'ASMIR BEGOVIĆ',dict(type='celebrate',team=0,score=[1,0],clock="0:13",big='¡BEGOVIĆ!',bigSize=150)),
   (5,'A LOS 13 SEGUNDOS',dict(type='stat',team=0,score=[1,0],clock="0:13",big='13 SEG',bigSize=180)),
   (5,'',dict(type='outro'))]),
 'e24':(['SWE','ENG'],'AMISTOSO · ESTOCOLMO 2012','',[
   (4,'¿DE CHILENA DESDE 30 METROS?',dict(type='intro',hook=True,big='¿DE CHILENA\nDESDE 30 m?',bigSize=150,score=[3,2],clock="90'")),
   (7,'EL PORTERO SALE…',dict(type='header',team=0,idx=9,score=[[0,[3,2]],[0.7,[4,2]]],big=[[0,None],[0.72,'¡CHILENA!']],clock="90+1'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'ZLATAN IBRAHIMOVIĆ',dict(type='header',team=0,idx=9,cam='goal',score=[[0,[3,2]],[0.7,[4,2]]],big=[[0,None],[0.72,'¡ZLATAN!']],clock="90+1'",flashes=1,shake=1,shakeAt=0.7)),
   (5,'SU 4º GOL DE LA NOCHE',dict(type='celebrate',team=0,score=[4,2],clock='FINAL',big='4 GOLES',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e25':(['MUN','MCI'],'DERBI DE MANCHESTER · 2011','',[
   (4,'¿DE CHILENA EN EL DERBI?',dict(type='intro',hook=True,big='¿DE CHILENA\nEN EL DERBI?',bigSize=150,score=[1,1],clock="78'")),
   (7,'CENTRO DE NANI',dict(type='header',team=0,idx=10,score=[[0,[1,1]],[0.7,[2,1]]],big=[[0,None],[0.72,'¡CHILENA!']],clock="78'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'WAYNE ROONEY',dict(type='header',team=0,idx=10,cam='goal',score=[[0,[1,1]],[0.7,[2,1]]],big=[[0,None],[0.72,'¡ROONEY!']],clock="78'",flashes=1,shake=1,shakeAt=0.7)),
   (5,'GANARON EL DERBI',dict(type='celebrate',team=0,score=[2,1],clock='FINAL',big='2-1',bigSize=190)),
   (5,'',dict(type='outro'))]),
 'e26':(['COL','URU'],'MUNDIAL 2014 · OCTAVOS','',[
   (4,'¿DE PECHO Y VOLEA?',dict(type='intro',hook=True,big='¿DE PECHO\nY VOLEA?',bigSize=170,score=[0,0],clock="28'")),
   (7,'LA BAJA CON EL PECHO…',G('¡GOLAZO!',team=0,idx=10,dist=22,sz=-2,loft=1.2,ty=2.0,tz=-1.2,kDive=2,score=[[0,[0,0]],[0.6,[1,0]]],clock="28'")),
   (5,'JAMES RODRÍGUEZ',G('¡JAMES!',team=0,idx=10,dist=22,sz=-2,loft=1.2,ty=2.0,tz=-1.2,kDive=2,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="28'")),
   (5,'EL MEJOR GOL DEL MUNDIAL',dict(type='crowd',scarf='#f5d020',score=[1,0],clock="28'",big='PUSKÁS',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e27':(['ESP','NED'],'MUNDIAL 2014 · SALVADOR','',[
   (4,'¿DE PALOMITA?',dict(type='intro',hook=True,big='¿DE\nPALOMITA?',bigSize=180,score=[1,0],clock="44'")),
   (7,'PASE LARGO DE BLIND',dict(type='header',team=1,idx=9,score=[[0,[1,0]],[0.7,[1,1]]],big=[[0,None],[0.72,'¡VUELA!']],clock="44'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'VAN PERSIE',dict(type='header',team=1,idx=9,cam='goal',score=[[0,[1,0]],[0.7,[1,1]]],big=[[0,None],[0.72,'¡RVP!']],clock="44'",flashes=1,shake=1,shakeAt=0.7)),
   (5,'EL HOLANDÉS VOLADOR',dict(type='celebrate',team=1,score=[1,5],clock='FINAL',big='1-5',bigSize=190)),
   (5,'',dict(type='outro'))]),
 'e28':(['BAR','VAL'],'LALIGA · 2001','',[
   (4,'¿CHILENA EN EL 89?',dict(type='intro',hook=True,big="¿CHILENA\nEN EL 89'?",bigSize=170,score=[2,2],clock="89'")),
   (7,'SE NECESITABA GANAR',dict(type='header',team=0,idx=10,score=[[0,[2,2]],[0.7,[3,2]]],big=[[0,None],[0.72,'¡CHILENA!']],clock="89'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'RIVALDO',dict(type='header',team=0,idx=10,cam='goal',score=[[0,[2,2]],[0.7,[3,2]]],big=[[0,None],[0.72,'¡RIVALDO!']],clock="89'",flashes=1,shake=1,shakeAt=0.7)),
   (5,'HAT-TRICK Y A CHAMPIONS',dict(type='celebrate',team=0,score=[3,2],clock='FINAL',big='HAT-TRICK',bigSize=150)),
   (5,'',dict(type='outro'))]),
 'e29':(['FRA','ARG'],'MUNDIAL 2018 · OCTAVOS','',[
   (4,'¿UN LATERAL HIZO ESO?',dict(type='intro',hook=True,big='¿UN LATERAL\nHIZO ESO?',bigSize=150,score=[1,2],clock="57'")),
   (7,'CENTRO AL SEGUNDO PALO',G('¡GOLAZO!',team=0,idx=2,dist=20,sz=-8,loft=1.0,ty=1.6,tz=2.4,kDive=2,score=[[0,[1,2]],[0.6,[2,2]]],clock="57'")),
   (5,'BENJAMIN PAVARD',G('¡PAVARD!',team=0,idx=2,dist=20,sz=-8,loft=1.0,ty=1.6,tz=2.4,kDive=2,cam='goal',score=[[0,[1,2]],[0.6,[2,2]]],clock="57'")),
   (5,'FRANCIA GANÓ 4-3',dict(type='celebrate',team=0,score=[4,3],clock='FINAL',big='4-3',bigSize=190)),
   (5,'',dict(type='outro'))]),
 'e30':(['MEX','CRO'],'MUNDIAL 2014 · RECIFE','',[
   (4,'¿EL CAPITÁN DE CABEZA?',dict(type='intro',hook=True,big='¿EL CAPITÁN\nDE CABEZA?',bigSize=150,score=[0,0],clock="72'")),
   (7,'TIRO DE ESQUINA',dict(type='corner',team=0,idx=4,score=[[0,[0,0]],[0.75,[1,0]]],big=[[0,None],[0.78,'¡GOL!']],clock="72'",flashes=2,shake=1,shakeAt=0.78)),
   (5,'RAFA MÁRQUEZ',dict(type='celebrate',team=0,score=[1,0],clock="72'",big='¡RAFA!',bigSize=180)),
   (5,'MÉXICO GANÓ 3-1',dict(type='crowd',scarf='#006847',score=[3,1],clock='FINAL',big='3-1',bigSize=190)),
   (5,'',dict(type='outro'))]),
 'e31':(['MEX','USA'],'FINAL COPA ORO · 2011','',[
   (4,'¿CÓMO LA METIÓ AHÍ?',dict(type='intro',hook=True,big='¿CÓMO LA\nMETIÓ AHÍ?',bigSize=160,score=[3,2],clock="76'")),
   (7,'SE QUITA AL PORTERO…',G('¡GOLAZO!',team=0,idx=10,dist=12,sz=6,loft=2.2,ty=2.0,tz=-2.6,kDive=1,score=[[0,[3,2]],[0.6,[4,2]]],clock="76'")),
   (5,'GIOVANI DOS SANTOS',G('¡GIO!',team=0,idx=10,dist=12,sz=6,loft=2.2,ty=2.0,tz=-2.6,kDive=1,cam='goal',score=[[0,[3,2]],[0.6,[4,2]]],clock="76'")),
   (5,'MÉXICO CAMPEÓN',dict(type='trophy',team=0,idx=10,lift=True,confetti=True,score=[4,2],clock='FINAL',big=[[0,None],[0.45,'4-2']])),
   (5,'',dict(type='outro'))]),
 'e32':(['CMP','BAR'],'LALIGA · 1996','',[
   (4,'¿A CUÁNTOS DEJÓ ATRÁS?',dict(type='intro',hook=True,big='¿A CUÁNTOS\nDEJÓ ATRÁS?',bigSize=150,score=[0,1],clock="37'")),
   (7,'DESDE SU PROPIO CAMPO',G('¡GOLAZO!',team=1,idx=9,dist=34,sz=-4,score=[[0,[0,1]],[0.6,[0,2]]],clock="37'")),
   (5,'RONALDO NAZÁRIO',dict(type='celebrate',team=1,score=[0,2],clock="37'",big='R9',bigSize=200)),
   (5,'TENÍA 20 AÑOS',dict(type='stat',team=1,score=[0,2],clock="37'",big='20 AÑOS',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e33':(['MUN','POM'],'PREMIER LEAGUE · 2008','',[
   (4,'¿CÓMO SE MOVIÓ ASÍ?',dict(type='intro',hook=True,big='¿CÓMO SE\nMOVIÓ ASÍ?',bigSize=170,score=[1,0],clock="14'")),
   (7,'TIRO LIBRE A 30 METROS',G('¡GOLAZO!',team=0,idx=7,dist=30,sz=-2,tz=-2.4,ty=1.9,kDive=2,score=[[0,[1,0]],[0.6,[2,0]]],clock="14'")),
   (5,'CRISTIANO RONALDO',G('¡CR7!',team=0,idx=7,dist=30,sz=-2,tz=-2.4,ty=1.9,kDive=2,cam='goal',score=[[0,[1,0]],[0.6,[2,0]]],clock="14'")),
   (5,'EL PORTERO NI LA VIO',dict(type='stat',team=0,score=[2,0],clock="14'",big='¡NUDILLO!',bigSize=160)),
   (5,'',dict(type='outro'))]),
 'e34':(['CDP','FAN'],'¿CÓMO DEPORTES? · 14 NOV','',[
   (4,'¡LO LOGRAMOS!',dict(type='intro',hook=True,big='¡SOMOS\n50!',bigSize=210,score=[0,0],clock="90+5'")),
   (6,'GOL NÚMERO 50',G('¡50!',team=0,idx=9,dist=14,sz=-3,score=[[0,[49,0]],[0.6,[50,0]]],clock="90+5'")),
   (5,'GRACIAS A CADA UNO',dict(type='crowd',scarf='#ffd400',score=[50,0],clock='FINAL',big='¡GRACIAS!',bigSize=170,shake=1,shakeAt=0.3)),
   (6,'50 SEGUIDORES',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[50,0],clock='FINAL',flashes=2,big=[[0,None],[0.45,'🏆 50']])),
   (5,'¿VAMOS POR 100?',dict(type='stat',team=0,score=[50,0],clock='FINAL',big='VAMOS\nPOR 100',bigSize=150)),
   (4,'',dict(type='outro'))]),
 'e35':(['BRA','FRA'],'TORNEO DE FRANCIA · 1997','',[
   (4,'¿CÓMO SE CURVÓ ASÍ?',dict(type='intro',hook=True,big='¿CÓMO SE\nCURVÓ ASÍ?',bigSize=165,score=[0,0],clock="21'")),
   (7,'TIRO LIBRE A 35 METROS',G('¡GOLAZO!',team=0,idx=2,dist=35,sz=-8,tz=3.2,ty=1.2,kDive=1,score=[[0,[0,0]],[0.6,[1,0]]],clock="21'")),
   (5,'ROBERTO CARLOS',G('¡ROBERTO!',team=0,idx=2,dist=35,sz=-8,tz=3.2,ty=1.2,kDive=1,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="21'")),
   (5,'EL BALÓN IBA AFUERA',dict(type='stat',team=0,score=[1,0],clock="21'",big='¡FÍSICA!',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e36':(['ARG','ENG'],'MUNDIAL MÉXICO 86','',[
   (4,'¿A CUÁNTOS SE QUITÓ?',dict(type='intro',hook=True,big='¿A CUÁNTOS\nSE QUITÓ?',bigSize=150,score=[1,0],clock="55'")),
   (7,'DESDE MEDIO CAMPO',G('¡GOLAZO!',team=0,idx=9,dist=40,sz=-3,score=[[0,[1,0]],[0.6,[2,0]]],clock="55'")),
   (5,'DIEGO MARADONA',dict(type='celebrate',team=0,score=[2,0],clock="55'",big='¡DIEGO!',bigSize=180)),
   (5,'EL GOL DEL SIGLO',dict(type='stat',team=0,score=[2,0],clock="55'",big='A 6',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e37':(['MEX','FRA'],'MUNDIAL 2010','',[
   (4,'¿Y EL PORTERO?',dict(type='intro',hook=True,big='¿Y EL\nPORTERO?',bigSize=190,score=[0,0],clock="64'")),
   (7,'SE QUEDA SOLO…',G('¡GOOOL!',team=0,idx=9,dist=10,sz=4,kDive=1,score=[[0,[0,0]],[0.6,[1,0]]],clock="64'")),
   (5,'CHICHARITO',G('¡CHICHARITO!',team=0,idx=9,dist=10,sz=4,kDive=1,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="64'")),
   (5,'MÉXICO 2-0 FRANCIA',dict(type='crowd',scarf='#006847',score=[2,0],clock='FINAL',big='2-0',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e38':(['BAR','GET'],'COPA DEL REY · 2007','',[
   (4,'¿IGUAL QUE MARADONA?',dict(type='intro',hook=True,big='¿IGUAL QUE\nMARADONA?',bigSize=140,score=[0,0],clock="28'")),
   (7,'DESDE SU CAMPO',G('¡GOLAZO!',team=0,idx=9,dist=40,sz=4,score=[[0,[0,0]],[0.6,[1,0]]],clock="28'")),
   (5,'LIONEL MESSI',dict(type='celebrate',team=0,score=[1,0],clock="28'",big='¡MESSI!',bigSize=180)),
   (5,'TENÍA 19 AÑOS',dict(type='stat',team=0,score=[1,0],clock="28'",big='19 AÑOS',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e39':(['ESP','NED'],'FINAL MUNDIAL 2010','',[
   (4,'¿EN EL MINUTO 116?',dict(type='intro',hook=True,big='¿EN EL\n116?',bigSize=190,score=[0,0],clock="116'")),
   (7,'PRÓRROGA, 0-0…',G('¡GOOOL!',team=0,idx=7,dist=12,sz=5,score=[[0,[0,0]],[0.6,[1,0]]],clock="116'")),
   (5,'ANDRÉS INIESTA',G('¡INIESTA!',team=0,idx=7,dist=12,sz=5,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="116'")),
   (5,'ESPAÑA CAMPEÓN DEL MUNDO',dict(type='trophy',team=0,idx=7,lift=True,confetti=True,score=[1,0],clock='FINAL',big=[[0,None],[0.45,'1-0']])),
   (5,'',dict(type='outro'))]),
 'e40':(['MCI','QPR'],'PREMIER LEAGUE · 2012','',[
   (4,'¿EN EL MINUTO 93?',dict(type='intro',hook=True,big='¿EN EL\n93:20?',bigSize=180,score=[2,2],clock="93'")),
   (7,'NECESITABAN UN GOL',G('¡AGÜEROOO!',team=0,idx=9,dist=12,sz=-4,score=[[0,[2,2]],[0.6,[3,2]]],clock="93'")),
   (5,'SERGIO AGÜERO',dict(type='celebrate',team=0,score=[3,2],clock="93'",big='¡KUN!',bigSize=200)),
   (5,'CAMPEONES EN EL ÚLTIMO SEGUNDO',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[3,2],clock='FINAL',big=[[0,None],[0.45,'3-2']])),
   (5,'',dict(type='outro'))]),
 'e41':(['GER','BRA'],'SEMIFINAL MUNDIAL 2014','',[
   (4,'¿7-1 EN SU CASA?',dict(type='intro',hook=True,big='¿7-1 EN\nSU CASA?',bigSize=170,score=[0,0],clock="11'")),
   (7,'ALEMANIA NO PARABA',G('¡GOL!',team=0,idx=10,dist=11,sz=3,score=[[0,[4,0]],[0.6,[5,0]]],clock="29'")),
   (5,'5 GOLES EN 29 MINUTOS',dict(type='stat',team=0,score=[5,0],clock="29'",big='5 EN 29\'',bigSize=170)),
   (5,'BRASIL NO LO OLVIDA',dict(type='crowd',scarf='#ffdf00',score=[7,1],clock='FINAL',big='7-1',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e42':(['NED','ARG'],'MUNDIAL FRANCIA 98','',[
   (4,'¿CÓMO LA BAJÓ?',dict(type='intro',hook=True,big='¿CÓMO LA\nBAJÓ?',bigSize=175,score=[1,1],clock="89'")),
   (7,'PASE DE 60 METROS',G('¡GOLAZO!',team=0,idx=10,dist=12,sz=-5,loft=2.2,score=[[0,[1,1]],[0.6,[2,1]]],clock="89'")),
   (5,'DENNIS BERGKAMP',G('¡BERGKAMP!',team=0,idx=10,dist=12,sz=-5,loft=2.2,cam='goal',score=[[0,[1,1]],[0.6,[2,1]]],clock="89'")),
   (5,'3 TOQUES PERFECTOS',dict(type='stat',team=0,score=[2,1],clock="89'",big='3 TOQUES',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e43':(['PAR','ARG'],'ELIMINATORIAS · 1996','',[
   (4,'¿EL PORTERO LA TIRA?',dict(type='intro',hook=True,big='¿EL PORTERO\nLA TIRA?',bigSize=140,score=[0,0],clock="40'")),
   (7,'TIRO LIBRE…',G('¡GOLAZO!',team=0,idx=0,dist=28,sz=-3,tz=-2.4,ty=1.9,kDive=2,score=[[0,[0,0]],[0.6,[1,0]]],clock="40'")),
   (5,'JOSÉ LUIS CHILAVERT',G('¡CHILAVERT!',team=0,idx=0,dist=28,sz=-3,tz=-2.4,ty=1.9,kDive=2,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="40'")),
   (5,'UN PORTERO CON 62 GOLES',dict(type='stat',team=0,score=[1,0],clock="40'",big='62 GOLES',bigSize=165)),
   (5,'',dict(type='outro'))]),
 'e44':(['COL','ENG'],'WEMBLEY · 1995','',[
   (4,'¿QUÉ HIZO EL PORTERO?',dict(type='intro',hook=True,big='¿QUÉ HIZO EL\nPORTERO?',bigSize=135,score=[0,0],clock="22'")),
   (7,'DISPARO AL ARCO…',dict(type='save',team=1,idx=8,side=-1,big=[[0,None],[0.5,'¡¿QUÉ?!']],score=[0,0],clock="22'",shake=1,shakeAt=0.42)),
   (5,'RENÉ HIGUITA',dict(type='save',team=1,idx=8,side=-1,cam='goal',big=[[0,None],[0.5,'¡ESCORPIÓN!']],score=[0,0],clock="22'",shake=1,shakeAt=0.42)),
   (5,'LA ATAJADA MÁS LOCA',dict(type='stat',team=0,score=[0,0],clock="22'",big='¡HIGUITA!',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e45':(['RMA','LEV'],'FINAL CHAMPIONS · 2002','',[
   (4,'¿DE VOLEA?',dict(type='intro',hook=True,big='¿DE\nVOLEA?',bigSize=210,score=[1,1],clock="45'")),
   (7,'EL CENTRO VIENE ALTO…',G('¡GOLAZO!',team=0,idx=10,dist=16,sz=-6,loft=2.4,tz=-2.6,ty=2.0,kDive=1,score=[[0,[1,1]],[0.6,[2,1]]],clock="45'")),
   (5,'ZINEDINE ZIDANE',G('¡ZIZOU!',team=0,idx=10,dist=16,sz=-6,loft=2.4,tz=-2.6,ty=2.0,kDive=1,cam='goal',score=[[0,[1,1]],[0.6,[2,1]]],clock="45'")),
   (5,'GANÓ LA CHAMPIONS',dict(type='trophy',team=0,idx=10,lift=True,confetti=True,score=[2,1],clock='FINAL',big=[[0,None],[0.45,'2-1']])),
   (5,'',dict(type='outro'))]),
 'e46':(['BRA','ENG'],'MUNDIAL 2002','',[
   (4,'¿CENTRO O TIRO?',dict(type='intro',hook=True,big='¿CENTRO\nO TIRO?',bigSize=180,score=[1,1],clock="50'")),
   (7,'TIRO LIBRE A 40 METROS',G('¡GOLAZO!',team=0,idx=9,dist=38,sz=-10,loft=2.6,tz=-2.8,ty=2.1,kDive=1,score=[[0,[1,1]],[0.6,[2,1]]],clock="50'")),
   (5,'RONALDINHO',G('¡DINHO!',team=0,idx=9,dist=38,sz=-10,loft=2.6,tz=-2.8,ty=2.1,kDive=1,cam='goal',score=[[0,[1,1]],[0.6,[2,1]]],clock="50'")),
   (5,'EL PORTERO NO LO CREÍA',dict(type='stat',team=0,score=[2,1],clock="50'",big='¡POR\nENCIMA!',bigSize=160)),
   (5,'',dict(type='outro'))]),
 'e47':(['BRA','ITA'],'FINAL MUNDIAL 1970','',[
   (4,'¿EL MEJOR GOL EN EQUIPO?',dict(type='intro',hook=True,big='¿EL MEJOR GOL\nEN EQUIPO?',bigSize=125,score=[3,1],clock="86'")),
   (7,'9 JUGADORES LA TOCAN',G('¡GOLAZO!',team=0,idx=2,dist=18,sz=8,score=[[0,[3,1]],[0.6,[4,1]]],clock="86'")),
   (5,'CARLOS ALBERTO',dict(type='celebrate',team=0,score=[4,1],clock="86'",big='¡CAPITÁN!',bigSize=170)),
   (5,'BRASIL TRICAMPEÓN',dict(type='trophy',team=0,idx=2,lift=True,confetti=True,score=[4,1],clock='FINAL',big=[[0,None],[0.45,'4-1']])),
   (5,'',dict(type='outro'))]),
 'e48':(['ENG','GER'],'MUNDIAL 2010','',[
   (4,'¿ENTRÓ O NO?',dict(type='intro',hook=True,big='¿ENTRÓ\nO NO?',bigSize=200,score=[1,2],clock="38'")),
   (7,'PEGA EN EL TRAVESAÑO…',G('¿GOL?',team=0,idx=7,dist=24,sz=-2,tz=0,ty=2.3,kDive=1,score=[[0,[1,2]],[0.6,[1,2]]],clock="38'")),
   (5,'FRANK LAMPARD',G('¡ADENTRO!',team=0,idx=7,dist=24,sz=-2,tz=0,ty=2.3,kDive=1,cam='goal',score=[[0,[1,2]],[0.6,[1,2]]],clock="38'")),
   (5,'NO LO DIERON',dict(type='stat',team=0,score=[1,2],clock="38'",big='¡NO\nVALIÓ!',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e49':(['LIV','RMA'],'FINAL CHAMPIONS · 2018','',[
   (4,'¿SE LA DIO AL RIVAL?',dict(type='intro',hook=True,big='¿SE LA DIO\nAL RIVAL?',bigSize=150,score=[0,0],clock="51'")),
   (7,'EL PORTERO SACA CON LA MANO…',G('¡GOL!',team=1,idx=9,dist=6,sz=0,score=[[0,[0,0]],[0.6,[0,1]]],clock="51'")),
   (5,'BENZEMA LA METE',dict(type='celebrate',team=1,score=[0,1],clock="51'",big='¡¿QUÉ?!',bigSize=190)),
   (5,'REAL MADRID CAMPEÓN',dict(type='trophy',team=1,idx=9,lift=True,confetti=True,score=[1,3],clock='FINAL',big=[[0,None],[0.45,'1-3']])),
   (5,'',dict(type='outro'))]),
 'e50':(['MEX','BRA'],'MUNDIAL 2014','',[
   (4,'¿CÓMO LA SACÓ?',dict(type='intro',hook=True,big='¿CÓMO LA\nSACÓ?',bigSize=180,score=[0,0],clock="26'")),
   (7,'CABEZAZO DE NEYMAR…',dict(type='save',team=0,idx=8,side=1,big=[[0,None],[0.5,'¡ATAJADA!']],score=[0,0],clock="26'",shake=1,shakeAt=0.42)),
   (5,'MEMO OCHOA',dict(type='save',team=0,idx=8,side=1,cam='goal',big=[[0,None],[0.5,'¡OCHOA!']],score=[0,0],clock="26'",shake=1,shakeAt=0.42)),
   (5,'BRASIL NO PUDO',dict(type='crowd',scarf='#006847',score=[0,0],clock='FINAL',big='0-0',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e51':(['RMA','LIV'],'FINAL CHAMPIONS · 2022','',[
   (4,'¿CUÁNTAS ATAJÓ?',dict(type='intro',hook=True,big='¿CUÁNTAS\nATAJÓ?',bigSize=170,score=[0,0],clock="21'")),
   (7,'TIRO DE SALAH…',dict(type='save',team=1,idx=10,side=-1,big=[[0,None],[0.5,'¡ATAJADA!']],score=[0,0],clock="82'",shake=1,shakeAt=0.42)),
   (5,'THIBAUT COURTOIS',dict(type='save',team=1,idx=10,side=1,cam='goal',big=[[0,None],[0.5,'¡COURTOIS!']],score=[1,0],clock="82'",shake=1,shakeAt=0.42)),
   (5,'9 ATAJADAS EN LA FINAL',dict(type='stat',team=0,score=[1,0],clock='FINAL',big='9',bigSize=230)),
   (5,'',dict(type='outro'))]),
 'e52':(['BAR','VAL'],'TEMPORADA 2012','',[
   (4,'¿91 GOLES EN UN AÑO?',dict(type='intro',hook=True,big='¿91 GOLES\nEN UN AÑO?',bigSize=150,score=[0,0],clock="30'")),
   (7,'UNO MÁS…',G('¡GOL!',team=0,idx=9,dist=14,sz=3,score=[[0,[0,0]],[0.6,[1,0]]],clock="30'")),
   (5,'LIONEL MESSI',dict(type='celebrate',team=0,score=[1,0],clock="30'",big='¡LEO!',bigSize=200)),
   (5,'RÉCORD MUNDIAL',dict(type='stat',team=0,score=[1,0],clock="30'",big='91',bigSize=230)),
   (5,'',dict(type='outro'))]),
 'e53':(['WBA','LIV'],'PREMIER LEAGUE · 2021','',[
   (4,'¿EL PORTERO DE CABEZA?',dict(type='intro',hook=True,big='¿EL PORTERO\nDE CABEZA?',bigSize=140,score=[1,1],clock="90+5'")),
   (6,'SUBE EL PORTERO',dict(type='header',team=1,idx=0,score=[[0,[1,1]],[0.7,[1,2]]],big=[[0,None],[0.72,'¡ALISSON!']],clock="90+5'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'¡CABEZAZO!',dict(type='header',team=1,idx=0,cam='goal',score=[[0,[1,1]],[0.7,[1,2]]],big=[[0,None],[0.72,'¡GOOOL!']],clock="90+5'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'EL PRIMER PORTERO DEL LIVERPOOL',dict(type='stat',team=1,score=[1,2],clock='FINAL',big='¡HISTÓRICO!',bigSize=140)),
   (5,'',dict(type='outro'))]),
 'e54':(['RMA','BAR'],'FINAL COPA DEL REY · 2014','',[
   (4,'¿POR FUERA DE LA CANCHA?',dict(type='intro',hook=True,big='¿POR FUERA DE\nLA CANCHA?',bigSize=130,score=[1,1],clock="85'")),
   (7,'CARRERA DE 50 METROS',G('¡GOLAZO!',team=0,idx=11 if False else 10,dist=12,sz=-5,score=[[0,[1,1]],[0.6,[2,1]]],clock="85'")),
   (5,'GARETH BALE',dict(type='celebrate',team=0,score=[2,1],clock="85'",big='¡BALE!',bigSize=200)),
   (5,'¡LO DEJÓ ATRÁS!',dict(type='trophy',team=0,idx=10,lift=True,confetti=True,score=[2,1],clock='FINAL',big=[[0,None],[0.45,'2-1']])),
   (5,'',dict(type='outro'))]),
 'e55':(['STK','SOU'],'PREMIER LEAGUE · 2013','',[
   (4,'¿DE PORTERO A PORTERO?',dict(type='intro',hook=True,big='¿DE PORTERO\nA PORTERO?',bigSize=135,score=[0,0],clock="1'")),
   (7,'SAQUE LARGO DEL PORTERO…',G('¡GOOOL!',team=0,idx=0,dist=50,sz=0,loft=3.0,ty=0.4,kDive=1,score=[[0,[0,0]],[0.6,[1,0]]],clock="1'")),
   (5,'ASMIR BEGOVIĆ',G('¡BEGOVIĆ!',team=0,idx=0,dist=50,sz=0,loft=3.0,ty=0.4,kDive=1,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="1'")),
   (5,'¡DESDE 91 METROS!',dict(type='stat',team=0,score=[1,0],clock="1'",big='91 m',bigSize=220)),
   (5,'',dict(type='outro'))]),
 'e56':(['FRA','ITA'],'FINAL MUNDIAL 2006','',[
   (4,'¿UNA PANENKA EN LA FINAL?',dict(type='intro',hook=True,big='¿PANENKA EN\nLA FINAL?',bigSize=150,score=[0,0],clock="7'")),
   (7,'PENAL PARA FRANCIA',dict(type='penalty',team=0,idx=10,outcome='goal',tz=0,ty=1.9,side=1,score=[[0,[0,0]],[0.6,[1,0]]],big=[[0,None],[0.62,'¡PANENKA!']],clock="7'",flashes=1,shake=1)),
   (5,'ZINEDINE ZIDANE',dict(type='celebrate',team=0,score=[1,0],clock="7'",big='¡ZIZOU!',bigSize=190)),
   (5,'PEGÓ EN EL TRAVESAÑO Y ENTRÓ',dict(type='stat',team=0,score=[1,0],clock="7'",big='¡QUÉ\nNERVIOS!',bigSize=160)),
   (5,'',dict(type='outro'))]),
 'e57':(['BAY','WOB'],'BUNDESLIGA · 2015','',[
   (4,'¿5 GOLES EN 9 MINUTOS?',dict(type='intro',hook=True,big='¿5 GOLES EN\n9 MINUTOS?',bigSize=140,score=[0,1],clock="51'")),
   (7,'ENTRA DE CAMBIO…',G('¡GOL!',team=0,idx=9,dist=12,sz=3,score=[[0,[4,1]],[0.6,[5,1]]],clock="60'")),
   (5,'ROBERT LEWANDOWSKI',dict(type='celebrate',team=0,score=[5,1],clock="60'",big='¡LEWY!',bigSize=200)),
   (5,'¡EN SOLO 9 MINUTOS!',dict(type='stat',team=0,score=[5,1],clock="60'",big='5 EN 9\'',bigSize=190)),
   (5,'',dict(type='outro'))]),
 'e58':(['ARG','ENG'],'MUNDIAL MÉXICO 86','',[
   (4,'¿CON LA MANO?',dict(type='intro',hook=True,big='¿CON LA\nMANO?',bigSize=200,score=[0,0],clock="51'")),
   (6,'SALTA CON EL PORTERO',dict(type='header',team=0,idx=9,score=[[0,[0,0]],[0.7,[1,0]]],big=[[0,None],[0.72,'¿GOL?']],clock="51'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'¡EL ÁRBITRO LO DIO!',dict(type='header',team=0,idx=9,cam='goal',score=[[0,[0,0]],[0.7,[1,0]]],big=[[0,None],[0.72,'¡VALIÓ!']],clock="51'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'LA MANO DE DIOS',dict(type='stat',team=0,score=[1,0],clock="51'",big='LA MANO\nDE DIOS',bigSize=160)),
   (5,'',dict(type='outro'))]),
 'e59':(['TUR','KOR'],'MUNDIAL 2002','',[
   (4,'¿EN 11 SEGUNDOS?',dict(type='intro',hook=True,big='¿EN 11\nSEGUNDOS?',bigSize=180,score=[0,0],clock="0'")),
   (7,'SACAN DE MEDIO…',G('¡GOOOL!',team=0,idx=9,dist=18,sz=2,score=[[0,[0,0]],[0.6,[1,0]]],clock="1'")),
   (5,'HAKAN ŞÜKÜR',dict(type='celebrate',team=0,score=[1,0],clock="1'",big='¡HAKAN!',bigSize=190)),
   (5,'EL GOL MÁS RÁPIDO DE LOS MUNDIALES',dict(type='stat',team=0,score=[1,0],clock="1'",big='11 SEG',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e60':(['CDP','FAN'],'¿CÓMO DEPORTES? · 16 NOV','',[
   (4,'¡LO VOLVIMOS A HACER!',dict(type='intro',hook=True,big='¡SOMOS\n70!',bigSize=210,score=[69,0],clock="90+5'")),
   (6,'GOL NÚMERO 70',G('¡70!',team=0,idx=9,dist=14,sz=-3,score=[[0,[69,0]],[0.6,[70,0]]],clock="90+5'")),
   (5,'GRACIAS A CADA UNO',dict(type='crowd',scarf='#ffd400',score=[70,0],clock='FINAL',big='¡GRACIAS!',bigSize=170,shake=1,shakeAt=0.3)),
   (6,'70 SEGUIDORES',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[70,0],clock='FINAL',flashes=2,big=[[0,None],[0.45,'🏆 70']])),
   (5,'¿VAMOS POR 100?',dict(type='stat',team=0,score=[70,0],clock='FINAL',big='VAMOS\nPOR 100',bigSize=150)),
   (4,'',dict(type='outro'))]),
 'e61':(['NED','URS'],'FINAL EUROCOPA 1988','',[
   (4,'¿DESDE ESE ÁNGULO?',dict(type='intro',hook=True,big='¿DESDE ESE\nÁNGULO?',bigSize=160,score=[1,0],clock="54'")),
   (7,'CENTRO LARGO…',G('¡GOLAZO!',team=0,idx=9,dist=14,sz=-14,loft=2.4,ty=2.0,tz=2.6,kDive=1,score=[[0,[1,0]],[0.6,[2,0]]],clock="54'")),
   (5,'MARCO VAN BASTEN',G('¡VAN BASTEN!',team=0,idx=9,dist=14,sz=-14,loft=2.4,ty=2.0,tz=2.6,kDive=1,cam='goal',score=[[0,[1,0]],[0.6,[2,0]]],clock="54'")),
   (5,'HOLANDA CAMPEONA',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[2,0],clock='FINAL',big=[[0,None],[0.45,'2-0']])),
   (5,'',dict(type='outro'))]),
 'e62':(['BRA','SWE'],'FINAL MUNDIAL 1958','',[
   (4,'¿UN SOMBRERO EN LA FINAL?',dict(type='intro',hook=True,big='¿SOMBRERO EN\nLA FINAL?',bigSize=140,score=[2,1],clock="55'")),
   (7,'LA LEVANTA SOBRE EL DEFENSA',G('¡GOLAZO!',team=0,idx=9,dist=12,sz=2,score=[[0,[2,1]],[0.6,[3,1]]],clock="55'")),
   (5,'PELÉ',dict(type='celebrate',team=0,score=[3,1],clock="55'",big='¡PELÉ!',bigSize=200)),
   (5,'TENÍA 17 AÑOS',dict(type='stat',team=0,score=[3,1],clock="55'",big='17 AÑOS',bigSize=180)),
   (5,'',dict(type='outro'))]),
 'e63':(['MEX','KOR'],'MUNDIAL FRANCIA 98','',[
   (4,'¿SALTÓ CON EL BALÓN?',dict(type='intro',hook=True,big='¿SALTÓ CON\nEL BALÓN?',bigSize=145,score=[0,1],clock="60'")),
   (7,'LO ENCIERRAN DOS…',G('¡OLÉ!',team=0,idx=9,dist=24,sz=4,score=[[0,[0,1]],[0.6,[0,1]]],clock="60'")),
   (5,'CUAUHTÉMOC BLANCO',dict(type='celebrate',team=0,score=[0,1],clock="60'",big='¡CUAUH!',bigSize=190)),
   (5,'LA CUAUHTEMIÑA',dict(type='stat',team=0,score=[3,1],clock='FINAL',big='¡CUAUH-\nTEMIÑA!',bigSize=150)),
   (5,'',dict(type='outro'))]),
 'e64':(['BAR','BAY'],'SEMIFINAL CHAMPIONS 2015','',[
   (4,'¿SE CAYÓ SOLO?',dict(type='intro',hook=True,big='¿SE CAYÓ\nSOLO?',bigSize=180,score=[1,0],clock="80'")),
   (7,'UN AMAGUE Y…',G('¡GOLAZO!',team=0,idx=9,dist=10,sz=-5,kDive=1,score=[[0,[1,0]],[0.6,[2,0]]],clock="80'")),
   (5,'LIONEL MESSI',G('¡MESSI!',team=0,idx=9,dist=10,sz=-5,kDive=1,cam='goal',score=[[0,[1,0]],[0.6,[2,0]]],clock="80'")),
   (5,'EL DEFENSA AL SUELO',dict(type='stat',team=0,score=[3,0],clock='FINAL',big='¡AL\nSUELO!',bigSize=180)),
   (5,'',dict(type='outro'))]),
 'e65':(['LIV','MIL'],'FINAL CHAMPIONS 2005','',[
   (4,'¿3-0 Y REMONTARON?',dict(type='intro',hook=True,big='¿3-0 Y\nREMONTARON?',bigSize=150,score=[0,3],clock="45'")),
   (7,'EN 6 MINUTOS…',G('¡GOL!',team=0,idx=7,dist=12,sz=3,score=[[0,[2,3]],[0.6,[3,3]]],clock="60'")),
   (5,'EL MILAGRO DE ESTAMBUL',dict(type='crowd',scarf='#c8102e',score=[3,3],clock="60'",big='3-3',bigSize=200)),
   (5,'CAMPEONES EN PENALES',dict(type='trophy',team=0,idx=7,lift=True,confetti=True,score=[3,3],clock='FINAL',big=[[0,None],[0.45,'🏆']])),
   (5,'',dict(type='outro'))]),
 'e66':(['RMA','ATM'],'FINAL CHAMPIONS 2014','',[
   (4,'¿EN EL 92:48?',dict(type='intro',hook=True,big='¿EN EL\n92:48?',bigSize=180,score=[0,1],clock="92'")),
   (6,'TIRO DE ESQUINA…',dict(type='header',team=0,idx=3,score=[[0,[0,1]],[0.7,[1,1]]],big=[[0,None],[0.72,'¡GOL!']],clock="92'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'SERGIO RAMOS',dict(type='header',team=0,idx=3,cam='goal',score=[[0,[0,1]],[0.7,[1,1]]],big=[[0,None],[0.72,'¡RAMOS!']],clock="92'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'LA DÉCIMA',dict(type='trophy',team=0,idx=3,lift=True,confetti=True,score=[4,1],clock='FINAL',big=[[0,None],[0.45,'4-1']])),
   (5,'',dict(type='outro'))]),
 'e67':(['ESP','NED'],'FINAL MUNDIAL 2010','',[
   (4,'¿CON EL PIE?',dict(type='intro',hook=True,big='¿CON EL\nPIE?',bigSize=200,score=[0,0],clock="62'")),
   (7,'ROBBEN SOLO FRENTE AL PORTERO',dict(type='save',team=0,idx=6,side=1,big=[[0,None],[0.5,'¡ATAJADA!']],score=[0,0],clock="62'",shake=1,shakeAt=0.42)),
   (5,'IKER CASILLAS',dict(type='save',team=0,idx=6,side=1,cam='goal',big=[[0,None],[0.5,'¡SAN IKER!']],score=[0,0],clock="62'",shake=1,shakeAt=0.42)),
   (5,'ESPAÑA CAMPEONA',dict(type='trophy',team=0,idx=6,lift=True,confetti=True,score=[1,0],clock='FINAL',big=[[0,None],[0.45,'1-0']])),
   (5,'',dict(type='outro'))]),
 'e68':(['ENG','BRA'],'MUNDIAL MÉXICO 70','',[
   (4,'¿LA MEJOR ATAJADA?',dict(type='intro',hook=True,big='¿LA MEJOR\nATAJADA?',bigSize=160,score=[0,0],clock="10'")),
   (7,'CABEZAZO DE PELÉ…',dict(type='save',team=1,idx=8,side=-1,big=[[0,None],[0.5,'¡NOOO!']],score=[0,0],clock="10'",shake=1,shakeAt=0.42)),
   (5,'GORDON BANKS',dict(type='save',team=1,idx=8,side=-1,cam='goal',big=[[0,None],[0.5,'¡BANKS!']],score=[0,0],clock="10'",shake=1,shakeAt=0.42)),
   (5,'NI PELÉ LO CREÍA',dict(type='stat',team=0,score=[0,0],clock="10'",big='¡IMPOSIBLE!',bigSize=150)),
   (5,'',dict(type='outro'))]),
 'e69':(['BAR','RMA'],'EL CLÁSICO · 2005','',[
   (4,'¿LO APLAUDIÓ EL RIVAL?',dict(type='intro',hook=True,big='¿LO APLAUDIÓ\nEL RIVAL?',bigSize=140,score=[1,0],clock="59'")),
   (7,'SE QUITA A TODOS…',G('¡GOLAZO!',team=0,idx=9,dist=22,sz=-6,score=[[0,[1,0]],[0.6,[2,0]]],clock="59'")),
   (5,'RONALDINHO',dict(type='crowd',scarf='#ffffff',score=[2,0],clock="59'",big='¡APLAUSOS!',bigSize=160)),
   (5,'EN EL BERNABÉU',dict(type='stat',team=0,score=[3,0],clock='FINAL',big='0-3',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e70':(['BAR','RMA'],'EL CLÁSICO · 2017','',[
   (4,'¿ENSEÑÓ LA CAMISETA?',dict(type='intro',hook=True,big='¿ENSEÑÓ LA\nCAMISETA?',bigSize=140,score=[2,2],clock="92'")),
   (7,'ÚLTIMO MINUTO…',G('¡GOOOL!',team=0,idx=9,dist=14,sz=3,score=[[0,[2,2]],[0.6,[3,2]]],clock="92'")),
   (5,'LIONEL MESSI',dict(type='celebrate',team=0,score=[3,2],clock="92'",big='10',bigSize=230)),
   (5,'SU GOL 500',dict(type='stat',team=0,score=[3,2],clock='FINAL',big='500',bigSize=230)),
   (5,'',dict(type='outro'))]),
 'e71':(['MEX','ITA'],'MUNDIAL 2002','',[
   (4,'¿DE ESPALDAS?',dict(type='intro',hook=True,big='¿DE\nESPALDAS?',bigSize=190,score=[0,0],clock="34'")),
   (6,'CENTRO AL ÁREA',dict(type='header',team=0,idx=9,score=[[0,[0,0]],[0.7,[1,0]]],big=[[0,None],[0.72,'¡GOLAZO!']],clock="34'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'JARED BORGETTI',dict(type='header',team=0,idx=9,cam='goal',score=[[0,[0,0]],[0.7,[1,0]]],big=[[0,None],[0.72,'¡BORGETTI!']],clock="34'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'DE NUCA A ITALIA',dict(type='stat',team=0,score=[1,0],clock="34'",big='¡DE NUCA!',bigSize=170)),
   (5,'',dict(type='outro'))]),
 'e72':(['MEX','GER'],'MUNDIAL RUSIA 2018','',[
   (4,'¿LE GANÓ AL CAMPEÓN?',dict(type='intro',hook=True,big='¿LE GANÓ AL\nCAMPEÓN?',bigSize=145,score=[0,0],clock="35'")),
   (7,'CONTRAGOLPE…',G('¡GOOOL!',team=0,idx=10,dist=14,sz=4,score=[[0,[0,0]],[0.6,[1,0]]],clock="35'")),
   (5,'HIRVING LOZANO',dict(type='celebrate',team=0,score=[1,0],clock="35'",big='¡CHUCKY!',bigSize=180)),
   (5,'¡HASTA UN SISMO!',dict(type='crowd',scarf='#006847',score=[1,0],clock='FINAL',big='1-0',bigSize=200,shake=1.5,shakeAt=0.2)),
   (5,'',dict(type='outro'))]),
 'e73':(['ARG','FRA'],'FINAL MUNDIAL 2022','',[
   (4,'¿AL FIN?',dict(type='intro',hook=True,big='¿AL\nFIN?',bigSize=220,score=[3,3],clock='PENALES')),
   (7,'EL ÚLTIMO PENAL…',dict(type='penalty',team=0,idx=3,outcome='goal',tz=2.4,score=[[0,['3 (3)','3 (2)']],[0.6,['3 (4)','3 (2)']]],big=[[0,None],[0.62,'¡CAMPEONES!']],clock='PENALES',flashes=1,shake=1)),
   (5,'LIONEL MESSI',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=['3 (4)','3 (2)'],clock='FINAL',big=[[0,None],[0.45,'🏆']])),
   (5,'CAMPEÓN DEL MUNDO',dict(type='stat',team=0,score=['3 (4)','3 (2)'],clock='FINAL',big='LA TERCERA',bigSize=150)),
   (5,'',dict(type='outro'))]),
 'e74':(['FRA','ARG'],'FINAL MUNDIAL 2022','',[
   (4,'¿3 GOLES Y PERDIÓ?',dict(type='intro',hook=True,big='¿3 GOLES\nY PERDIÓ?',bigSize=165,score=[2,3],clock="118'")),
   (7,'PENAL EN EL 118',dict(type='penalty',team=0,idx=9,outcome='goal',tz=-2.4,score=[[0,[2,3]],[0.6,[3,3]]],big=[[0,None],[0.62,'3-3']],clock="118'",flashes=1,shake=1)),
   (5,'KYLIAN MBAPPÉ',dict(type='celebrate',team=0,score=[3,3],clock="118'",big='¡HAT-TRICK!',bigSize=150)),
   (5,'Y AUN ASÍ PERDIÓ',dict(type='stat',team=0,score=[3,3],clock='PENALES',big='2-4',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e75':(['LEI','MCI'],'PREMIER LEAGUE · 2016','',[
   (4,'¿5000 A 1?',dict(type='intro',hook=True,big='¿5000\nA 1?',bigSize=200,score=[0,0],clock="3'")),
   (7,'NADIE CREÍA EN ELLOS',G('¡GOL!',team=0,idx=9,dist=12,sz=-4,score=[[0,[0,0]],[0.6,[1,0]]],clock="3'")),
   (5,'JAMIE VARDY',dict(type='celebrate',team=0,score=[1,0],clock="3'",big='¡VARDY!',bigSize=190)),
   (5,'LEICESTER CAMPEÓN',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[3,1],clock='FINAL',big=[[0,None],[0.45,'🏆']])),
   (5,'',dict(type='outro'))]),
 'e76':(['BAR','MUN'],'FINAL CHAMPIONS 2009','',[
   (4,'¿MESSI DE CABEZA?',dict(type='intro',hook=True,big='¿MESSI DE\nCABEZA?',bigSize=160,score=[1,0],clock="70'")),
   (6,'CENTRO DE XAVI',dict(type='header',team=0,idx=9,score=[[0,[1,0]],[0.7,[2,0]]],big=[[0,None],[0.72,'¡GOL!']],clock="70'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'MIDE 1.70',dict(type='header',team=0,idx=9,cam='goal',score=[[0,[1,0]],[0.7,[2,0]]],big=[[0,None],[0.72,'¡1.70!']],clock="70'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'BARÇA CAMPEÓN',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[2,0],clock='FINAL',big=[[0,None],[0.45,'2-0']])),
   (5,'',dict(type='outro'))]),
 'e77':(['FRA','BRA'],'FINAL MUNDIAL 1998','',[
   (4,'¿DOS DE CABEZA EN LA FINAL?',dict(type='intro',hook=True,big='¿DOS DE\nCABEZA?',bigSize=180,score=[0,0],clock="27'")),
   (6,'TIRO DE ESQUINA',dict(type='header',team=0,idx=10,score=[[0,[0,0]],[0.7,[1,0]]],big=[[0,None],[0.72,'¡GOL!']],clock="27'",flashes=2,shake=1,shakeAt=0.7)),
   (5,'¡Y OTRA VEZ!',dict(type='header',team=0,idx=10,cam='goal',score=[[0,[1,0]],[0.7,[2,0]]],big=[[0,None],[0.72,'¡ZIZOU!']],clock="45+1'",flashes=1,shake=1,shakeAt=0.7)),
   (6,'FRANCIA CAMPEONA',dict(type='trophy',team=0,idx=10,lift=True,confetti=True,score=[3,0],clock='FINAL',big=[[0,None],[0.45,'3-0']])),
   (5,'',dict(type='outro'))]),
 'e78':(['GER','ARG'],'FINAL MUNDIAL 2014','',[
   (4,'¿EN EL 113?',dict(type='intro',hook=True,big='¿EN EL\n113?',bigSize=200,score=[0,0],clock="113'")),
   (7,'LA BAJA CON EL PECHO…',G('¡GOLAZO!',team=0,idx=9,dist=10,sz=-4,score=[[0,[0,0]],[0.6,[1,0]]],clock="113'")),
   (5,'MARIO GÖTZE',G('¡GÖTZE!',team=0,idx=9,dist=10,sz=-4,cam='goal',score=[[0,[0,0]],[0.6,[1,0]]],clock="113'")),
   (5,'ALEMANIA CAMPEONA',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[1,0],clock='FINAL',big=[[0,None],[0.45,'1-0']])),
   (5,'',dict(type='outro'))]),
 'e79':(['MEX','BRA'],'FINAL OLÍMPICA · LONDRES 2012','',[
   (4,'¿A LOS 28 SEGUNDOS?',dict(type='intro',hook=True,big='¿A LOS 28\nSEGUNDOS?',bigSize=150,score=[0,0],clock="0'")),
   (7,'ROBO EN LA SALIDA',G('¡GOOOL!',team=0,idx=9,dist=18,sz=3,score=[[0,[0,0]],[0.6,[1,0]]],clock="1'")),
   (5,'ORIBE PERALTA',dict(type='celebrate',team=0,score=[1,0],clock="1'",big='¡ORIBE!',bigSize=190)),
   (5,'¡MEDALLA DE ORO!',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[2,1],clock='FINAL',big=[[0,None],[0.45,'🥇']])),
   (5,'',dict(type='outro'))]),
 'e80':(['ITA','ENG'],'EUROCOPA 2012','',[
   (4,'¿PANENKA EN PENALES?',dict(type='intro',hook=True,big='¿PANENKA EN\nPENALES?',bigSize=145,score=['0 (1)','0 (2)'],clock='PENALES')),
   (7,'ITALIA PERDÍA…',dict(type='penalty',team=0,idx=8,outcome='goal',tz=0,ty=1.9,side=1,score=[[0,['0 (1)','0 (2)']],[0.6,['0 (2)','0 (2)']]],big=[[0,None],[0.62,'¡PANENKA!']],clock='PENALES',flashes=1,shake=1)),
   (5,'ANDREA PIRLO',dict(type='celebrate',team=0,score=['0 (2)','0 (2)'],clock='PENALES',big='¡PIRLO!',bigSize=190)),
   (5,'ITALIA GANÓ',dict(type='stat',team=0,score=['0 (4)','0 (2)'],clock='FINAL',big='4-2',bigSize=200)),
   (5,'',dict(type='outro'))]),
 'e91':(['CDP','FAN'],'¿CÓMO DEPORTES? · 16 NOV','',[
   (4,'¡LO LOGRAMOS!',dict(type='intro',hook=True,big='¡SOMOS\n100!',bigSize=210,score=[99,0],clock="90+5'")),
   (6,'GOL NÚMERO 100',G('¡100!',team=0,idx=9,dist=14,sz=-3,score=[[0,[99,0]],[0.6,[100,0]]],clock="90+5'")),
   (5,'GRACIAS A CADA UNO',dict(type='crowd',scarf='#ffd400',score=[100,0],clock='FINAL',big='¡GRACIAS!',bigSize=170,shake=1,shakeAt=0.3)),
   (6,'100 SEGUIDORES',dict(type='trophy',team=0,idx=9,lift=True,confetti=True,score=[100,0],clock='FINAL',flashes=2,big=[[0,None],[0.45,'🏆 100']])),
   (5,'¿VAMOS POR 1000?',dict(type='stat',team=0,score=[100,0],clock='FINAL',big='VAMOS\nPOR 1000',bigSize=150)),
   (4,'',dict(type='outro'))]),
}
cfgs={}; tim=json.load(open('timing.json'))
for k,(tm,label,_,shots) in E.items():
    t=0.0; segs=[]; out=[]
    for beats,cap,sh in shots:
        d=beats*B; segs.append({'text':cap or ' ','start':round(t,3),'end':round(t+d-0.1,3)}); t+=d; out.append(sh)
    cfgs[k]=dict(sport='soccer',label=label,teams=[T[tm[0]],T[tm[1]]],crowd=[T[tm[0]]['shirt'],'#ffffff',T[tm[1]]['shirt'],T[tm[0]]['shirt']],confetti=[T[tm[0]]['shirt'],'#ffffff','#ffd700'],series='EDITS ⚽ ¿CÓMO DEPORTES?',outroSub=('¡AYÚDANOS A LLEGAR A 1000!' if k=='e91' else '¡AYÚDANOS A LLEGAR A 100!' if k in ('e34','e60') else 'PARTE 2 → SÍGUENOS' if int(k[1:])>=14 else '+ EDITS DE FUTBOL'),rain=int(k[1:])>=14,blocky=35<=int(k[1:])<=52,grade='contrast(1.15) saturate(1.35)',shots=out)
    tim[k]={'dur':round(t-0.8,3),'segs':segs,'bpm':128}

NT={
 'NE':{'name':'Patriots','abbr':'NE','shirt':'#0c2340','alt':'#c60c30','shorts':'#b0b7bc','socks':'#0c2340','num':'#ffffff','numStroke':'#c60c30','helmet':'#b0b7bc','mask':'#0c2340','helmetStripe':'#c60c30'},
 'NE_W':{'name':'Patriots','abbr':'NE','shirt':'#ffffff','alt':'#0c2340','shorts':'#b0b7bc','socks':'#0c2340','num':'#0c2340','numStroke':'#c60c30','helmet':'#b0b7bc','mask':'#0c2340','helmetStripe':'#0c2340'},
 'ATL':{'name':'Falcons','abbr':'ATL','shirt':'#a71930','alt':'#000000','shorts':'#ffffff','socks':'#000000','num':'#ffffff','numStroke':'#000000','helmet':'#101820','mask':'#555','helmetStripe':'#a71930'},
 'SF':{'name':'49ers','abbr':'SF','shirt':'#aa0000','alt':'#b3995d','shorts':'#b3995d','socks':'#aa0000','num':'#ffffff','numStroke':'#000000','helmet':'#b3995d','mask':'#999','helmetStripe':'#aa0000'},
 'DAL':{'name':'Cowboys','abbr':'DAL','shirt':'#ffffff','alt':'#003594','shorts':'#869397','socks':'#003594','num':'#003594','numStroke':'#ffffff','helmet':'#c0c8cc','mask':'#ddd','helmetStripe':'#003594'},
 'NYG':{'name':'Giants','abbr':'NYG','shirt':'#0b2265','alt':'#a71930','shorts':'#a5acaf','socks':'#0b2265','num':'#ffffff','numStroke':'#a71930','helmet':'#0b2265','mask':'#999','helmetStripe':'#a71930'},
 'KC':{'name':'Chiefs','abbr':'KC','shirt':'#e31837','alt':'#ffb81c','shorts':'#ffffff','socks':'#e31837','num':'#ffffff','numStroke':'#ffb81c','helmet':'#e31837','mask':'#ddd','helmetStripe':'#ffffff'},
 'BUF':{'name':'Bills','abbr':'BUF','shirt':'#00338d','alt':'#c60c30','shorts':'#ffffff','socks':'#00338d','num':'#ffffff','numStroke':'#c60c30','helmet':'#ffffff','mask':'#00338d','helmetStripe':'#c60c30'},
 'MIA':{'name':'Dolphins','abbr':'MIA','shirt':'#008e97','alt':'#fc4c02','shorts':'#ffffff','socks':'#008e97','num':'#ffffff','numStroke':'#fc4c02','helmet':'#ffffff','mask':'#008e97','helmetStripe':'#fc4c02'},
 'TB':{'name':'Buccaneers','abbr':'TB','shirt':'#d50a0a','alt':'#34302b','shorts':'#b1babf','socks':'#d50a0a','num':'#ffffff','numStroke':'#34302b','helmet':'#b1babf','mask':'#34302b','helmetStripe':'#d50a0a'},
 'SEA':{'name':'Seahawks','abbr':'SEA','shirt':'#002244','alt':'#69be28','shorts':'#a5acaf','socks':'#002244','num':'#ffffff','numStroke':'#69be28','helmet':'#002244','mask':'#a5acaf','helmetStripe':'#69be28'},
 'NO':{'name':'Saints','abbr':'NO','shirt':'#ffffff','alt':'#d3bc8d','shorts':'#d3bc8d','socks':'#101820','num':'#101820','numStroke':'#d3bc8d','helmet':'#d3bc8d','mask':'#101820','helmetStripe':'#101820'},
 'PHI':{'name':'Eagles','abbr':'PHI','shirt':'#004c54','alt':'#a5acaf','shorts':'#ffffff','socks':'#004c54','num':'#ffffff','numStroke':'#000000','helmet':'#004c54','mask':'#a5acaf','helmetStripe':'#a5acaf'},
 'PIT':{'name':'Steelers','abbr':'PIT','shirt':'#101820','alt':'#ffb612','shorts':'#ffb612','socks':'#101820','num':'#ffb612','numStroke':'#ffffff','helmet':'#101820','mask':'#999','helmetStripe':'#ffb612'},
 'OAK':{'name':'Raiders','abbr':'OAK','shirt':'#ffffff','alt':'#000000','shorts':'#a5acaf','socks':'#000000','num':'#000000','numStroke':'#a5acaf','helmet':'#a5acaf','mask':'#000','helmetStripe':'#000000'},
}
NUM=lambda qb,rb,wr:[qb,rb,wr,11,84,64,70,66,75,61,33]
DEF=[54,24,26,41,72,63,75,79,67,50,43]
PTD=lambda b,sc,clk,**k: dict(dict(type='pass',team=0,los=25,rec=1,rx=54,rz=-10,rzs=6,td=True,tThrow=0.3,tCatch=0.7,score=sc,big=[[0,None],[0.72,b]],clock=clk,shake=1,shakeAt=0.72,flashes=1),**k)
RTD=lambda b,sc,clk,**k: dict(dict(type='runTD',team=0,idx=1,x0=30,xe=53,score=sc,big=[[0,None],[0.85,b]],clock=clk,shake=1,shakeAt=0.86,flashes=1),**k)
EN={
 'e81':(['NE_W','ATL'],'SUPER BOWL LI · 2017',(12,28,11),[
   (4,'¿28-3 Y REMONTARON?',dict(type='intro',hook=True,big='¿28-3 Y\nREMONTARON?',bigSize=150,score=[3,28],clock='3Q 8:31')),
   (7,'TOM BRADY NO SE RINDIÓ',PTD('TOUCHDOWN',[[0,[20,28]],[0.72,[28,28]]],'4Q 0:57')),
   (5,'TIEMPO EXTRA',RTD('¡GANARON!',[[0,[28,28]],[0.85,[34,28]]],'OT',dive=True)),
   (5,'LA MAYOR REMONTADA',dict(type='celebrate',team=0,x=30,confetti=True,trophy=True,big='34-28',score=[34,28],clock='FINAL',flashes=2)),
   (5,'',dict(type='outro'))]),
 'e82':(['NYG','NE_W'],'SUPER BOWL XLII · 2008',(10,17,85),[
   (4,'¿CON EL CASCO?',dict(type='intro',hook=True,big='¿CON EL\nCASCO?',bigSize=190,score=[10,14],clock='4Q 1:15')),
   (7,'SE ESCAPA DE 3…',dict(type='scramble',team=0,los=-6,escape=True,pr=[0,1],throwAt=0.78,score=[10,14],clock='4Q 1:15')),
   (5,'LA ATRAPA CONTRA EL CASCO',dict(type='catchLeap',team=0,rec=2,helmet=True,x=26,z=0,p0=0.05,p1=0.95,a0=-2.2,a1=-1.4,score=[10,14],clock='4Q 1:00',big='¡EL CASCO!',flashes=1.5,shake=0.8,shakeAt=0.5)),
   (5,'ARRUINÓ LA TEMPORADA PERFECTA',dict(type='celebrate',team=0,x=0,confetti=True,trophy=True,big='17-14',score=[17,14],clock='FINAL',flashes=2)),
   (5,'',dict(type='outro'))]),
 'e83':(['SF','DAL'],'FINAL NFC · 1982',(16,32,87),[
   (4,'¿CÓMO LA ATRAPÓ?',dict(type='intro',hook=True,big='¿CÓMO LA\nATRAPÓ?',bigSize=170,score=[21,27],clock='4Q 0:58')),
   (7,'ÚLTIMOS SEGUNDOS…',dict(type='pass',team=0,los=44,qz=14,rec=2,rx=57,rz=13,rzs=-10,tThrow=0.3,tCatch=1.6,arcH=5,leap=True,score=[21,27],clock='4Q 0:51')),
   (5,'DWIGHT CLARK',dict(type='catchLeap',team=0,rec=2,x=57,z=13,p0=-1.0,p1=0.55,a0=-1.6,a1=-0.9,score=[[0,[21,27]],[0.6,[27,27]]],big=[[0,None],[0.6,'TOUCHDOWN']],clock='4Q 0:51',shake=1,shakeAt=0.6,flashes=1.5)),
   (5,'"THE CATCH"',dict(type='celebrate',team=0,x=53,z=10,big='28-27',score=[28,27],clock='FINAL',flashes=1.5)),
   (5,'',dict(type='outro'))]),
 'e84':(['KC','BUF'],'PLAYOFFS NFL · 2022',(15,25,87),[
   (4,'¿EN 13 SEGUNDOS?',dict(type='intro',hook=True,big='¿EN 13\nSEGUNDOS?',bigSize=170,score=[33,36],clock='4Q 0:13')),
   (7,'PASE LARGO…',PTD('¡44 YARDAS!',[[0,[33,36]],[0.72,[33,36]]],'4Q 0:13',td=False)),
   (5,'PATRICK MAHOMES',dict(type='hero',team=0,idx=0,ballInHand=True,score=[36,36],clock='4Q 0:00',x=-15,big='36-36',bigSize=190)),
   (5,'GANARON EN TIEMPO EXTRA',RTD('42-36',[[0,[36,36]],[0.85,[42,36]]],'OT')),
   (5,'',dict(type='outro'))]),
 'e85':(['MIA','NE'],'NFL · 2018',(8,30,14),[
   (4,'¿EL MILAGRO DE MIAMI?',dict(type='intro',hook=True,big='¿EL MILAGRO\nDE MIAMI?',bigSize=145,score=[28,33],clock='4Q 0:07')),
   (7,'PASE, LATERAL, LATERAL…',RTD('TOUCHDOWN',[[0,[28,33]],[0.85,[34,33]]],'4Q 0:00',x0=-5)),
   (5,'¡69 YARDAS!',dict(type='celebrate',team=0,x=53,big='¡MILAGRO!',score=[34,33],clock='FINAL',flashes=2)),
   (5,'LE GANARON A BRADY',dict(type='stat',big='34-33',bigSize=200,score=[34,33],clock='FINAL',los=10)),
   (5,'',dict(type='outro'))]),
 'e86':(['TB','KC'],'SUPER BOWL LV · 2021',(12,28,87),[
   (4,'¿A LOS 43 AÑOS?',dict(type='intro',hook=True,big='¿A LOS 43\nAÑOS?',bigSize=180,score=[0,0],clock='1Q')),
   (7,'TOM BRADY',PTD('TOUCHDOWN',[[0,[14,6]],[0.72,[21,6]]],'2Q 0:06')),
   (5,'SU SÉPTIMO ANILLO',dict(type='celebrate',team=0,x=0,confetti=True,trophy=True,big='7 💍',score=[31,9],clock='FINAL',flashes=2)),
   (5,'NADIE TIENE MÁS',dict(type='stat',big='7',bigSize=240,score=[31,9],clock='FINAL',los=10)),
   (5,'',dict(type='outro'))]),
 'e87':(['SEA','NO'],'PLAYOFFS NFL · 2011',(3,24,81),[
   (4,'¿UN TEMBLOR?',dict(type='intro',hook=True,big='¿UN\nTEMBLOR?',bigSize=190,score=[34,30],clock='4Q 3:38')),
   (7,'SE QUITA A 9 RIVALES',RTD('TOUCHDOWN',[[0,[34,30]],[0.85,[41,30]]],'4Q 3:22',x0=-15)),
   (5,'MARSHAWN LYNCH',dict(type='celebrate',team=0,x=53,big='¡BEAST MODE!',bigSize=150,score=[41,30],clock='4Q 3:22',flashes=2)),
   (5,'LOS FANS HICIERON TEMBLAR LA TIERRA',dict(type='stat',big='SISMO',bigSize=200,score=[41,36],clock='FINAL',los=10,shake=1.5,shakeAt=0.3)),
   (5,'',dict(type='outro'))]),
 'e88':(['PHI','NE'],'SUPER BOWL LII · 2018',(9,26,86),[
   (4,'¿EL QB LA ATRAPÓ?',dict(type='intro',hook=True,big='¿EL QB LA\nATRAPÓ?',bigSize=160,score=[15,12],clock='2Q 0:38')),
   (7,'JUGADA DE ENGAÑO',PTD('TOUCHDOWN',[[0,[15,12]],[0.72,[22,12]]],'2Q 0:34',rec=0)),
   (5,'"PHILLY SPECIAL"',dict(type='celebrate',team=0,x=53,big='¡PHILLY\nSPECIAL!',bigSize=140,score=[22,12],clock='2Q 0:34',flashes=2)),
   (5,'EAGLES CAMPEONES',dict(type='celebrate',team=0,x=0,confetti=True,trophy=True,big='41-33',score=[41,33],clock='FINAL',flashes=2)),
   (5,'',dict(type='outro'))]),
 'e89':(['NYG','DAL'],'NFL · 2014',(10,44,13),[
   (4,'¿CON UNA MANO?',dict(type='intro',hook=True,big='¿CON UNA\nMANO?',bigSize=180,score=[0,3],clock='2Q 1:00')),
   (7,'LE JALAN EL BRAZO…',PTD('TOUCHDOWN',[[0,[7,3]],[0.72,[14,3]]],'2Q 0:56',leap=True)),
   (5,'ODELL BECKHAM JR.',dict(type='catchLeap',team=0,rec=2,x=55,z=8,p0=0.05,p1=0.95,a0=-2.2,a1=-1.4,score=[14,3],clock='2Q 0:56',big='¡1 MANO!',flashes=1.5)),
   (5,'LA MEJOR ATRAPADA',dict(type='stat',big='¡IMPOSIBLE!',bigSize=150,score=[14,3],clock='2Q 0:56',los=10)),
   (5,'',dict(type='outro'))]),
 'e90':(['PIT','OAK'],'PLAYOFFS NFL · 1972',(12,36,82),[
   (4,'¿REBOTÓ Y LA ATRAPÓ?',dict(type='intro',hook=True,big='¿REBOTÓ Y\nLA ATRAPÓ?',bigSize=150,score=[6,7],clock='4Q 0:22')),
   (7,'ÚLTIMA JUGADA…',PTD('¡REBOTE!',[[0,[6,7]],[0.72,[6,7]]],'4Q 0:05',td=False)),
   (5,'FRANCO HARRIS',RTD('TOUCHDOWN',[[0,[6,7]],[0.85,[12,7]]],'4Q 0:00',x0=10)),
   (5,'"LA RECEPCIÓN INMACULADA"',dict(type='celebrate',team=0,x=53,big='13-7',score=[13,7],clock='FINAL',flashes=2)),
   (5,'',dict(type='outro'))]),
}
for k,(tm,label,num,shots) in EN.items():
    t=0.0; segs=[]; out=[]
    for beats,cap,sh in shots:
        d=beats*B; segs.append({'text':cap or ' ','start':round(t,3),'end':round(t+d-0.1,3)}); t+=d; out.append(sh)
    a,b=NT[tm[0]],NT[tm[1]]
    cfgs[k]=dict(sport='nfl',label=label,teams=[a,b],offense=0,shotgun=True,numbers=[NUM(*num),DEF],crowd=[a['shirt'],a['alt'],b['shirt'],'#ffffff'],confetti=[a['shirt'],'#ffffff','#ffd700'],series='EDITS 🏈 ¿CÓMO DEPORTES?',outroSub='PARTE 2 → SÍGUENOS',rain=True,grade='contrast(1.15) saturate(1.35)',shots=out)
    tim[k]={'dur':round(t-0.8,3),'segs':segs,'bpm':128}

NT['LAC']={'name':'Chargers','abbr':'LAC','shirt':'#0080c6','alt':'#ffc20e','shorts':'#ffffff','socks':'#0080c6','num':'#ffffff','numStroke':'#ffc20e','helmet':'#0080c6','mask':'#ffc20e','helmetStripe':'#ffc20e'}
NT['DAL_H']={'name':'Cowboys','abbr':'DAL','shirt':'#ffffff','alt':'#003594','shorts':'#869397','socks':'#003594','num':'#003594','numStroke':'#ffffff','helmet':'#869397','mask':'#003594','helmetStripe':'#003594'}
exec(open('memes.py').read())
for k,(shots,lines,title) in build().items():
    a,b=NT['LAC'],NT['DAL_H']
    cfgs[k]=dict(sport='nfl',blocky=True,ref=True,noBoard=True,label='',teams=[a,b],offense=0,numbers=[NUM(10,25,13),[88,4,11,21,90,54,75,79,67,50,43]],crowd=['#0080c6','#ffc20e','#003594','#869397','#ffffff'],confetti=['#0080c6','#ffc20e','#ffffff'],series='NFL ⚡ ¿CÓMO DEPORTES?',outroSub='SÍGUENOS PARA MÁS',grade='contrast(1.1) saturate(1.3)',shots=shots)

T['DOL']={'name':'Dólar FC','abbr':'$1','shirt':'#0b8f4d','alt':'#f2c200','shorts':'#ffffff','socks':'#0b8f4d','num':'#ffffff','numStroke':'#f2c200','keeper':'#f28c28'}
T['RIC']={'name':'Ricos FC','abbr':'RIC','shirt':'#7a3fa0','alt':'#f2c200','shorts':'#111111','socks':'#7a3fa0','num':'#ffffff','numStroke':'#111','keeper':'#2c8f45'}
exec(open('serie.py').read())
HUD={'e150':{'like':'$0','fan':'0','jug':'0'},'e151':{'like':'$20','fan':'11','jug':'9'},'e152':{'like':'$42','fan':'24','jug':'11','goal':10000}}
for i,(k,(shots,lines,part)) in enumerate(build().items()):
    a,b=T['DOL'],T['RIC']
    cfgs[k]=dict(sport='soccer',blocky=True,label='CLUB DE 1 DÓLAR · '+part,teams=[a,b],crowd=['#0b8f4d','#f2c200','#ffffff','#7a3fa0'],confetti=['#0b8f4d','#f2c200','#ffffff'],series='SERIE ⚽ CLUB DE $1',noBoard=True,hud=HUD.get(k,{'like':'$0','fan':'0','jug':'0'}),outroSub=('PARTE %d → SÍGUENOS' % (i+2)) if i<9 else '¿TEMPORADA 2? COMENTA',grade='contrast(1.1) saturate(1.3)',shots=shots)
SCR={}
exec(open('bicho.py').read())
T['SPO']={'name':'Sporting','abbr':'SCP','shirt':'#0b8f4d','alt':'#ffffff','shorts':'#111111','socks':'#0b8f4d','num':'#ffffff','numStroke':'#111','keeper':'#f2c200'}
for i,(part,beats) in enumerate(BICHO):
    k=f'e{160+i}'; shots=[]; lines=[]
    for line,sh in beats:
        sh=dict(sh); sh.setdefault('clock',part); shots.append(sh); lines.append(line)
    SCR[k]=lines
    cfgs[k]=dict(sport='soccer',label='LA VIDA DEL BICHO · '+part,teams=[T['SPO'],T['MUN']],crowd=['#0b8f4d','#ffffff','#da291c','#111111'],confetti=['#0b8f4d','#ffffff','#ffd700'],series='SERIE ⚽ LA VIDA DEL BICHO',noBoard=True,outroSub='EPISODIO %d → SÍGUEME' % (i+2),grade='contrast(1.15) saturate(1.25)',shots=shots)
sj=json.load(open('scripts.json')); sj.update(SCR); json.dump(sj,open('scripts.json','w'),ensure_ascii=False,indent=1)
exec(open('ytseries.py').read())
NT['UNO']={'name':'Dólar Bulls','abbr':'$1','shirt':'#111111','alt':'#f2c200','shorts':'#f2c200','socks':'#111111','num':'#f2c200','numStroke':'#111111','helmet':'#111111','mask':'#f2c200','helmetStripe':'#f2c200'}
T['EST']={'name':'Vacío FC','abbr':'VFC','shirt':'#1e5aa8','alt':'#ffffff','shorts':'#ffffff','socks':'#1e5aa8','num':'#ffffff','numStroke':'#111','keeper':'#f2c200'}
for k,c in YT.items():
    shots=[]; lines=[]
    for line,sh in c['beats']:
        sh=dict(sh); sh.setdefault('clock',c['part']); shots.append(sh); lines.append(line)
    SCR[k]=lines
    base=dict(label=c['label'],series=c['series'],noBoard=True,hud=c['hud'],outroSub=c['outro'],grade='contrast(1.1) saturate(1.3)',shots=shots,blocky=True)
    if c['kind']=='nfl': cfgs[k]=dict(base,sport='nfl',crowdFill=0.04,seatColor='#5a5f66',teams=[NT['UNO'],NT['DAL_H']],offense=0,numbers=[NUM(1,25,13),[88,4,11,21,90,54,75,79,67,50,43]],crowd=['#3a3f47','#2f343b','#444a52'],confetti=['#f2c200','#111111','#ffffff'])
    elif k=='e193': cfgs[k]=dict(base,sport='soccer',blocky=False,teams=[T['EST'],T['MUN']],crowd=['#1e5aa8','#ffffff','#ffd400'],confetti=['#1e5aa8','#ffffff','#ffd700'])
    elif k=='e190': cfgs[k]=dict(base,sport='soccer',teams=[T['EST'],T['MUN']],confetti=['#1e5aa8','#ffffff','#ffd700'])
    else: cfgs[k]=dict(base,sport='soccer',crowdFill=0.0,teams=[T['EST'],T['MUN']],crowd=['#3a3f47','#2f343b','#444a52'],confetti=['#1e5aa8','#ffffff','#ffd700'])
sj=json.load(open('scripts.json')); sj.update(SCR); json.dump(sj,open('scripts.json','w'),ensure_ascii=False,indent=1)
json.dump(tim,open('timing.json','w'),ensure_ascii=False,indent=1)
open('edits.js','w').write('export const CONFIGS = '+json.dumps(cfgs,ensure_ascii=False)+';\n')
print({k:round(v['dur']+0.8,1) for k,v in tim.items() if k.startswith('e') and k[1:].isdigit()})
