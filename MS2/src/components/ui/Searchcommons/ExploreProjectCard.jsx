import {
  Calendar,
  Users,
  Star,
  MoreVertical,
  Flag,
} from "lucide-react";

import { AppCard } from "../AppCard";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "@/components/ui/Searchcommons/FavoriteButton";
import CourseBadge from "@/components/ui/CourseBadge";
import { formatProjectRating } from "@/lib/projectRating";

export default function ExploreProjectCard({
  project,
  view,
  toggleFavorite,
  onOpenProject,
  showReport = false,
  onReport,
}) {
  const navigate = useNavigate();

  const openProject = () => {
    if (typeof onOpenProject === "function") {
      onOpenProject(project);
      return;
    }

    navigate(`/project?projectId=${encodeURIComponent(project.id)}`);
  };

  const visibleTags = Array.isArray(project.tags)
  ? project.tags.slice(0, 5)
  : [];

const hiddenTagCount = Math.max(
  (project.tags?.length || 0) - visibleTags.length,
  0
);

  return (
    <AppCard
      role="link"
      tabIndex={0}
      onClick={openProject}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject();
        }
      }}
      className={`
        group
        overflow-hidden
        rounded-3xl
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
        ${view === "grid" ? "max-w-[320px]" : "w-full flex flex-row h-[220px]"}
      `}
    >
      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className={`object-cover ${
            view === "grid" ? "h-44 w-full" : "h-full w-[280px]"
          }`}
        />

        <div className="absolute top-3 right-4 z-10">
          {showReport ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onReport?.(project);
              }}
              className="w-11 h-11 rounded-full bg-[color:var(--card-bg)] border border-[color:var(--card-border)] shadow-sm flex items-center justify-center hover:bg-[#FFF3EE] transition"
            >
              <Flag
                size={18}
                className={
                  project.reported
                    ? "fill-[#FFB089] text-[#FF8A65]"
                    : "text-[#FF8A65]"
                }
              />
            </button>
          ) : (
            <FavoriteButton
              favorite={project.favorite}
              onClick={() => toggleFavorite(project.id)}
            />
          )}
        </div>
      </div>

      <div className="p-5 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-[color:var(--ink)] transition group-hover:text-[color:var(--primary)]">
              {project.title}
            </h3>

            <p className="text-sm text-gray-500 font-medium mt-1">
              {String(project.type || "").toLowerCase().includes("bachelor") ||
              String(project.type || "").toLowerCase().includes("thesis")
                ? "Bachelor Project"
                : project.course || project.courseName || project.courseCode}
            </p>
          </div>

         
        </div>

        <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
          <div className="flex items-center gap-2">
            <Users size={15} />
            {project.instructor}
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            <span className="text-sm font-medium">{project.students} Students</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={15} />
              {formatProjectRating(project.rating)}
            </div>

            <div className="flex items-center gap-1 text-[color:var(--muted)]">
              <Calendar size={15} />
              {project.date}
            </div>
          </div>
        </div>

        {/* Course / Skill Tags */}
<div className="mt-3 flex flex-wrap items-center gap-y-2">
  {visibleTags.map((tag, index) => (
    <div key={tag} className="flex items-center">
      <span
        className="
          text-[11.5px] font-black
          text-[#355872]
          dark:text-[#8FC5E8]
        "
      >
        {tag}
      </span>

      {(index < visibleTags.length - 1 || hiddenTagCount > 0) && (
        <span
          className="
            mx-3
            text-[19px] font-black
            text-[#C49A2C]
            dark:text-[var(--gold)]
          "
        >
          ·
        </span>
      )}
    </div>
  ))}

  {hiddenTagCount > 0 && (
    <span
      className="
        text-[11px] font-black
        text-[#355872]
        dark:text-[#8FC5E8]
      "
    >
      +{hiddenTagCount} more{" "}
      {hiddenTagCount === 1 ? "skill" : "skills"}
    </span>
  )}
</div>
      </div>
    </AppCard>
  );
}
