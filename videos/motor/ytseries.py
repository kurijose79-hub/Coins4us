# Series interactivas pensadas para YouTube (suscriptores/likes/comentarios = recursos). Una línea de voz por toma.
P={'i':'idle','c':'cheer','s':'sad','k':'kneel','d':'down','p':'point','h':'shrug','f':'facepalm','r':'run','a':'armsUp','w':'shake','x':'dance','b':'ball'}
def SK(acts,cam='front',stamp=None,big=None,**k):
    sh=dict(type='skit',actors=[dict(team=t,idx=i,x=x,pose=P[p]) for (t,i,x,p) in acts],cam=cam,**k)
    if stamp: sh['stamp']=[[0,None],[0.35,stamp]]
    if big: sh.update(big=big,bigSize=130,hook=True,bigY=470)
    return sh
YT={
 'e170':dict(kind='soccer',part='PARTE 1',series='SERIE 🏟️ MI ESTADIO VACÍO',label='MI ESTADIO VACÍO · PARTE 1',
   hud={'labels':['🔔 SUSCRIPTOR = FAN','❤️ LIKE = $1','💬 COMENTARIO = CANTO'],'like':'0','fan':'$0','jug':'0'},outro='PARTE 2 → SUSCRÍBETE',
   beats=[('Construí un estadio para cuarenta mil personas… y no vino nadie.', SK([(0,10,0,'f')],cam='wide',big='¿UN ESTADIO\nVACÍO?')),
     ('Cada suscriptor será un aficionado en la grada.', SK([(0,10,0,'p')],cam='close',stamp='SUSCRIPTOR = AFICIONADO')),
     ('Cada like, un dólar para prender las luces.', SK([(0,10,0,'h')],cam='front',stamp='LIKE = $1')),
     ('Y cada comentario, un canto para el equipo.', SK([(0,10,0,'x')],cam='close',stamp='COMENTARIO = CANTO')),
     ('Si llegamos a mil, jugamos el primer partido con el estadio lleno.', SK([(0,10,0,'c')],cam='wide',stamp='META: 1,000')),
     ('Suscríbete y sé el aficionado número uno. Parte dos: vemos cuántos llegaron.', dict(type='outro'))]),
 'e180':dict(kind='nfl',part='PARTE 1',series='SERIE 🏈 EQUIPO NFL DE $1',label='EQUIPO DE $1 · PARTE 1',
   hud={'labels':['❤️ LIKE = 1 YARDA','🔔 SUSCRIPTOR = FAN','💬 COMENTARIO = JUGADOR'],'like':'0','fan':'0','jug':'0'},outro='PARTE 2 → SUSCRÍBETE',
   beats=[('Compré un equipo de futbol americano por un dólar.', SK([(0,0,0,'c')],cam='front',big='¿UN EQUIPO NFL\nPOR $1?')),
     ('El estadio es un estacionamiento… y el balón está desinflado.', SK([(0,0,0,'h')],cam='close',stamp='BALÓN: DESINFLADO')),
     ('Cada like es una yarda de avance.', SK([(0,0,0,'b')],cam='front',stamp='LIKE = 1 YARDA')),
     ('Cada suscriptor, un fan. Y cada comentario, un jugador nuevo.', SK([(0,0,0,'p')],cam='close',stamp='COMENTA TU POSICIÓN')),
     ('Y necesito un mariscal de campo urgente.', SK([(0,0,0,'f')],cam='wide',stamp='SE BUSCA QB')),
     ('Comenta tu nombre y posición. Parte dos: el primer entrenamiento.', dict(type='outro'))]),
}
