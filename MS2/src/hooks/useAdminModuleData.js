import { useMemo, useState } from "react";
import { ADMIN_STORAGE_KEY, adminModuleSeed } from "@/data/adminModuleData";

function loadInitialState() {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? { ...adminModuleSeed, ...JSON.parse(stored) } : adminModuleSeed;
  } catch {
    return adminModuleSeed;
  }
}

function saveState(nextState) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function activity(title, detail, tone = "info") {
  return { id: `act-${Date.now()}-${Math.random().toString(16).slice(2)}`, title, detail, time: "Just now", tone };
}

function pushActivity(prev, entry) {
  return [entry, ...(prev.activity || [])].slice(0, 12);
}

function deriveStatistics(state) {
  const users = state.users || [];
  const employers = state.employers || [];
  const courses = state.courses || [];
  const projects = state.flaggedProjects || [];
  const activeUsers = users.filter((user) => user.status === "active").length;
  const approvedEmployers = employers.filter((employer) => employer.status === "approved").length;

  return {
    ...state.statistics,
    activeUsers: Math.max(activeUsers, state.statistics?.activeUsers || 0),
    totalCourses: courses.length,
    approvedEmployers: Math.max(approvedEmployers, state.statistics?.approvedEmployers || 0),
    projectModeration: [
      { label: "Active", value: projects.filter((project) => project.active).length },
      { label: "Deactivated", value: projects.filter((project) => !project.active).length },
      { label: "Resolved", value: projects.filter((project) => project.status === "resolved").length },
    ],
    employerStatus: [
      { label: "Approved", value: employers.filter((item) => item.status === "approved").length },
      { label: "Pending", value: employers.filter((item) => item.status === "pending").length },
      { label: "Needs review", value: employers.filter((item) => item.status === "needs-review").length },
      { label: "Rejected", value: employers.filter((item) => item.status === "rejected").length },
    ],
  };
}

