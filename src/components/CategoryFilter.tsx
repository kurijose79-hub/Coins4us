interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === category
              ? "border-amber-400 bg-amber-400 text-neutral-900"
              : "border-neutral-300 bg-white text-neutral-700 hover:border-amber-400 hover:text-amber-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
