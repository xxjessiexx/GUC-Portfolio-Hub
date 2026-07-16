import { AppCard } from "@/components/ui/AppCard";
import { ArrowRight } from "lucide-react";

import RecommendedProjectCard from "./RecommendedProjectCard";

export default function RecommendedProjectsSection({
  projects,
}) {
  return (
    <AppCard
      className="
        p-3
        rounded-[30px]
        bg-[var(--card-bg)]
border border-[var(--card-border)]
shadow-[var(--shadow-card)]
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--ink)] mt-1 ml-4">
            Recommended Projects
          </h2>

          <p className="text-[var(--muted)] mt-1 ml-6">
            Curated projects you might find interesting.
          </p>
        </div>

        
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <RecommendedProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </AppCard>
  );
}