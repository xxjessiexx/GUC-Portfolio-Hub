import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff, Star, Users } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import ProjectPageHeader from "@/components/projectPage/ProjectPageHeader";
import ProjectPageVideo from "@/components/projectPage/ProjectPageVideo";
import ProjectInvitationBanner from "@/components/projectPage/ProjectInvitationBanner";
import ProjectOverviewTab from "@/components/projectPage/ProjectOverviewTab";
import ProjectPageTabs from "@/components/projectPage/ProjectPageTabs";
import ProjectTasksTab from "@/components/projectPage/ProjectTasksTab";
import ProjectBachelorThesisTab from "@/components/projectPage/ProjectBachelorThesisTab";
import ProjectFeedbackTab from "@/components/projectPage/ProjectFeedbackTab";
import ProjectTaskModals from "@/components/projectPage/ProjectTaskModals";
import ProjectCollaboratorsSection from "@/components/project/ProjectCollaboratorsSection";

import { useProjectThesisDrafts } from "@/hooks/projectPage/useProjectThesisDrafts";
import { useProjectTasks } from "@/hooks/projectPage/useProjectTasks";
import { useProjectFeedback } from "@/hooks/projectPage/useProjectFeedback";

import {
  getDisplayName,
  makeId,
  normalizeRole,
} from "@/utils/projectPage/projectPageHelpers";
import {
  getInvitationStatus,
  normalizeProjectForPage,
} from "@/utils/projectPage/normalizeProjectForPage";
import { getProjectFile } from "@/utils/projectPage/projectFiles";

import {
  addNotification,
  getCollection,
  getCurrentUser,
  getProjectById,
  updateProject,
} from "@/data/demoStore";


const LIGHT_WORKSPACE_THEME = {
  "--ink": "#102536",
  "--muted": "#718391",
  "--primary": "#355872",
  "--dark": "#243F53",
  "--accent": "#7AAACE",
  "--gold": "#E6C77B",
  "--card-bg": "#FFFFFF",
  "--card-border": "#D7E3EA",
  "--background": "#F8FBFD",
  "--foreground": "#102536",
  "--border": "#D7E3EA",
  colorScheme: "light",
};

function makeNotification(userId, title, body, projectId, type = "project") {
  if (!userId) return;

  addNotification({
    id: makeId("notification"),
    userId,
    title,
    body,
    message: body,
    type,
    projectId,
    unread: true,
    createdAt: new Date().toISOString(),
  });
}

function sameId(a, b) {
  return String(a || "") === String(b || "");
}

function toIdSet(values = []) {
  return new Set(
    (Array.isArray(values) ? values : []).filter(Boolean).map(String)
  );
}

function getProjectFlow(location, projectId) {
  const flow = location.state?.projectFlow || {};

  const projectIds = Array.from(
    new Set(
      (Array.isArray(flow.projectIds) ? flow.projectIds : [])
        .filter(Boolean)
        .map(String)
    )
  );

  const currentIndex = projectIds.findIndex((id) => sameId(id, projectId));

  return {
    originPath: flow.originPath || "/explore-projects",
    originLabel: flow.originLabel || "Explore Projects",
    projectIds,
    currentIndex,
    previousId:
      currentIndex > 0 ? projectIds[currentIndex - 1] : null,
    nextId:
      currentIndex >= 0 && currentIndex < projectIds.length - 1
        ? projectIds[currentIndex + 1]
        : null,
  };
}

function getSequenceProject(id) {
  if (!id) return null;

  const project = getProjectById(id);
  if (!project) return null;

  return normalizeProjectForPage(project);
}

function getActiveTabCopy(tab) {
  const copy = {
    overview: {
      title: "Overview",
      description: "A quick look at the project, team and technical details.",
    },
    tasks: {
      title: "Tasks",
      description: "Track the team's work, ownership and project progress.",
    },
    collaborators: {
      title: "Collaborators",
      description: "See who is working on the project and manage the team.",
    },
    feedback: {
      title: "Feedback",
      description: "Review instructor feedback, ratings and project comments.",
    },
    "bachelor thesis": {
      title: "Bachelor Thesis",
      description: "Manage thesis drafts, feedback and the final submission.",
    },
  };

  return copy[tab] || {
    title: tab.charAt(0).toUpperCase() + tab.slice(1),
    description: "Project workspace.",
  };
}

