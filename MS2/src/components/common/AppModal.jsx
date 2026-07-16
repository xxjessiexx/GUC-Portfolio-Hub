import { X } from "lucide-react";

export default function AppModal({
  title,
  children,
  onClose,
  maxWidth = "max-w-2xl",
}) {
  return (
    <div
      className="
        fixed inset-0 z-[99999]
        flex items-start justify-center
        overflow-y-auto
        bg-black/45
backdrop-blur-sm
        px-6 pb-10 pt-28
        
      "
    >
      <div
        className={`
          w-full ${maxWidth}
          rounded-[32px]

bg-[var(--card-bg-strong)]
border border-[var(--card-border)]

text-[var(--ink)]

p-6

shadow-[var(--shadow-card)]
backdrop-blur-xl
        `}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              grid h-10 w-10 place-items-center
              rounded-2xl
              
              text-[color:var(--muted)]
              transition
              bg-[var(--surface)]
border border-[var(--card-border)]

hover:bg-[var(--surface-elevated)]
hover:border-[var(--primary)]
            "
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}