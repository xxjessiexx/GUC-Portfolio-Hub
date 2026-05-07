import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfileSelectField({ label, value, options, onChange }) {
  return (
    <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center dark:border-white/10">
      <p className="text-sm font-black text-[color:var(--dark)] dark:text-[color:var(--ink)]">
        {label}
      </p>

      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger className="h-12 w-full max-w-[520px] rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-4 text-[color:var(--ink)] shadow-sm focus:ring-4 focus:ring-[color:var(--gold)]/15 dark:border-white/10 dark:bg-white/[0.055] dark:focus:ring-[color:var(--accent)]/15">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          className="
            z-[9999]
            max-h-64
            min-w-[260px]
            overflow-hidden
            rounded-2xl
            border
            border-[rgba(53,88,114,0.14)]
            !bg-[#F7F8F0]
            p-2
            !text-[#102630]
            shadow-[0_24px_70px_rgba(53,88,114,0.18)]
            backdrop-blur-none
            dark:border-white/10
            dark:!bg-[#102030]
            dark:!text-[#F3F8FB]
            dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]
          "
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={String(option)}
              className="
                cursor-pointer
                rounded-xl
                px-3
                py-2.5
                text-sm
                font-bold
                text-[#102630]
                focus:bg-[rgba(156,213,255,0.32)]
                focus:text-[#355872]
                data-[state=checked]:bg-[rgba(156,213,255,0.24)]
                data-[state=checked]:text-[#355872]
                dark:text-[#F3F8FB]
                dark:focus:bg-white/10
                dark:focus:text-[#9CD5FF]
                dark:data-[state=checked]:bg-white/10
                dark:data-[state=checked]:text-[#9CD5FF]
              "
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}