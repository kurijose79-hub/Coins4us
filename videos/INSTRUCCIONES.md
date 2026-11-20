# Reglas de producción (dadas por el dueño del canal)

1. **Nunca parar:** al terminar una tanda de 10 videos, empezar otra tanda de 10 y programarla. Siempre haciendo videos.
2. **Hasta el 14 de diciembre de 2026:** programar en Instagram (@como.deportes) y YouTube ("¿Cómo deportes?") a la misma hora (CDMX). Horarios: 13:00, 16:00 y 19:00.
3. **Desde el 15 de diciembre de 2026:** NO programar nada, salvo episodios de una serie. Todo lo demás se publica directo en cuanto esté listo.
4. Si el dueño dice que hay demasiados programados, los siguientes se publican directo.
5. Voz: Kokoro "Alex" (gratis). Nada de voces robóticas.
6. Estilo: 2dbuena (o 3D); título amarillo grande en el primer cuadro; gancho en el primer segundo; una sola idea por video; ~20-30 s.
7. Lo que mejor funciona: golf + curiosidades "¿Por qué…? / ¿Cómo…?" y lugares/récords increíbles.
8. Reels a pedido: los que respondan comentarios se le entregan al dueño para que los suba él.

## Lección del mejor reel ("¿Y EL PORTERO?", 14 nov)
- 1,907 vistas, 95% desde la pestaña Reels, 34.6% de omisiones (bajo = bueno), 1.1% compartido.
- Pero duraba 52 s y la gente veía 12 s en promedio: la retención cae fuerte en los primeros 15 s.
- 0 seguidores nuevos: no había razón para seguir.
- Por eso, de ahora en adelante:
  1. Pregunta GRANDE y nítida desde el cuadro 0 (sin fade a negro).
  2. Videos de 12–15 s, con el momento clave antes del segundo 8.
  3. Cierre "PARTE 2 → SÍGUENOS" y llamada a seguir en el caption.
  4. Fútbol 3D con lluvia; temas de porteros locos y goles imposibles.

## Sonido (15 nov)
- De ahora en adelante NINGÚN video va sin sonido: lleva voz natural o música buena de edit / "aura" (phonk).
- Las respuestas con reel ahora las subo yo, con burbuja "Respondiendo a @usuario" y el comentario.

## Ritmo de subida (15 nov)
- Cada video se publica con 2–15 minutos de separación (aleatorio), nunca todos juntos.
- En los videos de "notificación" usar la foto real del perfil (videos/motor/pausa/logo.jpg) y el texto "Significa que trataste bien este video".

## LÍMITES DIARIOS (15 nov) — IMPORTANTE
- Desde el video de 50 seguidores (e34) en adelante TODO falló:
  - Instagram: "límite de publicaciones por API en 24 h alcanzado" (Instagram permite ~25 por día vía API).
  - YouTube: "uploadLimitExceeded" (límite diario de subidas del canal).
