import AppSelect from "@/components/common/AppSelect";
import { Pin } from "lucide-react";

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
    <div className={className}>
      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <Pin className="h-3.5 w-3.5" />
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
