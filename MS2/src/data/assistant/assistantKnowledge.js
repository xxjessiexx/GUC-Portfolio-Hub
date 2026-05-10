import {
  getDemoDb,
  getCurrentUser,
  getAllProjects,
  getAllPortfolios,
  getInternships,
  getApplicationsForStudent,
  getProjectsForUser,
  getInternshipsForEmployer,
  getAllInstructors,
  getAdminModuleState,
  normalizeRole,
} from "@/data/demoStore";

const asArray = (value) => (Array.isArray(value) ? value : []);
const text = (value) => String(value ?? "").trim();
const lower = (value) => text(value).toLowerCase();
const unique = (items) => [...new Set(items.filter(Boolean))];
const hasAny = (haystack, words) => words.some((word) => haystack.includes(word));
const compact = (value) =>
  lower(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(
      /\b(where|how|do|does|can|could|should|i|me|my|the|a|an|to|go|open|find|show|view|see|page|screen|section|please|pls|is|are|there|any|about)\b/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

const includesCompact = (question, phrase) => {
  const q = lower(question);
  const c = compact(question);
  const p = lower(phrase);
  const pc = compact(phrase);
  return q.includes(p) || (pc && c.includes(pc));
};

const scoreText = (query, fields) => {
  const terms = unique(compact(query).split(" ").filter((term) => term.length > 1));
  if (!terms.length) return 0;
  const joined = lower(fields.filter(Boolean).join(" "));
  return terms.reduce((score, term) => score + (joined.includes(term) ? 1 : 0), 0);
};

const list = (items, limit = 5) => {
  const visible = items.filter(Boolean).slice(0, limit);
  const rest = Math.max(0, items.length - visible.length);
  if (!visible.length) return "none found";
  return `${visible.join(", ")}${rest ? `, +${rest} more` : ""}`;
};

const route = (label, path, roles, keywords, description) => ({
  label,
  path,
  roles,
  keywords,
  description,
});

export const assistantRoutes = [
  route("Student dashboard", "/student-dashboard", ["student"], ["student dashboard", "my dashboard", "overview", "home"], "Track your projects, alerts, portfolio completion, recommendations, and applications."),
  route("Instructor dashboard", "/instructor-dashboard", ["instructor"], ["instructor dashboard", "review queue", "supervised projects", "teaching dashboard"], "Review projects, course work, comments, ratings, flags, and teaching alerts."),
  route("Employer dashboard", "/employer-dashboard", ["employer"], ["employer dashboard", "company dashboard", "hiring dashboard", "applicants"], "Manage internships, applicants, company profile progress, and hiring activity."),
  route("Admin dashboard", "/admin-dashboard", ["admin"], ["admin dashboard", "admin overview", "platform overview"], "Monitor users, employers, courses, reports, flags, link requests, and statistics."),
  route("Discover", "/discover", ["student", "instructor", "employer", "admin"], ["discover", "search hub", "explore hub", "browse"], "Start from the discovery hub for projects, portfolios, instructors, and internships."),
  route("Explore projects", "/explore-projects", ["student", "instructor", "employer", "admin"], ["explore projects", "project search", "public projects", "find projects", "browse projects"], "Browse public projects by title, course, technology, owner, and visibility."),
  route("Project details", "/project", ["student", "instructor", "employer", "admin"], ["project details", "project page", "view project"], "Open the project detail page. Some project cards also route to /projects/:projectId/edit or /edit-project/:projectId when editing."),
  route("Create project", "/create-project", ["student"], ["create project", "create a project", "add project", "new project", "upload project", "post project", "where create project"], "Create a course or bachelor project with description, tags, links, visibility, and collaborators."),
  route("View all my projects", "/view-all-projects", ["student", "instructor", "admin"], ["my projects", "all projects", "view all projects", "projects list"], "Open the full project list instead of only the dashboard preview."),
  route("Edit project", "/edit-project/:projectId", ["student", "admin"], ["edit project", "update project", "change project", "modify project"], "Edit an existing project from its card or details page."),
  route("Explore portfolios", "/explore-portfolio", ["student", "instructor", "employer", "admin"], ["portfolio", "portfolios", "students", "candidate", "candidates", "student profiles"], "Browse student portfolios, skills, public projects, and candidate profiles."),
  route("Manage portfolio", "/manage-portfolio", ["student"], ["manage portfolio", "edit portfolio", "portfolio settings", "my portfolio"], "Edit your public portfolio presentation, pinned projects, sections, and links."),
  route("My portfolio", "/portfolio", ["student"], ["portfolio page", "my portfolio page", "public portfolio"], "Preview the portfolio page."),
  route("Explore instructors", "/explore-instructors", ["student", "instructor", "admin"], ["instructor", "instructors", "professor", "course instructor", "teacher"], "Find instructors by department, interests, linked courses, and supervised work."),
  route("Internships", "/internships", ["student", "instructor", "employer", "admin"], ["internship", "internships", "roles", "jobs", "browse internships"], "Browse internship listings, requirements, deadlines, skills, companies, and application status."),
  route("Internship details", "/internships/:internshipId", ["student", "employer", "admin"], ["internship details", "view internship", "internship page"], "Open a full internship detail page from an internship card."),
  route("My applications", "/my-applications", ["student"], ["my applications", "applications", "applied", "application status"], "See internships you applied to and whether each is pending, accepted, or rejected."),
  route("Create internship", "/create-internship", ["employer"], ["create internship", "post internship", "new internship", "add internship"], "Create a new internship listing for your company."),
  route("Manage internships", "/manage-internships", ["employer"], ["manage internships", "my internships", "edit internships", "company internships"], "Manage internship listings posted by the current employer."),
  route("Manage applicants", "/manage-applicants/:internshipId", ["employer"], ["manage applicants", "applicants", "candidates", "applications received"], "Review students who applied to a specific internship."),
  route("Edit student profile", "/edit-student-profile", ["student"], ["edit profile", "student profile", "profile settings", "personal info"], "Update student personal details, skills, image, and links."),
  route("Edit instructor profile", "/edit-instructor-profile", ["instructor"], ["edit instructor profile", "instructor profile", "my profile"], "Update instructor bio, office, interests, and linked academic information."),
  route("Edit employer profile", "/edit-employer-profile", ["employer"], ["edit employer profile", "company profile", "edit company", "employer profile"], "Update employer/company biography, industry, documents, and location."),
  route("Chat", "/chat", ["student", "instructor", "employer", "admin"], ["chat", "messages", "message", "conversation"], "Open platform chats and project conversations."),
  route("Notifications", "/notifications", ["student", "instructor", "employer", "admin"], ["notifications", "alerts", "bell", "unread"], "Read platform alerts, feedback updates, application changes, and admin notices."),
  route("Favorites", "/fav-list", ["student", "instructor", "employer", "admin"], ["favorites", "saved", "bookmarks", "favorite list"], "Open saved projects and portfolios."),
  route("Favorite projects", "/favorite-projects", ["student", "instructor", "employer", "admin"], ["favorite projects", "saved projects", "bookmarked projects"], "Open projects saved by the current user."),
  route("Favorite portfolios", "/favorite-portfolios", ["student", "instructor", "employer", "admin"], ["favorite portfolios", "saved portfolios", "bookmarked portfolios"], "Open portfolios saved by the current user."),
  route("Admin users", "/admin/users", ["admin"], ["manage users", "admin users", "users list", "activate users", "deactivate users"], "View and manage platform user accounts."),
  route("Admin employers", "/admin/employers", ["admin"], ["verify employers", "admin employers", "company verification", "employer approvals"], "Review employer verification status and company documents."),
  route("Admin courses", "/admin/courses", ["admin"], ["manage courses", "admin courses", "courses", "course management"], "Manage course records and course-to-project links."),
  route("Create course", "/admin/courses/create", ["admin"], ["create course", "add course", "new course"], "Create a new course record as an admin."),
  route("Admin link requests", "/admin/link-requests", ["admin"], ["link requests", "course link requests", "pending links"], "Review requests to link projects to courses."),
  route("Flagged projects", "/admin/flagged-projects", ["admin"], ["flagged projects", "reports", "appeals", "reported projects"], "Review reported projects and student appeals."),
  route("Admin statistics", "/admin/statistics", ["admin"], ["statistics", "analytics", "platform stats", "usage"], "View platform analytics and usage statistics."),
  route("Create admin account", "/admin/users/create-admin", ["admin"], ["create admin", "new admin", "admin account"], "Create another admin account."),
];

function routeMatches(question, role) {
  const q = lower(question);
  const isNavigationQuestion = hasAny(q, [
    "where",
    "how do i",
    "how can i",
    "open",
    "go to",
    "navigate",
    "page",
    "screen",
    "route",
    "create",
    "add",
    "post",
    "manage",
    "edit",
    "view",
    "show me",
  ]);

  const matches = assistantRoutes
    .map((item) => ({
      ...item,
      score:
        item.keywords.reduce((sum, keyword) => sum + (includesCompact(question, keyword) ? 4 : 0), 0) +
        scoreText(question, [item.label, item.description, item.path]) +
        (item.roles.includes(role) ? 1 : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!matches.length) return null;
  if (isNavigationQuestion || matches[0].score >= 5) return matches.slice(0, 3);
  return null;
}

function buildIndex() {
  const db = getDemoDb();
  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role || currentUser?.accountRole || currentUser?.systemRole || "student");
  const users = asArray(db.users);
  const courses = asArray(db.courses);
  const rawProjects = asArray(db.projects);
  const projects = getAllProjects({ includePrivate: true });
  const publicProjects = getAllProjects({ includePrivate: false });
  const portfolios = getAllPortfolios();
  const instructors = getAllInstructors();
  const employers = users.filter((user) => user.role === "employer");
  const students = users.filter((user) => user.role === "student");
  const internships = getInternships();
  const applications = currentUser?.role === "student" ? getApplicationsForStudent(currentUser.id) : [];
  const myProjects = currentUser?.id ? getProjectsForUser(currentUser.id, { includePrivate: true }) : [];
  const myInternships = currentUser?.role === "employer" ? getInternshipsForEmployer(currentUser.id) : [];
  const admin = role === "admin" ? getAdminModuleState() : null;

  return {
    db,
    role,
    currentUser,
    users,
    students,
    instructors,
    employers,
    courses,
    rawProjects,
    projects,
    publicProjects,
    portfolios,
    internships,
    applications,
    myProjects,
    myInternships,
    admin,
    counts: {
      users: users.length,
      students: students.length,
      instructors: instructors.length,
      employers: employers.length,
      courses: courses.length,
      projects: projects.length,
      publicProjects: publicProjects.length,
      portfolios: portfolios.length,
      internships: internships.length,
      applications: applications.length,
      myProjects: myProjects.length,
      myInternships: myInternships.length,
      reports: asArray(db.reports).length,
      notifications: asArray(db.notifications).filter((n) => !currentUser?.id || n.userId === currentUser.id).length,
    },
  };
}

function bestMatches(query, items, fields, limit = 5) {
  return items
    .map((item) => ({ item, score: scoreText(query, fields(item)) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

function answerNavigation(question, ctx) {
  const matches = routeMatches(question, ctx.role);
  if (!matches?.length) return null;
  const first = matches[0];
  return {
    mood: "wave",
    title: "I know where that is.",
    text: `${first.label} is the page you want. ${first.description}`,
    routes: matches.map(({ label, path, description }) => ({ label, path, description })),
    confidence: "high",
  };
}

function answerCourses(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["course", "csen", "dmet", "math", "teaches", "teach", "instructor for"])) return null;

  const codeMatch = question.match(/\b[A-Z]{2,5}\s*\d{3}\b/i)?.[0]?.replace(/\s+/g, "").toUpperCase();
  const matches = codeMatch
    ? ctx.courses.filter((course) => lower(course.code).replace(/\s+/g, "") === lower(codeMatch))
    : bestMatches(question, ctx.courses, (course) => [course.code, course.name, course.type, course.description], 5);

  if (!matches.length && hasAny(q, ["course", "csen", "dmet"])) {
    return {
      mood: "thinking",
      title: "I could not find that course in the seed database.",
      text: `I searched the current demo seed courses and did not find a match. The database currently has ${ctx.counts.courses} courses. Try a course code like CSEN 603 or a course name.`,
      routes: [{ label: "Explore instructors", path: "/explore-instructors" }, { label: "Admin courses", path: "/admin/courses" }],
      confidence: "medium",
    };
  }

  if (!matches.length) return null;

  const lines = matches.map((course) => {
    const teachers = asArray(course.instructorIds)
      .map((id) => ctx.users.find((user) => user.id === id)?.name)
      .filter(Boolean);
    const linked = asArray(course.linkedProjectIds).length;
    return `${course.code} — ${course.name}: instructor(s) ${list(teachers, 3)}; linked projects: ${linked}.`;
  });

  return {
    mood: "happy",
    title: matches.length === 1 ? "Here is the course record." : "Here are the matching courses.",
    text: lines.join("\n"),
    routes: [{ label: "Explore instructors", path: "/explore-instructors" }, { label: "Explore projects", path: "/explore-projects" }],
    confidence: "high",
  };
}

function answerProjects(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["project", "projects", "react", "python", "java", "yolo", "opencv", "portfolio hub", "bfmc", "course project", "bachelor"])) return null;

  if (hasAny(q, ["how many", "count", "number of"])) {
    return {
      mood: "happy",
      title: "Project count from the seed database.",
      text: `The current demo database has ${ctx.counts.projects} total projects, ${ctx.counts.publicProjects} visible public projects, and ${ctx.counts.myProjects} project(s) connected to the current user.`,
      routes: [{ label: "Explore projects", path: "/explore-projects" }, { label: "View all my projects", path: "/view-all-projects" }],
      confidence: "high",
    };
  }

  const matches = bestMatches(question, ctx.projects, (project) => [
    project.title,
    project.description,
    project.course,
    project.courseCode,
    project.courseName,
    project.owner?.name,
    project.instructor,
    ...asArray(project.tags),
    ...asArray(project.languages),
    ...asArray(project.technologies),
  ], 5);

  if (!matches.length) {
    return {
      mood: "thinking",
      title: "I do not see that project in the database.",
      text: `I checked the live demoStore project collection. I can see ${ctx.counts.projects} projects, but none confidently match your wording. Try a title, course code, owner name, or technology.`,
      routes: [{ label: "Explore projects", path: "/explore-projects" }, { label: "Create project", path: "/create-project" }],
      confidence: "medium",
    };
  }

  const lines = matches.map((project) => {
    const tech = list(unique([...asArray(project.technologies), ...asArray(project.languages), ...asArray(project.tags)]), 4);
    return `${project.title} — by ${project.owner?.name || "Unknown student"}; course: ${project.course || project.courseName || "Unlinked"}; tech: ${tech}; status: ${project.status || "unknown"}.`;
  });

  return {
    mood: "happy",
    title: "Matching projects from demoStore.",
    text: lines.join("\n"),
    routes: [{ label: "Explore projects", path: "/explore-projects" }, { label: "View all my projects", path: "/view-all-projects" }],
    confidence: "high",
  };
}

function answerInstructors(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["instructor", "professor", "doctor", "dr ", "teacher", "teaches", "mentor", "supervisor"])) return null;

  const matches = bestMatches(question, ctx.instructors, (instructor) => [
    instructor.name,
    instructor.email,
    instructor.department,
    instructor.office,
    instructor.bio,
    instructor.title,
    ...asArray(instructor.researchInterests),
    ...asArray(instructor.courses),
  ], 5);

  if (!matches.length) {
    return {
      mood: "thinking",
      title: "No exact instructor match.",
      text: `I can see ${ctx.counts.instructors} instructor profiles in the seed database, but none confidently match that question. Try an instructor name, office, department, research interest, or course code.`,
      routes: [{ label: "Explore instructors", path: "/explore-instructors" }],
      confidence: "medium",
    };
  }

  return {
    mood: "happy",
    title: "Instructor information from the database.",
    text: matches
      .map((instructor) => `${instructor.name} — ${instructor.department || "Department unknown"}; office: ${instructor.office || "not listed"}; courses: ${list(asArray(instructor.courses), 3)}.`)
      .join("\n"),
    routes: [{ label: "Explore instructors", path: "/explore-instructors" }],
    confidence: "high",
  };
}

function answerEmployers(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["company", "companies", "employer", "employers", "verification", "verified", "industry", "hiring"])) return null;

  if (hasAny(q, ["how many", "count", "number of"])) {
    const approved = ctx.employers.filter((emp) => ["approved", "active"].includes(lower(emp.verificationStatus || emp.status))).length;
    return {
      mood: "happy",
      title: "Employer count from demoStore.",
      text: `The database has ${ctx.counts.employers} employer accounts. ${approved} are approved/active according to their stored status fields.`,
      routes: [{ label: "Admin employers", path: "/admin/employers" }, { label: "Explore portfolios", path: "/explore-portfolio" }],
      confidence: "high",
    };
  }

  const matches = bestMatches(question, ctx.employers, (employer) => [
    employer.name,
    employer.companyName,
    employer.email,
    employer.industry,
    employer.companyBio,
    employer.bio,
    employer.position,
    employer.location?.label,
    employer.verificationStatus,
  ], 5);

  if (!matches.length) return null;

  return {
    mood: "happy",
    title: "Company information from the seed database.",
    text: matches
      .map((employer) => `${employer.companyName || employer.name} — ${employer.industry || "industry not listed"}; contact: ${employer.name}; status: ${employer.verificationStatus || employer.status || "unknown"}; location: ${employer.location?.label || "not listed"}.`)
      .join("\n"),
    routes: [{ label: "Internships", path: "/internships" }, { label: "Admin employers", path: "/admin/employers" }],
    confidence: "high",
  };
}

