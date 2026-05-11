import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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
import ProjectRoleActions from "@/components/projectPage/ProjectRoleActions";
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

export default function ProjectPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

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
    loggedInUser?.name || loggedInUser?.fullName || loggedInUser?.email || "";

  const currentUserId = loggedInUser?.id;
  const userRole = normalizeRole(loggedInUser?.role);
  const isAdmin = userRole === "admin";
  const isLoggedInInstructor = userRole === "instructor";

  const isPublic = project?.visibility === "Public";

  const isCreator =
    Boolean(project) &&
    String(currentUserId || "") === String(project.ownerId || "");

  const statusFor = (id) => getInvitationStatus(project, id);

  const acceptedCollaboratorIds = (project?.collaboratorIds || []).filter(
    (id) => statusFor(id) === "accepted"
  );

  const acceptedInstructorIds = (project?.instructorIds || []).filter(
    (id) => statusFor(id) === "accepted"
  );

  const isAcceptedCollaborator =
    Boolean(project) && acceptedCollaboratorIds.includes(currentUserId);

  const coursesForProject = courses.find(
    (course) => String(course.id) === String(project?.courseId)
  );

  const linkedInstructorIds = new Set([
    ...(project?.courseInstructorIds || []),
    ...(project?.raw?.courseInstructorIds || []),
    ...(project?.raw?.courseRecord?.instructorIds || []),
    ...(coursesForProject?.instructorIds || []),
    ...(project?.instructorIds || []),
  ].map(String));

  const userLinkedCourseIds = [
    ...(loggedInUser?.linkedCourseIds || []),
    ...(loggedInUser?.courseIds || []),
    ...(loggedInUser?.courses || [])
      .map((course) => (typeof course === "string" ? course : course?.id))
      .filter(Boolean),
  ].map(String);

  const isLinkedToProjectCourse =
    Boolean(project?.courseId) &&
    (linkedInstructorIds.has(String(currentUserId)) ||
      userLinkedCourseIds.includes(String(project.courseId)));

  const isAcceptedProjectInstructor =
    Boolean(project) && acceptedInstructorIds.includes(currentUserId);

  const isRelatedInstructor =
    isLoggedInInstructor && (isLinkedToProjectCourse || isAcceptedProjectInstructor);

  const isOtherInstructor = isLoggedInInstructor && !isRelatedInstructor;

  const hasOwnProjectInvitation = Boolean(
    project?.invitationStatuses?.some(
      (item) =>
        String(item.userId) === String(currentUserId) &&
        ["pending", "accepted"].includes(String(item.status).toLowerCase())
    )
  );

  const isBachelorProject = project?.type === "Bachelor Project";

  const canViewProject =
    Boolean(project) &&
    (isPublic ||
      isCreator ||
      isAcceptedCollaborator ||
      isRelatedInstructor ||
      isAdmin ||
      hasOwnProjectInvitation);

  const canManageProject = isCreator;
  const canManageTasks = isCreator;
  const canInvitePeople = isCreator;
  const canCancelInvitations = isCreator;
  const canRemoveCollaborators = isCreator;
  const canManageCollaborators = isCreator;
  const canViewComments =
    isCreator || isAcceptedCollaborator || isRelatedInstructor || isAdmin;
  const canAddInstructorFeedback = isRelatedInstructor;
  const canFlagProject = isAdmin || isLoggedInInstructor;
  const canModerateProject = isAdmin;
  const canAppealFlag = isCreator;

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
    const currentRole = normalizeRole(loggedInUser?.role);

    const statusForId = (id) => getInvitationStatus(normalizedProject, id);
    const projectCourse = (getCollection("courses") || []).find(
      (course) => String(course.id) === String(normalizedProject.courseId)
    );
    const currentInstructorCourseIds = [
      ...(loggedInUser?.linkedCourseIds || []),
      ...(loggedInUser?.courseIds || []),
    ].map(String);

    const linkedInstructorIdsForProject = new Set([
      ...(normalizedProject.courseInstructorIds || []),
      ...(normalizedProject.raw?.courseInstructorIds || []),
      ...(normalizedProject.raw?.courseRecord?.instructorIds || []),
      ...(projectCourse?.instructorIds || []),
      ...(normalizedProject.instructorIds || []),
    ].map(String));

    const canView =
      normalizedProject.visibility === "Public" ||
      String(normalizedProject.ownerId) === String(currentId) ||
      (normalizedProject.collaboratorIds || []).some(
        (id) => String(id) === String(currentId) && statusForId(id) === "accepted"
      ) ||
      (currentRole === "instructor" &&
        (linkedInstructorIdsForProject.has(String(currentId)) ||
          currentInstructorCourseIds.includes(String(normalizedProject.courseId)))) ||
      (normalizedProject.invitationStatuses || []).some(
        (item) =>
          String(item.userId) === String(currentId) &&
          ["pending", "accepted"].includes(String(item.status).toLowerCase())
      ) ||
      currentRole === "admin";

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

  const goToEditProject = () => {
    if (!project?.id || !canManageProject) return;
    navigate(`/edit-project/${project.id}`);
  };

  const flagProject = () => {
    if (!project?.id || !canFlagProject || isCreator) return;

    const reason = window.prompt(
      "Why are you flagging this project?",
      project.flagReason || ""
    );

    if (reason === null || !reason.trim()) return;

    const now = new Date().toISOString();

    persistProject({
      status: "flagged",
      flagReason: reason.trim(),
      flaggedById: loggedInUser?.id,
      flaggedByName: getDisplayName(loggedInUser),
      flaggedAt: now,
      appealStatus: "none",
    });

    const savedFlaggedProjects = JSON.parse(
      localStorage.getItem("flaggedProjects") || "[]"
    );

    const nextFlaggedProjects = [
      ...savedFlaggedProjects.filter((item) => String(item.id) !== String(project.id)),
      {
        id: project.id,
        title: project.title,
        student: project.ownerName,
        course: project.course,
        reason: reason.trim(),
        flaggedBy: getDisplayName(loggedInUser),
        flaggedById: loggedInUser?.id,
        status: "flagged",
        appealStatus: "none",
        submittedAt: now.slice(0, 10),
        active: project.active !== false,
      },
    ];

    localStorage.setItem("flaggedProjects", JSON.stringify(nextFlaggedProjects));

    makeNotification(
      project.ownerId,
      "Project flagged",
      `${project.title} was flagged: ${reason.trim()}`,
      project.id,
      "project-flag"
    );
  };

  const appealFlag = () => {
    if (!project?.id || !canAppealFlag) return;

    const message = window.prompt(
      "Write your appeal message for the admin:",
      project.appealMessage || ""
    );

    if (message === null || !message.trim()) return;

    const now = new Date().toISOString();

    persistProject({
      appealStatus: "submitted",
      appealMessage: message.trim(),
      appealSubmittedAt: now,
    });

    const savedFlaggedProjects = JSON.parse(
      localStorage.getItem("flaggedProjects") || "[]"
    );

    const nextFlaggedProjects = [
      ...savedFlaggedProjects.filter((item) => String(item.id) !== String(project.id)),
      {
        id: project.id,
        title: project.title,
        student: project.ownerName,
        course: project.course,
        reason: project.flagReason || "Owner submitted an appeal for this flagged project.",
        flaggedBy: project.flaggedByName || "Instructor/Admin",
        flaggedById: project.flaggedById || "",
        status: "under-review",
        appealStatus: "submitted",
        appealMessage: message.trim(),
        submittedAt: now.slice(0, 10),
        active: project.active !== false,
      },
    ];

    localStorage.setItem("flaggedProjects", JSON.stringify(nextFlaggedProjects));
  };

  const toggleProjectActive = (currentlyInactive) => {
    if (!project?.id || !canModerateProject) return;

    const nextActive = Boolean(currentlyInactive);
    const note = window.prompt(
      nextActive ? "Activation note" : "Why are you deactivating this project?",
      project.adminNote || ""
    );

    if (!nextActive && (note === null || !note.trim())) return;
    if (note === null) return;

    persistProject({
      active: nextActive,
      adminNote: note.trim(),
      status: nextActive ? "approved" : "flagged",
      deactivatedAt: nextActive ? undefined : new Date().toISOString(),
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
      `${getDisplayName(loggedInUser)} ${status} the invitation to ${project.title}.`,
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

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-3 sm:px-4 lg:px-0">
        <AppCard className="space-y-6 p-5 sm:p-6 lg:p-8">
          <ProjectPageHeader
            project={project}
            isPublic={isPublic}
            canManageProject={canManageProject}
            onToggleVisibility={toggleVisibility}
          />

          <ProjectInvitationBanner
            invitation={ownPendingInvitation}
            onAccept={() => respondToInvitation("accepted")}
            onReject={() => respondToInvitation("rejected")}
          />

          <ProjectRoleActions
            project={project}
            permissions={{
              isOwner: isCreator,
              isAcceptedCollaborator,
              isRelatedInstructor,
              isOtherInstructor,
              isAdmin,
              canManageProject,
              canFlagProject,
              canAppealFlag,
              canModerateProject,
            }}
            onEditProject={goToEditProject}
            onFlagProject={flagProject}
            onAppealFlag={appealFlag}
            onToggleProjectActive={toggleProjectActive}
          />

          <ProjectPageVideo src={projectVideoSrc} />

          <ProjectPageTabs
            visibleTabs={visibleTabs}
            activeTab={safeActiveTab}
            setActiveTab={setActiveTab}
          />

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
              onAddTaskClick={() => projectTasks.setShowTaskPopup(true)}
              onStoreTasks={projectTasks.storeTasks}
              onUpdateTaskStatus={projectTasks.updateTaskStatus}
              onOpenEditTask={projectTasks.openEditPopup}
              onDeleteTask={projectTasks.deleteTask}
              onAddTaskFeedback={projectTasks.addTaskFeedback}
              onEditTaskFeedback={projectTasks.editTaskFeedback}
              onDeleteTaskFeedback={projectTasks.deleteTaskFeedback}
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

          <ProjectTaskModals
            project={project}
            isBachelorProject={isBachelorProject}
            showTaskPopup={projectTasks.showTaskPopup}
            setShowTaskPopup={projectTasks.setShowTaskPopup}
            newTask={projectTasks.newTask}
            setNewTask={projectTasks.setNewTask}
            onAddTask={projectTasks.addTask}
            showEditPopup={projectTasks.showEditPopup}
            setShowEditPopup={projectTasks.setShowEditPopup}
            editingTask={projectTasks.editingTask}
            setEditingTask={projectTasks.setEditingTask}
            onSaveEditedTask={projectTasks.saveEditedTask}
          />
        </AppCard>
      </div>
    </DashboardLayout>
  );
}