import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { cn } from "@/lib/utils";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";

export function AdminSection({ title, subtitle, action, children, className = "" }) {
  return (
    <AppCard className={cn("p-5", className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">
            Admin control
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[color:var(--ink)]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-[color:var(--muted)]">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </AppCard>
  );
}

export function AdminBadge({ children, tone = "blue" }) {
  const tones = {
    blue: "border-[#7AAACE]/50 bg-[#D8ECF8]/80 text-[#355872] dark:border-[#9CD5FF]/20 dark:bg-[#9CD5FF]/10 dark:text-[#9CD5FF]",
    gold: "border-[#E6C77B]/50 bg-[#FFF7D6]/80 text-[#7B5E12] dark:border-[#E6C77B]/25 dark:bg-[#E6C77B]/10 dark:text-[#E6C77B]",
    danger: "border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
    neutral: "border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] text-[color:var(--muted)]",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black", tones[tone])}>
      {children}
    </span>
  );
}

export function AdminActionPair({ approveLabel = "Approve", rejectLabel = "Reject" }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <motion.button
        type="button"
        whileTap={tapScale}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: easeOutExpo }}
        className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
        aria-label={approveLabel}
      >
        <CheckCircle2 className="h-4 w-4" />
      </motion.button>
      <motion.button
        type="button"
        whileTap={tapScale}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: easeOutExpo }}
        className="grid h-10 w-10 place-items-center rounded-2xl border border-red-200 bg-red-50 text-red-600 shadow-sm hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
        aria-label={rejectLabel}
      >
        <XCircle className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

export function AdminMiniButton({ children, variant = "outline", icon: Icon }) {
  return (
    <AppButton variant={variant} size="sm" className="rounded-xl">
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </AppButton>
  );
}
