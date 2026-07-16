import { Children } from "react";

export default function FilterPanel({
  title = "Filters",
  children,
  onClear,
  clearLabel = "Clear filters",
}) {
  return (
    <div
      className="
        mt-5
        rounded-3xl
        p-5

        bg-[var(--surface)]
        border border-[var(--card-border)]
        shadow-[var(--shadow-soft)]
        backdrop-blur-md
      "
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-black text-[var(--ink)]">
          {title}
        </h3>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              rounded-2xl
              px-4

              bg-[var(--surface-strong)]
              border border-[var(--border-blue)]

              text-sm
              font-black
              text-[var(--primary)]

              shadow-[var(--shadow-soft)]
              transition-all

              hover:bg-[var(--surface-elevated)]
              hover:border-[var(--primary)]
            "
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