import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const toneStyles = {
  danger: "text-red-500 bg-red-500/10 border-red-500/20",
  warning: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  brand: "text-[color:var(--primary)] bg-[color:var(--accent)]/15 border-[color:var(--accent)]/30",
};

export function AdminActionDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "brand",
  noteLabel = "Admin note / reason",
  notePlaceholder = "Add a short reason for audit history...",
  noteRequired = false,
  noteValue = "",
  onNoteChange,
  onCancel,
  onConfirm,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1721]/45 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-lg"
          >
            <AppCard variant="strong" radius="xl" padding="lg" className="shadow-[0_28px_90px_rgba(16,32,45,0.24)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-2xl border p-3", toneStyles[tone] || toneStyles.brand)}>
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[color:var(--ink)]">{title}</h2>
                    {description ? <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p> : null}
                  </div>
                </div>
                <button type="button" onClick={onCancel} className="rounded-full p-2 text-[color:var(--muted)] transition hover:bg-black/5 hover:text-[color:var(--ink)]">
                  <X className="size-5" />
                </button>
              </div>

              {onNoteChange ? (
                <div className="mt-5 space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    {noteLabel}{noteRequired ? <span className="text-red-500"> *</span> : null}
                  </Label>
                  <textarea
                    value={noteValue}
                    onChange={(event) => onNoteChange(event.target.value)}
                    placeholder={notePlaceholder}
                    rows={4}
                    className="w-full resize-none rounded-3xl border border-white/70 bg-[var(--input-bg)] px-4 py-3 text-sm font-semibold leading-6 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] outline-none transition placeholder:text-[color:var(--muted)]/65 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring-soft)]"
                  />
                  {noteRequired && !noteValue.trim() ? <p className="text-xs font-semibold text-red-500">A reason is required for this decision.</p> : null}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <AppButton
  variant="glass"
  onClick={onCancel}
  className="
    bg-[#F3F6FA]
    border border-[#D5DEE8]
    text-[#355872]
    hover:bg-[#E9F0F7]
    hover:border-[#C3D2E3]
  "
>{cancelLabel}</AppButton>
                <AppButton variant={tone === "danger" ? "danger" : "brand"} onClick={onConfirm} className="
    bg-[image:var(--nav-gradient)]
    text-white
    hover:brightness-110
  ">
                  {confirmLabel}
                </AppButton>
              </div>
            </AppCard>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
