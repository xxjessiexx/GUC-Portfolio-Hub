// src/components/ui/Searchcommons/InsctructorCard.jsx

import { Mail, MapPin } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";

function courseCode(course) {
  if (!course) return "";

  const text = String(course).trim();

  if (text.includes(" - ")) {
    return text.split(" - ")[0].trim();
  }

  const parts = text.split(/\s+/);

  if (parts.length >= 2) {
    return parts.slice(0, 2).join(" ");
  }

  return text;
}

export default function InstructorCard({ instructor, onView }) {
  const courses = Array.isArray(instructor.courses)
    ? instructor.courses
    : [];

  const visibleCourses = courses.slice(0, 3);
  const remainingCourses = Math.max(courses.length - visibleCourses.length, 0);

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
        group
        w-full max-w-[320px] h-full
        overflow-hidden
        rounded-3xl
        border border-[var(--card-border)]
        bg-[var(--card-bg)]
        shadow-[var(--shadow-card)]
        backdrop-blur-md
        cursor-pointer
        outline-none
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[var(--primary)]
        hover:shadow-[var(--shadow-lifted)]
        focus-visible:ring-4
        focus-visible:ring-[#7AAACE]/20
      "
    >
      {/* Visual zone — same footprint/rhythm as project cards */}
      <div
        className="
          flex h-44 items-center justify-center
          border-b border-[var(--card-border)]
          bg-[linear-gradient(145deg,rgba(234,242,246,0.95),rgba(248,251,252,0.98))]
          dark:bg-[linear-gradient(145deg,rgba(14,35,49,0.95),rgba(18,42,58,0.98))]
        "
      >
        <img
          src={instructor.image}
          alt={instructor.name}
          className="
            h-[108px] w-[108px] rounded-full
            border-[5px] border-white/85
            object-cover
            shadow-[0_18px_38px_rgba(53,88,114,0.18)]
            dark:border-white/10
          "
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="
            text-lg font-black
            text-[color:var(--ink)]
            transition
            group-hover:text-[color:var(--primary)]
          "
        >
          {instructor.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-[var(--muted)]">
          {[instructor.role, instructor.department].filter(Boolean).join(" · ")}
        </p>

        <div
          className="
            mt-4 space-y-2.5
            text-[12px] font-semibold
            text-[var(--muted)]
          "
        >
          <div className="flex min-w-0 items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-[var(--primary)]" />
            <span className="truncate">{instructor.email}</span>
          </div>

          {instructor.office ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--primary)]" />
              <span>{instructor.office}</span>
            </div>
          ) : null}
        </div>

       {courses.length ? (
  <div className="mt-auto border-t border-[var(--border-blue)] pt-3.5">
    <div className="flex items-center justify-between gap-3">
      <p
        className="
          text-[9.5px] font-black uppercase tracking-[0.14em]
          text-[#6F8391]
          dark:text-[#8FA5B4]
        "
      >
        Teaching
      </p>

      <span className="text-[9.5px] font-black text-[var(--muted)]">
        {courses.length} {courses.length === 1 ? "course" : "courses"}
      </span>
    </div>

   <div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {visibleCourses.map((course, index) => (
          <span
            key={`${course}-${index}`}
            className="text-[11px] font-black text-[var(--primary)]"
          >
            {courseCode(course)}

            {index < visibleCourses.length - 1 ? (
              <span className="ml-2.5 text-[#B89736] dark:text-[var(--gold)]">
                ·
              </span>
            ) : null}
          </span>
        ))}
      </div>

      {remainingCourses > 0 ? (
        <p className="mt-2 text-[10.5px] font-black text-[var(--primary)]">
          + {remainingCourses} more{" "}
          {remainingCourses === 1 ? "course" : "courses"}
        </p>
      ) : null}
    </div>
  </div>
) : null}
    
</div>
    </AppCard>
  );
}
