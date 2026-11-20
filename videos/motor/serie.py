# Serie "Compré un club por 1 dólar" (3D cuadrada, soccer). Una línea de voz por toma.
P={'i':'idle','c':'cheer','s':'sad','k':'kneel','d':'down','p':'point','h':'shrug','f':'facepalm','r':'run','a':'armsUp','w':'shake','x':'dance'}
def SK(acts,cam='front',stamp=None,big=None,**k):
    sh=dict(type='skit',actors=[dict(team=t,idx=i,x=x,pose=P[p]) for (t,i,x,p) in acts],cam=cam,**k)
    if stamp: sh['stamp']=[[0,None],[0.35,stamp]]
    if big: sh.update(big=big,bigSize=150,hook=True,bigY=470)
    return sh
G=lambda b,sc,**k: dict(dict(type='goal',big=[[0,None],[0.62,b]],flashes=1,shake=1,shakeAt=0.62,score=sc),**k)
ME=(0,10,0,'i')  # el dueño (yo)
EPS=[
 ('PARTE 1','¿COMPRÉ UN CLUB\nPOR 1 DÓLAR?',[
  ('Compré un club de futbol por un dólar.', SK([(0,10,0,'c')],big='¿COMPRÉ UN CLUB\nPOR 1 DÓLAR?')),
  ('Pensé que era la mejor compra de mi vida.', SK([(0,10,0,'x')],cam='close')),
  ('Cada like es un dólar para el club. Cada seguidor, un fan. Y cada comentario, un jugador.', SK([(0,10,0,'p')],cam='close',stamp='¡AYÚDANOS!')),
  ('Hasta que vi la deuda.', SK([(0,10,0,'s')],cam='front',stamp='DEUDA: $50 MILLONES')),
  ('Y el club no tiene ni un jugador.', SK([(0,10,0,'k')],cam='wide',stamp='JUGADORES: 0')),
  ('Parte dos: busco jugadores. Síguenos.', dict(type='outro'))]),
 ('PARTE 2','¿7 DÍAS PARA\nSALVAR EL CLUB?',[
  ('Tengo siete días para salvar este club… o desaparece.', SK([(0,10,0,'f')],big='¿7 DÍAS PARA\nSALVAR EL CLUB?')),
  ('Gracias a ustedes juntamos veinte dólares, once fans… y nueve jugadores.', SK([(0,10,0,'c')],cam='close',stamp='$20 · 11 FANS · 9 JUGADORES')),
  ('En la portería: Cornelio. Mbappé y Daniel dos punto cero, a la banca… o a cambiar de posición.', SK([(0,0,0,'c'),(0,1,-1.5,'h'),(0,2,1.5,'h')],cam='front',stamp='POR: CORNELIO')),
  ('En la defensa: Axel y José Ángel.', SK([(0,3,-0.8,'a'),(0,4,0.8,'a')],cam='front',stamp='DEF: AXEL · JOSÉ ÁNGEL')),
  ('Daniel por la derecha. Messi de mediapunta… y Messi dos punto cero también.', SK([(0,5,-1.5,'w'),(0,6,0,'x'),(0,7,1.5,'x')],cam='wide',stamp='DANIEL · MESSI · MESSI 2.0')),
  ('Y arriba, el delantero Funi.', G('¡FUNI!',[0,0],team=0,idx=9,dist=16,sz=2)),
  ('Pero con veinte dólares… no alcanza para nada.', SK([(0,10,0,'h')],cam='close',stamp='CAJA: $20')),
  ('La primera cuota de la deuda vence la próxima semana. Si no pagamos, el club muere.', SK([(0,10,0,'s')],cam='front',stamp='VENCE EN 7 DÍAS')),
  ('Yo solo puedo poner tres mil dólares… y con eso contraté a un entrenador.', SK([(0,10,-1.1,'w'),(0,8,1.1,'w')],cam='front',stamp='NUEVO DT: -$3,000')),
  ('Pero la cancha está destrozada… y el primer partido es la próxima semana.', SK([(0,10,0,'k')],cam='wide',stamp='CANCHA: DESTROZADA')),
  ('Cada like es un dólar para arreglarla. Comenta tu nombre y posición. Parte tres: el primer partido.', dict(type='outro'))]),
 ('PARTE 3','¿EL PORTERO\nES EL CONSERJE?',[
  ('Primer entrenamiento del club.', SK([(0,0,-1.6,'i'),(0,4,-0.5,'i'),(0,7,0.6,'i'),(0,9,1.7,'i')],cam='wide',big='¿EL PORTERO\nES EL CONSERJE?')),
  ('Le pedí a mi primo que pateara…', G('¡AFUERA!',[0,0],team=0,idx=9,dist=12,sz=14,tz=6,ty=3.5)),
  ('Y el balón terminó en el estacionamiento.', SK([(0,9,0,'h')],cam='close',stamp='BALÓN PERDIDO')),
  ('Pero el conserje atajó todo.', dict(type='save',team=1,idx=8,side=1,big=[[0,None],[0.5,'¡ATAJADA!']],score=[0,0],shake=1,shakeAt=0.42)),
  ('Parte cuatro: el primer partido. Síguenos.', dict(type='outro'))]),
 ('PARTE 4','¿CUÁNTOS GOLES\nNOS METIERON?',[
  ('Primer partido oficial.', SK([(0,10,0,'i')],big='¿CUÁNTOS GOLES\nNOS METIERON?')),
  ('El rival anotó al primer minuto.', G('0-1',[[0,[0,0]],[0.6,[0,1]]],team=1,idx=9,dist=14,sz=3)),
  ('Y luego otro… y otro… y otro.', dict(type='crowd',scarf='#0b8f4d',score=[0,7],big='0-7',bigSize=200)),
  ('Terminamos perdiendo nueve a cero.', SK([(0,0,-1,'k'),(0,10,1,'d')],cam='front',stamp='0 - 9')),
  ('Parte cinco: un fichaje bomba. Síguenos.', dict(type='outro'))]),
 ('PARTE 5','¿UN FICHAJE\nDE 41 AÑOS?',[
  ('Necesitaba un goleador urgente.', SK([(0,10,0,'f')],big='¿UN FICHAJE\nDE 41 AÑOS?')),
  ('Encontré a un delantero retirado de cuarenta y un años.', SK([(0,10,-1.1,'w'),(0,9,1.1,'w')],cam='front')),
  ('Pidió como salario… tacos gratis.', SK([(0,9,0,'x')],cam='close',stamp='SALARIO: TACOS 🌮')),
  ('Firmado.', SK([(0,10,-1.1,'c'),(0,9,1.1,'c')],cam='front',stamp='¡FICHADO!')),
  ('Parte seis: el problema de la deuda. Síguenos.', dict(type='outro'))]),
 ('PARTE 6','¿VENDÍ EL PASTO\nDEL ESTADIO?',[
  ('El banco quiere su dinero.', SK([(0,10,0,'s')],big='¿VENDÍ EL PASTO\nDEL ESTADIO?')),
  ('Así que vendí el pasto del estadio.', SK([(0,10,0,'h')],cam='wide',stamp='VENDIDO')),
  ('Ahora jugamos en tierra.', SK([(0,0,-1,'f'),(0,9,1,'f')],cam='front')),
  ('Pero la deuda bajó un poquito.', SK([(0,10,0,'c')],cam='close',stamp='DEUDA: $49.9 M')),
  ('Parte siete: ¿por fin ganamos? Síguenos.', dict(type='outro'))]),
 ('PARTE 7','¿POR FIN\nGANAMOS?',[
  ('Partido siete. Seguimos sin ganar.', SK([(0,10,0,'i')],big='¿POR FIN\nGANAMOS?')),
  ('Minuto noventa. Tiro de esquina.', dict(type='corner',team=0,idx=9,score=[[0,[0,0]],[0.75,[1,0]]],big=[[0,None],[0.78,'¡GOL!']],flashes=2,shake=1,shakeAt=0.78)),
  ('El balón rebota en la cabeza del conserje… ¡y entra!', dict(type='celebrate',team=0,score=[1,0],big='¡DE REBOTE!',bigSize=170)),
  ('Primera victoria de la historia.', SK([(0,0,-1.6,'c'),(0,9,-0.5,'c'),(0,10,0.6,'x'),(0,4,1.7,'c')],cam='wide',stamp='1 - 0')),
  ('Parte ocho: llega un patrocinador. Síguenos.', dict(type='outro'))]),
 ('PARTE 8','¿NUESTRO\nPATROCINADOR?',[
  ('Ganamos cinco partidos seguidos.', SK([(0,10,0,'x')],big='¿NUESTRO\nPATROCINADOR?')),
  ('Y por fin llegó un patrocinador.', SK([(0,10,-1.1,'w'),(1,10,1.1,'w')],cam='front')),
  ('La taquería de la esquina.', SK([(0,10,0,'c')],cam='close',stamp='TACOS DON PEPE 🌮')),
  ('Nos paga… en tacos.', SK([(0,0,-1,'x'),(0,9,1,'x')],cam='front',stamp='PAGO: 500 TACOS')),
  ('Parte nueve: la gran final. Síguenos.', dict(type='outro'))]),
 ('PARTE 9','¿LLEGAMOS A\nLA FINAL?',[
  ('Contra todo pronóstico…', SK([(0,10,0,'i')],big='¿LLEGAMOS A\nLA FINAL?')),
  ('Llegamos a la final de la copa.', dict(type='crowd',scarf='#0b8f4d',score=[0,0],big='¡FINAL!',bigSize=200)),
  ('Contra el equipo más rico del país.', SK([(0,10,-1.1,'h'),(1,9,1.1,'p')],cam='front',stamp='$500 M vs $1')),
  ('Empate. Nos vamos a penales.', dict(type='penalty',team=0,idx=9,outcome='goal',tz=2.4,score=[[0,['1 (0)','1 (0)']],[0.6,['1 (1)','1 (0)']]],big=[[0,None],[0.62,'PENALES']],flashes=1,shake=1)),
  ('Parte diez: el final. Síguenos.', dict(type='outro'))]),
 ('PARTE 10','¿GANAMOS\nLA COPA?',[
  ('Último penal. El conserje en la portería.', SK([(0,0,0,'i')],big='¿GANAMOS\nLA COPA?')),
  ('Se tira… ¡y lo ataja!', dict(type='save',team=1,idx=8,side=-1,cam='goal',big=[[0,None],[0.5,'¡LO ATAJA!']],score=['1 (4)','1 (3)'],shake=1,shakeAt=0.42)),
  ('El club de un dólar… es campeón.', dict(type='trophy',team=0,idx=0,lift=True,confetti=True,score=['1 (4)','1 (3)'],clock='FINAL',flashes=2,big=[[0,None],[0.45,'🏆']])),
  ('La deuda sigue ahí… pero ahora tenemos fans.', SK([(0,10,0,'x')],cam='close',stamp='TEMPORADA 2?')),
  ('¿Quieres temporada dos? Comenta y síguenos.', dict(type='outro'))]),
]
def build():
    out={}
    for n,(part,title,beats) in enumerate(EPS):
        k=f'e{150+n}'; shots=[]; lines=[]
        for line,sh in beats:
            sh=dict(sh); sh.setdefault('clock',part); shots.append(sh); lines.append(line)
        out[k]=(shots,lines,part)
    return out
