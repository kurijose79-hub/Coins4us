// Catálogo de productos. Para agregar uno nuevo, copia un objeto y cambia
// los datos. "image" puede ser una URL o una ruta dentro de /public/products.
// Campos opcionales (country, year, material, condition, stock, description,
// featured) se pueden omitir si no aplican.
import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "demo-1",
    name: "Moneda de ejemplo",
    category: "Monedas",
    country: "México",
    year: 1980,
    material: "Plata",
    condition: "Excelente",
    price: 500,
    currency: "MXN",
    stock: 1,
    description:
      "Este es un producto de ejemplo. Reemplázalo o bórralo cuando agregues tus propias piezas.",
    image: "https://placehold.co/600x600/1f2430/f7f5f0?text=Coins4us",
    featured: true,
  },
];
