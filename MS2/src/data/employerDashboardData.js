export const employerProfile = {
  companyName: "TechVista Cairo",
  companyEmail: "careers@techvista.io",
  workspaceLabel: "Employer Workspace",
  industry: "Software & AI Solutions",
  location: "Smart Village, Cairo",
  verificationStatus: "Pending admin review",
  companyLogo: null,
  profileCompletion: 76,
  bio:
    "Building practical software, AI tools, and internship pathways for ambitious GUC students.",
  documents: [
    { name: "Tax Certificate.pdf", status: "Uploaded", date: "May 2" },
    { name: "Commercial Register.pdf", status: "Uploaded", date: "May 2" },
  ],
};

export const employerStats = {
  activeInternships: 4,
  totalApplicants: 38,
  acceptedStudents: 9,
  unreadAlerts: 5,
};

export const internshipStats = [
  { label: "2023", internships: 3, students: 8 },
  { label: "2024", internships: 6, students: 17 },
  { label: "2025", internships: 8, students: 24 },
  { label: "2026", internships: 4, students: 9 },
];

export const employerInternships = [
  {
    id: "int-1",
    title: "Frontend Engineering Intern",
    details:
      "Build polished React interfaces, reusable UI components, and responsive dashboard screens.",
    skills: ["React", "Tailwind", "UI/UX"],
    languages: ["JavaScript", "TypeScript"],
    duration: "3 months",
    deadline: "May 24",
    postedAt: "May 1, 2026",
    status: "Currently hiring",
    archived: false,
    applicants: 14,
  },
  {
    id: "int-2",
    title: "AI Product Intern",
    details:
      "Prototype AI features, prepare model evaluation notes, and support product experiments.",
    skills: ["Python", "ML", "Research"],
    languages: ["Python"],
    duration: "2 months",
    deadline: "May 31",
    postedAt: "May 4, 2026",
    status: "Currently hiring",
    archived: false,
    applicants: 11,
  },
  {
    id: "int-3",
    title: "Backend Systems Intern",
    details:
      "Work on APIs, authentication flows, and internship application tracking services.",
    skills: ["Node.js", "APIs", "MongoDB"],
    languages: ["JavaScript", "SQL"],
    duration: "4 months",
    deadline: "Apr 26",
    postedAt: "Apr 6, 2026",
    status: "Position filled",
    archived: true,
    applicants: 13,
  },
];

export const topApplicants = [
  {
    id: "app-1",
    name: "Yasmin Khaled",
    email: "yasmin.khaled@student.guc.edu.eg",
    role: "MET Student",
    internship: "Frontend Engineering Intern",
    topContributorScore: 96,
    status: "Nominated",
    skills: ["React", "Tailwind", "SE"],
    portfolioProjects: 8,
    reason: "Top contributor on saved portfolio projects",
  },
  {
    id: "app-2",
    name: "Mariam Adel",
    email: "mariam.adel@student.guc.edu.eg",
    role: "CSEN Student",
    internship: "AI Product Intern",
    topContributorScore: 91,
    status: "Accepted",
    skills: ["Python", "YOLO", "Research"],
    portfolioProjects: 6,
    reason: "Strong AI project history",
  },
  {
    id: "app-3",
    name: "Omar Tarek",
    email: "omar.tarek@student.guc.edu.eg",
    role: "MET Student",
    internship: "Backend Systems Intern",
    topContributorScore: 87,
    status: "Rejected",
    skills: ["Node.js", "APIs", "Databases"],
    portfolioProjects: 5,
    reason: "Relevant backend coursework",
  },
];

export const favoritePortfolios = [
  {
    name: "Yasmin Khaled",
    major: "Media Engineering and Technology",
    projects: 8,
    skills: ["React", "UI/UX", "Node.js"],
  },
  {
    name: "Mariam Adel",
    major: "Computer Science",
    projects: 6,
    skills: ["Python", "Machine Learning", "OpenCV"],
  },
  {
    name: "Karim Nabil",
    major: "Digital Media Engineering",
    projects: 5,
    skills: ["Flutter", "Firebase", "Design"],
  },
];

export const recommendedProjects = [
  {
    title: "Smart Study Buddy",
    course: "CSEN 501",
    rating: 4.8,
    reason: "Matches your saved React portfolios",
  },
  {
    title: "AI Research Assistant",
    course: "Bachelor Project",
    rating: 4.7,
    reason: "High AI relevance for open internships",
  },
  {
    title: "Campus Navigator",
    course: "DMET 502",
    rating: 4.5,
    reason: "Strong mobile product signals",
  },
];

export const employerNotifications = [
  {
    id: "emp-n-1",
    title: "New applicant",
    text: "Yasmin Khaled applied to Frontend Engineering Intern.",
    unread: true,
    type: "internship",
    time: "6/5/2026 at 11:24",
  },
  {
    id: "emp-n-2",
    title: "Verification update",
    text: "Your company documents are waiting for admin review.",
    unread: true,
    type: "company",
    time: "6/5/2026 at 10:05",
  },
  {
    id: "emp-n-3",
    title: "Private message",
    text: "Mariam Adel asked about the AI Product Intern role.",
    unread: true,
    type: "message",
    time: "5/5/2026 at 18:40",
  },
];

export const messageThreads = [
  {
    name: "Yasmin Khaled",
    context: "Frontend Engineering Intern",
    preview: "Thank you for reviewing my portfolio. I can share more UI work.",
    unread: true,
  },
  {
    name: "Dr. Aya Salama",
    context: "Course Instructor",
    preview: "The nominated students have strong project ownership evidence.",
    unread: false,
  },
];
