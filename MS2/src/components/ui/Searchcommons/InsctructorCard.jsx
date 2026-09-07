import { Mail, MapPin } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import CourseBadge from "@/components/ui/CourseBadge";

export default function InstructorCard({ instructor,onView }) {
  return (
    <AppCard
  role="link"
  tabIndex={0}
  onClick={onView}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onView?.();
    }
  }}
  className="
    p-6
    rounded-[28px]

    bg-[var(--card-bg)]
    border border-[var(--card-border)]

    shadow-[var(--shadow-card)]
    hover:shadow-[var(--shadow-lifted)]

    backdrop-blur-md
    cursor-pointer
    outline-none
    focus-visible:ring-4
    focus-visible:ring-[#7AAACE]/20
    transition-all
    duration-300

    hover:-translate-y-1
    hover:border-[var(--primary)]
  "
>
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1.2fr_0.9fr_1.3fr]
          gap-6
          items-center
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-5">
          <img
            src={instructor.image}
            alt={instructor.name}
            className="w-24 h-24 rounded-full object-cover"
          />

          <div>
            <h2 className="text-2xl font-black text-[var(--ink)]">
              {instructor.name}
            </h2>

            <p className="mt-1 text-[var(--muted)] font-semibold">
              {instructor.role}
            </p>

            <p className="mt-2 text-[var(--primary)] font-semibold">
              {instructor.department}
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div className="space-y-4 xl:border-l
xl:border-r
border-[var(--card-border)] xl:px-6">

          <div className="flex items-center gap-3 text-[var(--muted)]">
            <Mail size={18} />
            <span>{instructor.email}</span>
          </div>

          <div className="flex items-center gap-3 text-[var(--muted)]">
            <MapPin size={18} />
            <span>{instructor.office}</span>
          </div>
        </div>

        {/* COURSES */}
        <div>
          <h3 className="font-black text-[var(--ink)] mb-3">
            Courses Taught
          </h3>

          <div className="flex flex-wrap gap-2">
            {instructor.courses.map((course) => (
              <CourseBadge
                key={course}
                course={course}
                className="mt-0"
              />
            ))}
          </div>
        </div>

      </div>
    </AppCard>
  );
}