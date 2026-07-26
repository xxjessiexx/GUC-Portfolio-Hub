import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenCheck, MessageSquareText } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/button";
import Toast from "@/components/ui/toast";

import { useNotifications } from "@/context/NotificationsContext";
import { useUserProfile } from "@/context/UserProfileContext";
import InstructorDashboardAnalytics from "@/components/InstructorDashboard/InstructorDashboardAnalytics";

import {
  getAllProjects,
  getCollection,
  getCurrentUser,
  getLinkedCoursesForInstructor,
  getNotificationsForUser,
} from "@/data/demoStore";

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

function getDisplayName(user) {
  return (
    user?.name ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Course Instructor"
  );
}

function initials(name = "Instructor") {
  return String(name || "Instructor")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatar(user) {
  return user?.image || user?.avatar || user?.profileImage || "";
}

function getProjectRating(project) {
  const rating = project?.rating;
  if (typeof rating === "number") return rating;
  if (typeof rating === "string") return Number(rating) || 0;
  if (rating && typeof rating === "object") return Number(rating.value || rating.score || 0) || 0;
  return Number(project?.averageRating || 0) || 0;
}

function getPendingInstructorInvites(projects, instructorId) {
  return projects.flatMap((project) =>
    (project.invitationStatuses || [])
      .filter(
        (invite) =>
          String(invite.userId) === String(instructorId) &&
          String(invite.status || "").toLowerCase() === "pending"
      )
      .map((invite) => ({ ...invite, project }))
  );
}

function projectNeedsReview(project) {
  const hasProjectFeedback = Array.isArray(project.feedback) && project.feedback.length > 0;
  const pendingTasks = (project.tasks || []).filter((task) => {
    const status = String(task.status || "").toLowerCase();
    return status !== "completed" || !(task.feedback || []).length;
  });
  const thesisDrafts = (project.thesisDrafts || []).filter(
    (draft) => draft.isFinal || draft.visibility === "public" || !(draft.feedback || []).length
  );

  return !hasProjectFeedback || pendingTasks.length > 0 || thesisDrafts.length > 0;
}

function buildInstructorSnapshot(instructorId, profile, sharedNotifications = []) {
  const users = getCollection("users") || [];
  const storeUser =
    users.find((user) => String(user.id) === String(instructorId)) ||
    getCurrentUser() ||
    {};

  const instructor = {
    ...storeUser,
    ...profile,
    id: storeUser.id || profile?.id || instructorId,
    name: profile?.name || profile?.fullName || getDisplayName(storeUser),
    title: profile?.title || storeUser.title || "Course Instructor",
    department: profile?.department || storeUser.department || "Computer Science & Engineering",
    image: profile?.image || getAvatar(storeUser),
    bio:
      profile?.bio ||
      storeUser.bio ||
      "Review project invitations, supervise course projects, comment on tasks and thesis drafts, and keep student feedback moving from one workspace.",
  };

  const linkedCourses = getLinkedCoursesForInstructor(instructor.id);
  const linkedCourseIds = new Set(linkedCourses.map((course) => String(course.id)));

  const allProjects = getAllProjects({ includePrivate: true });
  const supervisedProjects = allProjects.filter((project) => {
    const instructorMatch = (project.instructorIds || []).some(
      (id) => String(id) === String(instructor.id)
    );
    const courseMatch = linkedCourseIds.has(String(project.courseId));
    return instructorMatch || courseMatch;
  });

  const pendingInvites = getPendingInstructorInvites(allProjects, instructor.id);
  const reviewQueue = supervisedProjects
    .filter(projectNeedsReview)
    .map((project) => {
      const isBachelor =
        String(project.type || "").toLowerCase().includes("bachelor") ||
        String(project.courseName || project.course || "").toLowerCase().includes("bachelor");
      const pendingTask = (project.tasks || []).find(
        (task) => String(task.status || "").toLowerCase() !== "completed"
      );
      const finalDraft = (project.thesisDrafts || []).find((draft) => draft.isFinal);

      return {
        id: project.id,
        title: project.title || project.name || "Untitled project",
        student: project.owner?.name || project.student?.name || project.ownerName || "Student team",
        course: project.courseCode || project.courseName || project.course || "Course Project",
        type: isBachelor && finalDraft ? "Thesis draft" : pendingTask ? "Task feedback" : "Project feedback",
        due: pendingTask?.deadline || finalDraft?.uploadedAt || project.updatedAt || project.createdAt,
        priority: isBachelor ? "High" : pendingTask ? "Medium" : "Low",
        action: isBachelor && finalDraft ? "Review thesis draft" : pendingTask ? "Comment on milestone tasks" : "Rate project",
        project,
      };
    })
    .slice(0, 6);

  const ratings = supervisedProjects.map(getProjectRating).filter((rating) => rating > 0);
  const averageRating = ratings.length
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
    : "0.0";

  const notifications = [
    ...getNotificationsForUser(instructor.id),
    ...(sharedNotifications || []),
  ].slice(0, 8);

  return {
    instructor,
    linkedCourses,
    supervisedProjects,
    reviewQueue,
    pendingInvites,
    notifications,
    reviewCapacity: Math.min(96, Math.max(18, Math.round((reviewQueue.length / Math.max(supervisedProjects.length, 1)) * 100))),
    stats: {
      linkedCourses: linkedCourses.length,
      activeCourses: linkedCourses.filter((course) => course.linked || course.status === "Linked").length,
      projectsToReview: reviewQueue.length,
      projectsNeedingFeedbackToday: reviewQueue.filter((item) => String(item.due || "").toLowerCase().includes("today")).length,
      pendingInvites: pendingInvites.length,
      bachelorProjects: supervisedProjects.filter((project) =>
        String(project.courseName || project.course || project.type || "").toLowerCase().includes("bachelor")
      ).length,
      averageRating,
    },
  };
}

function InstructorHero({ instructor, snapshot }) {
  const navigate = useNavigate();
  const avatar = getAvatar(instructor);
  const name = getDisplayName(instructor);

  return (
    <AppCard className="mb-6 overflow-hidden">
      <div className="grid gap-6 p-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[var(--primary)]">
            Instructor Overview
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[26px] border border-[color:var(--border)]  bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] text-2xl font-black text-white shadow-[0_18px_45px_rgba(53,88,114,0.2)] dark:border-white/10">
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                initials(name)
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-4xl font-black tracking-tight text-[var(--ink)]">
                {name}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                {instructor.bio}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex h-9 items-center rounded-full border border-[#7AAACE]/30 bg-[color:var(--card)]
border-[color:var(--border)] px-4 text-xs font-black text-[var(--primary)] shadow-[0_10px_24px_rgba(53,88,114,0.08)]">
                  {instructor.title || "Course Instructor"}
                </span>
                <span className="inline-flex h-9 items-center rounded-full border border-[#7AAACE]/30 bg-white/65 px-4 text-xs font-black text-[var(--primary)] shadow-[0_10px_24px_rgba(53,88,114,0.08)]">
                  {snapshot.linkedCourses.length} linked courses
                </span>
                <span className="inline-flex h-9 items-center rounded-full border border-[#E6C77B]/45 bg-white/65 px-4 text-xs font-black text-[var(--primary)] shadow-[0_10px_24px_rgba(53,88,114,0.08)]">
                  {snapshot.reviewQueue.length} review actions
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-6 text-white shadow-[0_24px_65px_rgba(53,88,114,0.28)] dark:[background:var(--dashboard-hero-action-gradient)] dark:shadow-[0_24px_65px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold text-white/70">Quick action</p>
          <h3 className="mt-2 text-2xl font-black">Review student work</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Open project reviews, comment on task updates, and handle bachelor thesis feedback from the instructor workspace.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    

            <Button
              type="button"
              onClick={() => navigate("/instructor/my-courses")}
              className="rounded-2xl bg-white/10 px-5 font-black text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              <BookOpenCheck className="mr-2 h-4 w-4" />
              Linked Courses
            </Button>
          </div>
        </div>
      </div>
    </AppCard>
  );
}

export default function InstructorDashboard() {
  const { profile } = useUserProfile();
  const { notifications: sharedNotifications = [] } = useNotifications();
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());

  useEffect(() => {
    const refresh = () => setCurrentUserState(getCurrentUser());
    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);
    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, []);

  const snapshot = useMemo(() => {
    return buildInstructorSnapshot(currentUser?.id || profile?.id, profile, sharedNotifications);
  }, [currentUser?.id, profile, sharedNotifications]);

  const instructor = snapshot.instructor;

  return (
    <DashboardLayout
      notifications={snapshot.notifications}
      workspace="instructor"
      workspaceLabel="Instructor Workspace"
      sidebarProgress={{
        title: "Review capacity",
        value: snapshot.reviewCapacity,
        label: `${snapshot.reviewQueue.length} urgent actions`,
      }}
    >
      <Toast notification={toast} onClose={() => setToast(null)} />
      <InstructorHero instructor={instructor} snapshot={snapshot} />
      <InstructorDashboardAnalytics snapshot={snapshot} notifications={snapshot.notifications} />
    </DashboardLayout>
  );
}
