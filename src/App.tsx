import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { CategoryFilter } from "./components/CategoryFilter";
import { ProductGrid } from "./components/ProductGrid";
import { ProductModal } from "./components/ProductModal";
import { Footer } from "./components/Footer";
import { products } from "./data/products";
import type { Product } from "./types/product";

const ALL = "Todos";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [selected, setSelected] = useState<Product | null>(null);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === ALL || p.category === category;
      const matchesSearch =
        term === "" ||
        [p.name, p.country, p.year, p.material]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Header search={search} onSearchChange={setSearch} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
        <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
        <ProductGrid products={filtered} onSelect={setSelected} />
      </main>

      <Footer />

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default App;
