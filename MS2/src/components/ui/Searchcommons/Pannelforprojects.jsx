import { ArrowRight } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";

import ExploreProjectCard from "./ExploreProjectCard";
import { useNavigate } from "react-router-dom";

export default function Pannelforprojects({
  projects,
  view = "grid",
  toggleFavorite,
  hideViewMore = false,
}) {
  const navigate = useNavigate();
  return (
     <AppCard
  className="
    p-6
    rounded-[30px]

    bg-[var(--card-bg)]
    border border-[var(--card-border)]

    shadow-[var(--shadow-card)]
  "
>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2
            className="
              text-2xl
              font-black
              text-[var(--ink)]
            "
          >
           Your Favorite Projects
          </h2>
        </div>

        {!hideViewMore && (

  <button
  onClick={() =>
    navigate("/favorite-projects")
  }
  className="
    text-[var(--primary)]
hover:text-[var(--accent)]
    font-semibold
    flex items-center gap-2
    hover:underline
  "
>
  View More Porjects

  
</button>

)}
      </div>

      {/* CARDS */}
      <div
        className={
          view === "grid"
            ? `
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            `
            : "flex flex-col gap-5"
        }
      >
        {projects.map((project) => (
          <ExploreProjectCard
            key={project.id}
            project={project}
            view={view}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </AppCard>
  );
}