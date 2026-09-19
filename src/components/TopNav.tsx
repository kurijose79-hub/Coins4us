export type MainView = "cuenta" | "crear" | "biblioteca" | "analisis";

interface TopNavProps {
  active: MainView;
  onNavigate: (view: MainView) => void;
}

const TABS: { id: MainView; label: string; icon: string }[] = [
  { id: "cuenta", label: "Cuenta", icon: "⚙️" },
  { id: "crear", label: "Crear", icon: "✨" },
  { id: "biblioteca", label: "Biblioteca", icon: "📚" },
  { id: "analisis", label: "Análisis", icon: "📊" },
];

export function TopNav({ active, onNavigate }: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Audio<span className="text-amber-400">libros</span>
        </h1>
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active === tab.id
                  ? "bg-amber-400 text-neutral-950"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <span aria-hidden>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
