# audioUS

App hecha con React + Vite + TypeScript + Tailwind CSS que convierte libros en
audiolibros usando la síntesis de voz del navegador (Web Speech API). Todo el
procesamiento ocurre en el dispositivo: tus libros nunca se suben a un
servidor.

## Secciones de la app

- **Cuenta**: elige tu idioma (12 idiomas) y usa el **Lab de voz** para
  previsualizar y elegir entre las voces instaladas en tu navegador/sistema,
  con velocidad y tono predeterminados.
- **Crear**: sube un archivo `.txt`/`.pdf`, pega texto, **toma fotos de un
  libro físico** (OCR en el navegador con Tesseract.js, sin subir las fotos a
  ningún servidor) o **importa la transcripción de un video de YouTube** (vía
  una función serverless de Supabase, necesaria porque el navegador no puede
  pedirle eso a YouTube directamente por CORS). "Crear con IA" y "Traducción"
  siguen como tarjetas de "próximamente": requieren conectar una API de IA de
  pago que esta app no tiene configurada.
- **Biblioteca**: tus libros agrupados por serie cuando aplica, más un
  estante de **audiolibros gratis de dominio público** (extractos de obras
  como el Quijote o Alicia en el país de las maravillas, con su fuente
  siempre visible, como exige su licencia).
- **Análisis**: estadísticas de lectura (libros empezados/terminados, tiempo
  escuchado estimado) y una lista de recomendados basada en lo que aún no
  empezaste. El asistente conversacional sobre tus libros también requiere
  una API de IA y por ahora solo se muestra como próximamente.

## Lector

- Reproduce el libro frase por frase, resaltando el texto que se está
  leyendo y con navegación por **capítulos** (detectados automáticamente por
  encabezados tipo "Capítulo 1") además de por frase.
- Progreso guardado en IndexedDB para continuar donde quedaste.

## Limitaciones conocidas (a propósito, no son bugs)

- **No hay clonación de voz real**: grabar un video para crear tu propia voz
  requiere un servicio de IA de voz (tipo ElevenLabs) conectado por API; no
  se puede hacer solo en el navegador. Esta app no lo simula.
- **No hay generación de libros con IA ni traducción automática**: requieren
  una API de pago que no está conectada. Se muestran como "próximamente" en
  vez de fingir que funcionan.
- **Importar de YouTube solo funciona si el video tiene subtítulos o
  transcripción activados**: se extrae únicamente el texto de los subtítulos,
  nunca se descarga el video ni el audio. Usa una función serverless propia
  (Supabase Edge Function) porque el navegador no puede pedirle esto a
  YouTube directamente (CORS).
- **El OCR de fotos descarga un modelo de reconocimiento de texto la primera
  vez que lo usas** (desde una CDN pública, igual que cualquier app que usa
  Tesseract.js): las fotos en sí nunca salen de tu navegador, pero si no
  tienes conexión a internet la primera vez, no podrá cargar el motor.
  Revisa el texto reconocido antes de guardar: el OCR puede tener errores.
- **No hay conexión con Kindle/Google Books/Drive**: requiere OAuth con un
  backend que esta app no tiene.
- **"Audiolibros gratis" son solo de dominio público**: no se ocultan fuentes
  de libros con derechos de autor; eso sería distribución no autorizada.
- No es posible exportar el audio generado a un archivo `.mp3`/`.wav`: los
  navegadores no exponen la salida de `speechSynthesis` como audio grabable.
- Formatos soportados: `.txt`, `.pdf` y texto pegado. EPUB no está soportado
  todavía.

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```
