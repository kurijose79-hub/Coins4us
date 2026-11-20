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
G=lambda b,sc,**k: dict(dict(type='goal',big=[[0,None],[0.62,b]],flashes=1,shake=1,shakeAt=0.62,score=sc),**k)
YT['e193']=dict(kind='soccer',part='¡GRACIAS!',series='¿CÓMO DEPORTES? · YOUTUBE',label='¡SOMOS 50 EN YOUTUBE!',hud=None,outro='¡VAMOS POR 100!',full=True,
   beats=[('¡Somos cincuenta suscriptores en YouTube!', SK([(0,10,0,'c')],cam='front',big='¡SOMOS 50\nEN YOUTUBE!')),
     ('Hace unos días éramos cero.', SK([(0,10,0,'i')],cam='close',stamp='DÍA 1: 0')),
     ('Hoy somos cincuenta.', G('¡50!',[[0,[49,0]],[0.6,[50,0]]],team=0,idx=9,dist=14,sz=-3)),
     ('Gracias a cada uno de ustedes.', dict(type='crowd',scarf='#ffd400',score=[50,0],big='¡GRACIAS!',bigSize=170)),
     ('Siguiente meta: cien. Suscríbete y llegamos juntos.', dict(type='outro'))])
YT['e190']=dict(kind='soccer',part='PARTE 1',series='SERIE ⚽ MI HIJO FUTBOLISTA',label='MI HIJO FUTBOLISTA · PARTE 1',
   hud={'labels':['❤️ LIKE = 1 HORA','🔔 SUSCRIPTOR = FAN','💬 COMENTARIO = DECIDE'],'like':'0 h','fan':'0','jug':'0'},outro='PARTE 2 → SUSCRÍBETE',
   beats=[('Mi hijo de ocho años quiere ser futbolista profesional.', SK([(0,9,0,'c')],cam='front',big='¿SERÁ\nPROFESIONAL?')),
     ('Pero nunca ha pateado un balón.', SK([(0,9,0,'h')],cam='close',stamp='EXPERIENCIA: 0')),
     ('Cada like es una hora de entrenamiento.', SK([(0,9,0,'r')],cam='wide',stamp='LIKE = 1 HORA')),
     ('Y ustedes deciden en los comentarios: ¿portero, defensa o delantero?', SK([(0,9,0,'p')],cam='front',stamp='¿QUÉ POSICIÓN?')),
     ('Si llegamos a mil horas, hace una prueba en un club de verdad.', SK([(0,9,0,'x')],cam='close',stamp='META: 1,000 HORAS')),
     ('Comenta su posición. Parte dos: su primer entrenamiento.', dict(type='outro'))])
