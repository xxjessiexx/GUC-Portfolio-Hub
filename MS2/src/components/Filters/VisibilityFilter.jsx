import AppSelect from "@/components/common/AppSelect";
import { Eye } from "lucide-react";

export default function VisibilityFilter({
  value = "all",
  onChange,
  options,
  label = "Visibility",
  placeholder = "All Visibility",
  className = "",
}) {
  const items =
    options || [
      { value: "public", label: "Public" },
      { value: "private", label: "Private" },
      { value: "featured", label: "Featured" },
    ];

  return (
    <div className={className}>
      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <Eye className="h-3.5 w-3.5" />
        {label}
      </span>
      <AppSelect
        value={value}
        onChange={onChange}
        options={[{ value: "all", label: placeholder }, ...items]}
        placeholder={placeholder}
        className="min-w-[180px]"
      />
    </div>
  );
}
