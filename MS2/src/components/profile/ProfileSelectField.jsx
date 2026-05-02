import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfileSelectField({ label, value, options, onChange }) {
  return (
    <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
      <p className="text-sm font-black text-[color:var(--dark)]">{label}</p>

      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger className="h-12 w-full max-w-[520px] rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-4 text-[color:var(--ink)] shadow-sm focus:ring-4 focus:ring-[color:var(--gold)]/15">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[9999] max-h-64 min-w-[260px] rounded-2xl border border-[color:var(--primary)]/10 bg-white/95 p-2 text-[color:var(--ink)] shadow-[0_20px_60px_rgba(53,88,114,0.18)] backdrop-blur-xl"
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={String(option)}
              className="cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold focus:bg-[color:var(--accent)]/25 focus:text-[color:var(--primary)]"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}