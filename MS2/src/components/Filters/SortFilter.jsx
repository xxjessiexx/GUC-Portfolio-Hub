import AppSelect from "@/components/common/AppSelect";
import { ArrowUpDown } from "lucide-react";

export default function SortFilter({
  value = "newest",
  onChange,
  options,
  label = "Sort",
  placeholder,
  className = "",
}) {
  const items =
    options || [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "highest-rated", label: "Highest Rated" },
      { value: "most-projects", label: "Most Projects" },
    ];

  const normalizedItems = placeholder
    ? [{ value: "all", label: placeholder }, ...items]
    : items;

  return (
    <div className={className}>
      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <ArrowUpDown className="h-3.5 w-3.5" />
        {label}
      </span>
      <AppSelect
        value={value}
        onChange={onChange}
        options={normalizedItems}
        placeholder={placeholder || "Choose sorting"}
        className="min-w-[180px]"
      />
    </div>
  );
}
