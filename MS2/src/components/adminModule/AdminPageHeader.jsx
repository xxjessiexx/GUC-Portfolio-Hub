import { Link } from "react-router-dom";
import { AppButton } from "@/components/ui/AppButton";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  icon: Icon,
}) {
  return (
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[color:var(--primary)]">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
          {title}
        </h1>

        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-[color:var(--muted)]">
          {description}
        </p>
      </div>

      {actionLabel && (
        <AppButton
          as={Link}
          to={actionTo}
          size="lg"
          className="rounded-2xl bg-[color:var(--primary)] px-6 py-3 font-black text-white shadow-[0_14px_30px_rgba(31,58,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[color:var(--primary)]/90"
        >
          {Icon && <Icon className="size-5" />}
          {actionLabel}
        </AppButton>
      )}
    </div>
  );
}