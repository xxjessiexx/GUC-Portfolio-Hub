import { cn } from "@/lib/utils";

export default function InstructorWorkspaceTabs({
  items,
  value,
  onChange,
  ariaLabel = "Workspace filters",
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative inline-flex h-11 items-center gap-2 px-3 text-[12.5px] font-black transition-colors",
              selected
                ? "text-[#17384E] dark:text-white"
                : "text-[#7B8D98] hover:text-[color:var(--primary)] dark:text-[#8298A6] dark:hover:text-[#C7D8E1]"
            )}
          >
            {item.label}
            {item.count !== undefined ? (
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 py-0.5 text-[9.5px] leading-4",
                  selected
                    ? "bg-[color:var(--gold)]/38 text-[#6F581D] dark:bg-[color:var(--gold)]/14 dark:text-[color:var(--gold)]"
                    : "bg-[#E9F0F3] text-[#7A8D99] dark:bg-white/[0.05] dark:text-[#8599A5]"
                )}
              >
                {item.count}
              </span>
            ) : null}
            {selected ? (
              <span className="absolute inset-x-2 bottom-[-9px] h-[3px] rounded-t-full bg-[color:var(--gold)]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
