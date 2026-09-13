import { ArrowLeft, Eye, EyeOff, Star, Users } from "lucide-react";
import ProjectInvitationBanner from "@/components/projectPage/ProjectInvitationBanner";
import ProjectPageHeader from "@/components/projectPage/ProjectPageHeader";
import ProjectActivityPanel from "@/components/projectPage/ProjectActivityPanel";
import ProjectSequenceNavigation from "@/components/projectPage/ProjectSequenceNavigation";
import { formatProjectRating } from "@/lib/projectRating";
import { formatProjectDate } from "@/utils/projectPage/projectPageHelpers";

export default function ProjectContextSidebar({
  project,
  originLabel,
  onReturn,
  isPublic,
  canManageProject,
  onToggleVisibility,
  isInstructor,
  contentUpdatedAt,
  invitation,
  onAcceptInvitation,
  onRejectInvitation,
  activityEvents,
  onOpenActivity,
  showBrief = false,
  flow,
  previousProject,
  nextProject,
  onOpenProject,
}) {
  return (
    <aside className="relative flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-[#D6E2E8] bg-[linear-gradient(180deg,#F9FCFD_0%,#F3F8FA_56%,#EDF4F7_100%)] xl:h-full xl:border-b-0 xl:border-r">
      <div className="pointer-events-none absolute left-[-95px] top-[72px] h-[250px] w-[250px] rounded-full bg-[#7AAACE]/12 blur-[72px]" />
      <div className="pointer-events-none absolute right-[-125px] top-[315px] h-[240px] w-[240px] rounded-full bg-[#E6C77B]/7 blur-[84px]" />

      <div className="relative z-[1] min-h-0 flex-1 overflow-y-auto px-7 pb-6 pt-6 xl:overscroll-contain">
        <button
          type="button"
          onClick={onReturn}
          className="group inline-flex items-center gap-2 text-[13px] font-black text-[#557C97] transition hover:text-[#294A61]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {originLabel}
        </button>

        <div className="mt-6">
          <ProjectPageHeader
            project={project}
            isPublic={isPublic}
            canManageProject={canManageProject}
            onToggleVisibility={onToggleVisibility}
            variant="identity"
          />
        </div>

        <div className="mt-5 border-y border-[#D4E1E8] bg-white/20 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-[#61798A]">
            <span>
              {isInstructor ? "Content updated" : "Updated"}{" "}
              {isInstructor ? formatProjectDate(contentUpdatedAt) : project.updatedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#6F94AA]" />
              {project.collaborators} collaborators
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 text-[#D3AE45]" />
              {formatProjectRating(project.rating)}
            </span>
          </div>

          {canManageProject ? (
            <button
              type="button"
              onClick={onToggleVisibility}
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black transition hover:-translate-y-0.5 ${
                isPublic
                  ? "border-[#7AAACE]/25 bg-[#EAF5FB] text-[#355872]"
                  : "border-[#D9C174]/35 bg-[#FFF8E3] text-[#7B6326]"
              }`}
            >
              {isPublic ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
              {project.visibility}
            </button>
          ) : null}
        </div>

        <ProjectInvitationBanner
          invitation={invitation}
          onAccept={onAcceptInvitation}
          onReject={onRejectInvitation}
        />

        {showBrief ? (
          <section className="mt-5 rounded-[22px] border border-[#D2E0E7] bg-white/80 px-5 py-5 shadow-[0_12px_28px_rgba(53,88,114,0.06)]">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 rounded-full bg-[#E6C77B]" />
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64879D]">
                Project brief
              </p>
            </div>
            <h2 className="mt-3 text-[20px] font-black tracking-[-0.025em] text-[#142C3C]">
              About this project
            </h2>
            <p className="mt-3 text-[13px] font-medium leading-6.5 text-[#677A87]">
              {project.description}
            </p>
          </section>
        ) : null}

        {activityEvents ? (
          <ProjectActivityPanel
            mode={isInstructor ? "instructor" : "member"}
            events={activityEvents}
            onOpenEvent={onOpenActivity}
          />
        ) : null}
      </div>

      <ProjectSequenceNavigation
        flow={flow}
        previousProject={previousProject}
        nextProject={nextProject}
        onOpenProject={onOpenProject}
        embedded
      />
    </aside>
  );
}
