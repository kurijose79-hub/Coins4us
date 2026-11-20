# Serie "La Vida del Bicho" (3D buena, dramatización de fans). Una línea de voz por toma.
P={'i':'idle','c':'cheer','s':'sad','k':'kneel','d':'down','p':'point','h':'shrug','f':'facepalm','r':'run','a':'armsUp','w':'shake','x':'dance'}
def SK(acts,cam='front',stamp=None,big=None,**k):
    sh=dict(type='skit',actors=[dict(team=t,idx=i,x=x,pose=P[p]) for (t,i,x,p) in acts],cam=cam,**k)
    if stamp: sh['stamp']=[[0,None],[0.35,stamp]]
    if big: sh.update(big=big,bigSize=140,hook=True,bigY=470)
    return sh
BICHO=[('EPISODIO 1',[
 ('Tengo doce años… y acabo de dejar a mi familia en una isla.', SK([(0,10,0,'i')],cam='front',big='TIENES 12 AÑOS.\nESTÁS SOLO.')),
 ('En Lisboa se reían de mi acento.', SK([(0,10,0,'s'),(0,4,-1.4,'p'),(0,7,1.4,'c')],cam='front',stamp='"¿DE DÓNDE ERES?"')),
 ('Lloraba cada noche… y cada mañana volvía al campo.', SK([(0,10,0,'r')],cam='wide',stamp='6:00 AM')),
 ('A los quince, el médico dijo que mi corazón latía demasiado rápido.', SK([(0,10,0,'k')],cam='close',stamp='CORAZÓN ACELERADO')),
 ('Me operaron. Días después… ya estaba corriendo otra vez.', SK([(0,10,0,'r')],cam='low',stamp='OPERADO ✔')),
 ('Entrenaba con pesas en los tobillos.', SK([(0,10,0,'r')],cam='low',stamp='PESAS EN LOS TOBILLOS')),
 ('Cuando me las quitaba… nadie podía alcanzarme.', dict(type='goal',team=0,idx=10,dist=22,sz=-3,big=[[0,None],[0.62,'¡GOL!']],flashes=1,shake=1,shakeAt=0.62,score=[[0,[0,0]],[0.6,[1,0]]])),
 ('Diecisiete años. Primer equipo. Esa noche jugábamos contra el Manchester United.', dict(type='crowd',scarf='#0b8f4d',score=[0,0],big='VS\nMAN UNITED',bigSize=150)),
 ('Sígueme. El episodio dos empieza en Inglaterra.', dict(type='outro'))])]
