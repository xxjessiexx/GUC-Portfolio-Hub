import { Link2, Plus, Users } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function InstructorCoursesPanel({ courses = [] }) {
  return (
    <AppCard padding="lg" className="h-full">
      <SectionHeader
        eyebrow="Course linking"
        title="Linked courses"
        subtitle="Covers the instructor ability to link/unlink courses and show the courses taught on the profile."
        action="Request course"
        actionIcon={Plus}
      />

      <div className="mt-6 space-y-3">
        {courses.map((course) => {
          const linked = course.status === "Linked";

          return (
            <div
              key={course.id}
              className="rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4 transition hover:-translate-y-0.5 hover:bg-[color:var(--surface-strong)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">
                    {course.code}
                  </p>
                  <h3 className="mt-1 truncate text-base font-black text-[color:var(--ink)]">
                    {course.name}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                    linked
                      ? "bg-[color:var(--accent)]/20 text-[color:var(--primary)]"
                      : "bg-[color:var(--gold)]/20 text-[color:var(--primary)]"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[color:var(--muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {course.students} students
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Link2 className="h-4 w-4" />
                  {course.projects} projects
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <AppButton variant="outline" fullWidth>
          Link course
        </AppButton>
        <AppButton variant="ghost" fullWidth>
          Unlink
        </AppButton>
      </div>
    </AppCard>
  );
}
