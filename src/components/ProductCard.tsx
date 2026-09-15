import type { Product } from "../types/product";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-neutral-900">
            Destacado
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-2 top-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-xs font-semibold text-white">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-amber-600">
          {product.category}
        </span>
        <h3 className="text-base font-semibold text-neutral-900">{product.name}</h3>
        <p className="text-sm text-neutral-500">
          {[product.country, product.year].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold text-neutral-900">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </button>
  );
}
