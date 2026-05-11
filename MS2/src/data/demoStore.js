// src/data/demoStore.js
// V6 strict single-source demo store.
// Goal: no page should own random/static data. Seed lives in localStorage; writes go through this file.

import { DEMO_DATA_VERSION, demoSeed } from "@/data/seed";
import {
  extraDemoEmployerUsers,
  extraDemoInternships,
  
} from "@/data/seed/extra-demo-internships-50";

import {
  extraPortfolioProjectUsers,
  extraPortfolioProjects50,
} from "@/data/seed/extra-ms2-projects-50";


const DB_KEY = "guc_demo_database_v9";
const CHAT_RESET_VERSION = "chat-reset-v13";
const CHAT_RESET_KEY = "guc_demo_chat_reset_version";
const CURRENT_USER_KEY = "currentUser";
const LEGACY_USERS_KEY = "users";
const PROJECTS_STORAGE_KEY = "guc-portfolio-projects";
const INTERNSHIPS_STORAGE_KEY = "guc-portfolio-internships";
const APPLIED_INTERNSHIPS_KEY = "guc-applied-internships";
const SAVED_INTERNSHIPS_KEY = "guc-saved-internships";
const COVER_LETTERS_KEY = "guc-cover-letters";

const clone = (value) => JSON.parse(JSON.stringify(value));

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readSession(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return parseJson(sessionStorage.getItem(key), fallback);
}

function writeSession(key, value) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

function readLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return parseJson(localStorage.getItem(key), fallback);
}

function writeLocal(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function dispatchStoreChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-db-change"));
}

function dispatchUserChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-current-user-change"));
}
function ensureBachelorLinks(db = {}) {
  const courses = Array.isArray(db.courses) ? db.courses : [];
  const projects = Array.isArray(db.projects) ? db.projects : [];

  const bachelorCourses = courses.filter((course) => {
    const type = String(course.type || "").toLowerCase();
    const name = String(course.name || "").toLowerCase();
    const code = String(course.code || "").toLowerCase();

    return (
      type.includes("bachelor") ||
      name.includes("bachelor") ||
      code.includes("bachelor")
    );
  });

  if (!bachelorCourses.length) {
    return db;
  }

  const bachelorCourseIds = new Set(
    bachelorCourses.map((course) => String(course.id))
  );

  const updatedProjects = projects.map((project) => {
    const projectCourseId = String(project.courseId || "");
    const projectType = String(project.type || "").toLowerCase();
    const projectCourseName = String(project.courseName || project.course || "").toLowerCase();

    const isBachelorProject =
      bachelorCourseIds.has(projectCourseId) ||
      projectType.includes("bachelor") ||
      projectCourseName.includes("bachelor");

    if (!isBachelorProject) {
      return project;
    }

    const linkedCourse =
      courses.find((course) => String(course.id) === projectCourseId) ||
      bachelorCourses[0];

    return {
      ...project,
      courseId: project.courseId || linkedCourse.id,
      courseCode: project.courseCode || linkedCourse.code || "",
      courseName: project.courseName || linkedCourse.name || "Bachelor Project",
      course: project.course || `${linkedCourse.code || ""} - ${linkedCourse.name || "Bachelor Project"}`.trim(),
      type: project.type || "bachelor",
      instructorIds:
        project.instructorIds?.length
          ? project.instructorIds
          : linkedCourse.instructorIds || [],
    };
  });

  const projectIdsByCourse = updatedProjects.reduce((map, project) => {
    if (!project.courseId) return map;

    const courseId = String(project.courseId);

    if (!map.has(courseId)) {
      map.set(courseId, new Set());
    }

    map.get(courseId).add(project.id);

    return map;
  }, new Map());

  const updatedCourses = courses.map((course) => {
    const projectIds = projectIdsByCourse.get(String(course.id));

    return {
      ...course,
      linkedProjectIds: Array.from(
        new Set([
          ...(course.linkedProjectIds || []),
          ...(projectIds ? Array.from(projectIds) : []),
        ])
      ),
    };
  });

  return {
    ...db,
    courses: updatedCourses,
    projects: updatedProjects,
  };
}
function freshDb() {
  const existingUsers = demoSeed.users || [];
  const existingInternships = demoSeed.internships || [];
  const existingProjects = demoSeed.projects || [];

  const existingUserIds = new Set(existingUsers.map((user) => String(user.id)));
  const existingInternshipIds = new Set(
    existingInternships.map((internship) => String(internship.id))
  );
  const existingProjectIds = new Set(
    existingProjects.map((project) => String(project.id))
  );

  const allProjects = [
    ...existingProjects,
    ...extraPortfolioProjects50.filter(
      (project) => !existingProjectIds.has(String(project.id))
    ),
  ];
  const projectIdsByCourse = allProjects.reduce((map, project) => {
    if (!project.courseId) return map;
    const key = String(project.courseId);
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(project.id);
    return map;
  }, new Map());

  const mergedSeed = {
    ...demoSeed,

    users: [
      ...existingUsers,
      ...extraDemoEmployerUsers.filter(
        (user) => !existingUserIds.has(String(user.id))
      ),
      ...extraPortfolioProjectUsers.filter(
        (user) => !existingUserIds.has(String(user.id))
      ),
    ],

    courses: (demoSeed.courses || []).map((course) => ({
      ...course,
      linkedProjectIds: Array.from(
        new Set([
          ...(course.linkedProjectIds || []),
          ...(projectIdsByCourse.get(String(course.id)) || []),
        ])
      ),
    })),

    projects: allProjects,

    internships: [
      ...existingInternships,
      ...extraDemoInternships.filter(
        (internship) => !existingInternshipIds.has(String(internship.id))
      ),
    ],

    version: DEMO_DATA_VERSION,
  };

  return clone(ensureBachelorLinks(mergedSeed));
}
export function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();
  if (role.includes("admin")) return "admin";
  if (role.includes("instructor")) return "instructor";
  if (role.includes("employer") || role.includes("company")) return "employer";
  return "student";
}

