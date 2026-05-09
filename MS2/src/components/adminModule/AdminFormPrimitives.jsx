import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import AppIconFrame from "@/components/ui/AppIconFrame";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { cardMotion } from "@/lib/adminFormTokens";

export function AdminMotionCard({ children, className }) {
  return (
    <motion.div variants={cardMotion}>
      <AppCard className={cn("p-4 sm:p-5", className)}>{children}</AppCard>
    </motion.div>
  );
}

export function AdminFormSectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <AppIconFrame className="h-11 w-11 shrink-0">
        <Icon className="size-5" />
      </AppIconFrame>
      <div>
        <h2 className="text-lg font-black tracking-tight text-[color:var(--ink)] sm:text-xl">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p> : null}
      </div>
    </div>
  );
}

export function AdminField({ label, required, icon: Icon, children, feedback, error, success }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-black text-[color:var(--ink)]">
        {Icon ? <Icon className="size-4 text-[color:var(--primary)]" /> : null}
        {label}{required ? <span className="text-[color:var(--gold)]">*</span> : null}
      </Label>
      {children}
      {(error || success || feedback) ? (
        <p className={cn("text-xs font-semibold leading-5", error ? "text-red-500" : success ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]")}>{error || success || feedback}</p>
      ) : null}
    </div>
  );
}

export function RequirementLine({ done, children }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs font-bold", done ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]")}>
      <CheckCircle2 className={cn("size-4", done ? "opacity-100" : "opacity-35")} />
      {children}
    </div>
  );
}
