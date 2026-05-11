import { FaGithub as Github } from "react-icons/fa";

import { EmptyState } from "@/components/projectPage/ProjectPageShared";

function PersonCard({ person, variant = "default" }) {
  const isInstructor = variant === "instructor";

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-sm ${
        isInstructor ? "border-emerald-100 bg-emerald-50/70" : "bg-white/70"
      }`}
    >
      <img
        src={person.img}
        alt={person.name || "User"}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />

      <div className="min-w-0">
        <p className="truncate text-sm font-black text-[var(--ink)]">
          {person.name}
        </p>
        <p className="truncate text-xs font-semibold text-[var(--muted)]">
          {person.role}
        </p>
      </div>
    </div>
  );
}

export default function ProjectOverviewTab({ project, isBachelorProject }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border bg-white/60 p-5">
          <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
            About This Project
          </h3>

          <p className="max-w-4xl text-sm leading-7 text-[var(--muted)]">
            {project.description}
          </p>
        </div>

        <div className="rounded-2xl border bg-white/60 p-5">
          <h3 className="mb-3 text-lg font-black text-[var(--ink)]">
            Technologies
          </h3>

          <div className="flex flex-wrap gap-2">
            {project.technologies.length > 0 ? (
              project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--primary)] shadow-sm"
                >
                  {tech}
                </span>
              ))
            ) : (
              <p className="text-sm font-semibold text-[var(--muted)]">
                No technologies added.
              </p>
            )}
          </div>
        </div>
      </section>

      {project.github && (
        <section className="rounded-2xl border bg-white/60 p-5">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-[var(--ink)]">
            <Github className="h-4 w-4 text-[var(--primary)]" />
            GitHub Repository
          </h3>

          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline"
          >
            {project.github}
          </a>
        </section>
      )}

      {!isBachelorProject && (
        <section>
          <h3 className="mb-3 text-lg font-black text-[var(--ink)]">
            Team Members
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {project.team.map((member) => (
              <PersonCard key={member.id || member.name} person={member} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-lg font-black text-[var(--ink)]">
          Instructor{project.instructors.length === 1 ? "" : "s"}
        </h3>

        {project.instructors.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {project.instructors.map((instructor) => (
              <PersonCard
                key={instructor.id || instructor.name}
                person={instructor}
                variant="instructor"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No instructor assigned"
            description="No course instructor has accepted this project yet."
          />
        )}
      </section>
    </div>
  );
}