function makeId(prefix, label) {
  const clean = String(label || "item")
    .toLowerCase()
    .replace(/@.*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  const suffix = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now();
  return `${prefix}-${clean || suffix}`;
}

export function normalizeUserForStore(user = {}) {
  const role = normalizeRole(user.role || user.accountRole || user.systemRole || user.userType);
  const email = String(user.email || "").trim().toLowerCase();
  return {
    id: user.id || makeId(role, email || user.name || user.companyName),
    isDemo: Boolean(user.isDemo),
    ...user,
    email,
    name: user.name || user.fullName || user.companyName || "New User",
    role,
    systemRole: role,
    accountRole: role,
    status: user.status || (role === "employer" ? "pending" : "active"),
    favoriteProjectIds: user.favoriteProjectIds || [],
    favoritePortfolioIds: user.favoritePortfolioIds || [],
    savedInternshipIds: user.savedInternshipIds || [],
    skills: user.skills || [],
    createdAt: user.createdAt || new Date().toISOString(),
  };
}

function getCurrentUserRaw() {
  return readSession(CURRENT_USER_KEY, null);
}

function ownsOrTouchesProject(project, userId) {
  if (!userId) return false;
  return project.ownerId === userId || project.collaboratorIds?.includes(userId) || project.instructorIds?.includes(userId);
}

function internshipVisibleForUser(internship, user) {
  if (!user?.id) return false;
  if (user.role === "employer") return internship.employerId === user.id;
  if (user.role === "student") return (internship.applications || []).some((app) => app.studentId === user.id);
  return false;
}

function syncCompatibilityKeys(db, explicitUser = getCurrentUserRaw()) {
  if (typeof window === "undefined") return;
  const user = explicitUser ? normalizeUserForStore(explicitUser) : null;

  // These are compatibility outputs only. They are regenerated from the single database.
  const projects = user ? (db.projects || []).filter((project) => ownsOrTouchesProject(project, user.id)).map(hydrateProjectFromDb(db)) : [];
  const internships = user ? (db.internships || []).filter((item) => internshipVisibleForUser(item, user)).map(hydrateInternshipFromDb(db)) : [];

  writeLocal(PROJECTS_STORAGE_KEY, projects);
  writeLocal(INTERNSHIPS_STORAGE_KEY, internships);
  writeSession(LEGACY_USERS_KEY, (db.users || []).filter((item) => !item.isDemo));

  const savedIds = user?.savedInternshipIds || [];
  const appliedIds = user?.role === "student" ? getApplicationsForStudentFromDb(db, user.id).map((item) => item.internshipId) : [];
  writeLocal(SAVED_INTERNSHIPS_KEY, savedIds);
  writeLocal(APPLIED_INTERNSHIPS_KEY, appliedIds);
}

export function initializeDemoStore({ force = false } = {}) {
  if (typeof window === "undefined") return freshDb();

  if (force) {
    const reset = freshDb();

    writeLocal(DB_KEY, reset);
    localStorage.setItem(CHAT_RESET_KEY, CHAT_RESET_VERSION);
    sessionStorage.removeItem(CURRENT_USER_KEY);

    syncCompatibilityKeys(reset, null);
    dispatchStoreChange();
    dispatchUserChange();

    return reset;
  }

  const stored = readLocal(DB_KEY, null);

  if (stored?.version === DEMO_DATA_VERSION && Array.isArray(stored.users)) {
    const alreadyResetChats =
      localStorage.getItem(CHAT_RESET_KEY) === CHAT_RESET_VERSION;

    if (!alreadyResetChats) {
      const seedDb = freshDb();

      const updatedDb = ensureBachelorLinks({
        ...stored,

        // Reset chat-related demo state back to seed.
        // This removes old test messages and old message notifications.
        // It keeps users/projects/internships/applications untouched.
        chats: seedDb.chats || [],
        notifications: seedDb.notifications || [],
      });

      writeLocal(DB_KEY, updatedDb);
      localStorage.setItem(CHAT_RESET_KEY, CHAT_RESET_VERSION);

      syncCompatibilityKeys(updatedDb);
      dispatchStoreChange();

      return updatedDb;
    }

    const migratedStored = ensureBachelorLinks(stored);
    if (JSON.stringify(migratedStored) !== JSON.stringify(stored)) writeLocal(DB_KEY, migratedStored);
    syncCompatibilityKeys(migratedStored);
    return migratedStored;
  }

  const next = freshDb();

  writeLocal(DB_KEY, next);
  localStorage.setItem(CHAT_RESET_KEY, CHAT_RESET_VERSION);

  syncCompatibilityKeys(next);
  dispatchStoreChange();

  return next;
}

export function getDemoDb() {
  return initializeDemoStore();
}

export function setDemoDb(nextDb) {
  const normalized = ensureBachelorLinks({ ...nextDb, version: DEMO_DATA_VERSION });
  writeLocal(DB_KEY, normalized);
  syncCompatibilityKeys(normalized);
  dispatchStoreChange();
  return normalized;
}

export function resetDemoDb() {
  return initializeDemoStore({ force: true });
}

export function getCollection(name) {
  return getDemoDb()[name] || [];
}

export function setCollection(name, value) {
  const db = getDemoDb();
  return setDemoDb({ ...db, [name]: value });
}

export function upsertRecord(collectionName, record) {
  const db = getDemoDb();
  const collection = db[collectionName] || [];
  const exists = collection.some((item) => item.id === record.id);
  const nextCollection = exists
    ? collection.map((item) => (item.id === record.id ? { ...item, ...record } : item))
    : [record, ...collection];
  setDemoDb({ ...db, [collectionName]: nextCollection });
  return record;
}

export function removeRecord(collectionName, id) {
  const db = getDemoDb();
  setDemoDb({ ...db, [collectionName]: (db[collectionName] || []).filter((item) => item.id !== id) });
}

export function getCurrentUser() {
  const sessionUser = getCurrentUserRaw();
  if (!sessionUser?.id) return null;
  return getUserById(sessionUser.id) || sessionUser;
}

export function setCurrentUser(user) {
  const normalized = normalizeUserForStore(user);
  writeSession(CURRENT_USER_KEY, normalized);
  syncCompatibilityKeys(getDemoDb(), normalized);
  dispatchUserChange();
  return normalized;
}
export function getEmployerDashboardSnapshot(employerId = getCurrentUser()?.id) {
  const db = getDemoDb();
  const users = db.users || [];
  const employer =
    users.find((user) => String(user.id) === String(employerId)) ||
    getCurrentUser() ||
    null;

  const id = employer?.id || employerId;

  const internships = (db.internships || [])
    .filter((internship) => String(internship.employerId) === String(id))
    .map(hydrateInternshipFromDb(db))
    .map((internship) => ({
      ...internship,
      applications: (internship.applications || []).map((application) => ({
        ...application,
        student:
          users.find((user) => String(user.id) === String(application.studentId)) ||
          null,
      })),
    }));

  const applications = internships.flatMap((internship) =>
    (internship.applications || []).map((application) => ({
      ...application,
      internshipId: internship.id,
      internshipTitle: internship.title,
    }))
  );

  const acceptedLike = new Set([
    "accepted",
    "hired",
    "completed",
    "interned",
    "offer accepted",
  ]);

  const acceptedApplications = applications.filter((application) =>
    acceptedLike.has(String(application.status || "").trim().toLowerCase())
  );

  const filledInternships = internships.filter((internship) => {
    const status = String(internship.status || "").toLowerCase();
    return (
      Boolean(internship.isFilled) ||
      status.includes("filled") ||
      status.includes("completed") ||
      status.includes("closed")
    );
  });

  const acceptedStudentIds = new Set(
    acceptedApplications.map((application) => application.studentId).filter(Boolean)
  );

  const studentsInterned = Math.max(
    acceptedStudentIds.size,
    filledInternships.length
  );

  return {
    employer,
    internships,
    applications,
    acceptedApplications,
    filledInternships,
    stats: {
      internshipsOffered: internships.length,
      activeInternships: internships.filter((internship) => {
        const status = String(internship.status || "").toLowerCase();
        return (
          !internship.archived &&
          !internship.isArchived &&
          !status.includes("filled") &&
          !status.includes("closed")
        );
      }).length,
      totalApplicants:
        applications.length ||
        internships.reduce(
          (sum, internship) => sum + Number(internship.applicants || 0),
          0
        ),
      studentsInterned,
    },
    notifications: (db.notifications || []).filter(
      (notification) => String(notification.userId) === String(id)
    ),
  };
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CURRENT_USER_KEY);
  writeLocal(PROJECTS_STORAGE_KEY, []);
  writeLocal(INTERNSHIPS_STORAGE_KEY, []);
  writeLocal(APPLIED_INTERNSHIPS_KEY, []);
  writeLocal(SAVED_INTERNSHIPS_KEY, []);
  dispatchUserChange();
}

export function findUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return getCollection("users").find((user) => user.email?.toLowerCase() === normalized) || null;
}

export function findUserByCredentials(email, password) {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : null;
}

