import { BookOpen, Building2, CalendarDays, Clock } from "lucide-react";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

export default function InstructorProfileSummary({ profile, updateProfile }) {
  const department =
    profile.department || "Computer Science and Engineering";

  const officeHours =
    profile.officeHours || "Sun, Tue, Thu";

  const joinedGuc = profile.joinedGuc || "September 2010";

  const courses = profile.courses || [
    "CSEN 601 — Software Engineering",
    "CSEN 604 — Database Systems",
    "CSEN 603 — Artificial Intelligence",
    "CSEN 701 — Web Applications",
  ];

  return (
    <div className="text-center">
      <ProfilePhotoUploader
        image={profile.image}
        setImage={(image) => updateProfile({ image })}
        name={profile.name}
      />

      <h2 className="mt-4 text-2xl font-black text-[color:var(--ink)]">
        {profile.name || "Dr. Mervat Abuelkheir"}
      </h2>

      <p className="text-sm font-semibold text-[color:var(--muted)]">
        Course Instructor
      </p>

      <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[color:var(--muted)]">
        {profile.bio ||
          "Passionate about advancing software engineering, database systems, and artificial intelligence."}
      </p>

      <div className="my-6 h-px bg-[color:var(--primary)]/10" />

      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <Building2 className="h-4 w-4 text-[color:var(--primary)]" />
            Department
          </span>
          <span className="text-right text-sm font-semibold text-[color:var(--muted)]">
            {department}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <CalendarDays className="h-4 w-4 text-[color:var(--primary)]" />
            Joined GUC
          </span>
          <span className="text-sm font-semibold text-[color:var(--muted)]">
            {joinedGuc}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <Clock className="h-4 w-4 text-[color:var(--primary)]" />
            Office Hours
          </span>
          <span className="text-sm font-semibold text-[color:var(--muted)]">
            {officeHours}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <BookOpen className="h-4 w-4 text-[color:var(--primary)]" />
            Courses Linked
          </span>
          <span className="text-sm font-semibold text-[color:var(--muted)]">
            {courses.length}
          </span>
        </div>
      </div>
    </div>
  );
}