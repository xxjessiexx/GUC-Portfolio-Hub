import { cn } from "@/lib/utils";

const variants = {
  blue: "bg-[color:var(--accent)]/30 text-[color:var(--primary)] shadow-[0_0_0_6px_rgba(156,213,255,0.14)]",
  white: "bg-white/12 text-[color:var(--accent)] ring-1 ring-white/15",
  gold: "bg-[color:var(--gold)]/20 text-[color:var(--primary)]",
};

export default function AppIconFrame({ variant = "blue", className, children }) {
  return (
    <span
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