function SequenceDestination({
  label,
  project,
  direction,
  onClick,
}) {
  if (!project) return null;

  const previous = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 flex-1 rounded-[16px] border border-[#355872]/10 bg-white px-3.5 py-3 text-left shadow-[0_7px_18px_rgba(53,88,114,0.05)] transition hover:-translate-y-[1px] hover:border-[#7AAACE]/35 hover:shadow-[0_11px_24px_rgba(53,88,114,0.09)]"
    >
      <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-[#7896A8]">
        {previous ? <ChevronLeft className="h-3 w-3" /> : null}
        {label}
        {!previous ? <ChevronRight className="h-3 w-3" /> : null}
      </div>

      <p className="mt-1.5 truncate text-[10px] font-black text-[color:var(--ink)]">
        {project.title}
      </p>

      <p className="mt-0.5 truncate text-[8px] font-semibold text-[color:var(--muted)]">
        {project.course || project.courseCode || project.courseName || "Project"}
      </p>
    </button>
  );
}

export default function ProjectPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const projectId =
    searchParams.get("projectId") || params.projectId || params.id;

  const [project, setProject] = useState(null);
  const [projectMissing, setProjectMissing] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [videoObjectUrl, setVideoObjectUrl] = useState("");

  const loggedInUser = getCurrentUser();

  const users = useMemo(() => getCollection("users") || [], []);
  const courses = useMemo(() => getCollection("courses") || [], []);

  const currentUser =
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    loggedInUser?.email ||
    "";

  const currentUserId = loggedInUser?.id;
  const userRole = normalizeRole(loggedInUser?.role);
  const isAdmin = userRole === "admin";

  const isPublic = project?.visibility === "Public";

  const isCreator =
    Boolean(project) &&
    (sameId(currentUserId, project.ownerId) ||
      sameId(currentUserId, project.raw?.ownerId) ||
      sameId(currentUserId, project.raw?.studentId) ||
      sameId(currentUserId, project.raw?.authorId) ||
      sameId(currentUserId, project.raw?.creatorId) ||
      String(currentUser || "").trim().toLowerCase() ===
        String(project.ownerName || "").trim().toLowerCase());

  const acceptedCollaboratorIds = (project?.collaboratorIds || []).filter(
    (id) => getInvitationStatus(project, id) === "accepted"
  );

  const acceptedInstructorIds = (project?.instructorIds || []).filter(
    (id) => getInvitationStatus(project, id) === "accepted"
  );

  const isAcceptedCollaborator =
    Boolean(project) &&
    acceptedCollaboratorIds.some((id) => sameId(id, currentUserId));

  const ownInvitationStatus = (project?.invitationStatuses || []).find((item) =>
    sameId(item.userId, currentUserId)
  );

  const hasOwnProjectInvitation = Boolean(
    ownInvitationStatus &&
      ["pending", "accepted"].includes(
        String(ownInvitationStatus.status).toLowerCase()
      )
  );

  const courseRecord =
    project?.raw?.courseRecord ||
    project?.courseRecord ||
    courses.find((course) => sameId(course.id, project?.courseId)) ||
    null;

  const courseInstructorIds = toIdSet([
    ...(courseRecord?.instructorIds || []),
    ...(project?.raw?.courseInstructorIds || []),
    ...(project?.raw?.courseInstructorId
      ? [project.raw.courseInstructorId]
      : []),
  ]);

  const userLinkedCourseIds = toIdSet([
    ...(loggedInUser?.linkedCourseIds || []),
    ...(loggedInUser?.courseIds || []),
    ...(loggedInUser?.courses || []),
  ]);

  const isAcceptedProjectInstructor =
    userRole === "instructor" &&
    acceptedInstructorIds.some((id) => sameId(id, currentUserId));

  const isCourseLinkedInstructor =
    userRole === "instructor" &&
    (courseInstructorIds.has(String(currentUserId || "")) ||
      userLinkedCourseIds.has(String(project?.courseId || "")));

  const isRelatedInstructor =
    Boolean(project) &&
    (isAcceptedProjectInstructor || isCourseLinkedInstructor);

  const isBachelorProject = project?.type === "Bachelor Project";

  const canViewProject =
    Boolean(project) &&
    (isPublic ||
      isCreator ||
      isAcceptedCollaborator ||
      isRelatedInstructor ||
      isAdmin ||
      hasOwnProjectInvitation);

  /*
    Requirements-safe permissions:
    - Owner manages project content, collaborators, thesis drafts, and tasks.
    - Accepted collaborator can only update the status of assigned tasks.
    - Related/course instructor can add feedback/rating and flag elsewhere.
    - Other instructor can view allowed public projects, but cannot comment/rate.
    - Admin can moderate, but must not see instructor comments/feedback here.
  */
  const canManageProject = isCreator;
  const canManageTasks = isCreator;

  const canInvitePeople = isCreator && !isBachelorProject;
  const canCancelInvitations = isCreator && !isBachelorProject;
  const canRemoveCollaborators = isCreator && !isBachelorProject;
  const canManageCollaborators = canRemoveCollaborators;

  const canViewComments =
    isCreator || isAcceptedCollaborator || isRelatedInstructor;

  const canAddInstructorFeedback = isRelatedInstructor;

  const visibleTabs = useMemo(() => {
    const tabs = ["overview", "tasks"];

    if (!isBachelorProject) tabs.push("collaborators");
    if (canViewComments) tabs.push("feedback");
    if (isBachelorProject) tabs.push("bachelor thesis");

    return tabs;
  }, [canViewComments, isBachelorProject]);

  const safeActiveTab = visibleTabs.includes(activeTab)
    ? activeTab
    : "overview";

  const refreshProject = () => {
    const loadedProject = getProjectById(projectId);

    if (!loadedProject) {
      setProject(null);
      setProjectMissing(true);
      setUnauthorized(false);
      setTasks([]);
      return;
    }

    const normalizedProject = normalizeProjectForPage(loadedProject);
    const currentId = loggedInUser?.id;

    const statusFor = (id) => getInvitationStatus(normalizedProject, id);

    const refreshCourseRecord =
      normalizedProject.raw?.courseRecord ||
      normalizedProject.courseRecord ||
      courses.find((course) => sameId(course.id, normalizedProject.courseId)) ||
      null;

    const refreshCourseInstructorIds = toIdSet([
      ...(refreshCourseRecord?.instructorIds || []),
      ...(normalizedProject.raw?.courseInstructorIds || []),
      ...(normalizedProject.raw?.courseInstructorId
        ? [normalizedProject.raw.courseInstructorId]
        : []),
    ]);

    const refreshUserLinkedCourseIds = toIdSet([
      ...(loggedInUser?.linkedCourseIds || []),
      ...(loggedInUser?.courseIds || []),
      ...(loggedInUser?.courses || []),
    ]);

    const refreshIsRelatedInstructor =
      normalizeRole(loggedInUser?.role) === "instructor" &&
      ((normalizedProject.instructorIds || []).some(
        (id) => sameId(id, currentId) && statusFor(id) === "accepted"
      ) ||
        refreshCourseInstructorIds.has(String(currentId || "")) ||
        refreshUserLinkedCourseIds.has(
          String(normalizedProject.courseId || "")
        ));

    const canView =
      normalizedProject.visibility === "Public" ||
      sameId(normalizedProject.ownerId, currentId) ||
      sameId(normalizedProject.raw?.ownerId, currentId) ||
      sameId(normalizedProject.raw?.studentId, currentId) ||
      sameId(normalizedProject.raw?.authorId, currentId) ||
      sameId(normalizedProject.raw?.creatorId, currentId) ||
      (normalizedProject.collaboratorIds || []).some(
        (id) => sameId(id, currentId) && statusFor(id) === "accepted"
      ) ||
      refreshIsRelatedInstructor ||
      (normalizedProject.invitationStatuses || []).some(
        (item) =>
          sameId(item.userId, currentId) &&
          ["pending", "accepted"].includes(
            String(item.status).toLowerCase()
          )
      ) ||
      normalizeRole(loggedInUser?.role) === "admin";

    setProject(normalizedProject);
    setProjectMissing(false);
    setUnauthorized(!canView);
    setTasks(normalizedProject.tasks || []);
  };

  useEffect(() => {
    refreshProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, loggedInUser?.id]);

  useEffect(() => {
    let createdUrl = "";
    let cancelled = false;

    async function loadStoredVideo() {
      setVideoObjectUrl("");

      const fileId = project?.videoFile?.id || project?.videoFileId;
      if (!fileId) return;

      try {
        const saved = await getProjectFile(fileId);
        const file = saved?.file;

        if (!file || cancelled) return;

        createdUrl = URL.createObjectURL(file);
        setVideoObjectUrl(createdUrl);
      } catch {
        if (!cancelled) setVideoObjectUrl("");
      }
    }

    loadStoredVideo();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [project?.videoFile?.id, project?.videoFileId]);

  const persistProject = (updates) => {
    if (!project?.id) return null;

    const updated = updateProject(project.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (updated) {
      const normalized = normalizeProjectForPage(updated);
      setProject(normalized);
      setTasks(normalized.tasks || []);
    }

    return updated;
  };

  const thesisDrafts = useProjectThesisDrafts({
    project,
    isCreator,
    isAdmin,
    canAddInstructorFeedback,
    loggedInUser,
    persistProject,
    makeNotification,
  });

  const projectTasks = useProjectTasks({
    project,
    tasks,
    setTasks,
    setProject,
    isBachelorProject,
    canManageTasks,
    canAddInstructorFeedback,
    loggedInUser,
    currentUser,
    isAdmin,
    makeNotification,
  });

  const projectFeedback = useProjectFeedback({
    project,
    canAddInstructorFeedback,
    loggedInUser,
    isAdmin,
    persistProject,
    makeNotification,
  });

  const toggleVisibility = () => {
    if (!canManageProject) return;

    persistProject({
      visibility: isPublic ? "private" : "public",
    });
  };

  const respondToInvitation = (status) => {
    if (!project || !loggedInUser?.id) return;

    const currentStatuses = project.invitationStatuses || [];

    const ownInvitation = currentStatuses.find(
      (item) => String(item.userId) === String(loggedInUser.id)
    );

    if (!ownInvitation || ownInvitation.status !== "pending") return;

    const nextStatuses = currentStatuses.map((item) =>
      String(item.userId) === String(loggedInUser.id)
        ? {
            ...item,
            status,
            respondedAt: new Date().toISOString(),
          }
        : item
    );

    const updates = {
      invitationStatuses: nextStatuses,
    };

    if (status === "accepted") {
      if (ownInvitation.role === "instructor") {
        updates.instructorIds = Array.from(
          new Set([...(project.instructorIds || []), loggedInUser.id])
        );
      } else {
        updates.collaboratorIds = Array.from(
          new Set([...(project.collaboratorIds || []), loggedInUser.id])
        );
      }
    }

    persistProject(updates);

    makeNotification(
      project.ownerId,
      `Project invitation ${status}`,
      `${getDisplayName(loggedInUser)} ${status} the invitation to ${
        project.title
      }.`,
      project.id,
      "project-invite"
    );
  };

  if (projectMissing || !project) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <AppCard className="space-y-4 p-6">
            <h2 className="text-2xl font-black text-[var(--ink)]">
              Project not found
            </h2>
            <p className="text-sm font-semibold text-[var(--muted)]">
              The selected project could not be found in the demo database.
            </p>
          </AppCard>
        </div>
      </DashboardLayout>
    );
  }

  if (unauthorized || !canViewProject) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <AppCard className="space-y-4 p-6">
            <h2 className="text-2xl font-black text-[var(--ink)]">
              This project is private
            </h2>
            <p className="text-sm font-semibold text-[var(--muted)]">
              You can only view this project if it is public or if you are the
              creator, an accepted collaborator, an assigned instructor, or an
              admin.
            </p>
          </AppCard>
        </div>
      </DashboardLayout>
    );
  }

  const ownPendingInvitation = (project.invitationStatuses || []).find(
    (item) =>
      String(item.userId) === String(loggedInUser?.id) &&
      String(item.status).toLowerCase() === "pending"
  );

  const projectVideoSrc = videoObjectUrl || project.video;

  const projectFlow = getProjectFlow(location, project.id);
  const previousProject = getSequenceProject(projectFlow.previousId);
  const nextProject = getSequenceProject(projectFlow.nextId);

  const openFlowProject = (id) => {
    if (!id) return;

    navigate(`/project?projectId=${encodeURIComponent(id)}`, {
      state: {
        ...(location.state || {}),
        projectFlow: {
          ...projectFlow,
          projectIds: projectFlow.projectIds,
        },
      },
    });

    setActiveTab("overview");
  };

  const returnToOrigin = () => {
    navigate(projectFlow.originPath || "/explore-projects");
  };

  const activeTabCopy = getActiveTabCopy(safeActiveTab);

  return (
    <DashboardLayout>
      <main className="min-h-0 px-3 py-4 pb-6 sm:px-5 lg:px-6">
        <div className="mx-auto w-full max-w-[1480px]">
          <AppCard
            style={LIGHT_WORKSPACE_THEME}
            className="flex overflow-hidden rounded-[30px] border border-[#C7D8E2] bg-[#F8FBFD] p-0 text-[#102536] shadow-[0_34px_80px_rgba(53,88,114,0.20)] xl:h-[calc(100vh-8.1rem)] xl:min-h-[620px] xl:flex-col"
          >
            <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(390px,0.68fr)_minmax(0,1.32fr)]">
              {/* =================================================
                  LEFT — PROJECT CONTEXT
              ================================================= */}
              <aside className="relative flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-[#D6E2E8] bg-[linear-gradient(180deg,#F9FCFD_0%,#F3F8FA_56%,#EDF4F7_100%)] xl:h-full xl:border-b-0 xl:border-r">
                <div className="pointer-events-none absolute left-[-95px] top-[72px] h-[250px] w-[250px] rounded-full bg-[#7AAACE]/12 blur-[72px]" />
                <div className="pointer-events-none absolute right-[-125px] top-[315px] h-[240px] w-[240px] rounded-full bg-[#E6C77B]/7 blur-[84px]" />

                {/* PROJECT CONTEXT */}
                <div className="relative z-[1] min-h-0 flex-1 overflow-y-auto px-7 pb-6 pt-6 xl:overscroll-contain">
                  <button
                    type="button"
                    onClick={returnToOrigin}
                    className="group inline-flex items-center gap-2 text-[13px] font-black text-[#557C97] transition hover:text-[#294A61]"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    {projectFlow.originLabel}
                  </button>

                  <div className="mt-6">
                    <ProjectPageHeader
                      project={project}
                      isPublic={isPublic}
                      canManageProject={canManageProject}
                      onToggleVisibility={toggleVisibility}
                      variant="identity"
                    />
                  </div>

                  <div className="mt-5 border-y border-[#D4E1E8] bg-white/20 py-4">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-[#61798A]">
                      <span>Updated {project.updatedAt}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#6F94AA]" />
                        {project.collaborators} collaborators
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-[#D3AE45]" />
                        {project.rating || 0} / 5
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleVisibility}
                      disabled={!canManageProject}
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black transition ${
                        isPublic
                          ? "border-[#7AAACE]/25 bg-[#EAF5FB] text-[#355872]"
                          : "border-[#D9C174]/35 bg-[#FFF8E3] text-[#7B6326]"
                      } ${
                        canManageProject
                          ? "hover:-translate-y-0.5"
                          : "cursor-default"
                      }`}
                    >
                      {isPublic ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                      {project.visibility}
                    </button>
                  </div>

                  <ProjectInvitationBanner
                    invitation={ownPendingInvitation}
                    onAccept={() => respondToInvitation("accepted")}
                    onReject={() => respondToInvitation("rejected")}
                  />

                  <div className="mt-5">
                    <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#5F849B]">
                      Project preview
                    </p>

                    <div className="h-[245px] w-full overflow-hidden rounded-[22px] border border-[#2B4557]/12 bg-[#101A21] shadow-[0_24px_52px_rgba(38,72,95,0.20)] ring-1 ring-white/70 [&_section]:!mx-0 [&_section]:!h-full [&_section]:!max-w-none [&_section]:!w-full [&_video]:!h-full [&_video]:!w-full [&_video]:!aspect-auto [&_video]:!rounded-none [&_video]:!border-0 [&_video]:!object-contain [&_video]:!shadow-none">
                      <ProjectPageVideo src={projectVideoSrc} />
                    </div>
                  </div>
                </div>

                {/* COLLECTION NAVIGATION */}
                {projectFlow.projectIds.length > 1 ? (
                  <div className="relative z-[2] shrink-0 border-t border-[#D1E0E7] bg-[linear-gradient(180deg,#F5F9FB_0%,#EDF4F7_100%)] px-7 py-4 shadow-[0_-10px_28px_rgba(53,88,114,0.045)]">
                    <div className="flex items-center justify-between gap-4">
                      {previousProject ? (
                        <button
                          type="button"
                          onClick={() => openFlowProject(projectFlow.previousId)}
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
                        {projectFlow.currentIndex + 1} of {projectFlow.projectIds.length}
                      </span>

                      {nextProject ? (
                        <button
                          type="button"
                          onClick={() => openFlowProject(projectFlow.nextId)}
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
                ) : null}
              </aside>

              {/* =================================================
                  RIGHT — ACTIVE WORKSPACE
              ================================================= */}
              <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#FCFDFE] xl:h-full">
                <div className="shrink-0 border-b border-[#C9D8E1] bg-[#FCFDFE] px-7 pt-6 sm:px-9">
                  <div className="mb-4 flex items-start justify-between gap-6 pr-12 sm:pr-16">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="h-[2px] w-7 rounded-full bg-[#E6C77B]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5D89A4]">
                          Project workspace
                        </p>
                      </div>

                      <h1 className="mt-2 text-[32px] font-black leading-[0.98] tracking-[-0.04em] text-[color:var(--ink)] sm:text-[36px]">
                        {activeTabCopy.title}
                      </h1>

                      <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-5.5 text-[color:var(--muted)]">
                        {activeTabCopy.description}
                      </p>
                    </div>

                  </div>

                  <ProjectPageTabs
                    visibleTabs={visibleTabs}
                    activeTab={safeActiveTab}
                    setActiveTab={setActiveTab}
                  />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7FAFC] px-7 py-7 sm:px-9 xl:overscroll-contain">
                  {safeActiveTab === "overview" && (
                    <ProjectOverviewTab
                      project={project}
                      isBachelorProject={isBachelorProject}
                    />
                  )}

                  {safeActiveTab === "tasks" && (
                    <ProjectTasksTab
                      tasks={tasks}
                      canManageTasks={canManageTasks}
                      canViewComments={canViewComments}
                      canAddInstructorFeedback={canAddInstructorFeedback}
                      loggedInUser={loggedInUser}
                      currentUser={currentUser}
                      isAdmin={isAdmin}
                      taskFeedbackDrafts={projectTasks.taskFeedbackDrafts}
                      setTaskFeedbackDrafts={projectTasks.setTaskFeedbackDrafts}
                      onAddTaskClick={projectTasks.openTaskPopup}
                      onStoreTasks={projectTasks.storeTasks}
                      onUpdateTaskStatus={projectTasks.updateTaskStatus}
                      onOpenEditTask={projectTasks.openEditPopup}
                      onDeleteTask={projectTasks.deleteTask}
                      onAddTaskFeedback={projectTasks.addTaskFeedback}
                      onEditTaskFeedback={projectTasks.editTaskFeedback}
                      onDeleteTaskFeedback={projectTasks.deleteTaskFeedback}
                      showAddTaskButton
                    />
                  )}

                  {safeActiveTab === "collaborators" && !isBachelorProject && (
                    <ProjectCollaboratorsSection
                      project={project}
                      users={users}
                      courses={courses}
                      tasks={tasks}
                      canManageCollaborators={canManageCollaborators}
                      canInvitePeople={canInvitePeople}
                      canCancelInvitations={canCancelInvitations}
                      canRemoveCollaborators={canRemoveCollaborators}
                      refreshProject={refreshProject}
                    />
                  )}

                  {safeActiveTab === "feedback" && canViewComments && (
                    <ProjectFeedbackTab
                      project={project}
                      loggedInUser={loggedInUser}
                      isAdmin={isAdmin}
                      canAddInstructorFeedback={canAddInstructorFeedback}
                      ratingDraft={projectFeedback.ratingDraft}
                      setRatingDraft={projectFeedback.setRatingDraft}
                      projectFeedbackDraft={projectFeedback.projectFeedbackDraft}
                      setProjectFeedbackDraft={projectFeedback.setProjectFeedbackDraft}
                      onSaveRating={projectFeedback.saveRating}
                      onAddProjectFeedback={projectFeedback.addProjectFeedback}
                      onEditProjectFeedback={projectFeedback.editProjectFeedback}
                      onDeleteProjectFeedback={projectFeedback.deleteProjectFeedback}
                    />
                  )}

                  {safeActiveTab === "bachelor thesis" && isBachelorProject && (
                    <ProjectBachelorThesisTab
                      visibleDrafts={thesisDrafts.visibleDrafts}
                      isCreator={isCreator}
                      canViewComments={canViewComments}
                      canAddInstructorFeedback={canAddInstructorFeedback}
                      loggedInUser={loggedInUser}
                      isAdmin={isAdmin}
                      newDraft={thesisDrafts.newDraft}
                      setNewDraft={thesisDrafts.setNewDraft}
                      newDraftFile={thesisDrafts.newDraftFile}
                      setNewDraftFile={thesisDrafts.setNewDraftFile}
                      draftMessage={thesisDrafts.draftMessage}
                      draftFeedbackDrafts={thesisDrafts.draftFeedbackDrafts}
                      setDraftFeedbackDrafts={thesisDrafts.setDraftFeedbackDrafts}
                      onAddThesisDraft={thesisDrafts.addThesisDraft}
                      onViewDraft={thesisDrafts.viewDraft}
                      onSelectFinalDraft={thesisDrafts.selectFinalDraft}
                      onDeleteThesisDraft={thesisDrafts.deleteThesisDraft}
                      onAddDraftFeedback={thesisDrafts.addDraftFeedback}
                      onEditDraftFeedback={thesisDrafts.editDraftFeedback}
                      onDeleteDraftFeedback={thesisDrafts.deleteDraftFeedback}
                    />
                  )}
                </div>
              </section>
            </div>

            <ProjectTaskModals
              project={project}
              isBachelorProject={isBachelorProject}
              showTaskPopup={projectTasks.showTaskPopup}
              setShowTaskPopup={projectTasks.setShowTaskPopup}
              onCloseTaskPopup={projectTasks.closeTaskPopup}
              newTask={projectTasks.newTask}
              setNewTask={projectTasks.setNewTask}
              updateNewTask={projectTasks.updateNewTask}
              taskErrors={projectTasks.taskErrors}
              onAddTask={projectTasks.addTask}
              showEditPopup={projectTasks.showEditPopup}
              setShowEditPopup={projectTasks.setShowEditPopup}
              editingTask={projectTasks.editingTask}
              setEditingTask={projectTasks.setEditingTask}
              onSaveEditedTask={projectTasks.saveEditedTask}
            />
          </AppCard>
        </div>
      </main>
    </DashboardLayout>
  );
}
