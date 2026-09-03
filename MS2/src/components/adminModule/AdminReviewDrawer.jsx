import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";

export function AdminReviewDrawer({
  open,
  title,
  eyebrow,
  subtitle,
  status,
  onClose,
  children,
  footer,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="absolute inset-0 bg-[#0b1721]/45 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 28,
            }}
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-full
              max-w-xl
              flex-col
              overflow-hidden
              border-l
              border-[#D7E1E8]
              bg-[var(--card-bg-strong)]
              shadow-[0_30px_120px_rgba(16,32,45,0.28)]
            "
          >
            <div className="border-b border-[color:var(--border-blue)] bg-[var(--surface-strong)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {eyebrow ? (
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">
                      {eyebrow}
                    </p>
                  ) : null}

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[color:var(--ink)]">
                    {title}
                  </h2>

                  {subtitle ? (
                    <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                      {subtitle}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {status ? (
                    <AdminStatusBadge status={status} />
                  ) : null}

                  <AppButton
                    variant="glass"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="size-4" />
                    Close
                  </AppButton>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>

            {footer ? (
              <div className="border-t border-[color:var(--border-blue)] bg-[var(--card-bg-strong)] p-4">
                {footer}
              </div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function DrawerSection({
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        rounded-3xl
        border
        border-[color:var(--border-blue)]
        bg-[var(--surface-soft)]
        p-4
        shadow-[0_14px_35px_rgba(53,88,114,0.06)]
        ${className}
      `}
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
        {title}
      </p>

      <div className="mt-3 text-sm font-semibold leading-7 text-[color:var(--ink)]">
        {children}
      </div>
    </section>
  );
}