# Audiolibros

App hecha con React + Vite + TypeScript + Tailwind CSS que convierte libros en
audiolibros usando la síntesis de voz del navegador (Web Speech API). Todo el
procesamiento ocurre en el dispositivo: tus libros nunca se suben a un
servidor.

## Funcionalidades

- **Agregar libros**: sube un archivo `.txt` o `.pdf`, o pega el texto
  manualmente.
- **Biblioteca**: guarda tus libros en el navegador (IndexedDB) con su
  progreso de lectura.
- **Lector con voz**: reproduce el libro frase por frase, resaltando el texto
  que se está leyendo y permitiendo saltar a cualquier frase con un clic.
- **Controles**: reproducir, pausar, detener, frase anterior/siguiente,
  selección de voz, velocidad y tono.
- **Progreso guardado**: al reabrir un libro continúa donde quedaste.

## Limitaciones conocidas

- La calidad y disponibilidad de voces depende del navegador y sistema
  operativo (usa las voces instaladas del sistema).
- No es posible exportar el audio generado a un archivo `.mp3`/`.wav`: los
  navegadores no exponen la salida de `speechSynthesis` como audio grabable.
  Esta app está pensada para escuchar en vivo, no para generar archivos de
  audio descargables.
- Formatos soportados actualmente: `.txt`, `.pdf` y texto pegado. EPUB no está
  soportado todavía.

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```
