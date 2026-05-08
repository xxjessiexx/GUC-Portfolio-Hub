import { isValidElement } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  actionIcon: ActionIcon,
  onAction,
  className,
}) {
  const hasCustomAction = isValidElement(action);

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[color:var(--secondary)]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-2xl font-black tracking-tight text-[color:var(--ink)]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[color:var(--muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {hasCustomAction ? (
            action
          ) : (
            <AppButton variant="glass" size="sm" onClick={onAction}>
              {ActionIcon && <ActionIcon className="h-4 w-4" />}
              {action}
            </AppButton>
          )}
        </div>
      )}
    </div>
  );
}
