# Pies en Reacción

App para entrenar ejercicios de trabajo de pies, hecha con React + Vite +
TypeScript + Tailwind CSS.

Eliges un ejercicio y un modo:

- **Tiempo fijo**: cuenta regresiva de segundos asegurados (ej. 10 s) para
  sostener el ejercicio.
- **Reacción**: espera un tiempo aleatorio y, en cuanto la pantalla se pone
  verde, hay que picarla lo antes posible. Mide el tiempo de reacción en
  milisegundos y avisa si hubo falsa salida.

Cada resultado queda guardado en un historial local (en el navegador).

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```