function answerInternships(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["internship", "internships", "job", "jobs", "application", "applications", "apply", "applicant", "applicants"])) return null;

  if (hasAny(q, ["my applications", "applied", "application status"])) {
    if (ctx.role !== "student") {
      return {
        mood: "thinking",
        title: "Applications are student-specific.",
        text: "Application status is shown for student accounts. Employers should use Manage applicants, and admins can review employer/user data from the admin pages.",
        routes: [{ label: "Manage applicants", path: "/manage-applicants/:internshipId" }, { label: "Admin employers", path: "/admin/employers" }],
        confidence: "high",
      };
    }
    return {
      mood: ctx.applications.length ? "happy" : "thinking",
      title: "Your applications from demoStore.",
      text: ctx.applications.length
        ? ctx.applications.map((app) => `${app.title} at ${app.company}: ${app.status} since ${app.displayDate || app.dateApplied}.`).join("\n")
        : "You do not have applications stored for the current student account yet.",
      routes: [{ label: "My applications", path: "/my-applications" }, { label: "Internships", path: "/internships" }],
      confidence: "high",
    };
  }

  if (hasAny(q, ["how many", "count", "number of"])) {
    return {
      mood: "happy",
      title: "Internship count from demoStore.",
      text: `The database has ${ctx.counts.internships} internship listings. The current student has ${ctx.counts.applications} application(s), and the current employer has ${ctx.counts.myInternships} listing(s).`,
      routes: [{ label: "Internships", path: "/internships" }, { label: "My applications", path: "/my-applications" }, { label: "Manage internships", path: "/manage-internships" }],
      confidence: "high",
    };
  }

  const matches = bestMatches(question, ctx.internships, (internship) => [
    internship.title,
    internship.company,
    internship.companyName,
    internship.department,
    internship.location,
    internship.duration,
    internship.workMode,
    internship.overview,
    ...asArray(internship.skills),
    ...asArray(internship.requirements),
    ...asArray(internship.responsibilities),
  ], 5);

  if (!matches.length) {
    return {
      mood: "thinking",
      title: "I do not see that internship.",
      text: `I searched ${ctx.counts.internships} internship listings in the live seed database but did not get a confident match. Try a company name, skill, role title, or location.`,
      routes: [{ label: "Internships", path: "/internships" }],
      confidence: "medium",
    };
  }

  return {
    mood: "happy",
    title: "Matching internships from demoStore.",
    text: matches
      .map((job) => `${job.title} at ${job.companyName || job.company} — ${job.location}; ${job.duration}; ${job.workMode || "work mode not listed"}; skills: ${list(asArray(job.skills), 4)}; applicants: ${job.applicants || asArray(job.applications).length}.`)
      .join("\n"),
    routes: [{ label: "Internships", path: "/internships" }, { label: "Create internship", path: "/create-internship" }],
    confidence: "high",
  };
}

