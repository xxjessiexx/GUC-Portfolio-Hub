import { Calendar, Users, Star, MoreVertical, Heart } from "lucide-react";
import { AppCard } from "./AppCard";
import { useNavigate } from "react-router-dom";

export default function ExploreProjectCard({
  project,
  view,
  toggleFavorite,
}) {
  const navigate = useNavigate();

  return (
    <AppCard
      className={`
        overflow-hidden
        rounded-3xl
        border border-gray-100
        bg-white
        shadow-sm
        hover:shadow-md
        transition

        ${
          view === "grid"
            ? "max-w-[320px]"
            : "w-full flex flex-row h-[220px]"
        }
      `}
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className={`
            object-cover
            ${
              view === "grid"
                ? "h-44 w-full"
                : "h-full w-[280px]"
            }
          `}
        />

        {/* HEART */}
        <button
          onClick={() => toggleFavorite(project.id)}
          className="
            absolute top-3 right-3
            w-10 h-10
            rounded-full
            bg-white/90
            flex items-center justify-center
            shadow
          "
        >
          <Heart
            size={18}
            className={
              project.favorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between">
          <div>
            {/* TITLE */}
            <h3
              onClick={() => navigate("/project")}
              className="
                text-lg font-black text-[#16253A]
                cursor-pointer hover:text-blue-600
                transition
              "
            >
              {project.title}
            </h3>

            <p className="text-sm text-gray-500 font-medium mt-1">
              {project.course}
            </p>
          </div>

          <button>
            <MoreVertical
              size={18}
              className="text-gray-400"
            />
          </button>
        </div>

        {/* INFO */}
        <div className="mt-4 space-y-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users size={15} />
            {project.instructor}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={15} />
              {project.rating}
            </div>

            <div className="flex items-center gap-1">
              <Calendar size={15} />
              {project.date}
            </div>
          </div>
        </div>

        {/* TAGS */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="
                px-3 py-1
                rounded-full
                bg-blue-50
                text-blue-600
                text-xs
                font-semibold
              "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </AppCard>
  );
}