export const users = [
  {
    id: "stu-001",
    role: "student",
    name: "Yasmin Khaled",
    email: "yasmin.khaled@student.guc.edu.eg",
    faculty: "Media Engineering and Technology",
    semester: 6,
    skills: ["React", "UI/UX", "Node.js"],
    status: "active",
  },
  {
    id: "ins-001",
    role: "instructor",
    name: "Dr. Aya Salama",
    email: "aya.salama@guc.edu.eg",
    department: "Software Engineering",
    courses: ["CSEN 501", "CSEN 601"],
    status: "active",
  },
  {
    id: "emp-001",
    role: "employer",
    name: "Nour Hassan",
    email: "nour@techvista.com",
    companyName: "TechVista",
    industry: "Software",
    verificationStatus: "pending",
  },
];

export const courses = [
  {
    id: "c-001",
    code: "CSEN 501",
    name: "Software Engineering",
    instructorId: "ins-001",
  },
  {
    id: "c-002",
    code: "CSEN 603",
    name: "Human Computer Interaction",
    instructorId: "ins-001",
  },
];

export const projects = [
  {
    id: "p-001",
    title: "Smart Study Buddy",
    type: "Course Project",
    courseCode: "CSEN 501",
    visibility: "public",
    status: "submitted",
    ownerId: "stu-001",
    collaborators: ["Yasmin Khaled", "Mariam Adel", "Omar Tarek"],
    instructorId: "ins-001",
    description:
      "An AI-powered study companion that helps students organize notes, generate quizzes, and track progress.",
    githubLink: "https://github.com/demo/smart-study-buddy",
    demoLink: "https://demo-smart-study.example.com",
    demoVideo: "https://drive.google.com/demo-video",
    skills: ["React", "Node.js", "AI"],
    rating: 4.8,
    feedback: [
      {
        id: "f-001",
        author: "Dr. Aya Salama",
        role: "instructor",
        message: "Strong concept and clean presentation. Improve testing evidence.",
      },
    ],
  },
  {
    id: "p-002",
    title: "Campus Navigator",
    type: "Bachelor Project",
    courseCode: "BI 301",
    visibility: "public",
    status: "approved",
    ownerId: "stu-002",
    collaborators: ["Karim Nader", "Laila Samir"],
    instructorId: "ins-001",
    description:
      "A campus navigation platform that helps students locate buildings, labs, services, and events.",
    githubLink: "https://github.com/demo/campus-navigator",
    demoLink: "https://campus-nav.example.com",
    thesisFile: "CampusNavigator_FinalThesis.pdf",
    skills: ["Mobile", "Maps", "UX Research"],
    rating: 4.6,
    feedback: [],
  },
];

export const portfolios = [
  {
    id: "pf-001",
    studentId: "stu-001",
    headline: "Frontend developer passionate about polished educational tools.",
    bio: "MET student focused on React, UI systems, and student-centered platforms.",
    projects: ["p-001"],
    achievements: ["DAAD Award", "ICPC Participant"],
    contactVisible: true,
  },
];

export const internships = [
  {
    id: "int-001",
    title: "Frontend Intern",
    companyName: "TechVista",
    employerId: "emp-001",
    location: "Cairo, Egypt",
    mode: "Hybrid",
    status: "open",
    skills: ["React", "Tailwind", "Git"],
    description:
      "Work with the product team to build responsive dashboards and student-facing interfaces.",
  },
];

export const notifications = [
  {
    id: "n-001",
    userId: "stu-001",
    type: "invitation",
    title: "Project invitation",
    message: "You were invited to collaborate on Campus Navigator.",
    read: false,
  },
  {
    id: "n-002",
    userId: "emp-001",
    type: "verification",
    title: "Verification pending",
    message: "Your company profile is waiting for admin approval.",
    read: false,
  },
];