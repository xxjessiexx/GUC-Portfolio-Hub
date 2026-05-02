import { GraduationCap, BookOpen, CalendarDays } from "lucide-react";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

export default function MiniProfileSummary({ profile, updateProfile }) {
  return (
    <div className="text-center">
      <ProfilePhotoUploader
        image={profile.image}
        setImage={(image) => updateProfile({ image })}
        name={profile.name}
      />

      <h2 className="mt-4 text-2xl font-black text-[color:var(--ink)]">
        {profile.name}
      </h2>

      <p className="text-sm font-semibold text-[color:var(--muted)]">
        {profile.role}
      </p>

      <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[color:var(--muted)]">
        {profile.bio}
      </p>

      <div className="my-6 h-px bg-[color:var(--primary)]/10" />

      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <GraduationCap className="h-4 w-4 text-[color:var(--primary)]" />
            Faculty
          </span>
          <span className="text-sm font-semibold text-[color:var(--muted)]">
            {profile.faculty}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <BookOpen className="h-4 w-4 text-[color:var(--primary)]" />
            Major
          </span>
          <span className="text-sm font-semibold text-[color:var(--muted)]">
            {profile.major}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <CalendarDays className="h-4 w-4 text-[color:var(--primary)]" />
            Semester
          </span>
          <span className="text-sm font-semibold text-[color:var(--muted)]">
            {profile.semester}
          </span>
        </div>
      </div>
    </div>
  );
}