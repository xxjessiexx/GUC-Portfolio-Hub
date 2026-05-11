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
        bg-[#102B3C]/18
        px-6 pb-10 pt-28
        backdrop-blur-[1.5px]
      "
    >
      <div
        className={`
          w-full ${maxWidth}
          rounded-[32px]
          border border-white/70
          bg-white
          p-6
          shadow-[0_30px_90px_rgba(44,57,71,0.22)]
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
              bg-slate-100
              text-[color:var(--muted)]
              transition
              hover:bg-slate-200
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