# Motor de videos (3D y 2dbuena)

Todo lo necesario para volver a generar los videos: motores, configuraciones, guiones y tiempos.

- `engine.js` + `configs.js`: estadios 3D (NFL, fútbol, Messi vs CR7, tenis 3D). Página: `page.html`.
- `f1.js` + `f1configs.js`: F1 3D. Página: `f1page.html`.
- `golf3d.js`: golf 3D (cóndor y explicativo). Página: `g3dpage.html`.
- `golf2d.js`: estilo **2dbuena** (golf, papá, tenis, béisbol). Páginas: `g2dpage.html`, `t2dpage.html` (+ `tennis2d.js`), `b2dpage.html` (+ `baseball2d.js`).
- `scripts.json`: todos los guiones. `timing.json`: tiempos de cada frase según la voz.
- `render.js <id> full|stills`: renderiza con Playwright + ffmpeg (necesita `npm i three@0.160.0`).

## Pendientes (guiones listos, falta la voz natural de vidIQ)
- `b01`–`b10`: 10 videos de béisbol 2dbuena. Voces en 2 bloques de 5 (`bgroup0.txt`/`bgroup1.txt` = 112 créditos). Los tiempos de `b01`, `b07` y `b08` en `timing.json` son provisionales (`_fake`).
- `c01`–`c03`: "¿Cómo se curva?" (pelota de golf, curva de béisbol, frenos de F1) = 28 créditos en una sola voz (`cgroup.txt`).

Flujo con créditos: generar voz (Brian) → `split_groups.py`/`realign.py` → `audio_tennis.py <ids>` para el fondo → `render.js <id> full` → mezcla con ffmpeg → subir y programar con vidIQ.