export function useAdminModuleData() {
  const [state, setState] = useState(loadInitialState);

  const updateState = (updater) => {
    setState((prev) => saveState(typeof updater === "function" ? updater(prev) : updater));
  };

  const statistics = useMemo(() => deriveStatistics(state), [state]);

  const metrics = useMemo(() => {
    const pendingEmployers = state.employers.filter((item) => item.status === "pending" || item.status === "needs-review").length;
    const pendingLinks = state.linkRequests.filter((item) => item.status === "pending").length;
    const flaggedOpen = state.flaggedProjects.filter((item) => item.status !== "resolved").length;
    const inactiveUsers = state.users.filter((item) => item.status !== "active").length;

    return [
      { label: "Active users", value: statistics.activeUsers, detail: `${inactiveUsers} inactive accounts`, tone: "info" },
      { label: "Pending reviews", value: pendingEmployers + pendingLinks + flaggedOpen, detail: "Employers, links and flags", tone: "warning" },
      { label: "Projects", value: statistics.totalProjects, detail: "Visible project records", tone: "success" },
      { label: "Employers", value: statistics.approvedEmployers, detail: `${pendingEmployers} awaiting action`, tone: "gold" },
    ];
  }, [state, statistics]);

  const setUserStatus = (id, status, note = "") => updateState((prev) => {
    const user = prev.users.find((item) => item.id === id);
    return {
      ...prev,
      users: prev.users.map((item) => item.id === id ? { ...item, status, adminNote: note || item.adminNote } : item),
      activity: pushActivity(prev, activity(`${status === "active" ? "Activated" : "Deactivated"} account`, `${user?.name || "A user"} was marked ${status}.${note ? ` Note: ${note}` : ""}`, status === "active" ? "success" : "danger")),
    };
  });

  const createAdminUser = ({ name, email, username, password, note = "" }) => {
    if (!name || !email || !username || !password) return;

    const adminRecord = {
      id: `u-admin-${Date.now()}`,
      name,
      email,
      username,
      role: "Administrator",
      status: "active",
      joined: today(),
      projects: 0,
      lastSeen: "New",
      adminNote: note,
    };

    updateState((prev) => ({
      ...prev,
      users: [adminRecord, ...prev.users.filter((user) => user.email?.toLowerCase() !== email.toLowerCase())],
      statistics: {
        ...prev.statistics,
        roleDistribution: prev.statistics.roleDistribution.map((item) =>
          item.label === "Admins" ? { ...item, value: item.value + 1 } : item
        ),
      },
      activity: pushActivity(prev, activity("Admin account created", `${name} was provisioned as an administrator.${note ? ` Note: ${note}` : ""}`, "success")),
    }));

    const sessionUsers = JSON.parse(sessionStorage.getItem("users") || "[]");
    sessionStorage.setItem(
      "users",
      JSON.stringify([
        {
          id: adminRecord.id,
          name,
          email,
          username,
          password,
          role: "admin",
          accountRole: "admin",
          systemRole: "admin",
        },
        ...sessionUsers.filter((user) => user.email?.toLowerCase() !== email.toLowerCase() && user.username?.toLowerCase() !== username.toLowerCase()),
      ])
    );
  };

  const setEmployerStatus = (id, status, note = "") => updateState((prev) => {
    const employer = prev.employers.find((item) => item.id === id);
    return {
      ...prev,
      employers: prev.employers.map((item) => item.id === id ? { ...item, status, reviewNote: note || item.reviewNote, reviewedAt: today() } : item),
      activity: pushActivity(prev, activity(`Employer ${status}`, `${employer?.companyName || "Company"} was ${status}.${note ? ` Reason: ${note}` : ""}`, status === "approved" ? "success" : status === "rejected" ? "danger" : "warning")),
    };
  });

  const addCourse = ({ code, name, type, instructor, note = "" }) => {
    if (!code || !name) return;
    const course = { id: `c-${Date.now()}`, code, name, type: type || "Course", instructor: instructor || "Unassigned", status: "active", linkedProjects: 0, adminNote: note };
    updateState((prev) => ({
      ...prev,
      courses: [course, ...prev.courses],
      activity: pushActivity(prev, activity("Course created", `${code} - ${name} was added to the academic catalog.${note ? ` Note: ${note}` : ""}`, "success")),
    }));
  };

  const updateCourse = (id, updates, note = "") => updateState((prev) => {
    const course = prev.courses.find((item) => item.id === id);
    return {
      ...prev,
      courses: prev.courses.map((item) => item.id === id ? { ...item, ...updates, adminNote: note || item.adminNote } : item),
      activity: pushActivity(prev, activity("Course updated", `${course?.code || "Course"} details were updated.${note ? ` Note: ${note}` : ""}`, "info")),
    };
  });

  const setCourseStatus = (id, status, note = "") => updateState((prev) => {
    const course = prev.courses.find((item) => item.id === id);
    return {
      ...prev,
      courses: prev.courses.map((item) => item.id === id ? { ...item, status, adminNote: note || item.adminNote } : item),
      activity: pushActivity(prev, activity(`${status === "active" ? "Activated" : "Deactivated"} course`, `${course?.code || "Course"} was marked ${status}.${note ? ` Note: ${note}` : ""}`, status === "active" ? "success" : "warning")),
    };
  });

  const deleteCourse = (id, note = "") => updateState((prev) => {
    const course = prev.courses.find((item) => item.id === id);
    return {
      ...prev,
      courses: prev.courses.filter((item) => item.id !== id),
      activity: pushActivity(prev, activity("Course deleted", `${course?.code || "A course"} was removed from the catalog.${note ? ` Reason: ${note}` : ""}`, "danger")),
    };
  });

  const setLinkRequestStatus = (id, status, note = "") => updateState((prev) => {
    const request = prev.linkRequests.find((item) => item.id === id);
    return {
      ...prev,
      linkRequests: prev.linkRequests.map((item) => item.id === id ? { ...item, status, decisionNote: note || item.decisionNote, reviewedAt: today() } : item),
      activity: pushActivity(prev, activity(`Link request ${status}`, `${request?.instructor || "Instructor"} request to ${request?.action || "link"} ${request?.course || "a course"} was ${status}.${note ? ` Reason: ${note}` : ""}`, status === "approved" ? "success" : "danger")),
    };
  });

  const setProjectActive = (id, active, note = "") => updateState((prev) => {
    const project = prev.flaggedProjects.find((item) => item.id === id);
    return {
      ...prev,
      flaggedProjects: prev.flaggedProjects.map((item) => item.id === id ? { ...item, active, status: active ? "resolved" : "flagged", adminNote: note || item.adminNote } : item),
      activity: pushActivity(prev, activity(`${active ? "Activated" : "Deactivated"} project`, `${project?.title || "Project"} was ${active ? "restored" : "deactivated"}.${note ? ` Reason: ${note}` : ""}`, active ? "success" : "danger")),
    };
  });

  const setAppealStatus = (id, status, note = "") => updateState((prev) => {
    const appeal = prev.appeals.find((item) => item.id === id);
    return {
      ...prev,
      appeals: prev.appeals.map((item) => item.id === id ? { ...item, status, decisionNote: note || item.decisionNote, reviewedAt: today() } : item),
      flaggedProjects: prev.flaggedProjects.map((project) => project.id === appeal?.projectId ? { ...project, appealStatus: status, active: status === "accepted" ? true : project.active, status: status === "accepted" ? "resolved" : project.status } : project),
      activity: pushActivity(prev, activity(`Appeal ${status}`, `${appeal?.student || "Student"}'s appeal was ${status}.${note ? ` Reason: ${note}` : ""}`, status === "accepted" ? "success" : "danger")),
    };
  });

  const resetDemoData = () => updateState(adminModuleSeed);

  return {
    ...state,
    statistics,
    metrics,
    actions: {
      setUserStatus,
      createAdminUser,
      setEmployerStatus,
      addCourse,
      setCourseStatus,
      updateCourse,
      deleteCourse,
      setLinkRequestStatus,
      setProjectActive,
      setAppealStatus,
      resetDemoData,
    },
  };
}
