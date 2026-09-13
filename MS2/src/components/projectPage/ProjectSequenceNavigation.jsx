import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectSequenceNavigation({
  flow,
  previousProject,
  nextProject,
  onOpenProject,
  embedded = false,
}) {
  if (!flow?.projectIds?.length || flow.projectIds.length <= 1) return null;

  return (
    <div
      className={`shrink-0 border-t border-[#D1E0E7] bg-[linear-gradient(180deg,#F5F9FB_0%,#EDF4F7_100%)] px-7 py-4 shadow-[0_-10px_28px_rgba(53,88,114,0.045)] ${
        embedded ? "relative z-[2]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {previousProject ? (
          <button
            type="button"
            onClick={() => onOpenProject(flow.previousId)}
            className="group inline-flex min-w-0 items-center gap-2 text-left"
          >
            <ChevronLeft className="h-4 w-4 shrink-0 text-[#7B98AA] transition-transform group-hover:-translate-x-0.5" />
            <span className="truncate text-[13px] font-black text-[#294A61] transition group-hover:text-[#163247]">
              {previousProject.title}
            </span>
          </button>
        ) : (
          <span />
        )}

        <span className="shrink-0 text-[11px] font-black text-[#7894A6]">
          {flow.currentIndex + 1} of {flow.projectIds.length}
        </span>

        {nextProject ? (
          <button
            type="button"
            onClick={() => onOpenProject(flow.nextId)}
            className="group inline-flex min-w-0 items-center gap-2 text-right"
          >
            <span className="truncate text-[13px] font-black text-[#294A61] transition group-hover:text-[#163247]">
              {nextProject.title}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#7B98AA] transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
