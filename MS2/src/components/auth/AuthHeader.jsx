import { GraduationCap } from "lucide-react";

export default function AuthHeader({
  badge,
  title,
  highlightedWord,
  description,
  showBrand = false,
  compact = false,
}) {
  if (showBrand) {
    return (
      <>
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/80 bg-[color:var(--accent)]/35 shadow-[0_14px_28px_rgba(53,88,114,0.18),0_0_0_6px_rgba(156,213,255,0.16)]">
            <GraduationCap className="h-8 w-8 text-[color:var(--primary)]" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-[color:var(--dark)] max-sm:text-xl">
            GUC Portfolio Hub
          </h2>
        </div>

        <div className="mb-10 text-center">
          <span className="mb-5 inline-flex rounded-full border border-[color:var(--accent)]/60 bg-[color:var(--accent)]/25 px-4 py-2 text-sm font-bold text-[color:var(--primary)]">
            {badge}
          </span>

          <h1 className="mb-4 text-5xl font-black tracking-[-0.06em] text-[color:var(--ink)] max-sm:text-4xl">
            {title}{" "}
            <span className="relative text-[color:var(--primary)] after:absolute after:-bottom-2 after:left-1 after:h-1 after:w-full after:rounded-full after:bg-[linear-gradient(90deg,var(--gold),transparent)]">
              {highlightedWord}
            </span>
          </h1>

          <p className="mx-auto max-w-[410px] text-base leading-7 text-[color:var(--muted)]">
            {description}
          </p>
        </div>
      </>
    );
  }

  if (compact) {
    return (
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-[14px] border border-white/80 bg-[color:var(--accent)]/35 shadow-[0_10px_22px_rgba(53,88,114,0.14),0_0_0_4px_rgba(156,213,255,0.12)]">
          <GraduationCap className="h-6 w-6 text-[color:var(--primary)]" />
        </div>

        <span className="mb-3 inline-flex rounded-full border border-[color:var(--accent)]/60 bg-[color:var(--accent)]/20 px-3 py-1.5 text-[11px] font-bold text-[color:var(--primary)]">
          {badge}
        </span>

        <h1 className="text-[38px] font-black leading-none tracking-[-0.055em] text-[color:var(--ink)] max-sm:text-3xl">
          {title}{" "}
          <span className="relative text-[color:var(--primary)] after:absolute after:-bottom-1.5 after:left-1 after:h-[3px] after:w-full after:rounded-full after:bg-[linear-gradient(90deg,var(--gold),transparent)]">
            {highlightedWord}
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-[430px] text-[13px] leading-5 text-[color:var(--muted)]">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/80 bg-[color:var(--accent)]/35 shadow-[0_14px_28px_rgba(53,88,114,0.18),0_0_0_6px_rgba(156,213,255,0.16)]">
        <GraduationCap className="h-8 w-8 text-[color:var(--primary)]" />
      </div>

      <span className="mb-4 inline-flex rounded-full border border-[color:var(--accent)]/60 bg-[color:var(--accent)]/25 px-4 py-2 text-sm font-bold text-[color:var(--primary)]">
        {badge}
      </span>

      <h1 className="text-5xl font-black tracking-[-0.06em] text-[color:var(--ink)] max-sm:text-4xl">
        {title}{" "}
        <span className="relative text-[color:var(--primary)] after:absolute after:-bottom-2 after:left-1 after:h-1 after:w-full after:rounded-full after:bg-[linear-gradient(90deg,var(--gold),transparent)]">
          {highlightedWord}
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-[480px] text-base leading-7 text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}