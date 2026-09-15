import { useEffect } from "react";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/format";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const details: [string, string | number | undefined][] = [
    ["País", product.country],
    ["Año", product.year],
    ["Material", product.material],
    ["Condición", product.condition],
    ["Disponibilidad", product.stock === 0 ? "Agotado" : product.stock ? `${product.stock} disponibles` : undefined],
  ];

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-neutral-950/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="aspect-square bg-neutral-100">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-3 p-6">
            <button
              type="button"
              onClick={onClose}
              className="self-end text-sm text-neutral-400 hover:text-neutral-700"
            >
              Cerrar ✕
            </button>
            <span className="text-xs font-medium uppercase tracking-wide text-amber-600">
              {product.category}
            </span>
            <h2 className="text-2xl font-semibold text-neutral-900">{product.name}</h2>
            <p className="text-2xl font-bold text-neutral-900">
              {formatPrice(product.price, product.currency)}
            </p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-neutral-200 pt-4 text-sm">
              {details
                .filter(([, value]) => value !== undefined && value !== "")
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-neutral-500">{label}</dt>
                    <dd className="font-medium text-neutral-900">{value}</dd>
                  </div>
                ))}
            </dl>

            {product.description && (
              <p className="border-t border-neutral-200 pt-4 text-sm text-neutral-600">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
