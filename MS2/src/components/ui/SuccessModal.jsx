import AppModal from "@/components/common/AppModal";

export default function SuccessModal({
  title,
  message,
  onClose,
}) {
  return (
    <AppModal
      title={title}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-center">

        <p className="text-gray-500">
          {message}
        </p>

        <button
          onClick={onClose}
          className="
            h-12
            w-full
            rounded-2xl
            bg-[color:var(--primary)]
            text-white
            font-bold
          "
        >
          Done
        </button>
      </div>
    </AppModal>
  );
}