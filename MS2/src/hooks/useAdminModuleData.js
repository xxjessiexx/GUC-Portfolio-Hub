import { useMemo, useState } from "react";
import { ADMIN_STORAGE_KEY, adminModuleSeed } from "@/data/adminModuleData";

function loadInitialState() {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : adminModuleSeed;
  } catch {
    return adminModuleSeed;
  }
}

function saveState(nextState) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function useAdminModuleData() {
  const [state, setState] = useState(loadInitialState);

  const updateState = (updater) => {
    setState((prev) => saveState(typeof updater === "function" ? updater(prev) : updater));
  };

  const metrics = useMemo(() => {
    const pendingEmployers = state.employers.filter((item) => item.status === "pending" || item.status === "needs-review").length;
    const pendingLinks = state.linkRequests.filter((item) => item.status === "pending").length;
    const flaggedOpen = state.flaggedProjects.filter((item) => item.status !== "resolved").length;
    const inactiveUsers = state.users.filter((item) => item.status !== "active").length;

    return [
      { label: "Active users", value: state.statistics.activeUsers, detail: `${inactiveUsers} inactive accounts`, tone: "info" },
      { label: "Pending reviews", value: pendingEmployers + pendingLinks + flaggedOpen, detail: "Employers, links and flags", tone: "warning" },
      { label: "Projects", value: state.statistics.totalProjects, detail: "Visible project records", tone: "success" },
      { label: "Employers", value: state.statistics.approvedEmployers, detail: `${pendingEmployers} awaiting action`, tone: "gold" },
    ];
  }, [state]);

  const setUserStatus = (id, status) => updateState((prev) => ({ ...prev, users: prev.users.map((user) => user.id === id ? { ...user, status } : user) }));

  const createAdminUser = ({ name, email }) => {
    if (!name || !email) return;
    updateState((prev) => ({
      ...prev,
      users: [
        { id: `u-admin-${Date.now()}`, name, email, role: "Administrator", status: "active", joined: new Date().toISOString().slice(0, 10), projects: 0, lastSeen: "New" },
        ...prev.users,
      ],
    }));
  };

  const setEmployerStatus = (id, status) => updateState((prev) => ({ ...prev, employers: prev.employers.map((employer) => employer.id === id ? { ...employer, status } : employer) }));

  const addCourse = ({ code, name, type, instructor }) => {
    if (!code || !name) return;
    updateState((prev) => ({
      ...prev,
      courses: [
        { id: `c-${Date.now()}`, code, name, type: type || "Course", instructor: instructor || "Unassigned", status: "active", linkedProjects: 0 },
        ...prev.courses,
      ],
    }));
  };

  const setCourseStatus = (id, status) => updateState((prev) => ({ ...prev, courses: prev.courses.map((course) => course.id === id ? { ...course, status } : course) }));

  const deleteCourse = (id) => updateState((prev) => ({ ...prev, courses: prev.courses.filter((course) => course.id !== id) }));

  const setLinkRequestStatus = (id, status) => updateState((prev) => ({ ...prev, linkRequests: prev.linkRequests.map((request) => request.id === id ? { ...request, status } : request) }));

  const setProjectActive = (id, active) => updateState((prev) => ({ ...prev, flaggedProjects: prev.flaggedProjects.map((project) => project.id === id ? { ...project, active, status: active ? "resolved" : "flagged" } : project) }));

  const setAppealStatus = (id, status) => updateState((prev) => ({ ...prev, appeals: prev.appeals.map((appeal) => appeal.id === id ? { ...appeal, status } : appeal) }));

  const resetDemoData = () => updateState(adminModuleSeed);

  return {
    ...state,
    metrics,
    actions: {
      setUserStatus,
      createAdminUser,
      setEmployerStatus,
      addCourse,
      setCourseStatus,
      deleteCourse,
      setLinkRequestStatus,
      setProjectActive,
      setAppealStatus,
      resetDemoData,
    },
  };
}
