export const adminProfile = {
  name: "Nadine Amin",
  email: "admin@guc.edu.eg",
  role: "Platform Administrator",
  profileCompletion: 96,
};

export const adminStats = [
  {
    label: "Total users",
    value: "1,248",
    detail: "Students, employers, instructors and admins",
    tone: "blue",
  },
  {
    label: "Projects",
    value: "386",
    detail: "24 flagged or awaiting review",
    tone: "gold",
  },
  {
    label: "Courses",
    value: "42",
    detail: "Including Bachelor Project tracks",
    tone: "blue",
  },
  {
    label: "Open requests",
    value: "31",
    detail: "Companies, course links and appeals",
    tone: "danger",
  },
];

export const platformUsage = [
  { label: "Students", value: 842, percent: 68 },
  { label: "Course instructors", value: 74, percent: 18 },
  { label: "Employers", value: 118, percent: 42 },
  { label: "Administrators", value: 6, percent: 8 },
];

export const employerApplications = [
  {
    id: "emp-1",
    company: "NileTech Labs",
    contact: "careers@niletech.com",
    status: "Pending review",
    documents: ["TaxCertificate.pdf", "CommercialRegister.pdf"],
    submitted: "Today",
    focus: "AI internships and backend roles",
  },
  {
    id: "emp-2",
    company: "Cairo Data Studio",
    contact: "people@cairodatas.com",
    status: "Needs document check",
    documents: ["TaxCertificate.pdf"],
    submitted: "Yesterday",
    focus: "Data analysis and BI internships",
  },
  {
    id: "emp-3",
    company: "PixelForge Egypt",
    contact: "hr@pixelforge.io",
    status: "Ready to approve",
    documents: ["TaxCertificate.pdf", "CompanyProfile.pdf"],
    submitted: "May 5",
    focus: "Frontend and UI/UX internships",
  },
];

export const courseRequests = [
  {
    id: "course-1",
    instructor: "Dr. Sarah Hassan",
    request: "Link to CSEN 501",
    course: "CSEN 501 - Software Engineering",
    time: "12 min ago",
  },
  {
    id: "course-2",
    instructor: "Dr. Karim Lotfy",
    request: "Unlink from DMET 502",
    course: "DMET 502 - Media Engineering",
    time: "1 hr ago",
  },
  {
    id: "course-3",
    instructor: "Dr. Aya Salama",
    request: "Link to Bachelor Project",
    course: "Bachelor Project",
    time: "Yesterday",
  },
];

export const flaggedProjects = [
  {
    id: "flag-1",
    title: "AI Research Assistant",
    reason: "Possible plagiarism in methodology section",
    reporter: "Dr. Sarah Hassan",
    status: "Appeal submitted",
    severity: "High",
  },
  {
    id: "flag-2",
    title: "Campus Navigator",
    reason: "External assets not credited",
    reporter: "Dr. Karim Lotfy",
    status: "Auto-deactivated",
    severity: "Medium",
  },
  {
    id: "flag-3",
    title: "Smart Study Buddy",
    reason: "Duplicate GitHub repository detected",
    reporter: "System review",
    status: "Awaiting student response",
    severity: "Medium",
  },
];

export const userModeration = [
  {
    name: "Mariam Adel",
    email: "mariam.adel@student.guc.edu.eg",
    role: "Student",
    status: "Active",
  },
  {
    name: "Dr. Sarah Hassan",
    email: "sarah.hassan@guc.edu.eg",
    role: "Course Instructor",
    status: "Active",
  },
  {
    name: "TechBridge",
    email: "omar@techbridge.com",
    role: "Employer",
    status: "Pending approval",
  },
  {
    name: "Youssef Nabil",
    email: "youssef.nabil@student.guc.edu.eg",
    role: "Student",
    status: "Deactivated",
  },
];

export const adminCourses = [
  { code: "CSEN 501", name: "Software Engineering", projects: 74, instructors: 5 },
  { code: "CSEN 601", name: "Computer Architecture", projects: 38, instructors: 3 },
  { code: "DMET 502", name: "Media Engineering", projects: 26, instructors: 2 },
  { code: "BACH 001", name: "Bachelor Project", projects: 91, instructors: 18 },
];
