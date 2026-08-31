const extraPortfolios = [
  {
    id: 21,
    name: "Omar Khaled",
    email: "omar.khaled@guc.edu.eg",
    image:
      "https://randomuser.me/api/portraits/men/83.jpg",
    major: "Computer Science",
    level: "Semester 8",
    projects: 9,
    favorite: false,
    bio: "Backend-focused developer passionate about scalable APIs and distributed systems.",
    skills: ["Node.js", "Express", "MongoDB", "Docker", "SQL"],
  },

  {
    id: 22,
    name: "Laila Hassan",
    email: "laila.hassan@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1200&auto=format&fit=crop",
    major: "Information Systems",
    level: "Semester 7",
    projects: 5,
    favorite: false,
    bio: "Enjoys designing intuitive dashboards and data-driven experiences.",
    skills: ["React", "Figma", "Power BI", "UI/UX"],
  },

  {
    id: 23,
    name: "Youssef Adel",
    email: "youssef.adel@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    major: "Software Engineering",
    level: "Semester 9",
    projects: 11,
    favorite: false,
    bio: "Full-stack engineer interested in clean architecture and cloud computing.",
    skills: ["React", "Java", "Spring Boot", "AWS"],
  },

  {
    id: 24,
    name: "Mariam Nabil",
    email: "mariam.nabil@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    major: "Media Engineering and Technology",
    level: "Semester 6",
    projects: 4,
    favorite: false,
    bio: "Creative frontend developer with strong animation and branding skills.",
    skills: ["React", "Tailwind CSS", "Framer Motion", "Figma"],
  },

  {
    id: 25,
    name: "Karim Tarek",
    email: "karim.tarek@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1200&auto=format&fit=crop",
    major: "Computer Science",
    level: "Semester 10",
    projects: 12,
    favorite: false,
    bio: "AI enthusiast focused on machine learning and autonomous systems.",
    skills: ["Python", "TensorFlow", "OpenCV", "YOLO"],
  },

  {
    id: 26,
    name: "Nadine Mostafa",
    email: "nadine.mostafa@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    major: "Data Science",
    level: "Semester 8",
    projects: 7,
    favorite: false,
    bio: "Passionate about analytics, prediction models, and business intelligence.",
    skills: ["Python", "Pandas", "Machine Learning", "SQL"],
  },

  {
    id: 27,
    name: "Ahmed Samir",
    email: "ahmed.samir@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?q=80&w=1200&auto=format&fit=crop",
    major: "Software Engineering",
    level: "Semester 7",
    projects: 6,
    favorite: false,
    bio: "Builds collaborative productivity tools and enterprise web apps.",
    skills: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  },

  {
    id: 28,
    name: "Salma Fathy",
    email: "salma.fathy@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    major: "Information Systems",
    level: "Semester 5",
    projects: 3,
    favorite: false,
    bio: "Interested in user research and accessibility-first design systems.",
    skills: ["UI/UX", "Accessibility", "Figma", "React"],
  },

  {
    id: 29,
    name: "Hassan Ali",
    email: "hassan.ali@guc.edu.eg",
    image:
      "https://randomuser.me/api/portraits/men/47.jpg",
    major: "Computer Science",
    level: "Semester 9",
    projects: 10,
    favorite: false,
    bio: "Cybersecurity enthusiast building secure and resilient applications.",
    skills: ["Linux", "Cybersecurity", "Networking", "Python"],
  },

  {
    id: 30,
    name: "Farah Emad",
    email: "farah.emad@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    major: "Media Engineering and Technology",
    level: "Semester 6",
    projects: 5,
    favorite: false,
    bio: "Frontend developer who enjoys building elegant portfolio experiences.",
    skills: ["React", "Tailwind CSS", "JavaScript", "Figma"],
  },

  {
    id: 31,
    name: "Mahmoud Ashraf",
    email: "mahmoud.ashraf@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    major: "Software Engineering",
    level: "Semester 8",
    projects: 8,
    favorite: false,
    bio: "Enjoys scalable backend systems and clean code practices.",
    skills: ["Java", "Spring", "Docker", "MySQL"],
  },

  {
    id: 32,
    name: "Dina Wael",
    email: "dina.wael@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    major: "Data Science",
    level: "Semester 7",
    projects: 6,
    favorite: false,
    bio: "Data visualization lover focused on impactful storytelling.",
    skills: ["Tableau", "Python", "Analytics", "SQL"],
  },

  {
    id: 33,
    name: "Ziad Mostafa",
    email: "ziad.mostafa@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    major: "Computer Science",
    level: "Semester 10",
    projects: 13,
    favorite: false,
    bio: "Competitive programmer and systems enthusiast.",
    skills: ["C++", "Algorithms", "Data Structures", "Java"],
  },

  {
    id: 34,
    name: "Aya Tamer",
    email: "aya.tamer@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
    major: "UI/UX Design",
    level: "Semester 6",
    projects: 4,
    favorite: false,
    bio: "Design systems creator focused on modern mobile interfaces.",
    skills: ["Figma", "UI Design", "Prototyping", "Branding"],
  },

  {
    id: 35,
    name: "Adam Sherif",
    email: "adam.sherif@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    major: "Software Engineering",
    level: "Semester 9",
    projects: 9,
    favorite: false,
    bio: "Builds performant full-stack applications with modern tooling.",
    skills: ["React", "Next.js", "Node.js", "MongoDB"],
  },

  {
    id: 36,
    name: "Rana Hossam",
    email: "rana.hossam@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    major: "Information Systems",
    level: "Semester 8",
    projects: 7,
    favorite: false,
    bio: "Interested in business analysis and smart recommendation systems.",
    skills: ["SQL", "Power BI", "Python", "React"],
  },

  {
    id: 37,
    name: "Khaled Essam",
    email: "khaled.essam@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1200&auto=format&fit=crop",
    major: "Computer Science",
    level: "Semester 7",
    projects: 5,
    favorite: false,
    bio: "Backend developer interested in cloud-native applications.",
    skills: ["Go", "Docker", "Kubernetes", "Linux"],
  },

  {
    id: 38,
    name: "Jana Atef",
    email: "jana.atef@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=1200&auto=format&fit=crop",
    major: "Media Engineering and Technology",
    level: "Semester 5",
    projects: 3,
    favorite: false,
    bio: "Passionate about storytelling through digital product design.",
    skills: ["Figma", "UI/UX", "Illustrator", "React"],
  },

  {
    id: 39,
    name: "Mostafa Ibrahim",
    email: "mostafa.ibrahim@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    major: "Software Engineering",
    level: "Semester 10",
    projects: 14,
    favorite: false,
    bio: "Enjoys leading large collaborative software engineering projects.",
    skills: ["Java", "Spring Boot", "Agile", "AWS"],
  },

  {
    id: 40,
    name: "Hana Magdy",
    email: "hana.magdy@guc.edu.eg",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    major: "Data Science",
    level: "Semester 8",
    projects: 6,
    favorite: false,
    bio: "Focused on AI-powered healthcare and predictive analytics.",
    skills: ["Python", "TensorFlow", "Data Analysis", "SQL"],
  },
];