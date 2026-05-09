import { Children } from "react";

export default function FilterPanel({
  title = "Filters",
  children,
  onClear,
  clearLabel = "Clear filters",
}) {
  return (
    <div className="mt-5 rounded-3xl border border-white/70 bg-white/60 p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-black text-[color:var(--ink)]">
          {title}
        </h3>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#D7E5F2] bg-white px-4 text-sm font-black text-[color:var(--primary)] shadow-sm transition hover:border-[color:var(--primary)] hover:bg-[#F4F9FF]"
          >
            {clearLabel}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {Children.map(children, (child) => (
          <div className="min-w-[13rem] flex-1 sm:flex-none">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}