export function registerUser(formUser) {
  const email = String(formUser.email || "").trim().toLowerCase();
  if (!email) throw new Error("Email is required.");
  if (findUserByEmail(email)) throw new Error("An account with this email already exists.");

  const created = normalizeUserForStore({
    ...formUser,
    id: formUser.id || makeId(normalizeRole(formUser.role), email),
    isDemo: false,
    email,
    image: formUser.image || null,
    avatar: formUser.avatar || "",
    bio: formUser.bio || "Passionate about building impactful digital solutions.",
    favoriteProjectIds: [],
    favoritePortfolioIds: [],
    savedInternshipIds: [],
  });

  upsertRecord("users", created);

  // upsertRecord -> setDemoDb -> ensureBachelorLinks writes the automatic
  // Bachelor Project link into BOTH places:
  // 1) created instructor.linkedCourseIds
  // 2) Bachelor Project course.instructorIds
  // Return the saved DB version, not the pre-save object, so sessionStorage/users
  // also carries the automatic Bachelor Project link immediately after register.
  const saved = getUserById(created.id) || created;
  writeSession(LEGACY_USERS_KEY, getRegisteredUsers());
  return saved;
}

export function getRegisteredUsers() {
  return getCollection("users").filter((user) => !user.isDemo);
}

export function getUserById(userId) {
  return getCollection("users").find((user) => user.id === userId) || null;
}

export function updateUser(userId, updates = {}) {
  const existing = getUserById(userId);
  if (!existing) return null;
  const updated = normalizeUserForStore({ ...existing, ...updates, id: userId, updatedAt: new Date().toISOString() });
  upsertRecord("users", updated);
  if (getCurrentUserRaw()?.id === userId) setCurrentUser(updated);
  return updated;
}

export function updateUserPasswordByEmail(email, password) {
  const user = findUserByEmail(email);
  if (!user) return null;
  return updateUser(user.id, { password });
}

export function deactivateCurrentUser() {
  const current = getCurrentUser();
  if (!current?.id) return null;
  const updated = updateUser(current.id, { status: "inactive", deactivatedAt: new Date().toISOString() });
  clearCurrentUser();
  return updated;
}

export function getCourseById(courseId) {
  return getCollection("courses").find((course) => course.id === courseId) || null;
}



function getBachelorCourse(db = getDemoDb()) {
  return (db.courses || []).find((course) =>
    String(course.type || "").toLowerCase() === "bachelor project" ||
    String(course.name || "").toLowerCase() === "bachelor project" ||
    String(course.id || "") === "course-bachelor"
  ) || null;
}

function getAdminUsersFromDb(db) {
  return (db.users || []).filter((user) => normalizeRole(user.role || user.systemRole || user.accountRole) === "admin");
}

function isBachelorCourse(course) {
  return Boolean(course) && (
    String(course.type || "").toLowerCase() === "bachelor project" ||
    String(course.name || "").toLowerCase() === "bachelor project" ||
    String(course.id || "") === "course-bachelor"
  );
}

function formatCourseLabel(course) {
  if (!course) return "Unknown course";
  return [course.code, course.name].filter(Boolean).join(" - ") || course.name || course.code || "Course";
}

function normalizeRequestAction(value) {
  const action = String(value || "link").toLowerCase();
  return action.includes("unlink") ? "unlink" : "link";
}

function hydrateLinkRequest(request, db = getDemoDb()) {
  const instructor = (db.users || []).find((user) => String(user.id) === String(request.instructorId || request.requestedById)) || null;
  const course = (db.courses || []).find((item) => String(item.id) === String(request.courseId)) || null;
  const action = normalizeRequestAction(request.action || request.type);

  return {
    ...request,
    action,
    type: action,
    instructorId: request.instructorId || request.requestedById,
    instructor: request.instructor || instructor?.name || "Unknown instructor",
    email: request.email || instructor?.email || "",
    courseId: request.courseId || course?.id,
    course: request.course || formatCourseLabel(course),
    requestedCourseCode: request.requestedCourseCode || course?.code || "",
    requestedCourseName: request.requestedCourseName || course?.name || "",
    reason: request.reason || (action === "unlink" ? "Requested to be unlinked from this course." : "Requested to be linked to this course."),
    status: request.status || "pending",
    submittedAt: request.submittedAt || request.createdAt || new Date().toISOString(),
    createdAt: request.createdAt || request.submittedAt || new Date().toISOString(),
  };
}

export function getLinkedCourseIdsForInstructor(instructorId = getCurrentUser()?.id) {
  if (!instructorId) return [];
  const db = getDemoDb();
  const instructor = (db.users || []).find((user) => String(user.id) === String(instructorId));
  const ids = new Set(instructor?.linkedCourseIds || []);

  (db.courses || []).forEach((course) => {
    if ((course.instructorIds || []).some((id) => String(id) === String(instructorId))) ids.add(course.id);
  });

  const bachelor = getBachelorCourse(db);
  if (bachelor?.id) ids.add(bachelor.id);

  return [...ids];
}

export function getAllCoursesForInstructorView() {
  const db = getDemoDb();
  const currentUser = getCurrentUser();
  const instructorId = currentUser?.id;
  const linkedCourseIds = new Set(getLinkedCourseIdsForInstructor(instructorId));
  const pendingRequests = (db.linkRequests || [])
    .filter((request) => String(request.instructorId || request.requestedById) === String(instructorId) && request.status === "pending")
    .map((request) => hydrateLinkRequest(request, db));

  return (db.courses || [])
    .filter((course) => course.status !== "inactive")
    .map((course) => {
      const pendingRequest = pendingRequests.find((request) => String(request.courseId) === String(course.id));
      const linked = linkedCourseIds.has(course.id) || isBachelorCourse(course);

      return {
        ...course,
        linked,
        isBachelorProject: isBachelorCourse(course),
        instructorNames: (course.instructorIds || []).map((id) => (db.users || []).find((user) => user.id === id)?.name).filter(Boolean),
        instructor: (course.instructorIds || []).map((id) => (db.users || []).find((user) => user.id === id)?.name).filter(Boolean).join(", ") || "Unassigned",
        linkedProjects: course.linkedProjectIds?.length || 0,
        pendingRequest,
        requestStatus: pendingRequest?.status || null,
        requestAction: pendingRequest?.action || null,
      };
    });
}

export function getLinkedCoursesForInstructor(instructorId = getCurrentUser()?.id) {
  const linkedIds = new Set(getLinkedCourseIdsForInstructor(instructorId));
  return getAllCoursesForInstructorView().filter((course) => linkedIds.has(course.id) || course.isBachelorProject);
}

export function requestCourseLinkChange(courseId, action = "link", reason = "") {
  const db = getDemoDb();
  const instructor = getCurrentUser();
  const course = (db.courses || []).find((item) => String(item.id) === String(courseId));

  if (!instructor?.id || normalizeRole(instructor.role || instructor.systemRole || instructor.accountRole) !== "instructor") {
    throw new Error("Only course instructors can request course links.");
  }

  if (!course) throw new Error("Course not found.");
  if (isBachelorCourse(course)) throw new Error("Bachelor Project is linked automatically for every course instructor.");

  const normalizedAction = normalizeRequestAction(action);
  const alreadyPending = (db.linkRequests || []).find((request) =>
    String(request.instructorId || request.requestedById) === String(instructor.id) &&
    String(request.courseId) === String(course.id) &&
    request.status === "pending"
  );

  if (alreadyPending) return hydrateLinkRequest(alreadyPending, db);

  const now = new Date();
  const request = {
    id: `link-request-${course.id}-${instructor.id}-${Date.now()}`,
    instructorId: instructor.id,
    courseId: course.id,
    action: normalizedAction,
    type: normalizedAction,
    status: "pending",
    reason: reason?.trim() || (normalizedAction === "unlink" ? "I am no longer teaching this course." : "I am teaching this course and need access."),
    createdAt: now.toISOString(),
    submittedAt: now.toISOString(),
  };

  const adminNotifications = getAdminUsersFromDb(db).map((admin) => ({
    id: `notif-link-request-${admin.id}-${request.id}`,
    userId: admin.id,
    type: "link-request",
    title: normalizedAction === "unlink" ? "Course unlink request" : "Course link request",
    text: `${instructor.name || "An instructor"} requested to ${normalizedAction === "unlink" ? "unlink from" : "link to"} ${formatCourseLabel(course)}.`,
    unread: true,
    createdAt: now.toISOString(),
    time: now.toLocaleString(),
    relatedUserId: instructor.id,
    relatedCourseId: course.id,
    linkRequestId: request.id,
  }));

  setDemoDb({
    ...db,
    linkRequests: [request, ...(db.linkRequests || [])],
    notifications: [...(db.notifications || []), ...adminNotifications],
  });

  return hydrateLinkRequest(request, { ...db, linkRequests: [request, ...(db.linkRequests || [])] });
}

