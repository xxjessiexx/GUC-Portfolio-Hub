import { ChevronDown, Pin } from "lucide-react";

export default function PinnedFilter({
  value = "all",
  onChange,
  options,
  label = "Pinned",
  placeholder = "All Projects",
  className = "",
}) {
  const items =
    options || [
      { value: "pinned", label: "Pinned Only" },
      { value: "unpinned", label: "Not Pinned" },
    ];

  return (
    <label
      className={`flex min-w-[180px] items-center justify-between gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 shadow-[var(--shadow-soft)] ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Pin className="h-4 w-4 shrink-0 text-[color:var(--muted)]" />

        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {label}
          </span>

          <select
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            className="mt-0.5 w-full appearance-none bg-transparent text-sm font-black text-[color:var(--ink)] outline-none"
          >
            <option value="all">{placeholder}</option>

            {items.map((item) => {
              const itemValue =
                typeof item === "string"
                  ? item
                  : item.value || item.id || item.name || item.title;

              const itemLabel =
                typeof item === "string"
                  ? item
                  : item.label || item.name || item.title || itemValue;

              return (
                <option key={itemValue} value={itemValue}>
                  {itemLabel}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-[color:var(--muted)]" />
    </label>
  );
}