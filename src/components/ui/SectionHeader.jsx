import { Button } from "@/components/ui/button";

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm font-medium text-[var(--muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Button
          variant="outline"
          className="rounded-2xl border-[color:rgba(53,88,114,0.15)] bg-white/60 font-bold text-[var(--primary)]"
        >
          {action}
        </Button>
      )}
    </div>
  );
}