# Coins4us — Catálogo

App de catálogo profesional hecha con React + Vite + TypeScript + Tailwind CSS.

## Desarrollo

```bash
npm install
npm run dev
```

## Cómo agregar productos

Los productos viven en `src/data/products.ts`. Para agregar uno nuevo, copia
un objeto de la lista y edita sus datos:

```ts
{
  id: "coin-002",           // único, sin espacios
  name: "5 Pesos Plata",
  category: "Monedas",
  country: "México",
  year: 1948,
  material: "Plata",
  condition: "Excelente",
  price: 1200,
  currency: "MXN",
  stock: 1,
  description: "Descripción breve de la pieza.",
  image: "/products/coin-002.jpg",
  featured: false,
}
```

- **Imágenes**: coloca el archivo en `public/products/` y referencia la ruta
  como `/products/nombre-archivo.jpg` en el campo `image` (también aceptas
  una URL completa).
- **Categorías**: se generan automáticamente a partir de los productos, así
  que basta con escribir una nueva categoría en el campo `category` para que
  aparezca como filtro.

Cuando me vayas dando los productos (nombre, país, año, material, precio,
foto, etc.), los voy agregando a este archivo.

## Build de producción

```bash
npm run build
```
