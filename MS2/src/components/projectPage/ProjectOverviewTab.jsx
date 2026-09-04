import { ExternalLink, UsersRound } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";

function PersonRow({ person, tone = "member" }) {
  const instructor = tone === "instructor";

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-[15px] px-3.5 py-3 ${
        instructor ? "bg-[#F2F8F5]" : "bg-[#F6F9FB]"
      }`}
    >
      <img
        src={person.img}
        alt={person.name || "User"}
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
      />

      <div className="min-w-0">
        <p className="truncate text-[13px] font-black text-[#173042]">
          {person.name}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-semibold text-[#7A8B96]">
          {person.role}
        </p>
      </div>
    </div>
  );
}

export default function ProjectOverviewTab({ project, isBachelorProject }) {
  const technologies = project.technologies || [];
  const team = project.team || [];
  const instructors = project.instructors || [];

  return (
    <div className="space-y-5">
      {/* PRIMARY OVERVIEW SURFACE */}
      <section className="overflow-hidden rounded-[26px] border border-[#CDDBE3] bg-white shadow-[0_16px_38px_rgba(53,88,114,0.08)]">
        <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
          <div className="px-6 py-6 sm:px-7">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-7 rounded-full bg-[#E6C77B]" />
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64879D]">
                Project brief
              </p>
            </div>

            <h2 className="mt-3 text-[23px] font-black tracking-[-0.025em] text-[#142C3C]">
              About this project
            </h2>

            <p className="mt-3 max-w-3xl text-[14px] font-medium leading-7 text-[#677A87]">
              {project.description}
            </p>
          </div>

          <div className="border-t border-[#E0E8ED] bg-[#F7FAFC] px-6 py-6 lg:border-l lg:border-t-0">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64879D]">
              Tech stack
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {technologies.length > 0 ? (
                technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#D3E0E7] bg-white px-3 py-1.5 text-[11px] font-black text-[#355872]"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-[12px] font-semibold text-[#7B8D98]">
                  No technologies added.
                </p>
              )}
            </div>
          </div>
        </div>

        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-4 border-t border-[#E0E8ED] bg-[#FBFDFE] px-6 py-4 transition hover:bg-[#F3F8FA] sm:px-7"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-[#EAF3F8] text-[#355872]">
                <Github className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#6E8DA0]">
                  Repository
                </p>
                <p className="mt-0.5 truncate text-[12px] font-black text-[#355872]">
                  {project.github}
                </p>
              </div>
            </div>

            <ExternalLink className="h-4 w-4 shrink-0 text-[#7394A8] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : null}
      </section>

      {/* PEOPLE — ONE SECTION, NOT CARD SOUP */}
      <section className="rounded-[26px] border border-[#CDDBE3] bg-white px-6 py-6 shadow-[0_14px_34px_rgba(53,88,114,0.07)] sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-[#6F95AC]" />
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64879D]">
                People
              </p>
            </div>
            <h2 className="mt-2 text-[21px] font-black tracking-[-0.02em] text-[#142C3C]">
              Project team
            </h2>
          </div>

          {!isBachelorProject ? (
            <span className="text-[11px] font-bold text-[#8798A2]">
              {team.length} member{team.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        {!isBachelorProject ? (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {team.map((member) => (
              <PersonRow key={member.id || member.name} person={member} />
            ))}
          </div>
        ) : null}

        <div className={`${!isBachelorProject ? "mt-5 border-t border-[#E2E9ED] pt-5" : "mt-4"}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.13em] text-[#6B899C]">
              Instructor{instructors.length === 1 ? "" : "s"}
            </p>
            <span className="text-[11px] font-bold text-[#91A0A9]">
              {instructors.length || "None assigned"}
            </span>
          </div>

          {instructors.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {instructors.map((instructor) => (
                <PersonRow
                  key={instructor.id || instructor.name}
                  person={instructor}
                  tone="instructor"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#F7FAFC] px-4 py-4 text-[12px] font-semibold text-[#748690]">
              No course instructor has accepted this project yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