export function setCourseLinkRequestStatus(requestId, status, note = "") {
  const db = getDemoDb();
  const request = (db.linkRequests || []).find((item) => String(item.id) === String(requestId));
  if (!request) return null;

  const normalizedStatus = String(status || "").toLowerCase();
  const action = normalizeRequestAction(request.action || request.type);
  const instructorId = request.instructorId || request.requestedById;
  const courseId = request.courseId;
  const course = (db.courses || []).find((item) => String(item.id) === String(courseId));
  const instructor = (db.users || []).find((user) => String(user.id) === String(instructorId));
  const now = new Date();

  const nextRequests = (db.linkRequests || []).map((item) =>
    String(item.id) === String(requestId)
      ? { ...item, status: normalizedStatus, decisionNote: note, reviewedAt: now.toISOString() }
      : item
  );

  let nextCourses = db.courses || [];
  let nextUsers = db.users || [];

  if (normalizedStatus === "approved" && course && instructor) {
    nextCourses = nextCourses.map((item) => {
      if (String(item.id) !== String(courseId)) return item;
      const ids = new Set(item.instructorIds || []);
      action === "unlink" ? ids.delete(instructorId) : ids.add(instructorId);
      return { ...item, instructorIds: [...ids] };
    });

    nextUsers = nextUsers.map((user) => {
      if (String(user.id) !== String(instructorId)) return user;
      const ids = new Set(user.linkedCourseIds || []);
      action === "unlink" ? ids.delete(courseId) : ids.add(courseId);
      const bachelor = getBachelorCourse(db);
      if (bachelor?.id) ids.add(bachelor.id);
      return { ...user, linkedCourseIds: [...ids] };
    });
  }

  const instructorNotification = instructor ? [{
    id: `notif-link-decision-${instructor.id}-${requestId}-${Date.now()}`,
    userId: instructor.id,
    type: "link-request",
    title: normalizedStatus === "approved" ? "Course request approved" : "Course request rejected",
    text: `Your request to ${action === "unlink" ? "unlink from" : "link to"} ${formatCourseLabel(course)} was ${normalizedStatus}.${note ? ` Note: ${note}` : ""}`,
    unread: true,
    createdAt: now.toISOString(),
    time: now.toLocaleString(),
    relatedCourseId: courseId,
    linkRequestId: requestId,
  }] : [];

  setDemoDb({
    ...db,
    users: nextUsers,
    courses: nextCourses,
    linkRequests: nextRequests,
    notifications: [...(db.notifications || []), ...instructorNotification],
  });

  return hydrateLinkRequest({ ...request, status: normalizedStatus, decisionNote: note, reviewedAt: now.toISOString() }, { ...db, users: nextUsers, courses: nextCourses });
}

export function getCourseForProjectInput(input = {}) {
  return getCollection("courses").find((course) =>
    course.id === input.courseId ||
    course.code === input.courseCode ||
    course.name === input.courseName ||
    `${course.code} - ${course.name}` === input.courseName ||
    `${course.code} - ${course.name}` === input.course
  ) || null;
}

function displayDate(value) {
  if (!value) return "Unknown";
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
}

function hydrateProjectFromDb(db) {
  return (project) => {
    const owner = (db.users || []).find((user) => user.id === project.ownerId) || null;
    const course = (db.courses || []).find((item) => item.id === project.courseId) || null;
    const collaborators = (project.collaboratorIds || []).map((id) => (db.users || []).find((user) => user.id === id)).filter(Boolean);
    const instructors = (project.instructorIds || []).map((id) => (db.users || []).find((user) => user.id === id)).filter(Boolean);
    const currentUser = getCurrentUserRaw();
    const tags = project.tags?.length ? project.tags : project.technologies?.length ? project.technologies : project.languages || [];
    return {
      ...project,
      owner,
      student: owner,
      courseRecord: course,
      course: course?.code ? `${course.code} - ${course.name}` : project.courseName || project.courseCode || "Unlinked course",
      courseName: course?.name || project.courseName || "Unlinked course",
      courseCode: course?.code || project.courseCode || "",
      program: course?.type === "Bachelor Project" ? "Bachelor Project" : course?.name || project.courseName || "Course Project",
      collaborators,
      collaboratorNames: collaborators.map((item) => item.name),
      instructors,
      instructor: instructors.map((item) => item.name).join(", ") || "Unassigned",
      instructorNames: instructors.map((item) => item.name),
      students: 1 + collaborators.length,
      date: displayDate(project.createdAt),
      favorite: Boolean(currentUser?.favoriteProjectIds?.includes(project.id)),
      image: project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      tags,
      languages: project.languages?.length ? project.languages : tags,
      technologies: project.technologies?.length ? project.technologies : tags,
      demo: project.demoUrl || project.demo || "",
    };
  };
}

export function hydrateProject(project) {
  return hydrateProjectFromDb(getDemoDb())(project);
}

export function getAllProjects({ includePrivate = false } = {}) {
  const db = getDemoDb();
  const currentUser = getCurrentUserRaw();
  return (db.projects || [])
    .filter((project) => includePrivate || project.visibility === "public" || project.visibility === "Public" || ownsOrTouchesProject(project, currentUser?.id))
    .map(hydrateProjectFromDb(db));
}

export function getPublicProjects() {
  return getAllProjects({ includePrivate: false });
}

export function getProjectById(projectId) {
  const project = getCollection("projects").find((item) => String(item.id) === String(projectId));
  return project ? hydrateProject(project) : null;
}

export function getProjectsForUser(userId, { includePrivate = true } = {}) {
  const db = getDemoDb();
  return (db.projects || [])
    .filter((project) => ownsOrTouchesProject(project, userId))
    .filter((project) => includePrivate || project.visibility === "public" || project.visibility === "Public")
    .map(hydrateProjectFromDb(db));
}

export function getOwnedProjectsForUser(userId, options) {
  const db = getDemoDb();
  return (db.projects || [])
    .filter((project) => project.ownerId === userId)
    .filter((project) => options?.includePrivate !== false || project.visibility === "public" || project.visibility === "Public")
    .map(hydrateProjectFromDb(db));
}

