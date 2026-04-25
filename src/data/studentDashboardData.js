export const student = {
  name: "Yasmin Khaled",
  email: "yasmin.khaled@student.guc.edu.eg",
  major: "Media Engineering and Technology",
  semester: 6,
  skills: ["React", "Tailwind", "UI/UX", "Java", "Node.js"],
  linkedin: "linkedin.com/in/yasmin-khaled",
  profileCompletion: 82,
};

export const projects = [
  {
    id: 1,
    title: "Smart Study Buddy",
    course: "CSEN 501 - Software Engineering",
    type: "Course Project",
    visibility: "Public",
    status: "Submitted",
    rating: 4.8,
    languages: ["React", "Node.js", "MongoDB"],
    collaborators: ["Mariam Adel", "Omar Tarek"],
    github: "github.com/demo/smart-study-buddy",
    demo: "demo-link.com",
    tasks: [
      { title: "Finalize UI screens", assignee: "Yasmin", status: "Completed", deadline: "May 2" },
      { title: "Prepare demo video", assignee: "Mariam", status: "Pending", deadline: "May 6" },
      { title: "Polish project writeup", assignee: "Omar", status: "Postponed", deadline: "May 8" },
    ],
    feedback: "Strong concept and clean presentation. Add clearer testing evidence.",
  },
  {
    id: 2,
    title: "Campus Navigator",
    course: "Bachelor Project",
    type: "Bachelor Project",
    visibility: "Private",
    status: "Draft",
    rating: 4.5,
    languages: ["Flutter", "Firebase"],
    collaborators: [],
    github: "github.com/demo/campus-navigator",
    demo: "demo-link.com",
    thesis: "CampusNavigator_FinalDraft.pdf",
    tasks: [
      { title: "Upload thesis draft", assignee: "Yasmin", status: "Completed", deadline: "May 1" },
      { title: "Mark final draft", assignee: "Yasmin", status: "Pending", deadline: "May 10" },
    ],
    feedback: "Supervisor requested more detail in methodology section.",
  },
];

export const notifications = [
  { title: "New instructor feedback", text: "Dr. Aya commented on Smart Study Buddy.", unread: true },
  { title: "Project invitation", text: "You were invited to join EcoTrack.", unread: true },
  { title: "Internship update", text: "Your Frontend Intern application was viewed.", unread: false },
];

export const recommendedProjects = [
  "EcoTrack",
  "GUC Course Planner",
  "AI Research Assistant",
];

export const internships = [
  {
    title: "Frontend Intern",
    company: "TechVista",
    status: "Applied",
    deadline: "May 20",
  },
  {
    title: "UI/UX Intern",
    company: "DesignLab Cairo",
    status: "Saved",
    deadline: "May 28",
  },
];