function answerCurrentUser(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["who am i", "my account", "current user", "my role", "profile completion", "my profile"])) return null;

  const user = ctx.currentUser;
  if (!user) {
    return {
      mood: "thinking",
      title: "No current user in sessionStorage.",
      text: "I cannot see a logged-in user right now. Log in with a seeded account so I can answer user-specific questions accurately.",
      routes: [{ label: "Login", path: "/login" }],
      confidence: "high",
    };
  }

  return {
    mood: "happy",
    title: "Current user from session + demoStore.",
    text: `You are logged in as ${user.name} (${user.email}) with the ${ctx.role} role. I can see ${ctx.counts.myProjects} project(s) connected to you, ${ctx.counts.notifications} notification(s), and ${ctx.role === "student" ? `${ctx.counts.applications} application(s)` : ctx.role === "employer" ? `${ctx.counts.myInternships} internship listing(s)` : `${ctx.counts.courses} course record(s) in the platform`}.`,
    routes: [
      ctx.role === "student" ? { label: "Edit student profile", path: "/edit-student-profile" } : null,
      ctx.role === "instructor" ? { label: "Edit instructor profile", path: "/edit-instructor-profile" } : null,
      ctx.role === "employer" ? { label: "Edit employer profile", path: "/edit-employer-profile" } : null,
      { label: "Notifications", path: "/notifications" },
    ].filter(Boolean),
    confidence: "high",
  };
}

