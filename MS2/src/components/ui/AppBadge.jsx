import { cn } from "@/lib/utils";

const tones = {
  blue: "border-[color:var(--accent)]/55 bg-[color:var(--accent)]/25 text-[color:var(--primary)]",
  gold: "border-[color:var(--gold)]/45 bg-[color:var(--gold)]/20 text-[color:var(--primary)]",
  white: "border-white/60 bg-white/60 text-[color:var(--primary)]",
  dark: "border-white/15 bg-white/10 text-white",
  muted: "border-[color:var(--border-blue)] bg-white/50 text-[color:var(--muted)]",
};

export default function AppBadge({ tone = "blue", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black backdrop-blur-xl",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
