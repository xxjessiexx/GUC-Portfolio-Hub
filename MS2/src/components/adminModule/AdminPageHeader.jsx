import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";

export function AdminPageHeader({ eyebrow, title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <AppCard variant="dark" radius="xl" padding="lg" className="overflow-hidden">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-xs font-black uppercase tracking-[0.26em] text-[color:var(--gold)]">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/65">{description}</p>}
        </div>

        {actionLabel && (
          <AppButton variant="navDark" size="lg" onClick={onAction}>
            {Icon && <Icon className="h-5 w-5" />}
            {actionLabel}
          </AppButton>
        )}
      </div>
    </AppCard>
  );
}