function answerSystem(question, ctx) {
  const q = lower(question);
  if (!hasAny(q, ["website", "platform", "database", "seed", "data", "stats", "summary", "what can you do", "help"])) return null;
  return {
    mood: "wave",
    title: "I am connected to your current seed database.",
    text: `I read from demoStore, not separate random arrays. Right now I can see ${ctx.counts.users} users, ${ctx.counts.students} students, ${ctx.counts.instructors} instructors, ${ctx.counts.employers} employers, ${ctx.counts.courses} courses, ${ctx.counts.projects} projects, ${ctx.counts.portfolios} portfolios, and ${ctx.counts.internships} internships. I can help you navigate pages, explain records, find courses/instructors/companies/projects, and summarize current-user data.`,
    routes: [{ label: "Discover", path: "/discover" }, { label: "Explore projects", path: "/explore-projects" }, { label: "Internships", path: "/internships" }],
    confidence: "high",
  };
}

export function answerAssistantQuestion(question) {
  const ctx = buildIndex();
  const q = text(question);
  if (!q) {
    return {
      mood: "wave",
      title: "Ask me anything about the platform.",
      text: "Try: Where do I create a project? Who teaches CSEN 603? Which internships need React? How many companies are approved?",
      routes: [{ label: "Discover", path: "/discover" }],
      confidence: "high",
    };
  }

  const answer =
    answerNavigation(q, ctx) ||
    answerCurrentUser(q, ctx) ||
    answerCourses(q, ctx) ||
    answerInternships(q, ctx) ||
    answerEmployers(q, ctx) ||
    answerInstructors(q, ctx) ||
    answerProjects(q, ctx) ||
    answerSystem(q, ctx);

  if (answer) {
    return {
      ...answer,
      timestamp: new Date().toISOString(),
      meta: { role: ctx.role, source: "demoStore + seed database" },
    };
  }

  return {
    mood: "thinking",
    title: "I do not want to guess.",
    text: `I could not find a confident answer in the current seed database. I can answer best when you mention a page, route, project title, course code, instructor name, company, skill, or internship title. Current database size: ${ctx.counts.users} users, ${ctx.counts.projects} projects, ${ctx.counts.courses} courses, ${ctx.counts.internships} internships.`,
    routes: [{ label: "Discover", path: "/discover" }, { label: "Explore projects", path: "/explore-projects" }, { label: "Internships", path: "/internships" }],
    confidence: "low",
    timestamp: new Date().toISOString(),
    meta: { role: ctx.role, source: "demoStore + seed database" },
  };
}

