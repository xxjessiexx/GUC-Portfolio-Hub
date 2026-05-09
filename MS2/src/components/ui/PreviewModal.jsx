import { Link } from "react-router-dom";
import { Bookmark, Send } from "lucide-react";

import AppModal from "@/components/common/AppModal";
import StatusBadge from "@/components/common/StatusBadge";
import { AppButton } from "@/components/ui/AppButton";

export default function PreviewModal({
  internship,
  isSaved,
  isApplied,
  onClose,
  onSave,
  onApply,
}) {
  return (
    <AppModal
      title="Internship Preview"
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        <h2 className="text-3xl font-black">
          {internship.title}
        </h2>

        <p>{internship.company}</p>

        <div className="flex gap-2">
          {internship.featured && (
            <StatusBadge status="Featured" />
          )}

          {isSaved && (
            <StatusBadge status="Saved" />
          )}

          {isApplied && (
            <StatusBadge status="Applied" />
          )}
        </div>

        <p>{internship.overview}</p>

        <div className="flex justify-end gap-3">
          <AppButton onClick={onSave}>
            <Bookmark className="mr-2 h-4 w-4" />

            {isSaved ? "Unsave" : "Save"}
          </AppButton>

          <AppButton
            onClick={onApply}
            disabled={isApplied}
          >
            <Send className="mr-2 h-4 w-4" />

            {isApplied
              ? "Already Applied"
              : "Apply"}
          </AppButton>

          <Link to={`/internships/${internship.id}`}>
            <AppButton>
              Full Details
            </AppButton>
          </Link>
        </div>
      </div>
    </AppModal>
  );
}