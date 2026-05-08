import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 shadow-[var(--shadow-soft)] ${className}`}
    >
      <Search className="h-4 w-4 text-[color:var(--muted)]" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
      />
    </div>
  );
}