export function getAssistantWelcome() {
  const ctx = buildIndex();
  const name = ctx.currentUser?.firstName || ctx.currentUser?.name?.split(" ")?.[0] || "there";
  return {
    mood: "wave",
    title: `Hi ${name}!`,
    text: `I am your tiny GUC desk pet. I can navigate the website and answer from the current seed database: ${ctx.counts.projects} projects, ${ctx.counts.courses} courses, ${ctx.counts.instructors} instructors, ${ctx.counts.employers} employers, and ${ctx.counts.internships} internships.`,
    routes: [{ label: "Discover", path: "/discover" }, { label: "Create project", path: "/create-project" }],
    confidence: "high",
    meta: { role: ctx.role, source: "demoStore + seed database" },
  };
}

export function getAssistantQuickPrompts(role = "student") {
  const common = ["Where do I search projects?", "Who teaches CSEN 603?", "What can you see in the database?"];
  if (role === "employer") return ["Where do I post an internship?", "Show my applicants", "Which students know React?", ...common.slice(0, 1)];
  if (role === "instructor") return ["Where is my review queue?", "Show projects for my courses", "Find instructors", ...common.slice(0, 1)];
  if (role === "admin") return ["Where do I verify employers?", "Show platform stats", "Where are flagged projects?", "How many users are there?"];
  return ["Where do I create a project?", "Show internships for React", "What are my applications?", ...common];
}
