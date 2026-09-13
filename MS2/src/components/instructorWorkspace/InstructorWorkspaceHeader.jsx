import { cn } from "@/lib/utils";

export default function InstructorWorkspaceHeader({
  eyebrow,
  title,
  description,
  stats = [],
  className = "",
}) {
  return (
    <header className={cn("relative isolate py-1", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.14),transparent_70%)] blur-xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-0 h-32 w-48 rounded-full bg-[radial-gradient(ellipse,rgba(230,199,123,0.10),transparent_72%)] blur-2xl"
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-4xl">
          <div className="mb-3 h-[3px] w-10 rounded-full bg-[var(--gold)]" />
          {eyebrow ? (
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[color:var(--secondary)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-black tracking-[-0.04em] text-[color:var(--ink)] sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-[color:var(--muted)]">
              {description}
            </p>
          ) : null}
        </div>

        {stats.length ? (
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 lg:pb-1">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                {index > 0 ? (
                  <span className="mr-0.5 text-[10px] font-black text-[#B9C5CB] dark:text-white/20">•</span>
                ) : null}
                <span
                  className={cn(
                    "text-[1.15rem] font-black tracking-[-0.035em] text-[color:var(--ink)]",
                    stat.emphasis === "gold" && "text-[#A47B16] dark:text-[color:var(--gold)]"
                  )}
                >
                  {stat.value}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.08em] text-[color:var(--muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
