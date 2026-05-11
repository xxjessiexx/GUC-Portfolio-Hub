export function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--primary)]/20 bg-white/50 p-5 text-sm font-semibold text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
      <p className="font-black text-[var(--ink)]">{title}</p>
      <p className="mt-1">{description}</p>
    </div>
  );
}

export function SmallActionButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`rounded-xl px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}