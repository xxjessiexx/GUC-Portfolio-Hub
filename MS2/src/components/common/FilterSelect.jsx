import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSelect({
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-black text-[color:var(--ink)] shadow-sm ${className}`}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent position="popper"
  side="bottom"
  sideOffset={8}
  avoidCollisions={false}
  className="
    z-[9999]
    rounded-2xl
    max-h-64
    overflow-y-auto
  ">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}