export function normalizeProjectInput(input = {}, owner = getCurrentUser()) {
  const course = getCourseForProjectInput(input);
  const visibility = input.visibility === true ? "public" : input.visibility === false ? "private" : String(input.visibility || "private").toLowerCase();
  const tags = input.tags || input.technologies || input.languages || [];
  return {
    id: input.id || makeId("project", input.title),
    isDemo: Boolean(input.isDemo),
    ownerId: input.ownerId || owner?.id,
    collaboratorIds: input.collaboratorIds || [],
    instructorIds: input.instructorIds || course?.instructorIds || [],
    courseId: input.courseId || course?.id || "",
    courseCode: input.courseCode || course?.code || "",
    courseName: input.courseName || course?.name || input.course || "Unlinked Course",
    title: input.title || "Untitled Project",
    type: input.type || (course?.type === "Bachelor Project" ? "bachelor" : "course"),
    description: input.description || "",
    visibility,
    status: input.status || "draft",
    rating: input.rating || 0,
    tags,
    languages: input.languages || tags,
    technologies: input.technologies || tags,
    github: input.github || "",
    demoUrl: input.demoUrl || input.demo || "",
    image: input.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
}

export function createProject(projectInput) {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("You must be logged in to create a project.");
  const project = normalizeProjectInput({ ...projectInput, isDemo: false }, currentUser);
  upsertRecord("projects", project);
  return hydrateProject(project);
}

export function updateProject(projectId, updates) {
  const db = getDemoDb();
  const existing = (db.projects || []).find((project) => String(project.id) === String(projectId));
  if (!existing) return null;
  const updated = normalizeProjectInput({ ...existing, ...updates, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }, getCurrentUser());
  setDemoDb({ ...db, projects: db.projects.map((project) => (project.id === existing.id ? updated : project)) });
  return hydrateProject(updated);
}

export function deleteProject(projectId) {
  removeRecord("projects", projectId);
}

export function toggleFavoriteProject(projectId, userId = getCurrentUser()?.id) {
  const user = getUserById(userId);
  if (!user) return null;
  const ids = new Set(user.favoriteProjectIds || []);
  ids.has(projectId) ? ids.delete(projectId) : ids.add(projectId);
  const updated = { ...user, favoriteProjectIds: [...ids] };
  upsertRecord("users", updated);
  if (getCurrentUserRaw()?.id === userId) setCurrentUser(updated);
  return updated;
}

export function getPortfolioForUser(userId) {
  const user = getUserById(userId);
  if (!user || user.role !== "student") return null;
  const projects = getOwnedProjectsForUser(userId, { includePrivate: false });
  const currentUser = getCurrentUserRaw();
  return {
    id: user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    major: user.major || user.faculty || "Media Engineering and Technology",
    level: user.level || (user.semester ? `Semester ${user.semester}` : "Student"),
    bio: user.bio || "Student portfolio.",
    skills: user.skills || [],
    links: user.links || {},
    image: user.avatar || user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    projects: projects.length,
    projectCount: projects.length,
    projectItems: projects,
    favorite: Boolean(currentUser?.favoritePortfolioIds?.includes(user.id)),
  };
}

export function getAllPortfolios() {
  return getCollection("users").filter((user) => user.role === "student").map((user) => getPortfolioForUser(user.id)).filter(Boolean);
}

export function toggleFavoritePortfolio(userId, currentUserId = getCurrentUser()?.id) {
  const user = getUserById(currentUserId);
  if (!user) return null;
  const ids = new Set(user.favoritePortfolioIds || []);
  ids.has(userId) ? ids.delete(userId) : ids.add(userId);
  const updated = { ...user, favoritePortfolioIds: [...ids] };
  upsertRecord("users", updated);
  setCurrentUser(updated);
  return updated;
}

export function getAllInstructors() {
  const db = getDemoDb();
  return (db.users || []).filter((user) => user.role === "instructor").map((instructor) => {
    const courses = (db.courses || []).filter((course) => course.instructorIds?.includes(instructor.id));
    return {
      ...instructor,
      role: instructor.title || "Course Instructor",
      department: instructor.department || "Computer Science",
      office: instructor.office || "C7",
      image: instructor.avatar || instructor.image || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
      courses: courses.map((course) => `${course.code} - ${course.name}`),
      courseRecords: courses,
      projects: getProjectsForUser(instructor.id, { includePrivate: false }),
    };
  });
}

function hydrateInternshipFromDb(db) {
  return (internship) => {
    const employer = (db.users || []).find((user) => user.id === internship.employerId) || null;
    return {
      ...internship,
      employer,
      company: internship.company || internship.companyName || employer?.companyName || employer?.name || "Company",
      companyName: internship.companyName || internship.company || employer?.companyName || employer?.name || "Company",
      applicants: internship.applicants ?? (internship.applications || []).length,
      reviews: internship.reviews ?? Math.max(18, (internship.applications || []).length * 8),
      rating: internship.rating || employer?.rating || 4.5,
      status: internship.status || "Active",
      featured: Boolean(internship.featured),
      skills: internship.skills || [],
      postedAt: internship.postedAt || "Posted recently",
    };
  };
}

export function hydrateInternship(internship) {
  return hydrateInternshipFromDb(getDemoDb())(internship);
}

export function getInternships() {
  const db = getDemoDb();
  return (db.internships || []).map(hydrateInternshipFromDb(db));
}

export function getInternshipById(internshipId) {
  const raw = getCollection("internships").find((item) => String(item.id) === String(internshipId));
  return raw ? hydrateInternship(raw) : null;
}

export function getInternshipsForEmployer(employerId = getCurrentUser()?.id) {
  return getInternships().filter((item) => item.employerId === employerId);
}

function getApplicationsForStudentFromDb(db, studentId) {
  return (db.internships || []).flatMap((internship) =>
    (internship.applications || [])
      .filter((application) => application.studentId === studentId)
      .map((application) => ({
        ...application,
        internshipId: internship.id,
        title: internship.title,
        company: internship.companyName || internship.company,
        location: internship.location,
        duration: internship.duration,
        dateApplied: application.appliedAt,
        displayDate: application.displayDate || displayDate(application.appliedAt),
        status: application.status === "accepted" ? "Accepted" : application.status === "rejected" ? "Rejected" : "Pending",
      }))
  );
}

export function getApplicationsForStudent(studentId = getCurrentUser()?.id) {
  return getApplicationsForStudentFromDb(getDemoDb(), studentId);
}

export function applyToInternship(internshipId, coverLetter = "", studentId = getCurrentUser()?.id) {
  if (!studentId) return null;
  const db = getDemoDb();
  let createdApplication = null;
  const nextInternships = db.internships.map((internship) => {
    if (internship.id !== internshipId) return internship;
    const apps = (internship.applications || []).filter((app) => app.studentId !== studentId);
    createdApplication = {
      id: makeId("application", `${internshipId}-${studentId}`),
      internshipId,
      studentId,
      status: "pending",
      coverLetter,
      appliedAt: new Date().toISOString().slice(0, 10),
    };
    return {
      ...internship,
      applications: [...apps, createdApplication],
    };
  });
  setDemoDb({ ...db, internships: nextInternships });
  const letters = readLocal(COVER_LETTERS_KEY, {});
  writeLocal(COVER_LETTERS_KEY, { ...letters, [internshipId]: coverLetter });
  return createdApplication;
}

export function setApplicantStatus(internshipId, studentId, status) {
  const db = getDemoDb();
  setDemoDb({
    ...db,
    internships: db.internships.map((internship) => internship.id !== internshipId ? internship : {
      ...internship,
      applications: (internship.applications || []).map((app) => app.studentId === studentId ? { ...app, status } : app),
    }),
  });
}

export function toggleSavedInternship(internshipId, userId = getCurrentUser()?.id) {
  const user = getUserById(userId);
  if (!user) return null;
  const ids = new Set(user.savedInternshipIds || []);
  ids.has(internshipId) ? ids.delete(internshipId) : ids.add(internshipId);
  const updated = { ...user, savedInternshipIds: [...ids] };
  upsertRecord("users", updated);
  if (getCurrentUserRaw()?.id === userId) setCurrentUser(updated);
  return updated;
}

export function createInternship(input = {}) {
  const employer = getCurrentUser();
  if (!employer || employer.role !== "employer") throw new Error("You must be logged in as an employer.");
  const internship = {
    id: input.id || makeId("internship", input.title),
    isDemo: false,
    employerId: input.employerId || employer.id,
    companyName: input.companyName || employer.companyName || employer.name,
    company: input.company || input.companyName || employer.companyName || employer.name,
    title: input.title || "Untitled Internship",
    department: input.department || "Engineering",
    location: input.location || employer.location || "Cairo, Egypt",
    duration: input.duration || "3 months",
    workMode: input.workMode || "Hybrid",
    deadline: input.deadline || new Date().toISOString().slice(0, 10),
    startDate: input.startDate || "",
    stipend: input.stipend || "Undisclosed",
    skills: input.skills || [],
    overview: input.overview || input.description || "",
    responsibilities: input.responsibilities || [],
    requirements: input.requirements || [],
    benefits: input.benefits || [],
    eligibility: input.eligibility || [],
    status: input.status || "Active",
    featured: Boolean(input.featured),
    applications: input.applications || [],
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
  upsertRecord("internships", internship);
  return hydrateInternship(internship);
}

export function updateInternship(internshipId, updates) {
  const db = getDemoDb();
  const existing = db.internships.find((item) => String(item.id) === String(internshipId));
  if (!existing) return null;
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  setDemoDb({ ...db, internships: db.internships.map((item) => item.id === existing.id ? updated : item) });
  return hydrateInternship(updated);
}

export function deleteInternship(internshipId) {
  removeRecord("internships", internshipId);
}

export function getNotificationsForUser(userId = getCurrentUser()?.id) {
  if (!userId) return [];

  const all = getCollection("notifications");

  return all.filter(
    (notification) => String(notification.userId) === String(userId)
  );
}

export function markNotification(notificationId, unread) {
  setCollection("notifications", getCollection("notifications").map((item) => item.id === notificationId ? { ...item, unread } : item));
}

export function addNotification(notification) {
  const current = getCurrentUser();
  const item = { id: notification.id || makeId("notification", notification.title), userId: notification.userId || current?.id, unread: true, time: notification.time || new Date().toLocaleString(), ...notification };
  upsertRecord("notifications", item);
  return item;
}

//chats
//chats
export const CHAT_STORE_EVENT = "demo-chats-updated";

function notifyChatsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHAT_STORE_EVENT));
  }
}

