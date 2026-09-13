import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InstructorSearchField({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
}) {
  return (
    <label className={cn("relative block min-w-0", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718796] dark:text-[#9CB2C1]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-[52px] w-full rounded-[17px] border border-[#C8DAE4] bg-white pl-11 pr-4 text-[13px] font-semibold text-[color:var(--ink)] shadow-[0_9px_24px_rgba(53,88,114,0.08)] outline-none transition placeholder:text-[#80939F] focus:border-[color:var(--primary)]/45 focus:ring-4 focus:ring-[color:var(--primary)]/10 dark:border-white/12 dark:bg-[#102638] dark:placeholder:text-[#8FA6B6]",
          inputClassName
        )}
      />
    </label>
  );
}
