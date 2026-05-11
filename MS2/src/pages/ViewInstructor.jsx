import AppModal from "@/components/common/AppModal";
import InstructorProfileCard from "./InstructorProfileCard";

export default function ViewInstructor({
  instructor,
  onClose,
}) {
  if (!instructor) return null;

  return (
    <AppModal
      title=""
      onClose={onClose}
      maxWidth="max-w-5xl"
    >
      <InstructorProfileCard
        instructor={instructor}
        onClose={onClose}
      />
    </AppModal>
  );
}
