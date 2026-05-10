// src/data/demoStore.js
// V6 strict single-source demo store.
// Goal: no page should own random/static data. Seed lives in localStorage; writes go through this file.

import { DEMO_DATA_VERSION, demoSeed } from "@/data/seed";
import {
  extraDemoEmployerUsers,
  extraDemoInternships,
} from "@/data/seed/extra-demo-internships-50";

const DB_KEY = "guc_demo_database_v8";
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

function freshDb() {
  const existingUsers = demoSeed.users || [];
  const existingInternships = demoSeed.internships || [];

  const existingUserIds = new Set(existingUsers.map((user) => user.id));
  const existingInternshipIds = new Set(
    existingInternships.map((internship) => internship.id)
  );

  const mergedSeed = {
    ...demoSeed,

    users: [
      ...existingUsers,
      ...extraDemoEmployerUsers.filter(
        (user) => !existingUserIds.has(user.id)
      ),
    ],

    internships: [
      ...existingInternships,
      ...extraDemoInternships.filter(
        (internship) => !existingInternshipIds.has(internship.id)
      ),
    ],

    version: DEMO_DATA_VERSION,
  };

  return clone(mergedSeed);
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
    syncCompatibilityKeys(reset);
    dispatchStoreChange();
    return reset;
  }

  const stored = readLocal(DB_KEY, null);
  if (stored?.version === DEMO_DATA_VERSION && Array.isArray(stored.users)) {
    syncCompatibilityKeys(stored);
    return stored;
  }

  // Do not import old random arrays/localStorage as source of truth. Start from the audited seed.
  const next = freshDb();
  writeLocal(DB_KEY, next);
  syncCompatibilityKeys(next);
  dispatchStoreChange();
  return next;
}

export function getDemoDb() {
  return initializeDemoStore();
}

export function setDemoDb(nextDb) {
  const normalized = { ...nextDb, version: DEMO_DATA_VERSION };
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
  writeSession(LEGACY_USERS_KEY, getRegisteredUsers());
  return created;
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
  return getCollection("notifications").filter((notification) => notification.userId === userId);
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

export function getChatsForCurrentUser(userId = getCurrentUser()?.id) {
  return getCollection("chats").filter((chat) => chat.participantIds?.includes(userId));
}

export function setChatsForCurrentUser(chats, userId = getCurrentUser()?.id) {
  const db = getDemoDb();
  const incoming = chats.filter((chat) => chat.participantIds?.includes(userId));
  const incomingIds = new Set(incoming.map((chat) => chat.id));
  const untouched = (db.chats || []).filter((chat) => !incomingIds.has(chat.id));
  setDemoDb({ ...db, chats: [...incoming, ...untouched] });
}

export function addChatMessage(chatId, text, senderId = getCurrentUser()?.id) {
  const db = getDemoDb();
  const message = { id: makeId("msg", chatId), senderId, sender: "me", text, createdAt: new Date().toISOString(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
  setDemoDb({ ...db, chats: db.chats.map((chat) => chat.id !== chatId ? chat : { ...chat, messages: [...(chat.messages || []), message] }) });
  return message;
}

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

export function getAdminModuleState() {
  const db = getDemoDb();
  const users = db.users || [];
  const employers = users.filter((user) => user.role === "employer").map((user) => ({
    id: user.id,
    companyName: user.companyName || user.name,
    contact: user.email,
    status: user.verificationStatus || user.status || "pending",
    focus: user.industry || "Software",
    submitted: user.createdAt || "Seeded",
    documents: user.uploadedDocuments || [],
  }));
  return {
    users: users.map((user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status || "active", joined: user.createdAt || "Seeded", projects: (db.projects || []).filter((p) => p.ownerId === user.id).length, lastSeen: user.isDemo ? "Demo" : "New" })),
    employers,
    courses: (db.courses || []).map((course) => ({ id: course.id, code: course.code, name: course.name, type: course.type, instructor: (course.instructorIds || []).map((id) => users.find((u) => u.id === id)?.name).filter(Boolean).join(", ") || "Unassigned", status: course.status === "pending-link" ? "active" : course.status, linkedProjects: course.linkedProjectIds?.length || 0 })),
    linkRequests: db.linkRequests || [],
    flaggedProjects: (db.reports || []).map((report) => ({ id: report.projectId, reportId: report.id, title: (db.projects || []).find((p) => p.id === report.projectId)?.title || "Project", reason: report.reason, status: report.status, active: report.active, reportedBy: users.find((u) => u.id === report.reportedById)?.name || "Instructor" })),
    appeals: (db.reports || []).filter((r) => r.appeal).map((r) => ({ ...r.appeal, projectId: r.projectId, student: users.find((u) => u.id === r.appeal.studentId)?.name || "Student" })),
    activity: [],
    statistics: { totalUsers: users.length, activeUsers: users.filter((u) => u.status === "active").length, totalProjects: (db.projects || []).length, totalCourses: (db.courses || []).length, approvedEmployers: employers.filter((e) => e.status === "approved" || e.status === "active").length },
  };
}
