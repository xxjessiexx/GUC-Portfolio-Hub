import { cn } from "@/lib/utils";

const tones = {
  blue:
    "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--primary)]",

  gold:
    "border-[var(--gold)]/40 bg-[var(--gold)]/15 text-[var(--gold)]",

  white:
    "border-[var(--card-border)] bg-[var(--surface)] text-[var(--ink)]",

  dark:
    "border-[var(--card-border)] bg-[var(--surface-soft)] text-[var(--ink)]",

  muted:
    "border-[var(--card-border)] bg-[var(--surface-soft)] text-[var(--muted)]",
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
