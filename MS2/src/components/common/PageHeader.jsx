import { cn } from "@/lib/utils";

export default function PageHeader({
  title,
  description,
  action,
  eyebrow,
  accent = true,
  className = "",
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 max-w-4xl">
        {accent && (
          <div
            aria-hidden="true"
            className="mb-3 h-[3px] w-10 rounded-full bg-[var(--gold)]"
          />
        )}

        {eyebrow && (
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[color:var(--secondary)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-4xl font-black tracking-[-0.04em] text-[color:var(--ink)] sm:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-[color:var(--muted)]">
            {description}
          </p>
        )}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
