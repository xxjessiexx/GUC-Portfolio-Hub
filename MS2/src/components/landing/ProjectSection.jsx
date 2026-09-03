import ProjectCard from "@/components/landing/ProjectCard";

export default function ProjectSection({ projects }) {
  return (
    <section
      id="student-work"
      className="
        relative z-10
        scroll-mt-4
        overflow-hidden
        bg-[#071C2C]
        px-6
        py-16
        text-white
      "
    >
      <div className="
        pointer-events-none
        absolute -left-28 top-10
        h-[380px] w-[380px]
        rounded-full
        bg-[radial-gradient(circle,rgba(122,170,206,0.14),transparent_68%)]
        blur-2xl
      " />

      <div className="
        pointer-events-none
        absolute -bottom-32 right-0
        h-[440px] w-[440px]
        rounded-full
        bg-[radial-gradient(circle,rgba(230,199,123,0.05),transparent_70%)]
        blur-3xl
      " />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="
            mb-2
            text-xs font-black uppercase
            tracking-[0.18em]
            text-[#9CD5FF]
          ">
            Student Work
          </p>

          <h2 className="
            max-w-3xl
            text-4xl font-black
            leading-[1.05]
            tracking-tight
            text-white
            sm:text-[2.7rem]
          ">
            A glimpse of what GUC students are building
          </h2>

          <p className="
            mt-3
            max-w-2xl
            text-sm leading-6
            text-white/58
            sm:text-base
          ">
            Selected work from across GUC — course projects, bachelor work,
            technical builds, and portfolio pieces. Full project details live
            inside the platform.
          </p>
        </div>

        <div className="space-y-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}