import { createPortal } from "react-dom";

export default function DeleteConfirmationModal({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
  confirmText = "Delete",
}) {
  if (!open) return null;

  return createPortal(
    <div
      className="
        fixed inset-0 z-[99999]
        flex items-center justify-center
        bg-[#0b1721]/45
        px-6
        backdrop-blur-sm
      "
      onMouseDown={onCancel}
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        className="
          w-full max-w-md
          rounded-[32px]
          border border-white/80
          bg-[var(--card-bg-strong)]
          p-8
          shadow-[0_28px_90px_rgba(16,32,45,0.24)]
        "
      >
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-black text-[color:var(--ink)]">
              {title}
            </h2>

            <p className="mt-3 text-base font-semibold leading-relaxed text-[color:var(--muted)]">
              {description}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="
                rounded-2xl
                border border-[#D5DEE8]
                bg-[#F3F6FA]
                px-5 py-3
                font-black
                text-[#355872]
                transition
                hover:border-[#C3D2E3]
                hover:bg-[#E9F0F7]
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="
                rounded-2xl
                bg-red-500
                px-5 py-3
                font-black
                text-white
                shadow-[0_14px_30px_rgba(239,68,68,0.28)]
                transition
                hover:bg-red-600
              "
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}