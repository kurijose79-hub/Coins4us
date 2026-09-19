interface ComingSoonCardProps {
  icon: string;
  title: string;
  description: string;
  requirement: string;
}

export function ComingSoonCard({ icon, title, description, requirement }: ComingSoonCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      </div>
      <p className="text-sm text-neutral-500">{description}</p>
      <div className="rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-500">
        Próximamente — {requirement}
      </div>
    </div>
  );
}
