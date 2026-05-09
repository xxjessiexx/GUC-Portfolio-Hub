import CourseBadge from "@/components/ui/CourseBadge";
import {
  Star,
  Users,
  GitBranch,
} from "lucide-react";

export default function RecommendedProjectCard({
  project,
}) {
  const Icon = project.icon;

  return (
    <div
      className="
        border border-gray-100
        rounded-[24px]
        p-5
        bg-white/85
        hover:shadow-md
        transition
      "
    >
      {/* TOP */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">

          {/* ICON */}
          <div
            className={`
              w-14 h-14
              rounded-2xl
              flex items-center justify-center
              ${project.color}
            `}
          >
            <Icon size={24} />
          </div>

          {/* TITLE */}
          <div>
            <h3 className="text-[20px] font-black text-[#16253A] leading-tight">
              {project.title}
            </h3>

            <p className="mt-1 text-[15px] text-gray-500 font-semibold">
              {project.course}
            </p>
          </div>
        </div>

        {/* BADGE */}
        <div className="px-3 py-1 rounded-full bg-[#EEF5FF] text-[#5E8DDA] text-xs font-semibold">
          Public
        </div>
      </div>

      {/* DESCRIPTION */}
      <p
  className="
    text-[15px]
    text-gray-500
    mt-4
    leading-7
    min-h-[72px]
  "
>
  {project.description}
</p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-5">
        {project.tags.map((tag) => (
          <CourseBadge
            key={tag}
            course={tag}
            className="mt-0"
          />
        ))}
      </div>

      {/* FOOTER */}
      <div
  className="
    flex items-center justify-between
    flex-wrap gap-4
    mt-6
    text-sm
    text-gray-500
    font-medium
  "
>
        <div className="flex items-center gap-1">
          <Star size={15} className="text-yellow-500" />
          {project.rating}
        </div>

        <div className="flex items-center gap-1">
          <Users size={15} />

          <span className="leading-5 ">
            {project.contributors} Contributors
          </span>
        </div>

        <div className="flex items-center gap-1 ml-6">
          <GitBranch size={15} />

          <span className="leading-5 ml-4">
            {project.updated}
          </span>
        </div>
      </div>
    </div>
  );
}