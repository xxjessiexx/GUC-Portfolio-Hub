import AppModal from "@/components/common/AppModal";

export default function ApplyModal({
  internship,
  coverLetter,
  setCoverLetter,
  isApplied,
  onClose,
  onConfirm,
}) {
  return (
    <AppModal
      title={`Apply — ${internship.title}`}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <textarea
        value={coverLetter}
        onChange={(e) =>
          setCoverLetter(e.target.value)
        }
        placeholder="Write your cover letter..."
        className="
          mt-5
          min-h-40
          w-full
          rounded-2xl
          border
          p-4
        "
      />

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose}>
          Cancel
        </button>

        <button
          onClick={onConfirm}
          disabled={isApplied}
        >
          {isApplied
            ? "Already Applied"
            : "Submit"}
        </button>
      </div>
    </AppModal>
  );
}