- Regla nueva: máximo ~20 posts al día por plataforma, repartidos (cada 45–70 min), no 10 seguidos cada hora.
- Cola de reintento (en orden): e34 (¡SOMOS 50!) primero, luego z21–z30, e35–e44, z31–z40, e45–e54.
- (15 nov, orden del usuario) POR AHORA NO PROGRAMAR NI PUBLICAR NADA: ya se llegó al límite. Solo seguir haciendo videos y dejarlos listos en la cola. Volver a subir a partir del reintento de las 22:45 CDMX del 15 nov.
- (15 nov) TODOS los videos llevan VOZ (golf: tts_cb.py; edits 3D: voice_edit.py mezcla voz sobre el beat).
- (15 nov) Hoy solo GOLF con la 2D buena. 3D cuadrada e45–e54 en pausa.
- (16 nov) Estilos: 2D buena (golf, golf2d/golf3/golf4.js), 3D buena (engine.js), 3D cuadrada (blocky). Usuario pide: 100 de golf 2D buena (z61–z99, y11–y71; generador g100.py) con ideas para ganar seguidores. Salida: videos/golf_100.
- Subir el máximo diario (~20 por plataforma), uno cada 45–70 min.
- (16 nov) ÉXITO: el tenis 3D de Steffi Graf (Golden Slam) llegó a 236 likes. Hacer más así: tenis 3D con voz + pregunta (t16–t25: Nadal 14 RG, Djokovic 24, Serena 23, Federer 8 Wimbledon, Laver, Alcaraz n°1 a los 19, Sinner remontada AO 2024, Navratilova 9, Djokovic oro París, Alcaraz–Sinner RG 2025). La gente comenta "¿Sinner o Alcaraz?" → usar ese CTA.
- (16 nov) 100 SEGUIDORES → video e91. Usuario pide 50 memes NFL 3D cuadrada Chargers vs Cowboys estilo "volado/somebody has to win" (escena 'skit' nueva en engine.js: capitanes + árbitro + moneda + sello rojo). Datos en memes.py, ids e100–e149, salida videos/memes_nfl. Voz Chatterbox + beat aura bajito.
- (16 nov, orden del usuario) MÍNIMO 20 VIDEOS AL DÍA, todos los días. Lo programado no se puede adelantar en vidIQ; completar el día con lo que haya listo (cada ~45 min).
- (16 nov, orden del usuario) De ahora en adelante: TODO video terminado se sube DE INMEDIATO (sin programar), respetando solo el tope de ~20–25 por día por plataforma; lo que pase del tope sale al día siguiente a primera hora. Siempre seguir produciendo.
- (17 nov, orden del usuario) HUBO QUEJAS: la voz suena robótica y los videos no se entienden. Hacer MENOS videos pero MEJORES: guion más claro y simple (una idea por escena, frases cortas), voz más natural (Chatterbox con exaggeration ~0.35–0.4, cfg ~0.3, pausas de 0.45 s, EQ + compresor + loudnorm), textos grandes. Producción en pausa hasta que el usuario elija voz (muestras A/B/C/D en scratchpad/voces).
- (17 nov) VOZ ELEGIDA: A = Alex calmado (muestra_em_alex.wav, exaggeration 0.35, cfg 0.3, EQ+compresor). Usar en todo.
- (17 nov, NUEVA REGLA DEL USUARIO) MENOS VIDEOS, MÁS CALIDAD. Publicar 4–5 al día en Instagram y 3–4 en YouTube, separados 3–4 h, en horarios buenos (CDMX): ~8:00, 13:00, 16:00, 19:30, 21:30. Priorizar los formatos que mejor funcionan (tenis 3D, celebraciones, 3D buena con pregunta). Producir con calma, revisar cada video antes de subirlo. (Reemplaza la regla de "mínimo 20 al día".)
- (17 nov, usuario) Separación de 3–4 HORAS entre cada publicación, todos los días. NO borrar reels viejos (a lo mucho archivar los muy malos). Producir una biblioteca grande y subir SOLO LOS MEJORES (4–5/día IG, 3–4 YT), elegidos por: gancho claro en el primer segundo, voz Alex calmado bien entendible, formato probado (tenis 3D, tier list, 3D buena con pregunta, celebraciones), sin errores visuales.
- (17 nov) SERIES: 'Compré un club por 1 dólar' (serie.py, e150–e159, 10 partes, 3D cuadrada, salida videos/serie_club1). Publicar 1 parte cada 3–4 h en orden. Tier list palos de golf (tier.js, x26).
- (17 nov) Serie Club $1 lleva contador arriba (❤️ LIKE = $1 · 👥 SEGUIDOR = FAN · 💬 COMENTARIO = JUGADOR). Cada parte nueva se renderiza con los números REALES de la parte anterior (CFG.hud en mkedits HUD dict). No inventar números.
- (17 nov) SERIE 2: 'Compré un campo de golf por $1' (campo.js, 2D buena, x27 = parte 1). Reto: 1,000 miembros en 30 días o se vuelve estacionamiento. Seguidor = miembro, like = $1, cada miembro tiene su placa. Contador abajo (MIEMBROS / LIKE=$ / DÍA). Partes 1–10 seguidas, con números reales de la parte anterior. Salida videos/serie_campo.

- Serie Club $1: NO hacer la Parte 2 hasta que el usuario diga cuánto se recaudó (likes/seguidores/comentarios reales).
- Club $1 Parte 3: sumar jugadores nuevos de YouTube: Gisela (mediocampo), Ángel (delantero centro). +13 suscriptores más (total ~24 tras Parte 1). Pedir cifras actualizadas al usuario.
- Series para YouTube: e170 "Mi estadio vacío" (crowdFill = suscriptores/1000), e180 "Equipo NFL de $1". Series sin música (solo voz).
- Club $1 Parte 1 (19 nov 7:25pm): 1,082 vistas, 22 likes, 20 comentarios, +12 suscriptores. Usar como base de la Parte 3 (sumar lo de la Parte 2).
- ¡SOMOS 50 EN YOUTUBE! (e193) listo para publicar SOLO cuando el usuario avise que llegamos a 50 suscriptores.
- Serie nueva e190 "Mi hijo futbolista" (like = 1 hora de entrenamiento, comentarios deciden posición).
- Club $1: la META es juntar $10,000 (likes = dólares) para pagar la cuota de la deuda y salvar el club. Decirlo desde el gancho de la Parte 3 y mostrar en pantalla "META: $10,000" con barra de progreso.
- Campo $1 Parte 3: nuevo miembro desde YouTube: @JoséAngel-v8y ("listo"). Sumar a placas.
- Series interactivas: cuando toque la siguiente parte, PEDIR al usuario las capturas (likes, seguidores/suscriptores nuevos, comentarios) del video exacto, diciendo cuál y en qué plataforma.
