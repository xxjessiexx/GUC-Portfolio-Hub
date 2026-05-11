import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminModuleState,
  getDemoDb,
  setDemoDb,
  setCourseLinkRequestStatus,
} from "@/data/demoStore";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function makeActivity(title, detail, tone = "info") {
  return {
    id: `act-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    detail,
    time: "Just now",
    tone,
  };
}

function normalizeCourseStatus(status) {
  return status === "pending-link" ? "active" : status || "active";
}

export function useAdminModuleData() {
  const [state, setState] = useState(() => getAdminModuleState());
  const [activity, setActivity] = useState([]);

  const refresh = useCallback(() => {
    setState(getAdminModuleState());
  }, []);

  const pushActivity = useCallback((entry) => {
    setActivity((prev) => [entry, ...prev].slice(0, 12));
  }, []);

  useEffect(() => {
    refresh();

    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, [refresh]);

  const statistics = useMemo(() => {
    const users = state.users || [];
    const employers = state.employers || [];
    const courses = state.courses || [];
    const flaggedProjects = state.flaggedProjects || [];

    return {
      ...state.statistics,
      activeUsers: users.filter((user) => user.status === "active").length,
      totalCourses: courses.length,
      approvedEmployers: employers.filter((item) => item.status === "approved" || item.status === "active").length,
      projectModeration: [
        { label: "Active", value: flaggedProjects.filter((project) => project.active).length },
        { label: "Deactivated", value: flaggedProjects.filter((project) => !project.active).length },
        { label: "Resolved", value: flaggedProjects.filter((project) => project.status === "resolved").length },
      ],
      employerStatus: [
        { label: "Approved", value: employers.filter((item) => item.status === "approved").length },
        { label: "Pending", value: employers.filter((item) => item.status === "pending").length },
        { label: "Needs review", value: employers.filter((item) => item.status === "needs-review").length },
        { label: "Rejected", value: employers.filter((item) => item.status === "rejected").length },
      ],
    };
  }, [state]);

  const metrics = useMemo(() => {
    const pendingEmployers = (state.employers || []).filter((item) => item.status === "pending" || item.status === "needs-review").length;
    const pendingLinks = (state.linkRequests || []).filter((item) => item.status === "pending").length;
    const flaggedOpen = (state.flaggedProjects || []).filter((item) => item.status !== "resolved").length;
    const inactiveUsers = (state.users || []).filter((item) => item.status !== "active").length;

    return [
      { label: "Active users", value: statistics.activeUsers, detail: `${inactiveUsers} inactive accounts`, tone: "info" },
      { label: "Pending reviews", value: pendingEmployers + pendingLinks + flaggedOpen, detail: "Employers, links and flags", tone: "warning" },
      { label: "Projects", value: statistics.totalProjects || 0, detail: "Visible project records", tone: "success" },
      { label: "Employers", value: statistics.approvedEmployers, detail: `${pendingEmployers} awaiting action`, tone: "gold" },
    ];
  }, [state, statistics]);

  const updateDb = useCallback((updater, activityEntry) => {
    const db = getDemoDb();
    const nextDb = typeof updater === "function" ? updater(db) : updater;
    setDemoDb(nextDb);
    if (activityEntry) pushActivity(activityEntry);
    refresh();
  }, [pushActivity, refresh]);

  const setUserStatus = useCallback((id, status, note = "") => {
    updateDb((db) => {
      const user = (db.users || []).find((item) => item.id === id);
      return {
        ...db,
        users: (db.users || []).map((item) =>
          item.id === id ? { ...item, status, adminNote: note || item.adminNote } : item
        ),
      };
    }, makeActivity(`${status === "active" ? "Activated" : "Deactivated"} account`, `A user was marked ${status}.${note ? ` Note: ${note}` : ""}`, status === "active" ? "success" : "danger"));
  }, [updateDb]);

  const createAdminUser = useCallback(({ name, email, username, password, note = "" }) => {
    if (!name || !email || !username || !password) return;

    const adminRecord = {
      id: `u-admin-${Date.now()}`,
      isDemo: false,
      name,
      email,
      username,
      password,
      role: "admin",
      accountRole: "admin",
      systemRole: "admin",
      status: "active",
      createdAt: today(),
      title: "Platform Administrator",
      adminNote: note,
    };

    updateDb((db) => ({
      ...db,
      users: [
        adminRecord,
        ...(db.users || []).filter((user) => user.email?.toLowerCase() !== email.toLowerCase() && user.username?.toLowerCase() !== username.toLowerCase()),
      ],
    }), makeActivity("Admin account created", `${name} was provisioned as an administrator.${note ? ` Note: ${note}` : ""}`, "success"));
  }, [updateDb]);

  const setEmployerStatus = useCallback((id, status, note = "") => {
    updateDb((db) => ({
      ...db,
      users: (db.users || []).map((user) =>
        user.id === id ? { ...user, status, verificationStatus: status, reviewNote: note || user.reviewNote, reviewedAt: today() } : user
      ),
    }), makeActivity(`Employer ${status}`, `Employer account was ${status}.${note ? ` Reason: ${note}` : ""}`, status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"));
  }, [updateDb]);

  const addCourse = useCallback(({ code, name, type, instructor, note = "" }) => {
    if (!code || !name) return;
    const normalizedCode = code.trim().toUpperCase();
    const course = {
      id: `course-${normalizedCode.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      code: normalizedCode,
      name: name.trim(),
      type: type || "Course",
      instructorIds: [],
      linkedProjectIds: [],
      status: "active",
      adminNote: note,
    };

    updateDb((db) => ({ ...db, courses: [course, ...(db.courses || [])] }), makeActivity("Course created", `${course.code} - ${course.name} was added.${note ? ` Note: ${note}` : ""}`, "success"));
  }, [updateDb]);

  const updateCourse = useCallback((id, updates, note = "") => {
    updateDb((db) => ({
      ...db,
      courses: (db.courses || []).map((course) =>
        course.id === id
          ? {
              ...course,
              code: updates.code || course.code,
              name: updates.name || course.name,
              type: updates.type || course.type,
              status: normalizeCourseStatus(updates.status || course.status),
              adminNote: note || course.adminNote,
            }
          : course
      ),
    }), makeActivity("Course updated", `Course details were updated.${note ? ` Note: ${note}` : ""}`, "info"));
  }, [updateDb]);

  const setCourseStatus = useCallback((id, status, note = "") => {
    updateDb((db) => ({
      ...db,
      courses: (db.courses || []).map((course) =>
        course.id === id ? { ...course, status, adminNote: note || course.adminNote } : course
      ),
    }), makeActivity(`${status === "active" ? "Activated" : "Deactivated"} course`, `Course was marked ${status}.${note ? ` Note: ${note}` : ""}`, status === "active" ? "success" : "warning"));
  }, [updateDb]);

  const deleteCourse = useCallback((id, note = "") => {
    updateDb((db) => ({
      ...db,
      courses: (db.courses || []).filter((course) => course.id !== id),
    }), makeActivity("Course deleted", `A course was removed.${note ? ` Reason: ${note}` : ""}`, "danger"));
  }, [updateDb]);

  const setLinkRequestStatus = useCallback((id, status, note = "") => {
    const updated = setCourseLinkRequestStatus(id, status, note);
    if (updated) {
      const action = String(updated.action || updated.type || "link").includes("unlink") ? "unlink" : "link";
      const requestLabel = action === "unlink" ? "unlink request" : "link request";
      const resultDetail =
        status === "approved"
          ? `${updated.instructor}'s ${requestLabel} for ${updated.course} was approved.`
          : `${updated.instructor}'s ${requestLabel} for ${updated.course} was rejected.`;

      pushActivity(makeActivity(
        `Course ${requestLabel} ${status}`,
        `${resultDetail}${note ? ` Reason: ${note}` : ""}`,
        status === "approved" ? "success" : "danger"
      ));
      refresh();
    }

    return updated;
  }, [pushActivity, refresh]);

  const setProjectActive = useCallback((id, active, note = "") => {
    updateDb((db) => ({
      ...db,
      reports: (db.reports || []).map((report) =>
        report.projectId === id ? { ...report, active, status: active ? "resolved" : "flagged", adminNote: note || report.adminNote } : report
      ),
    }), makeActivity(`${active ? "Activated" : "Deactivated"} project`, `Project was ${active ? "restored" : "deactivated"}.${note ? ` Reason: ${note}` : ""}`, active ? "success" : "danger"));
  }, [updateDb]);

  const setAppealStatus = useCallback((id, status, note = "") => {
    updateDb((db) => ({
      ...db,
      reports: (db.reports || []).map((report) =>
        report.appeal?.id === id
          ? { ...report, appeal: { ...report.appeal, status, decisionNote: note, reviewedAt: new Date().toISOString() } }
          : report
      ),
    }), makeActivity(`Appeal ${status}`, `Appeal was ${status}.${note ? ` Reason: ${note}` : ""}`, status === "accepted" ? "success" : "danger"));
  }, [updateDb]);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem("guc_demo_database_v8");
    refresh();
  }, [refresh]);

  return {
    ...state,
    activity: activity.length ? activity : state.activity || [],
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

