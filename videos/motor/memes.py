# 50 memes NFL 3D cuadrada: Chargers (team0) vs Cowboys (team1). Una línea de voz por toma.
P={'i':'idle','c':'cheer','s':'sad','k':'kneel','d':'down','p':'point','h':'shrug','f':'facepalm','b':'ball','x':'dance','r':'run','a':'armsUp','w':'shake'}
# beat: (voz, poseCHA, poseDAL, poseRef('' = sin árbitro), stamp, cam, coin)
M=[
('CHARGERS\nvs.\nCOWBOYS',[('Chargers contra Cowboys.','i','i','i','','front',0),('Llega el volado.','i','i','b','','close',0),('El árbitro lanza la moneda…','i','i','a','','low',1),('Y cae de canto.','h','h','h','¿Y AHORA?','front',0),('Ni la moneda quiere que alguien gane.','f','f','h','','front',0)]),
('ALGUIEN\nTIENE QUE\nGANAR',[('Chargers contra Cowboys.','i','i','i','','front',0),('Dos equipos que siempre encuentran cómo perder.','s','s','i','','close',0),('Pero hoy… alguien tiene que ganar.','i','i','p','ALGUIEN TIENE QUE GANAR','front',0),('Empate.','f','f','h','EMPATE','front',0)]),
('"ESTE ES\nNUESTRO AÑO"',[('Aficionado de Cowboys en septiembre:','i','c','','','close',0),('Este es nuestro año.','i','x','','ESTE ES NUESTRO AÑO','front',0),('Aficionado de Cowboys en enero:','i','k','','','close',0),('El próximo año sí.','c','s','','','front',0)]),
('LA MEJOR\nVENTAJA',[('Chargers ganando por veintisiete puntos.','c','i','','27-0','front',0),('Nada puede salir mal.','x','s','','','close',0),('Medio tiempo después…','s','c','','','low',0),('Así es ser aficionado de los Chargers.','k','x','','31-30','front',0)]),
('¿QUIÉN\nPATEA?',[('El árbitro pregunta: ¿quién patea primero?','i','i','p','','front',0),('Chargers: nosotros no, siempre fallamos.','h','i','i','','close',0),('Cowboys: nosotros tampoco.','h','h','i','','close',0),('Nadie quiere el balón.','f','f','f','PARTIDO SUSPENDIDO','front',0)]),
('EL\nVOLADO',[('Volado decisivo.','i','i','b','','front',0),('Cowboys pide águila.','i','p','b','','close',0),('Sale sol…','i','i','a','','low',1),('Y aun así Cowboys celebra.','i','x','h','¿POR QUÉ?','front',0)]),
('MI EQUIPO\nEN ENERO',[('Mi equipo en la temporada regular:','c','c','','','front',0),('Invencibles.','x','x','','12-5','close',0),('Mi equipo en playoffs:','i','i','','','low',0),('Desaparecidos.','d','d','','ELIMINADOS','front',0)]),
('LA\nLESIÓN',[('Chargers en la primera jugada.','r','i','','','wide',0),('Se tropieza solo.','d','i','','','close',0),('Fuera por toda la temporada.','k','f','','','front',0),('Ser de los Chargers duele.','s','h','','LESIONADO','front',0)]),
('EL\nCONTRATO',[('Cowboys negociando un contrato.','i','w','','','front',0),('Le ofrecen millones al jugador.','i','p','','','close',0),('Pierden en el comodín.','i','k','','','low',0),('Y renuevan otra vez.','f','x','','OTRO AÑO MÁS','front',0)]),
('¿Y LA\nDEFENSA?',[('Chargers anotan.','c','i','','7-0','front',0),('Cowboys anotan.','i','c','','7-7','front',0),('Chargers anotan.','c','i','','14-7','front',0),('Ninguna defensa se presentó a jugar.','h','h','h','SIN DEFENSA','front',0)]),
('EL GOL\nDE CAMPO',[('Gol de campo para ganar.','i','i','i','','front',0),('Distancia: veinte yardas.','b','i','i','','close',0),('Lo falla.','s','c','h','','low',0),('Clásico.','k','x','f','CLÁSICO','front',0)]),
('MI PAPÁ\nY LOS COWBOYS',[('Mi papá cada domingo:','i','i','','','close',0),('Hoy sí ganamos.','i','c','','','front',0),('Mi papá cada lunes:','i','s','','','close',0),('Ya no veo futbol nunca más.','i','k','','HASTA EL DOMINGO','front',0)]),
('EL\nÁRBITRO',[('El árbitro marca un castigo.','i','i','p','','front',0),('¿Para quién?','h','h','i','','close',0),('Para los dos.','f','f','a','CASTIGO DOBLE','low',0),('Así cualquiera empata.','h','h','x','','front',0)]),
('¿QUIÉN\nDIJO\nSUPER BOWL?',[('Alguien dijo Super Bowl.','i','i','','','front',0),('Los Chargers voltean.','p','i','','','close',0),('Los Cowboys voltean.','i','p','','','close',0),('Los dos se ríen.','x','x','','ESO NO EXISTE','front',0)]),
('CELEBRACIÓN\nANTICIPADA',[('Cowboys a punto de anotar.','i','r','','','wide',0),('Empieza a celebrar antes.','i','x','','','close',0),('Suelta el balón.','c','s','','','low',0),('No celebres antes de tiempo.','x','k','','BALÓN SUELTO','front',0)]),
('EL\nCALENDARIO',[('Calendario de los Chargers.','i','i','','','front',0),('Ganar todos los partidos fáciles.','c','i','','','close',0),('Perder todos los importantes.','k','i','','','close',0),('Así cada año.','s','h','','2026','front',0)]),
('EL\nDOMINGO',[('Aficionados un domingo en la mañana:','i','i','','','front',0),('Llenos de esperanza.','c','c','','','close',0),('Aficionados un domingo en la noche:','i','i','','','low',0),('Sin palabras.','d','d','','LUNES','front',0)]),
('EL NUEVO\nENTRENADOR',[('Llega un nuevo entrenador.','i','i','','','front',0),('Promete cambiarlo todo.','i','p','','','close',0),('Mismo resultado.','k','k','','','front',0),('El problema no era el entrenador.','f','f','','¿ENTONCES QUÉ?','front',0)]),
('HACER\nPAR',[('Chargers y Cowboys en playoffs.','i','i','','','front',0),('Uno pierde en comodín.','k','i','','','close',0),('El otro pierde en divisional.','i','k','','','close',0),('Mejores amigos.','x','x','','EQUIPO PERDEDOR','front',0)]),
('LA\nREPETICIÓN',[('La repetición muestra…','i','i','p','','front',0),('Que era touchdown.','c','i','p','','close',0),('Pero no lo cambian.','s','x','h','','low',0),('Siempre a los Chargers.','k','c','h','SIN TOUCHDOWN','front',0)]),
('EL QB\nESTRELLA',[('El quarterback estrella.','b','i','','','front',0),('Lanza el pase perfecto.','a','i','','','close',0),('Su receptor lo deja caer.','f','c','','','low',0),('Tristeza.','k','x','','INCOMPLETO','front',0)]),
('LOS\nPLAYOFFS',[('Llegan los playoffs.','c','c','','','front',0),('Todos están emocionados.','x','x','','','close',0),('Una semana después…','i','i','','','low',0),('Ya están de vacaciones.','d','d','','VACACIONES','front',0)]),
('¿ESCUCHASTE\nESO?',[('¿Escuchaste eso?','p','i','','','front',0),('Era el sonido de una temporada perfecta…','c','i','','','close',0),('rompiéndose en la semana uno.','k','x','','0-1','front',0)]),
('JERRY\nJONES',[('El dueño en conferencia de prensa:','i','w','','','close',0),('Tenemos al mejor equipo.','i','p','','','front',0),('Resultados:','i','i','','','low',0),('No.','x','k','','LO DE SIEMPRE','front',0)]),
('EL\nMEDIO TIEMPO',[('Al medio tiempo…','i','i','i','','front',0),('Chargers ganando.','c','s','i','21-3','close',0),('Al final del partido…','i','i','i','','low',0),('Ya saben cómo termina.','k','x','h','21-24','front',0)]),
('EL SAQUE\nINICIAL',[('Saque inicial.','i','i','','','wide',0),('Regreso para touchdown.','i','r','','','wide',0),('Doce segundos de partido.','f','c','','0-7','close',0),('Ya nos rendimos.','d','x','','','front',0)]),
('LA\nVIEJA\nCONFIABLE',[('Los Cowboys con la vieja confiable:','i','b','','','front',0),('Perder en casa en playoffs.','i','k','','','close',0),('Nunca falla.','h','s','','LA VIEJA CONFIABLE','front',0)]),
('CHARGERS\n2026',[('Chargers dos mil veintiséis.','c','i','','','front',0),('Tenemos al mejor quarterback joven.','b','i','','','close',0),('Tenemos al mejor entrenador.','p','i','','','close',0),('Tenemos lesiones.','k','h','','LA DE SIEMPRE','front',0)]),
('LA\nAPUESTA',[('Mi amigo apostó por los Cowboys.','i','c','','','front',0),('Yo aposté por los Chargers.','c','i','','','front',0),('Al final del partido…','i','i','','','low',0),('Los dos perdimos.','k','k','','LOS DOS PIERDEN','front',0)]),
('EL\nTOUCHDOWN',[('Touchdown de los Chargers.','x','i','','','front',0),('Bandera amarilla.','s','i','p','','close',0),('Anulado.','k','c','a','ANULADO','front',0),('La historia de su vida.','d','x','h','','front',0)]),
('¿CÓMO\nPERDIMOS?',[('¿Cómo perdimos ese partido?','h','i','','','front',0),('Íbamos ganando por veinte.','c','i','','','close',0),('Faltaban dos minutos.','i','i','','','close',0),('Somos los Chargers.','f','x','','EXPLICADO','front',0)]),
('AMÉRICA\nDE LA NFL',[('Le dicen el Equipo de América.','i','x','','','front',0),('Todo el país los ve.','i','c','','','close',0),('Todo el país los ve perder.','c','k','','','front',0),('Y lo disfruta.','x','s','','EQUIPO DE AMÉRICA','front',0)]),
('LA\nENTREVISTA',[('Reportero: ¿qué pasó hoy?','i','i','','','close',0),('Jugador: no ejecutamos.','h','i','','','close',0),('Reportero: ¿y la semana pasada?','i','i','','','close',0),('Tampoco.','f','f','','SIN EJECUCIÓN','front',0)]),
('EL\nCLIMA',[('Pronóstico: lluvia.','i','i','','','front',0),('Los Chargers juegan en Los Ángeles.','h','i','','','close',0),('Primera vez que ven agua.','k','x','','LLUEVE EN L.A.','front',0)]),
('AFICIONADO\nVS\nAFICIONADO',[('Aficionado de Chargers contra aficionado de Cowboys.','i','i','','','front',0),('¿Quién sufre más?','p','p','','','close',0),('Los dos al mismo tiempo:','i','i','','','low',0),('Yo.','k','k','','LOS DOS','front',0)]),
('EL\nDRAFT',[('Noche del draft.','i','i','','','front',0),('Elegimos al mejor jugador.','c','c','','','close',0),('Se lesiona en el campamento.','k','k','','','front',0),('Hasta el próximo draft.','f','f','','DRAFT','front',0)]),
('EL PASE\nLARGO',[('Pase largo…','a','i','','','wide',0),('El receptor sigue solo…','i','i','','','wide',0),('Está solo…','c','s','','','close',0),('Se le cae.','k','x','','INCOMPLETO','front',0)]),
('SIEMPRE\nEN ENERO',[('Diciembre: líderes de la división.','c','c','','1°','front',0),('Enero:','i','i','','','close',0),('Líderes en excusas.','h','h','','EXCUSAS','front',0)]),
('EL\nTIEMPO\nFUERA',[('Quedan diez segundos.','i','i','i','','front',0),('Piden tiempo fuera…','p','i','p','','close',0),('Ya no les quedaba.','f','c','a','CASTIGO','low',0),('Pierden.','k','x','h','FIN','front',0)]),
('¿ERES DE\nCOWBOYS?',[('¿Eres de los Cowboys?','i','p','','','close',0),('Saluda a tus amigos…','i','x','','','front',0),('que nunca vieron un título.','i','k','','DESDE 1995','front',0)]),
('LA\nMOTIVACIÓN',[('Discurso motivacional en el vestidor.','i','p','','','front',0),('¡Vamos a ganar!','c','c','','','close',0),('Salen al campo…','r','r','','','wide',0),('Se tropiezan.','d','d','','','front',0)]),
('EL\nRANKING',[('Ranking de poder semana uno:','i','i','','','front',0),('Número uno.','x','x','','#1','close',0),('Semana diez:','i','i','','','close',0),('Número veinte.','k','k','','#20','front',0)]),
('EL\nCAPITÁN',[('El capitán de los Chargers…','b','i','i','','front',0),('se presenta con el árbitro.','w','i','w','','close',0),('Gana el volado.','c','s','a','','low',1),('Primera victoria del año.','x','h','x','1-0','front',0)]),
('¿SABES\nQUÉ ES\nPEOR?',[('¿Sabes qué es peor que perder?','p','i','','','front',0),('Perder contra los Cowboys.','k','x','','','close',0),('¿Y qué es peor?','i','p','','','close',0),('Perder contra los Chargers.','x','k','','IGUALES','front',0)]),
('EL\nSILENCIO',[('El estadio de los Chargers:','i','i','','','front',0),('Más aficionados del rival…','h','x','','','close',0),('que del equipo local.','f','c','','VISITANTE EN CASA','front',0)]),
('EL\nREGRESO',[('Los Chargers pierden por veinte.','k','c','','','front',0),('Empiezan a remontar…','r','i','','','wide',0),('Se acercan…','c','s','','','close',0),('Y se acaba el tiempo.','d','x','','CASI','front',0)]),
('LA\nRIVALIDAD',[('La gran rivalidad.','i','i','','','front',0),('Chargers contra Cowboys.','p','p','','','close',0),('Se juega cada cuatro años.','h','h','','','close',0),('Por suerte.','x','x','','RIVALIDAD','front',0)]),
('¿POR\nQUÉ?',[('¿Por qué sigo viendo a mi equipo?','f','i','','','close',0),('Me hacen sufrir.','k','i','','','front',0),('Cada domingo.','s','s','','','close',0),('Porque los amo.','c','c','','AMOR','front',0)]),
('EL\nÚLTIMO\nVOLADO',[('Tiempo extra.','i','i','i','','front',0),('Volado final.','i','i','b','','close',0),('El árbitro lanza…','i','i','a','','low',1),('Gana el que menos lo merecía.','h','x','h','TIEMPO EXTRA','front',0)]),
('¿CHARGERS\nO\nCOWBOYS?',[('Si tuvieras que elegir:','i','i','','','front',0),('¿Chargers…','c','i','','','close',0),('o Cowboys?','i','c','','','close',0),('Comenta.','p','p','','COMENTA 👇','front',0)]),
]
def build():
    out={}
    for n,(title,beats) in enumerate(M[:50]):
        k=f'e{100+n}'; shots=[]; lines=[]
        for j,(line,pa,pb,pr,stamp,cam,coin) in enumerate(beats):
            acts=[dict(team=0,idx=0,x=-1.05,pose=P[pa]),dict(team=1,idx=0,x=1.05,pose=P[pb],ph=1.3)]
            if pr: acts.append(dict(ref=True,x=0,z=-0.5,pose=P[pr]))
            sh=dict(type='skit',actors=acts,cam=cam)
            if cam=='close': sh['cx2']=-1.05 if 'Charger' in line or pa not in ('i',) and pb=='i' else (1.05 if ('Cowboy' in line or pb!='i') else 0)
            if coin: sh['coin']=[0.15,0.85]
            if j==0: sh.update(big=title,bigSize=150,hook=True,bigY=520)
            if stamp: sh['stamp']=[[0,None],[0.35,stamp]]
            shots.append(sh); lines.append(line)
        shots.append(dict(type='outro')); lines.append('Síguenos para más.')
        out[k]=(shots,lines,title)
    return out
