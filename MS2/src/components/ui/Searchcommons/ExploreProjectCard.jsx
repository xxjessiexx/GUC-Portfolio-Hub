import { Calendar, Users, Star, MoreVertical, Flag} from "lucide-react";
import { AppCard } from "../AppCard";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "@/components/ui/Searchcommons/FavoriteButton";
import AuthBottomLink from "@/components/auth/AuthBottomLink";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthInput from "@/components/auth/AuthInput";

export default function ExploreProjectCard({
  project,
  view,
  toggleFavorite,
  showReport = false,
  onReport,
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
        
          <div className="absolute top-3 right-4 z-10">
    {showReport ? (

      <button
        onClick={() => onReport?.(project)}
        className="
          w-11 h-11
          rounded-full
          bg-white
          border border-gray-100
          shadow-sm
          flex items-center justify-center
          hover:bg-[#FFF3EE]
          transition
        "
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
        onClick={() =>
          toggleFavorite(project.id)
        }
      />

    )}
</div>

        
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between">
          <div>
            {/* TITLE */}
            <h3
              onClick={() => navigate(`/project?projectId=${project.id}`)}
              className="
                text-lg font-black text-[#16253A]
                cursor-pointer hover:text-blue-600
                transition
              "
            >
              {project.title}
            </h3>

            <p className="text-sm text-gray-500 font-medium mt-1">
              {String(project.type || "")
                .toLowerCase()
                .includes("bachelor") ||
              String(project.type || "")
                .toLowerCase()
                .includes("thesis")
                ? "Bachelor Project"
                : (
                    project.course ||
                    project.courseName ||
                    project.courseCode
                  )}
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
          <div className="flex items-center gap-2">
          <Users size={16} />

          <span className="text-sm font-medium">
            {project.students} Students
          </span>
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