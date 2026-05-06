import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ProjectsPanel({
  projects,
  selectedProject,
  setSelectedProject,
}) {
  return (
    <AppCard className="p-6">
      <SectionHeader
        title="My Projects"
        subtitle="Track visibility, progress, collaborators, and links."
        action="View All"
      />

      <div className="mt-6 space-y-4">
        {projects.map((project) => {
          const isSelected = selectedProject.id === project.id;

          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -3 }}
              whileTap={tapScale}
              transition={{ duration: 0.22, ease: easeOutExpo }}
              className={`w-full rounded-[26px] border p-5 text-left transition ${
                isSelected
                  ? "border-[var(--gold)] bg-[rgba(156,213,255,0.2)] shadow-[0_18px_45px_rgba(53,88,114,0.12)] dark:bg-[rgba(120,173,210,0.16)]"
                  : "border-white/70 bg-white/55 hover:bg-white/75 dark:border-white/10 dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="text-lg font-black text-[var(--ink)]">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
                    {project.course}
                  </p>
                </div>

                <VisibilityBadge visibility={project.visibility} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex h-9 items-center rounded-full border border-[#7AAACE]/55 bg-[#5F86A3] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-white/10 dark:text-[var(--accent)] dark:shadow-none"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </AppCard>
  );
}

function VisibilityBadge({ visibility }) {
  const isPublic = visibility === "Public";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-black shadow-[0_6px_18px_rgba(53,88,114,0.05)] ${
        isPublic
          ? "border-[rgba(156,213,255,0.5)] bg-[rgba(156,213,255,0.2)] text-[var(--primary)] dark:border-white/10 dark:bg-[rgba(156,213,255,0.16)] dark:text-[var(--accent)]"
          : "border-[rgba(230,199,123,0.45)] bg-[rgba(230,199,123,0.2)] text-[var(--primary)] dark:border-white/10 dark:bg-[rgba(230,199,123,0.14)] dark:text-[var(--gold)]"
      }`}
    >
      {isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {visibility}
    </span>
  );
}