function makeChatMessageId(chatId) {
  const randomPart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `msg-${String(chatId)}-${Date.now()}-${randomPart}`;
}

function getInitials(name) {
  return (
    String(name || "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

export function getChatDisplayMeta(chat, userId = getCurrentUser()?.id) {
  if (!chat) {
    return {
      name: "Unknown user",
      avatar: "?",
      image: "",
      online: false,
    };
  }

  const otherParticipantId = (chat.participantIds || []).find(
    (participantId) => String(participantId) !== String(userId)
  );

  const otherUser = getUserById(otherParticipantId);

  const displayName =
  otherUser?.name ||
  otherUser?.fullName ||
  otherUser?.displayName ||
  otherUser?.companyName ||
  chat.name ||
  "Unknown user";

  return {
    id: otherParticipantId,
    name: displayName,
    avatar: otherUser?.avatar || getInitials(displayName),
    image: otherUser?.image || otherUser?.profileImage || "",
    online: Boolean(chat.online),
  };
}

export function getChatsForCurrentUser(userId = getCurrentUser()?.id) {
  if (!userId) return [];

  return getCollection("chats").filter((chat) =>
    (chat.participantIds || []).some(
      (participantId) => String(participantId) === String(userId)
    )
  );
}


export function getExistingDirectChat(targetUserId, currentUserId = getCurrentUser()?.id) {
  if (!targetUserId || !currentUserId) return null;
  if (String(targetUserId) === String(currentUserId)) return null;

  const chats = getDemoDb().chats || [];

  return (
    chats.find((chat) => {
      const participantIds = (chat.participantIds || []).map(String);

      return (
        participantIds.length === 2 &&
        participantIds.includes(String(currentUserId)) &&
        participantIds.includes(String(targetUserId))
      );
    }) || null
  );
}

export function getOrCreateDirectChat(targetUserId, currentUserId = getCurrentUser()?.id) {
  if (!targetUserId || !currentUserId) return null;
  if (String(targetUserId) === String(currentUserId)) return null;

  const existingChat = getExistingDirectChat(targetUserId, currentUserId);
  if (existingChat) return existingChat;

  const db = getDemoDb();
  const chats = db.chats || [];

  const targetUser = getUserById(targetUserId);
  const currentUser = getUserById(currentUserId);

  if (!targetUser || !currentUser) return null;

  const sortedIds = [String(currentUserId), String(targetUserId)].sort();
  const now = new Date();

  const targetName =
    targetUser.name ||
    targetUser.fullName ||
    targetUser.displayName ||
    targetUser.companyName ||
    "New conversation";

  const newChat = {
    id: `chat-${sortedIds.join("-")}`,
    isDemo: false,
    participantIds: [currentUserId, targetUserId],
    name: targetName,
    avatar: targetUser.avatar || getInitials(targetName),
    online: false,
    unread: 0,
    unreadBy: [],
    messages: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  setDemoDb({
    ...db,
    chats: [newChat, ...chats],
  });

  notifyChatsChanged();

  return newChat;
}

export function setChatsForCurrentUser(chats, userId = getCurrentUser()?.id) {
  if (!userId) return;

  const db = getDemoDb();

  const incoming = chats.filter((chat) =>
    (chat.participantIds || []).some(
      (participantId) => String(participantId) === String(userId)
    )
  );

  const incomingIds = new Set(incoming.map((chat) => String(chat.id)));

  const untouched = (db.chats || []).filter(
    (chat) => !incomingIds.has(String(chat.id))
  );

  setDemoDb({
    ...db,
    chats: [...incoming, ...untouched],
  });

  notifyChatsChanged();
}

export function getUnreadChatCountForCurrentUser(userId = getCurrentUser()?.id) {
  if (!userId) return 0;

  return getChatsForCurrentUser(userId).filter((chat) =>
    (chat.unreadBy || []).some(
      (readerId) => String(readerId) === String(userId)
    )
  ).length;
}

export function markChatAsRead(chatId, userId = getCurrentUser()?.id) {
  if (!chatId || !userId) return;

  const db = getDemoDb();

  const updatedChats = (db.chats || []).map((chat) => {
    if (String(chat.id) !== String(chatId)) return chat;

    return {
      ...chat,
      unreadBy: (chat.unreadBy || []).filter(
        (readerId) => String(readerId) !== String(userId)
      ),
    };
  });

  setDemoDb({
    ...db,
    chats: updatedChats,
  });

  notifyChatsChanged();
}

export function addChatMessage(chatId, text, senderId = getCurrentUser()?.id) {
  if (!chatId || !senderId || !text?.trim()) return null;

  const db = getDemoDb();

  const targetChat = (db.chats || []).find(
    (chat) => String(chat.id) === String(chatId)
  );

  if (!targetChat) return null;

  const now = new Date();

  const message = {
    id: `msg-${String(chatId)}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    senderId,
    sender: "me",
    text: text.trim(),
    createdAt: now.toISOString(),
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const otherParticipantIds = (targetChat.participantIds || []).filter(
    (participantId) => String(participantId) !== String(senderId)
  );

  const senderUser = getUserById(senderId);

  const senderName =
  senderUser?.name ||
  senderUser?.fullName ||
  senderUser?.displayName ||
  senderUser?.companyName ||
  "Someone";

  const messagePreview =
    text.trim().length > 90 ? `${text.trim().slice(0, 90)}...` : text.trim();

  const newNotifications = otherParticipantIds.map((receiverId) => ({
    id: `notif-message-${String(chatId)}-${String(receiverId)}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    userId: receiverId,
    type: "message",
    title: `New message from ${senderName}`,
    text: messagePreview,
    unread: true,
    time: now.toLocaleString(),
    createdAt: now.toISOString(),
    chatId,
    fromUserId: senderId,
  }));

  const updatedChats = (db.chats || []).map((chat) => {
    if (String(chat.id) !== String(chatId)) return chat;

    return {
      ...chat,
      messages: [...(chat.messages || []), message],
      unreadBy: Array.from(
        new Set([
          ...(chat.unreadBy || []).filter(
            (readerId) => String(readerId) !== String(senderId)
          ),
          ...otherParticipantIds,
        ])
      ),
    };
  });

  setDemoDb({
    ...db,
    chats: updatedChats,
    notifications: [...(db.notifications || []), ...newNotifications],
  });

  notifyChatsChanged();

  return message;
}

export function addScriptedChatReply(
  chatId,
  text,
  senderId,
  { markAsUnread = false, createNotification = false } = {}
) {
  if (!chatId || !senderId || !text?.trim()) return null;

  const db = getDemoDb();

  const targetChat = (db.chats || []).find(
    (chat) => String(chat.id) === String(chatId)
  );

  if (!targetChat) return null;

  const now = new Date();

  const message = {
    id: `msg-${String(chatId)}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    senderId,
    sender: "other",
    text: text.trim(),
    createdAt: now.toISOString(),
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const otherParticipantIds = (targetChat.participantIds || []).filter(
    (participantId) => String(participantId) !== String(senderId)
  );

  const senderUser = getUserById(senderId);

  const senderName =
    senderUser?.name ||
    senderUser?.fullName ||
    senderUser?.displayName ||
    senderUser?.companyName ||
    "Someone";

  const messagePreview =
    text.trim().length > 90 ? `${text.trim().slice(0, 90)}...` : text.trim();

  const newNotifications = createNotification
    ? otherParticipantIds.map((receiverId) => ({
        id: `notif-message-${String(chatId)}-${String(receiverId)}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        userId: receiverId,
        type: "message",
        title: `New message from ${senderName}`,
        text: messagePreview,
        unread: true,
        time: now.toLocaleString(),
        createdAt: now.toISOString(),
        chatId,
        fromUserId: senderId,
      }))
    : [];

  const updatedChats = (db.chats || []).map((chat) => {
    if (String(chat.id) !== String(chatId)) return chat;

    const currentReplyIndex = chat.scriptedReplyIndex || 0;

    return {
      ...chat,
      messages: [...(chat.messages || []), message],
      scriptedReplyIndex: currentReplyIndex + 1,
      unreadBy: markAsUnread
        ? Array.from(
            new Set([
              ...(chat.unreadBy || []).filter(
                (readerId) => String(readerId) !== String(senderId)
              ),
              ...otherParticipantIds,
            ])
          )
        : chat.unreadBy || [],
    };
  });

  setDemoDb({
    ...db,
    chats: updatedChats,
    notifications: [...(db.notifications || []), ...newNotifications],
  });

  notifyChatsChanged();

  return message;
}
//chats
//chats


