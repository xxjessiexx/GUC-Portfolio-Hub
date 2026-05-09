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
        bg-white/65
        border border-gray-100
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#16253A]">
            ✨ Recommended Projects
          </h2>

          <p className="text-gray-500 mt-1">
            Curated projects you might find interesting.
          </p>
        </div>

        <button
          className="
            text-[#69A7FF]
            font-semibold
            flex items-center gap-2
            hover:underline
          "
        >
          View More Recommendations

          <ArrowRight size={16} />
        </button>
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