export function getRecommendedProjectsForUser(userId = getCurrentUser()?.id) {
  const user = getUserById(userId);
  const skills = new Set((user?.skills || []).map((skill) => String(skill).toLowerCase()));
  return getPublicProjects()
    .filter((project) => project.ownerId !== userId)
    .map((project) => ({
      ...project,
      recommendationScore: [...(project.tags || []), ...(project.languages || []), ...(project.technologies || [])].reduce((sum, tag) => sum + (skills.has(String(tag).toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore || (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);
}

export function getStudentDashboardSnapshot(userId = getCurrentUser()?.id) {
  const user = getUserById(userId);
  if (!user) return { student: null, projects: [], notifications: [], internships: [], applications: [], recommendedProjects: [] };
  return {
    student: { ...user, profileCompletion: user.isDemo ? 92 : 35, linkedin: user.links?.linkedin || user.linkedin || "" },
    projects: getOwnedProjectsForUser(user.id),
    notifications: getNotificationsForUser(user.id),
    internships: getInternships().filter((item) => item.applications?.some((app) => app.studentId === user.id)),
    applications: getApplicationsForStudent(user.id),
    recommendedProjects: getRecommendedProjectsForUser(user.id).map((project) => project.title),
  };
}
export function getAdminDashboardSnapshot(adminId) {
  const db = getDemoDb();

  const users = Array.isArray(db.users) ? db.users : [];
  const projects = Array.isArray(db.projects) ? db.projects : [];
  const courses = Array.isArray(db.courses) ? db.courses : [];
  const internships = Array.isArray(db.internships) ? db.internships : [];
  const notifications = Array.isArray(db.notifications) ? db.notifications : [];

  const currentUser =
    typeof getCurrentUser === "function" ? getCurrentUser() : null;

  const normalizeRoleSafe = (role) =>
    String(role || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const parseDateSafe = (value) => {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  };

  const internshipDate = (internship = {}) =>
    parseDateSafe(internship.postedAt) ||
    parseDateSafe(internship.createdAt) ||
    parseDateSafe(internship.datePosted) ||
    parseDateSafe(internship.postedDate) ||
    parseDateSafe(internship.createdOn) ||
    parseDateSafe(internship.deadline) ||
    new Date();

  const applicationDate = (application = {}, internship = {}) =>
    parseDateSafe(application.acceptedAt) ||
    parseDateSafe(application.completedAt) ||
    parseDateSafe(application.updatedAt) ||
    parseDateSafe(application.appliedAt) ||
    internshipDate(internship);

  const monthKeyFromDateSafe = (dateValue) => {
    const date = parseDateSafe(dateValue) || new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  const monthLabelFromKey = (key) => {
    const [, month] = String(key).split("-");
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return labels[Math.max(0, Number(month) - 1)] || key;
  };

  const getLastMonths = (count = 7) => {
    const today = new Date();

    return Array.from({ length: count }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - count + 1 + index, 1);
      const key = monthKeyFromDateSafe(date);

      return {
        key,
        label: monthLabelFromKey(key),
        date,
      };
    });
  };

  const isAcceptedStatus = (status) => {
    const normalized = String(status || "").trim().toLowerCase();

    return [
      "accepted",
      "hired",
      "completed",
      "complete",
      "interned",
      "offer accepted",
      "position filled",
      "filled",
    ].includes(normalized);
  };

  const getUserName = (user = {}) =>
    user.companyName ||
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown";

  const admin =
    users.find((user) => String(user.id) === String(adminId)) ||
    currentUser ||
    users.find((user) => normalizeRoleSafe(user.role) === "admin") ||
    null;

  const students = users.filter(
    (user) => normalizeRoleSafe(user.role) === "student"
  );

  const employers = users.filter(
    (user) => normalizeRoleSafe(user.role) === "employer"
  );

  const instructors = users.filter(
    (user) =>
      normalizeRoleSafe(user.role) === "instructor" ||
      normalizeRoleSafe(user.role) === "course-instructor"
  );

  const admins = users.filter(
    (user) => normalizeRoleSafe(user.role) === "admin"
  );

  const applicationsFromInternships = internships.flatMap((internship) =>
    (internship.applications || []).map((application) => ({
      ...application,
      internshipId: application.internshipId || internship.id,
      internshipTitle: application.internshipTitle || internship.title,
      employerId: application.employerId || internship.employerId,
      companyName:
        application.companyName ||
        internship.companyName ||
        internship.company ||
        "Unknown company",
      _internship: internship,
    }))
  );

  const applicationsFromDb = Array.isArray(db.applications)
    ? db.applications.map((application) => {
        const internship = internships.find(
          (item) => String(item.id) === String(application.internshipId)
        );

        return {
          ...application,
          internshipId: application.internshipId || internship?.id,
          internshipTitle: application.internshipTitle || internship?.title,
          employerId: application.employerId || internship?.employerId,
          companyName:
            application.companyName ||
            internship?.companyName ||
            internship?.company ||
            "Unknown company",
          _internship: internship || {},
        };
      })
    : [];

  const applicationMap = new Map();

  [...applicationsFromInternships, ...applicationsFromDb].forEach((application, index) => {
    const key =
      application.id ||
      `${application.internshipId || "internship"}-${
        application.studentId || application.email || "student"
      }-${index}`;

    applicationMap.set(String(key), application);
  });

  const applications = Array.from(applicationMap.values());

  const acceptedApplications = applications.filter((application) =>
    isAcceptedStatus(application.status)
  );

  const filledInternships = internships.filter((internship) => {
    const status = String(internship.status || "").toLowerCase();

    return (
      Boolean(internship.isFilled) ||
      Boolean(internship.filled) ||
      status.includes("filled") ||
      status.includes("completed") ||
      status.includes("closed")
    );
  });

  const acceptedStudentIds = new Set(
    acceptedApplications
      .map((application) => application.studentId || application.userId)
      .filter(Boolean)
  );

  const months = getLastMonths(7);

  const internshipTimeline = months.map((month, index) => {
    const monthEnd = new Date(`${month.key}-28`);

    const offered = internships.filter(
      (internship) => monthKeyFromDateSafe(internshipDate(internship)) === month.key
    ).length;

    const interned = acceptedApplications.filter((application) => {
      const date = applicationDate(application, application._internship);
      return monthKeyFromDateSafe(date) === month.key;
    }).length;

    const cumulativeOffered = internships.filter(
      (internship) => internshipDate(internship) <= monthEnd
    ).length;

    const cumulativeInterned = acceptedApplications.filter((application) => {
      const date = applicationDate(application, application._internship);
      return date <= monthEnd;
    }).length;

    return {
      ...month,
      offered,
      interned,
      cumulativeOffered,
      cumulativeInterned,
      value: offered + interned + index,
    };
  });

  const companyOutcomes = employers
    .map((employer) => {
      const companyInternships = internships.filter(
        (internship) => String(internship.employerId) === String(employer.id)
      );

      const companyApplications = applications.filter((application) =>
        companyInternships.some(
          (internship) => String(internship.id) === String(application.internshipId)
        )
      );

      const companyAccepted = companyApplications.filter((application) =>
        isAcceptedStatus(application.status)
      );

      const companyFilled = companyInternships.filter((internship) => {
        const status = String(internship.status || "").toLowerCase();

        return (
          Boolean(internship.isFilled) ||
          Boolean(internship.filled) ||
          status.includes("filled") ||
          status.includes("completed") ||
          status.includes("closed")
        );
      });

      return {
        id: employer.id,
        name: employer.companyName || employer.name || getUserName(employer),
        offered: companyInternships.length,
        interned: Math.max(
          new Set(
            companyAccepted
              .map((application) => application.studentId || application.userId)
              .filter(Boolean)
          ).size,
          companyFilled.length
        ),
      };
    })
    .filter((company) => company.offered > 0 || company.interned > 0)
    .sort((a, b) => b.interned - a.interned || b.offered - a.offered);

  const roleDistribution = [
    { label: "Students", value: students.length },
    { label: "Employers", value: employers.length },
    { label: "Instructors", value: instructors.length },
    { label: "Admins", value: admins.length },
  ];

  const stats = {
    totalUsers: users.length,
    students: students.length,
    employers: employers.length,
    instructors: instructors.length,
    admins: admins.length,
    projects: projects.length,
    courses: courses.length,
    internshipsOffered: internships.length,
    studentsInterned: Math.max(acceptedStudentIds.size, filledInternships.length),
    pendingReviews: notifications.filter(
      (notification) =>
        !notification.read &&
        ["admin", admin?.id].includes(notification.userId)
    ).length,
  };

  const makeSparkline = (base) =>
    Array.from({ length: 7 }, (_, index) => ({
      label: index,
      value: Math.max(
        0,
        Math.round(base * (0.55 + index * 0.075) + (index % 2 ? 1 : 0))
      ),
    }));

  return {
    admin,
    users,
    projects,
    courses,
    internships,
    applications,
    acceptedApplications,
    companyOutcomes,
    roleDistribution,
    internshipTimeline,
    notifications,
    stats,
    platformCards: [
      {
        label: "Total users",
        value: stats.totalUsers,
        detail: "all platform accounts",
      },
      {
        label: "Students",
        value: stats.students,
        detail: "registered learners",
      },
      {
        label: "Employers",
        value: stats.employers,
        detail: "company accounts",
      },
      {
        label: "Instructors",
        value: stats.instructors,
        detail: "course staff",
      },
      {
        label: "Total projects",
        value: stats.projects,
        detail: "visible project records",
      },
      {
        label: "Total courses",
        value: stats.courses,
        detail: "course catalog entries",
      },
      {
        label: "Internships offered",
        value: stats.internshipsOffered,
        detail: "roles posted by companies",
      },
      {
        label: "Students interned",
        value: stats.studentsInterned,
        detail: "accepted/completed interns",
      },
    ],
    sparklines: {
      users: makeSparkline(stats.totalUsers),
      students: makeSparkline(stats.students),
      employers: makeSparkline(stats.employers),
      instructors: makeSparkline(stats.instructors),
      projects: makeSparkline(stats.projects),
      courses: makeSparkline(stats.courses),
      internships: makeSparkline(stats.internshipsOffered),
      interned: makeSparkline(stats.studentsInterned),
    },
  };
}
export function getAdminModuleState() {
  const db = getDemoDb();
  const users = db.users || [];
  const employers = users.filter((user) => user.role === "employer").map((user) => ({
    id: user.id,
    companyName: user.companyName || user.name,
    contact: user.email,
    email: user.email,
    status: user.verificationStatus || user.status || "pending",
    focus: user.industry || "Software",
    submitted: user.createdAt || "Seeded",
    documents: user.uploadedDocuments || [],
  }));

  return {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "active",
      joined: user.createdAt || "Seeded",
      projects: (db.projects || []).filter((p) => p.ownerId === user.id).length,
      lastSeen: user.isDemo ? "Demo" : "New",
    })),
    employers,
    courses: (db.courses || []).map((course) => ({
      id: course.id,
      code: course.code,
      name: course.name,
      type: course.type,
      instructor: (course.instructorIds || []).map((id) => users.find((u) => u.id === id)?.name).filter(Boolean).join(", ") || "Unassigned",
      status: course.status === "pending-link" ? "active" : course.status || "active",
      linkedProjects: course.linkedProjectIds?.length || 0,
    })),
    linkRequests: (db.linkRequests || []).map((request) => hydrateLinkRequest(request, db)),
    flaggedProjects: (db.reports || []).map((report) => ({
      id: report.projectId,
      reportId: report.id,
      title: (db.projects || []).find((p) => p.id === report.projectId)?.title || "Project",
      reason: report.reason,
      status: report.status,
      active: report.active,
      reportedBy: users.find((u) => u.id === report.reportedById)?.name || "Instructor",
    })),
    appeals: (db.reports || []).filter((r) => r.appeal).map((r) => ({
      ...r.appeal,
      projectId: r.projectId,
      student: users.find((u) => u.id === r.appeal.studentId)?.name || "Student",
    })),
    activity: [],
    statistics: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      totalProjects: (db.projects || []).length,
      totalCourses: (db.courses || []).length,
      approvedEmployers: employers.filter((e) => e.status === "approved" || e.status === "active").length,
    },
  };
}