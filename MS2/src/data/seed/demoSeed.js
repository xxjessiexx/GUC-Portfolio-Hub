// src/data/seed/demoSeed.js
// Strict v6 merged revision against agreement, CV, requirements, and current React code.
// Rule: relationships use stable IDs. Display names are derived through demoStore helpers.
import {
  extraDemoEmployerUsers,
  extraDemoInternships,
} from "./extra-demo-internships-50"

export const DEMO_DATA_VERSION = "ms2-linked-demo-v6-merged-audited-2026-05-09";

export const usersSeed = [
  {
    "id": "student-demo-1",
    "isDemo": true,
    "role": "student",
    "systemRole": "student",
    "accountRole": "student",
    "name": "Yasmin Khaled",
    "email": "yasmin@student.guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [
      "project-portfolio-hub",
      "project-bfmc-raven",
      "project-os-scheduler"
    ],
    "favoritePortfolioIds": [
      "student-farida",
      "student-salma"
    ],
    "notificationMuted": false,
    "firstName": "Yasmin",
    "lastName": "Khaled",
    "faculty": "Media Engineering and Technology",
    "major": "Media Engineering and Technology",
    "semester": "6",
    "level": "Semester 6",
    "title": "MET Student · Full-stack & AI",
    "bio": "MET student passionate about full-stack development, AI, autonomous systems, and polished product design.",
    "skills": [
      "React",
      "Tailwind CSS",
      "shadcn/ui",
      "JavaScript",
      "Node.js",
      "Python",
      "OpenCV",
      "YOLO",
      "Java",
      "SQL",
      "UI/UX"
    ],
    "links": {
      "linkedin": "https://linkedin.com/in/yasmin-khaled-727767257",
      "github": "https://github.com/xxjessiexx",
      "behance": "https://behance.net/yasminkhaled17"
    }
  },
  {
    "id": "instructor-demo-1",
    "isDemo": true,
    "role": "instructor",
    "systemRole": "instructor",
    "accountRole": "instructor",
    "name": "Dr. Mervat Abulkheir",
    "email": "mervat@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "department": "Computer Science",
    "faculty": "Faculty of Engineering",
    "title": "Lecturer",
    "office": "C7.214",
    "bio": "Instructor focused on software engineering, web technologies, and student project mentorship.",
    "researchInterests": [
      "Software Engineering",
      "Web Technologies",
      "Project Mentorship",
      "HCI"
    ],
    "education": [
      "PhD in Computer Science",
      "MSc in Software Engineering"
    ],
    "linkedCourseIds": [
      "course-csen603",
      "course-csen403",
      "course-csen502",
      "course-bachelor"
    ]
  },
  {
    "id": "employer-demo-1",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "Omar Adel",
    "email": "omar@techbridge.com",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [
      "project-bfmc-raven",
      "project-portfolio-hub",
      "project-os-scheduler"
    ],
    "favoritePortfolioIds": [
      "student-demo-1",
      "student-mai",
      "student-noor"
    ],
    "notificationMuted": false,
    "companyName": "TechBridge",
    "position": "Talent Acquisition Lead",
    "industry": "Software, AI & Automotive Tech",
    "companyBio": "TechBridge hires internship-ready students with strong portfolios, clean documentation, and practical software experience.",
    "bio": "Looking for strong student portfolios, clean project documentation, and internship-ready candidates.",
    "location": {
      "label": "New Cairo, Egypt",
      "lat": 30.0074,
      "lng": 31.4913
    },
    "verificationStatus": "approved",
    "uploadedDocuments": [
      {
        "id": "doc-techbridge-tax",
        "name": "TechBridge Tax Certificate.pdf",
        "type": "Tax certificate",
        "status": "approved"
      },
      {
        "id": "doc-techbridge-register",
        "name": "TechBridge Commercial Register.pdf",
        "type": "Commercial register",
        "status": "approved"
      }
    ]
  },
  {
    "id": "admin-demo-1",
    "isDemo": true,
    "role": "admin",
    "systemRole": "admin",
    "accountRole": "admin",
    "name": "Nadine Amin",
    "email": "admin@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "username": "nadine.admin",
    "title": "Platform Administrator",
    "bio": "Responsible for verifying employers, managing users and courses, reviewing flags and appeals, and monitoring platform usage.",
    "faculty": "German University in Cairo",
    "major": "Platform Administration"
  },
  {
    "id": "instructor-slim",
    "isDemo": true,
    "role": "instructor",
    "systemRole": "instructor",
    "accountRole": "instructor",
    "name": "Dr. Slim Abdelnader",
    "email": "slim@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "department": "Computer Science",
    "faculty": "Faculty of Engineering",
    "title": "Course Instructor",
    "office": "C7.201",
    "bio": "Algorithms, programming education, and software quality.",
    "researchInterests": [
      "Course Projects",
      "Student Feedback",
      "Software Quality"
    ],
    "education": [
      "PhD in Computer Science"
    ],
    "linkedCourseIds": [
      "course-csen401"
    ]
  },
  {
    "id": "instructor-catherine",
    "isDemo": true,
    "role": "instructor",
    "systemRole": "instructor",
    "accountRole": "instructor",
    "name": "Dr. Catherine Elias",
    "email": "catherine@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "department": "Computer Science",
    "faculty": "Faculty of Engineering",
    "title": "Course Instructor",
    "office": "C7.305",
    "bio": "Computer architecture, VLIW, and systems thinking.",
    "researchInterests": [
      "Course Projects",
      "Student Feedback",
      "Software Quality"
    ],
    "education": [
      "PhD in Computer Science"
    ],
    "linkedCourseIds": [
      "course-csen601"
    ]
  },
  {
    "id": "instructor-aya",
    "isDemo": true,
    "role": "instructor",
    "systemRole": "instructor",
    "accountRole": "instructor",
    "name": "Dr. Aya Abdelhady",
    "email": "aya@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "department": "Computer Science",
    "faculty": "Faculty of Engineering",
    "title": "Course Instructor",
    "office": "C7.118",
    "bio": "Systems and database-oriented project supervision.",
    "researchInterests": [
      "Course Projects",
      "Student Feedback",
      "Software Quality"
    ],
    "education": [
      "PhD in Computer Science"
    ],
    "linkedCourseIds": [
      "course-csen602"
    ]
  },
  {
    "id": "instructor-karam",
    "isDemo": true,
    "role": "instructor",
    "systemRole": "instructor",
    "accountRole": "instructor",
    "name": "Dr. Mohamed Karam",
    "email": "mohamed.karam@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "department": "Computer Science",
    "faculty": "Faculty of Engineering",
    "title": "Course Instructor",
    "office": "C7.407",
    "bio": "Databases, logic programming, and practical engineering projects.",
    "researchInterests": [
      "Course Projects",
      "Student Feedback",
      "Software Quality"
    ],
    "education": [
      "PhD in Computer Science"
    ],
    "linkedCourseIds": [
      "course-csen604"
    ]
  },
  {
    "id": "instructor-youmna",
    "isDemo": true,
    "role": "instructor",
    "systemRole": "instructor",
    "accountRole": "instructor",
    "name": "Dr. Youmna Mohamed",
    "email": "youmna@guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "department": "Computer Science",
    "faculty": "Faculty of Engineering",
    "title": "Course Instructor",
    "office": "C7.222",
    "bio": "Portfolio-oriented web projects and presentation quality.",
    "researchInterests": [
      "Course Projects",
      "Student Feedback",
      "Software Quality"
    ],
    "education": [
      "PhD in Computer Science"
    ],
    "linkedCourseIds": [
      "course-csen403"
    ]
  },
  {
    "id": "student-farida",
    "isDemo": true,
    "role": "student",
    "systemRole": "student",
    "accountRole": "student",
    "name": "Farida Tarek",
    "email": "farida@student.guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "faculty": "Media Engineering and Technology",
    "major": "Media Engineering and Technology",
    "semester": "6",
    "level": "Semester 6",
    "title": "MET Student",
    "bio": "Frontend-focused collaborator with a strong eye for polished interfaces and accessible portfolio pages.",
    "skills": [
      "React",
      "Tailwind CSS",
      "Figma",
      "JavaScript",
      "Accessibility"
    ],
    "links": {
      "linkedin": "https://linkedin.com/in/farida-tarek-demo",
      "github": "https://github.com/farida-tarek-demo",
      "behance": "https://behance.net/faridatdemo"
    }
  },
  {
    "id": "student-salma",
    "isDemo": true,
    "role": "student",
    "systemRole": "student",
    "accountRole": "student",
    "name": "Salma Hazem",
    "email": "salma@student.guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "faculty": "Media Engineering and Technology",
    "major": "Media Engineering and Technology",
    "semester": "6",
    "level": "Semester 6",
    "title": "MET Student",
    "bio": "Product-minded student who enjoys documentation, UI structure, and project storytelling.",
    "skills": [
      "UI/UX",
      "Figma",
      "Documentation",
      "React",
      "Presentation Design"
    ],
    "links": {
      "linkedin": "https://linkedin.com/in/salma-hazem-demo",
      "github": "https://github.com/salma-hazem-demo",
      "behance": "https://behance.net/salmahazemdemo"
    }
  },
  {
    "id": "student-mai",
    "isDemo": true,
    "role": "student",
    "systemRole": "student",
    "accountRole": "student",
    "name": "Mai Hassan",
    "email": "mai@student.guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "faculty": "Media Engineering and Technology",
    "major": "Media Engineering and Technology",
    "semester": "6",
    "level": "Semester 6",
    "title": "MET Student",
    "bio": "Backend-oriented student interested in APIs, database schemas, and clean software architecture.",
    "skills": [
      "Node.js",
      "Express",
      "SQL",
      "MongoDB",
      "REST APIs"
    ],
    "links": {
      "linkedin": "https://linkedin.com/in/mai-hassan-demo",
      "github": "https://github.com/mai-hassan-demo",
      "behance": ""
    }
  },
  {
    "id": "student-yasmine",
    "isDemo": true,
    "role": "student",
    "systemRole": "student",
    "accountRole": "student",
    "name": "Yasmine Omar",
    "email": "yasmine@student.guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "faculty": "Media Engineering and Technology",
    "major": "Media Engineering and Technology",
    "semester": "6",
    "level": "Semester 6",
    "title": "MET Student",
    "bio": "Systems and Java developer who enjoys simulators, desktop apps, and course project logic.",
    "skills": [
      "Java",
      "JavaFX",
      "OOP",
      "Algorithms",
      "Git"
    ],
    "links": {
      "linkedin": "https://linkedin.com/in/yasmine-omar-demo",
      "github": "https://github.com/yasmine-omar-demo",
      "behance": ""
    }
  },
  {
    "id": "student-noor",
    "isDemo": true,
    "role": "student",
    "systemRole": "student",
    "accountRole": "student",
    "name": "Noor Samir",
    "email": "noor@student.guc.edu.eg",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "faculty": "Media Engineering and Technology",
    "major": "Media Engineering and Technology",
    "semester": "6",
    "level": "Semester 6",
    "title": "MET Student",
    "bio": "AI and data student interested in computer vision, analytics, and research-style projects.",
    "skills": [
      "Python",
      "OpenCV",
      "YOLO",
      "Data Analysis",
      "Machine Learning"
    ],
    "links": {
      "linkedin": "https://linkedin.com/in/noor-samir-demo",
      "github": "https://github.com/noor-samir-demo",
      "behance": ""
    }
  },
  {
    "id": "employer-niletech",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "NileTech AI",
    "email": "careers@niletech.ai",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "companyName": "NileTech AI",
    "position": "Recruitment Team",
    "industry": "Artificial Intelligence",
    "companyBio": "AI company hiring interns for applied ML and data products.",
    "bio": "AI company hiring interns for applied ML and data products.",
    "location": {
      "label": "Cairo, Egypt"
    },
    "verificationStatus": "approved"
  },
  {
    "id": "employer-robocairo",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "RoboCairo",
    "email": "talent@robocairo.com",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "companyName": "RoboCairo",
    "position": "Recruitment Team",
    "industry": "Robotics",
    "companyBio": "Robotics startup building perception and embedded prototypes.",
    "bio": "Robotics startup building perception and embedded prototypes.",
    "location": {
      "label": "Cairo, Egypt"
    },
    "verificationStatus": "approved"
  },
  {
    "id": "employer-delta",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "Delta Fintech",
    "email": "internships@deltafintech.com",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "companyName": "Delta Fintech",
    "position": "Recruitment Team",
    "industry": "Fintech",
    "companyBio": "Fintech product team looking for backend and data interns.",
    "bio": "Fintech product team looking for backend and data interns.",
    "location": {
      "label": "Cairo, Egypt"
    },
    "verificationStatus": "approved"
  },
  {
    "id": "employer-greenbyte",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "Greenbyte Solutions",
    "email": "hr@greenbyte.com",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "companyName": "Greenbyte Solutions",
    "position": "Recruitment Team",
    "industry": "Software Engineering",
    "companyBio": "Software house offering practical engineering internships.",
    "bio": "Software house offering practical engineering internships.",
    "location": {
      "label": "Cairo, Egypt"
    },
    "verificationStatus": "approved"
  },
  {
    "id": "employer-codewave",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "CodeWave Labs",
    "email": "people@codewave.dev",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "companyName": "CodeWave Labs",
    "position": "Recruitment Team",
    "industry": "Frontend Engineering",
    "companyBio": "Product lab focused on modern frontend and web apps.",
    "bio": "Product lab focused on modern frontend and web apps.",
    "location": {
      "label": "Cairo, Egypt"
    },
    "verificationStatus": "approved"
  },
  {
    "id": "employer-designlab",
    "isDemo": true,
    "role": "employer",
    "systemRole": "employer",
    "accountRole": "employer",
    "name": "DesignLab Cairo",
    "email": "careers@designlabcairo.com",
    "password": "123456",
    "avatar": "",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    "status": "active",
    "favoriteProjectIds": [],
    "favoritePortfolioIds": [],
    "notificationMuted": false,
    "companyName": "DesignLab Cairo",
    "position": "Recruitment Team",
    "industry": "Product Design",
    "companyBio": "Design studio mentoring UI/UX and product students.",
    "bio": "Design studio mentoring UI/UX and product students.",
    "location": {
      "label": "Cairo, Egypt"
    },
    "verificationStatus": "approved"
  },
  ... extraDemoEmployerUsers,
];

export const coursesSeed = [
  {
    "id": "course-csen401",
    "code": "CSEN 401",
    "name": "Computer Science Fundamentals",
    "type": "Course",
    "instructorIds": [
      "instructor-slim"
    ],
    "linkedProjectIds": [
      "project-audio-noise",
      "project-railway-optimization"
    ],
    "status": "active"
  },
  {
    "id": "course-csen601",
    "code": "CSEN 601",
    "name": "Computer Architecture",
    "type": "Course",
    "instructorIds": [
      "instructor-catherine"
    ],
    "linkedProjectIds": [
      "project-os-scheduler"
    ],
    "status": "active"
  },
  {
    "id": "course-csen602",
    "code": "CSEN 602",
    "name": "Operating Systems",
    "type": "Course",
    "instructorIds": [
      "instructor-aya"
    ],
    "linkedProjectIds": [
      "project-jackaroo"
    ],
    "status": "active"
  },
  {
    "id": "course-csen603",
    "code": "CSEN 603",
    "name": "Software Engineering",
    "type": "Course",
    "instructorIds": [
      "instructor-demo-1"
    ],
    "linkedProjectIds": [
      "project-portfolio-hub"
    ],
    "status": "active"
  },
  {
    "id": "course-csen604",
    "code": "CSEN 604",
    "name": "Databases & Logic",
    "type": "Course",
    "instructorIds": [
      "instructor-karam"
    ],
    "linkedProjectIds": [
      "project-hr-management",
      "project-class-scheduling"
    ],
    "status": "active"
  },
  {
    "id": "course-csen403",
    "code": "CSEN 403",
    "name": "Web & Mobile Computing",
    "type": "Course",
    "instructorIds": [
      "instructor-youmna",
      "instructor-demo-1"
    ],
    "linkedProjectIds": [
      "project-travel-destination",
      "project-smart-study-buddy"
    ],
    "status": "active"
  },
  {
    "id": "course-csen502",
    "code": "CSEN 502",
    "name": "Advanced Software Project",
    "type": "Course",
    "instructorIds": [
      "instructor-demo-1"
    ],
    "linkedProjectIds": [
      "project-bfmc-raven"
    ],
    "status": "active"
  },
  {
    "id": "course-bachelor",
    "code": "DMET 401",
    "name": "Bachelor Project",
    "type": "Bachelor Project",
    "instructorIds": [
      "instructor-demo-1"
    ],
    "linkedProjectIds": [
      "project-bachelor-autonomous-vehicle"
    ],
    "status": "pending-link",
    "linkRequest": {
      "id": "linkreq-bachelor-mervat",
      "requestedById": "instructor-demo-1",
      "action": "link",
      "status": "pending",
      "createdAt": "2026-05-05T12:00:00.000Z"
    }
  },
  {
    "id": "course-portfolio-showcase",
    "code": "PORTFOLIO",
    "name": "Student Portfolio Showcase",
    "type": "Portfolio Showcase",
    "status": "active",
    "instructorIds": [
      "instructor-demo-1"
    ],
    "linkedProjectIds": [
      "project-farida-design-system",
      "project-salma-case-study",
      "project-mai-api-hub",
      "project-yasmine-java-sim",
      "project-noor-vision-lab"
    ],
    "description": "Non-evaluation showcase course used only to give collaborator profiles their own public portfolio projects."
  }
];

export const projectsSeed = [
  {
    "id": "project-portfolio-hub",
    "isDemo": true,
    "title": "Project Portfolio Web Platform",
    "type": "Course Project",
    "courseId": "course-csen603",
    "courseCode": "CSEN 603",
    "courseName": "Software Engineering",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-salma",
      "student-mai",
      "student-yasmine",
      "student-farida",
      "student-noor"
    ],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": true,
    "featured": true,
    "rating": 4.9,
    "createdAt": "2026-04-18T10:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "JavaScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js"
    ],
    "technologies": [
      "React",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "REST APIs",
      "Git/GitHub"
    ],
    "tags": [
      "React",
      "Vite",
      "shadcn/ui",
      "Portfolio"
    ],
    "github": "https://github.com/xxjessiexx/guc-portfolio-hub",
    "demoUrl": "https://guc-portfolio-hub.demo",
    "description": "University portfolio platform with authentication flows, role-based pages, project creation, media upload support, discovery, and reusable component architecture optimized for responsive UI/UX and redesignability.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [
      {
        "id": "task-ph-1",
        "title": "Unify dummy data source",
        "assigneeId": "student-demo-1",
        "status": "pending",
        "deadline": "2026-05-11"
      },
      {
        "id": "task-ph-2",
        "title": "Wire discovery pages to store",
        "assigneeId": "student-salma",
        "status": "completed",
        "deadline": "2026-05-10"
      }
    ],
    "feedback": [
      {
        "id": "fb-portfolio-1",
        "authorId": "instructor-demo-1",
        "message": "Excellent redesignability direction. Keep relationships linked by ID so evaluation flows are consistent.",
        "createdAt": "2026-05-08T19:30:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-salma",
        "status": "accepted"
      },
      {
        "userId": "student-mai",
        "status": "accepted"
      },
      {
        "userId": "student-yasmine",
        "status": "accepted"
      },
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "student-noor",
        "status": "accepted"
      },
      {
        "userId": "instructor-demo-1",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-portfolio-1",
        "userId": "instructor-demo-1",
        "text": "Good redesignability direction. Make sure dummy data stays synchronized across role pages.",
        "createdAt": "2026-05-07T15:30:00.000Z"
      }
    ]
  },
  {
    "id": "project-bfmc-raven",
    "isDemo": true,
    "title": "Autonomous Vehicle Perception System",
    "type": "Course Project",
    "courseId": "course-csen502",
    "courseCode": "CSEN 502",
    "courseName": "Advanced Software Project",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-salma",
      "student-mai",
      "student-yasmine",
      "student-farida",
      "student-noor"
    ],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "visibility": "public",
    "status": "flagged",
    "pinned": true,
    "featured": true,
    "rating": 4.8,
    "createdAt": "2026-03-20T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Python",
      "OpenCV",
      "YOLO",
      "C++"
    ],
    "technologies": [
      "Raspberry Pi",
      "OpenCV",
      "YOLO",
      "TCP",
      "Serial",
      "Multithreading"
    ],
    "tags": [
      "YOLO",
      "OpenCV",
      "Raspberry Pi",
      "Autonomous Driving"
    ],
    "github": "https://github.com/xxjessiexx/bfmc-raven-perception",
    "demoUrl": "https://bfmc-raven.demo",
    "description": "Autonomous vehicle perception pipeline using lane detection, object detection for signs/pedestrians/vehicles, multithreading, and distributed communication across laptop, Raspberry Pi, and Arduino RP2040.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-bfmc-1",
        "authorId": "instructor-demo-1",
        "message": "Strong technical depth. Add clearer model-training documentation and dataset references.",
        "createdAt": "2026-05-03T12:00:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-salma",
        "status": "accepted"
      },
      {
        "userId": "student-mai",
        "status": "accepted"
      },
      {
        "userId": "student-yasmine",
        "status": "accepted"
      },
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "student-noor",
        "status": "accepted"
      },
      {
        "userId": "instructor-demo-1",
        "status": "accepted"
      }
    ],
    "flag": {
      "reason": "Dataset attribution needed before final public showcase.",
      "flaggedById": "instructor-demo-1",
      "appealStatus": "submitted",
      "active": false
    },
    "comments": [
      {
        "id": "comment-bfmc-1",
        "userId": "instructor-demo-1",
        "text": "Flag reason is visible. Prepare the appeal flow for the admin evaluation.",
        "createdAt": "2026-05-03T12:00:00.000Z"
      }
    ]
  },
  {
    "id": "project-os-scheduler",
    "isDemo": true,
    "title": "Operating System Scheduler Simulator",
    "type": "Course Project",
    "courseId": "course-csen601",
    "courseCode": "CSEN 601",
    "courseName": "Computer Architecture",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-mai",
      "student-yasmine",
      "student-farida"
    ],
    "instructorIds": [
      "instructor-catherine"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.7,
    "createdAt": "2026-02-14T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Java",
      "JavaFX"
    ],
    "technologies": [
      "Java",
      "JavaFX",
      "OOP",
      "Data Structures",
      "Algorithms"
    ],
    "tags": [
      "Java",
      "JavaFX",
      "Scheduling"
    ],
    "github": "https://github.com/xxjessiexx/os-scheduler-simulator",
    "demoUrl": "",
    "description": "Interactive CPU scheduling simulator visualizing FCFS, SJF, SRTF, Round Robin, Priority Scheduling, and MLFQ with timing metrics and execution timeline.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-os-1",
        "authorId": "instructor-catherine",
        "message": "The visual timeline makes the scheduling behavior easy to understand.",
        "createdAt": "2026-04-20T12:00:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-mai",
        "status": "accepted"
      },
      {
        "userId": "student-yasmine",
        "status": "accepted"
      },
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "instructor-catherine",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-os-1",
        "userId": "instructor-catherine",
        "text": "The timeline visualization is helpful. Clarify starvation handling in priority scheduling.",
        "createdAt": "2026-04-21T11:15:00.000Z"
      }
    ]
  },
  {
    "id": "project-hr-management",
    "isDemo": true,
    "title": "University HR Management System",
    "type": "Course Project",
    "courseId": "course-csen604",
    "courseCode": "CSEN 604",
    "courseName": "Databases & Logic",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-farida"
    ],
    "instructorIds": [
      "instructor-karam"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.6,
    "createdAt": "2025-11-03T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "SQL",
      "T-SQL"
    ],
    "technologies": [
      "SQL Server",
      "T-SQL",
      "Stored Procedures",
      "Functions",
      "Views",
      "EERD",
      "Relational Schema"
    ],
    "tags": [
      "SQL Server",
      "T-SQL",
      "Database"
    ],
    "github": "https://github.com/xxjessiexx/university-hr-management-system",
    "demoUrl": "",
    "description": "Multi-role HR database system handling attendance, payroll, bonuses/deductions, leave workflows, approval chains, validation, and role-based modules for Admin, HR, and Academic Employees.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-hr-1",
        "instructorId": "instructor-karam",
        "authorId": "instructor-karam",
        "text": "Good database coverage. Add one screenshot of stored procedure testing.",
        "rating": 4.5,
        "createdAt": "2026-03-18T14:00:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "instructor-karam",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-hr-1",
        "userId": "instructor-karam",
        "text": "Your schema is complete; explain approval-chain edge cases more clearly.",
        "createdAt": "2026-03-18T14:10:00.000Z"
      }
    ]
  },
  {
    "id": "project-class-scheduling",
    "isDemo": true,
    "title": "Class Scheduling System",
    "type": "Course Project",
    "courseId": "course-csen604",
    "courseCode": "CSEN 604",
    "courseName": "Databases & Logic",
    "ownerId": "student-demo-1",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-karam"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.2,
    "createdAt": "2025-02-01T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Prolog"
    ],
    "technologies": [
      "Prolog",
      "Logic Programming",
      "Constraint Rules"
    ],
    "tags": [
      "Prolog",
      "Scheduling",
      "Rules"
    ],
    "github": "https://github.com/xxjessiexx/class-scheduling-system",
    "demoUrl": "",
    "description": "Rule-based course scheduling system generating conflict-free timetables while avoiding clashes and ensuring students have two days off.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-class-1",
        "authorId": "instructor-karam",
        "message": "Good use of constraints. Add more examples to the README.",
        "createdAt": "2025-02-20T12:00:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "instructor-karam",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-class-1",
        "userId": "instructor-karam",
        "text": "Nice Prolog constraint explanation. Include one impossible-schedule example.",
        "createdAt": "2026-03-20T13:00:00.000Z"
      }
    ]
  },
  {
    "id": "project-travel-destination",
    "isDemo": true,
    "title": "Travel Destination Web Application",
    "type": "Course Project",
    "courseId": "course-csen403",
    "courseCode": "CSEN 403",
    "courseName": "Web & Mobile Computing",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-yasmine",
      "student-noor"
    ],
    "instructorIds": [
      "instructor-youmna",
      "instructor-demo-1"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.5,
    "createdAt": "2025-08-15T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "JavaScript",
      "Node.js",
      "MongoDB"
    ],
    "technologies": [
      "Node.js",
      "Express.js",
      "EJS",
      "MongoDB",
      "express-session"
    ],
    "tags": [
      "Node.js",
      "MongoDB",
      "EJS"
    ],
    "github": "https://github.com/xxjessiexx/travel-destination-web-app",
    "demoUrl": "",
    "description": "Full-stack travel website with authentication, session-based multi-user access, destination browsing, embedded videos, personalized want-to-go lists, and keyword search.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-travel-1",
        "instructorId": "instructor-youmna",
        "authorId": "instructor-youmna",
        "text": "Good session-based user flow. Add validation notes for the personalized want-to-go list.",
        "rating": 4.4,
        "createdAt": "2026-02-26T13:30:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-yasmine",
        "status": "accepted"
      },
      {
        "userId": "student-noor",
        "status": "accepted"
      },
      {
        "userId": "instructor-youmna",
        "status": "accepted"
      },
      {
        "userId": "instructor-demo-1",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-travel-1",
        "userId": "instructor-demo-1",
        "text": "The project is portfolio-ready; improve the README structure before publishing.",
        "createdAt": "2026-02-26T13:45:00.000Z"
      }
    ]
  },
  {
    "id": "project-smart-study-buddy",
    "isDemo": true,
    "title": "Smart Study Buddy",
    "type": "Course Project",
    "courseId": "course-csen403",
    "courseCode": "CSEN 403",
    "courseName": "Web & Mobile Computing",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-yasmine",
      "student-noor"
    ],
    "instructorIds": [
      "instructor-youmna",
      "instructor-demo-1"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.6,
    "createdAt": "2026-01-15T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "React",
      "Node.js",
      "MongoDB"
    ],
    "technologies": [
      "React",
      "Node.js",
      "MongoDB",
      "Tailwind CSS"
    ],
    "tags": [
      "React",
      "Node.js",
      "Study Tool"
    ],
    "github": "https://github.com/xxjessiexx/smart-study-buddy",
    "demoUrl": "",
    "description": "Study support dashboard for organizing revision tasks, resources, and project milestones.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-study-1",
        "instructorId": "instructor-youmna",
        "authorId": "instructor-youmna",
        "text": "Strong user value. Add more testing evidence for recommendation results.",
        "rating": 4.6,
        "createdAt": "2026-02-28T13:30:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-yasmine",
        "status": "accepted"
      },
      {
        "userId": "student-noor",
        "status": "accepted"
      },
      {
        "userId": "instructor-youmna",
        "status": "accepted"
      },
      {
        "userId": "instructor-demo-1",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-study-1",
        "userId": "instructor-demo-1",
        "text": "Good use of collaborative tasks; show how instructors see feedback in the demo.",
        "createdAt": "2026-02-28T13:45:00.000Z"
      }
    ]
  },
  {
    "id": "project-jackaroo",
    "isDemo": true,
    "title": "Jackaroo Game",
    "type": "Course Project",
    "courseId": "course-csen602",
    "courseCode": "CSEN 602",
    "courseName": "Operating Systems",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-mai",
      "student-yasmine",
      "student-farida"
    ],
    "instructorIds": [
      "instructor-aya"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.4,
    "createdAt": "2025-05-10T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Java",
      "JavaFX"
    ],
    "technologies": [
      "Java",
      "JavaFX",
      "OOP",
      "Git"
    ],
    "tags": [
      "Java",
      "JavaFX",
      "Game"
    ],
    "github": "https://github.com/xxjessiexx/jackaroo-game",
    "demoUrl": "",
    "description": "Modular board game with multiplayer mechanics, animations, score tracking, and object-oriented game logic.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [],
    "invitationStatuses": [
      {
        "userId": "student-mai",
        "status": "accepted"
      },
      {
        "userId": "student-yasmine",
        "status": "accepted"
      },
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "instructor-aya",
        "status": "accepted"
      }
    ]
  },
  {
    "id": "project-audio-noise",
    "isDemo": true,
    "title": "Audio Signal Processing & Noise Cancellation",
    "type": "Course Project",
    "courseId": "course-csen401",
    "courseCode": "CSEN 401",
    "courseName": "Computer Science Fundamentals",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-farida",
      "student-salma"
    ],
    "instructorIds": [
      "instructor-slim"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.3,
    "createdAt": "2025-03-06T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Python"
    ],
    "technologies": [
      "Python",
      "FFT",
      "Signal Processing"
    ],
    "tags": [
      "Python",
      "FFT",
      "Signal Processing"
    ],
    "github": "https://github.com/xxjessiexx/audio-noise-cancellation",
    "demoUrl": "",
    "description": "Generated piano signals, combined melodies, simulated noise, and removed noise using frequency-domain filtering.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-audio-1",
        "instructorId": "instructor-slim",
        "authorId": "instructor-slim",
        "text": "Clear FFT explanation. Add one more screenshot showing the before/after frequency spectrum.",
        "rating": 4.6,
        "createdAt": "2026-04-16T10:00:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "student-salma",
        "status": "accepted"
      },
      {
        "userId": "instructor-slim",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-audio-1",
        "userId": "instructor-slim",
        "text": "Good signal-processing documentation; make the assumptions section easier to scan.",
        "createdAt": "2026-04-16T10:10:00.000Z"
      }
    ]
  },
  {
    "id": "project-railway-optimization",
    "isDemo": true,
    "title": "Railway Network Optimization",
    "type": "Course Project",
    "courseId": "course-csen401",
    "courseCode": "CSEN 401",
    "courseName": "Computer Science Fundamentals",
    "ownerId": "student-demo-1",
    "collaboratorIds": [
      "student-farida",
      "student-salma"
    ],
    "instructorIds": [
      "instructor-slim"
    ],
    "visibility": "public",
    "status": "approved",
    "pinned": false,
    "featured": false,
    "rating": 4.1,
    "createdAt": "2025-01-10T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Haskell"
    ],
    "technologies": [
      "Haskell",
      "Dijkstra’s Algorithm",
      "A* Search",
      "Graphs"
    ],
    "tags": [
      "Haskell",
      "Dijkstra",
      "A*"
    ],
    "github": "https://github.com/xxjessiexx/railway-network-optimization",
    "demoUrl": "",
    "description": "Modeled railway stations as a weighted directed graph using adjacency matrices and computed optimal shortest paths.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [
      {
        "id": "fb-railway-1",
        "instructorId": "instructor-slim",
        "authorId": "instructor-slim",
        "text": "Strong algorithmic comparison between Dijkstra and A*. Add a small complexity table.",
        "rating": 4.7,
        "createdAt": "2026-04-17T10:00:00.000Z"
      }
    ],
    "invitationStatuses": [
      {
        "userId": "student-farida",
        "status": "accepted"
      },
      {
        "userId": "student-salma",
        "status": "accepted"
      },
      {
        "userId": "instructor-slim",
        "status": "accepted"
      }
    ],
    "comments": [
      {
        "id": "comment-railway-1",
        "userId": "instructor-slim",
        "text": "The graph model is convincing; include one sample route trace in the report.",
        "createdAt": "2026-04-17T10:15:00.000Z"
      }
    ]
  },
  {
    "id": "project-bachelor-autonomous-vehicle",
    "isDemo": true,
    "title": "Bachelor Project: Autonomous Vehicle System",
    "type": "Bachelor Project",
    "courseId": "course-bachelor",
    "courseCode": "DMET 401",
    "courseName": "Bachelor Project",
    "ownerId": "student-demo-1",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "visibility": "public",
    "status": "in-progress",
    "pinned": true,
    "featured": false,
    "rating": 4.9,
    "createdAt": "2026-04-01T12:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z",
    "languages": [
      "Python",
      "C++"
    ],
    "technologies": [
      "ROS 2",
      "OpenCV",
      "YOLO",
      "Raspberry Pi",
      "Arduino RP2040"
    ],
    "tags": [
      "ROS 2",
      "OpenCV",
      "YOLO"
    ],
    "github": "https://github.com/xxjessiexx/autonomous-vehicle-system",
    "demoUrl": "",
    "description": "Bachelor project for an autonomous vehicle stack with high-level laptop control, Raspberry Pi perception, and Arduino low-level control.",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "tasks": [],
    "feedback": [],
    "invitationStatuses": [
      {
        "userId": "instructor-demo-1",
        "status": "accepted"
      }
    ],
    "thesisDrafts": [
      {
        "id": "thesis-draft-1",
        "title": "Draft 1",
        "visibility": "private",
        "isFinal": false,
        "uploadedAt": "2026-04-20"
      },
      {
        "id": "thesis-final",
        "title": "Final Draft",
        "visibility": "public",
        "isFinal": true,
        "uploadedAt": "2026-05-08"
      }
    ]
  },
  {
    "id": "project-farida-design-system",
    "isDemo": true,
    "ownerId": "student-farida",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "courseId": "course-portfolio-showcase",
    "courseCode": "PORTFOLIO",
    "courseName": "Student Portfolio Showcase",
    "type": "Portfolio Project",
    "visibility": "public",
    "status": "approved",
    "featured": false,
    "pinned": false,
    "createdAt": "2026-04-10T12:00:00.000Z",
    "updatedAt": "2026-04-12T12:00:00.000Z",
    "github": "https://github.com/demo/project-farida-design-system",
    "demoUrl": "https://demo.guc-portfolio.local/showcase",
    "report": "Showcase_Report.pdf",
    "tasks": [
      {
        "id": "task-project-farida-design-system-1",
        "title": "Prepare public portfolio card",
        "description": "Write a short, clean summary and select a thumbnail.",
        "assigneeId": "student-farida",
        "status": "completed",
        "deadline": "2026-04-18",
        "priority": 1
      }
    ],
    "feedback": [
      {
        "id": "fb-project-farida-design-system-1",
        "instructorId": "instructor-demo-1",
        "authorId": "instructor-demo-1",
        "text": "Good portfolio-ready showcase project. Keep the README concise.",
        "rating": 4.5,
        "createdAt": "2026-04-20T10:00:00.000Z"
      }
    ],
    "comments": [],
    "title": "Accessible Portfolio Design System",
    "description": "A reusable React and Tailwind component library for student portfolio cards, search states, empty states, and profile sections.",
    "tags": [
      "React",
      "Tailwind CSS",
      "Accessibility",
      "Design Systems"
    ],
    "languages": [
      "JavaScript",
      "CSS"
    ],
    "technologies": [
      "React",
      "Tailwind CSS",
      "shadcn/ui"
    ],
    "image": "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop",
    "rating": 4.5
  },
  {
    "id": "project-salma-case-study",
    "isDemo": true,
    "ownerId": "student-salma",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "courseId": "course-portfolio-showcase",
    "courseCode": "PORTFOLIO",
    "courseName": "Student Portfolio Showcase",
    "type": "Portfolio Project",
    "visibility": "public",
    "status": "approved",
    "featured": false,
    "pinned": false,
    "createdAt": "2026-04-11T12:00:00.000Z",
    "updatedAt": "2026-04-13T12:00:00.000Z",
    "github": "https://github.com/demo/project-salma-case-study",
    "demoUrl": "https://demo.guc-portfolio.local/showcase",
    "report": "Showcase_Report.pdf",
    "tasks": [
      {
        "id": "task-project-salma-case-study-1",
        "title": "Prepare public portfolio card",
        "description": "Write a short, clean summary and select a thumbnail.",
        "assigneeId": "student-salma",
        "status": "completed",
        "deadline": "2026-04-18",
        "priority": 1
      }
    ],
    "feedback": [
      {
        "id": "fb-project-salma-case-study-1",
        "instructorId": "instructor-demo-1",
        "authorId": "instructor-demo-1",
        "text": "Good portfolio-ready showcase project. Keep the README concise.",
        "rating": 4.4,
        "createdAt": "2026-04-20T10:00:00.000Z"
      }
    ],
    "comments": [],
    "title": "Project Storytelling Case Study",
    "description": "A UI/UX case study showing how students can present goals, process, screenshots, demo links, and instructor feedback clearly.",
    "tags": [
      "UI/UX",
      "Figma",
      "Portfolio",
      "Documentation"
    ],
    "languages": [
      "Figma"
    ],
    "technologies": [
      "Figma",
      "Adobe XD"
    ],
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    "rating": 4.4
  },
  {
    "id": "project-mai-api-hub",
    "isDemo": true,
    "ownerId": "student-mai",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "courseId": "course-portfolio-showcase",
    "courseCode": "PORTFOLIO",
    "courseName": "Student Portfolio Showcase",
    "type": "Portfolio Project",
    "visibility": "public",
    "status": "approved",
    "featured": false,
    "pinned": false,
    "createdAt": "2026-04-12T12:00:00.000Z",
    "updatedAt": "2026-04-14T12:00:00.000Z",
    "github": "https://github.com/demo/project-mai-api-hub",
    "demoUrl": "https://demo.guc-portfolio.local/showcase",
    "report": "Showcase_Report.pdf",
    "tasks": [
      {
        "id": "task-project-mai-api-hub-1",
        "title": "Prepare public portfolio card",
        "description": "Write a short, clean summary and select a thumbnail.",
        "assigneeId": "student-mai",
        "status": "completed",
        "deadline": "2026-04-18",
        "priority": 1
      }
    ],
    "feedback": [
      {
        "id": "fb-project-mai-api-hub-1",
        "instructorId": "instructor-demo-1",
        "authorId": "instructor-demo-1",
        "text": "Good portfolio-ready showcase project. Keep the README concise.",
        "rating": 4.3,
        "createdAt": "2026-04-20T10:00:00.000Z"
      }
    ],
    "comments": [],
    "title": "Course Project API Hub",
    "description": "A backend API prototype for storing courses, projects, collaborators, and notifications with clean REST endpoints.",
    "tags": [
      "Node.js",
      "Express",
      "REST APIs",
      "MongoDB"
    ],
    "languages": [
      "JavaScript"
    ],
    "technologies": [
      "Node.js",
      "Express",
      "MongoDB"
    ],
    "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    "rating": 4.3
  },
  {
    "id": "project-yasmine-java-sim",
    "isDemo": true,
    "ownerId": "student-yasmine",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "courseId": "course-portfolio-showcase",
    "courseCode": "PORTFOLIO",
    "courseName": "Student Portfolio Showcase",
    "type": "Portfolio Project",
    "visibility": "public",
    "status": "approved",
    "featured": false,
    "pinned": false,
    "createdAt": "2026-04-13T12:00:00.000Z",
    "updatedAt": "2026-04-15T12:00:00.000Z",
    "github": "https://github.com/demo/project-yasmine-java-sim",
    "demoUrl": "https://demo.guc-portfolio.local/showcase",
    "report": "Showcase_Report.pdf",
    "tasks": [
      {
        "id": "task-project-yasmine-java-sim-1",
        "title": "Prepare public portfolio card",
        "description": "Write a short, clean summary and select a thumbnail.",
        "assigneeId": "student-yasmine",
        "status": "completed",
        "deadline": "2026-04-18",
        "priority": 1
      }
    ],
    "feedback": [
      {
        "id": "fb-project-yasmine-java-sim-1",
        "instructorId": "instructor-demo-1",
        "authorId": "instructor-demo-1",
        "text": "Good portfolio-ready showcase project. Keep the README concise.",
        "rating": 4.6,
        "createdAt": "2026-04-20T10:00:00.000Z"
      }
    ],
    "comments": [],
    "title": "Java Simulation Toolkit",
    "description": "A JavaFX toolkit for visualizing scheduling and step-by-step algorithm behavior for course demos.",
    "tags": [
      "Java",
      "JavaFX",
      "OOP",
      "Algorithms"
    ],
    "languages": [
      "Java"
    ],
    "technologies": [
      "JavaFX",
      "Git"
    ],
    "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    "rating": 4.6
  },
  {
    "id": "project-noor-vision-lab",
    "isDemo": true,
    "ownerId": "student-noor",
    "collaboratorIds": [],
    "instructorIds": [
      "instructor-demo-1"
    ],
    "courseId": "course-portfolio-showcase",
    "courseCode": "PORTFOLIO",
    "courseName": "Student Portfolio Showcase",
    "type": "Portfolio Project",
    "visibility": "public",
    "status": "approved",
    "featured": false,
    "pinned": false,
    "createdAt": "2026-04-14T12:00:00.000Z",
    "updatedAt": "2026-04-16T12:00:00.000Z",
    "github": "https://github.com/demo/project-noor-vision-lab",
    "demoUrl": "https://demo.guc-portfolio.local/showcase",
    "report": "Showcase_Report.pdf",
    "tasks": [
      {
        "id": "task-project-noor-vision-lab-1",
        "title": "Prepare public portfolio card",
        "description": "Write a short, clean summary and select a thumbnail.",
        "assigneeId": "student-noor",
        "status": "completed",
        "deadline": "2026-04-18",
        "priority": 1
      }
    ],
    "feedback": [
      {
        "id": "fb-project-noor-vision-lab-1",
        "instructorId": "instructor-demo-1",
        "authorId": "instructor-demo-1",
        "text": "Good portfolio-ready showcase project. Keep the README concise.",
        "rating": 4.7,
        "createdAt": "2026-04-20T10:00:00.000Z"
      }
    ],
    "comments": [],
    "title": "Computer Vision Experiment Lab",
    "description": "A small Python workspace comparing preprocessing pipelines for object detection demos and analytics dashboards.",
    "tags": [
      "Python",
      "OpenCV",
      "YOLO",
      "Computer Vision"
    ],
    "languages": [
      "Python"
    ],
    "technologies": [
      "OpenCV",
      "YOLO",
      "NumPy"
    ],
    "image": "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop",
    "rating": 4.7
  }
];

export const internshipsSeed = [
  {
    "id": "internship-1",
    "isDemo": true,
    "employerId": "employer-demo-1",
    "company": "TechBridge",
    "companyName": "TechBridge",
    "title": "Frontend Engineering Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "React",
      "Tailwind"
    ],
    "languages": [
      "JavaScript"
    ],
    "duration": "3 months",
    "deadline": "2026-06-10",
    "startDate": "2026-07-01",
    "postedAt": "Posted 1 days ago",
    "location": "New Cairo, Egypt",
    "workMode": "Hybrid",
    "stipend": "EGP 3,000 / month",
    "rating": 4.2,
    "reviews": 60,
    "featured": false,
    "department": "Engineering",
    "status": "Filled",
    "isFilled": true,
    "isArchived": false,
    "archived": false,
    "applicants": 18,
    "companyAbout": "TechBridge hires internship-ready students with strong portfolios, clean documentation, and practical software experience.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-1-yasmin",
        "studentId": "student-demo-1",
        "status": "rejected",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-01",
        "displayDate": "May 1, 2026",
        "nextStep": "Application closed",
        "note": "Rejected in the evaluation flow."
      }
    ]
  },
  {
    "id": "internship-2",
    "isDemo": true,
    "employerId": "employer-demo-1",
    "company": "TechBridge",
    "companyName": "TechBridge",
    "title": "AI Perception Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Python",
      "OpenCV",
      "YOLO"
    ],
    "languages": [
      "Python"
    ],
    "duration": "2 months",
    "deadline": "2026-06-11",
    "startDate": "2026-07-02",
    "postedAt": "Posted 2 days ago",
    "location": "New Cairo, Egypt",
    "workMode": "Remote",
    "stipend": "EGP 3,250 / month",
    "rating": 4.3,
    "reviews": 67,
    "featured": true,
    "department": "AI",
    "status": "Filled",
    "isFilled": true,
    "isArchived": false,
    "archived": false,
    "applicants": 23,
    "companyAbout": "TechBridge hires internship-ready students with strong portfolios, clean documentation, and practical software experience.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-2-yasmin",
        "studentId": "student-demo-1",
        "status": "rejected",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-02",
        "displayDate": "May 2, 2026",
        "nextStep": "Application closed",
        "note": "Rejected in the evaluation flow."
      }
    ]
  },
  {
    "id": "internship-3",
    "isDemo": true,
    "employerId": "employer-demo-1",
    "company": "TechBridge",
    "companyName": "TechBridge",
    "title": "Backend API Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Node.js",
      "REST APIs"
    ],
    "languages": [
      "JavaScript",
      "SQL"
    ],
    "duration": "3 months",
    "deadline": "2026-06-12",
    "startDate": "2026-07-03",
    "postedAt": "Posted 3 days ago",
    "location": "New Cairo, Egypt",
    "workMode": "Hybrid",
    "stipend": "EGP 3,500 / month",
    "rating": 4.4,
    "reviews": 74,
    "featured": false,
    "department": "Backend",
    "status": "Filled",
    "isFilled": true,
    "isArchived": false,
    "archived": false,
    "applicants": 28,
    "companyAbout": "TechBridge hires internship-ready students with strong portfolios, clean documentation, and practical software experience.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-3-yasmin",
        "studentId": "student-demo-1",
        "status": "rejected",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-03",
        "displayDate": "May 3, 2026",
        "nextStep": "Application closed",
        "note": "Rejected in the evaluation flow."
      }
    ]
  },
  {
    "id": "internship-4",
    "isDemo": true,
    "employerId": "employer-demo-1",
    "company": "TechBridge",
    "companyName": "TechBridge",
    "title": "UI/UX Product Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Figma",
      "UI/UX"
    ],
    "languages": [
      "HTML/CSS"
    ],
    "duration": "2 months",
    "deadline": "2026-06-13",
    "startDate": "2026-07-04",
    "postedAt": "Posted 4 days ago",
    "location": "New Cairo, Egypt",
    "workMode": "Remote",
    "stipend": "EGP 3,750 / month",
    "rating": 4.5,
    "reviews": 81,
    "featured": false,
    "department": "Design",
    "status": "Filled",
    "isFilled": true,
    "isArchived": false,
    "archived": false,
    "applicants": 33,
    "companyAbout": "TechBridge hires internship-ready students with strong portfolios, clean documentation, and practical software experience.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-4-yasmin",
        "studentId": "student-demo-1",
        "status": "rejected",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-04",
        "displayDate": "May 4, 2026",
        "nextStep": "Application closed",
        "note": "Rejected in the evaluation flow."
      }
    ]
  },
  {
    "id": "internship-5",
    "isDemo": true,
    "employerId": "employer-greenbyte",
    "company": "Greenbyte Solutions",
    "companyName": "Greenbyte Solutions",
    "title": "Software Engineering Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "JavaScript",
      "Git"
    ],
    "languages": [
      "JavaScript"
    ],
    "duration": "3 months",
    "deadline": "2026-06-14",
    "startDate": "2026-07-05",
    "postedAt": "Posted 5 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Hybrid",
    "stipend": "EGP 4,000 / month",
    "rating": 4.6,
    "reviews": 88,
    "featured": true,
    "department": "Engineering",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 38,
    "companyAbout": "Software house offering practical engineering internships.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-5-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-05",
        "displayDate": "May 5, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-6",
    "isDemo": true,
    "employerId": "employer-codewave",
    "company": "CodeWave Labs",
    "companyName": "CodeWave Labs",
    "title": "Frontend Developer Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "React",
      "JavaScript"
    ],
    "languages": [
      "JavaScript"
    ],
    "duration": "2 months",
    "deadline": "2026-06-15",
    "startDate": "2026-07-06",
    "postedAt": "Posted 6 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Remote",
    "stipend": "EGP 4,250 / month",
    "rating": 4.2,
    "reviews": 95,
    "featured": false,
    "department": "Frontend",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 43,
    "companyAbout": "Product lab focused on modern frontend and web apps.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-6-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-06",
        "displayDate": "May 6, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-7",
    "isDemo": true,
    "employerId": "employer-designlab",
    "company": "DesignLab Cairo",
    "companyName": "DesignLab Cairo",
    "title": "UI/UX Design Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Figma",
      "Prototyping"
    ],
    "languages": [
      "HTML/CSS"
    ],
    "duration": "3 months",
    "deadline": "2026-06-16",
    "startDate": "2026-07-07",
    "postedAt": "Posted 7 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Hybrid",
    "stipend": "EGP 4,500 / month",
    "rating": 4.3,
    "reviews": 102,
    "featured": false,
    "department": "Design",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 48,
    "companyAbout": "Design studio mentoring UI/UX and product students.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-7-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-07",
        "displayDate": "May 7, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-8",
    "isDemo": true,
    "employerId": "employer-niletech",
    "company": "NileTech AI",
    "companyName": "NileTech AI",
    "title": "Data Analyst Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Python",
      "SQL"
    ],
    "languages": [
      "Python",
      "SQL"
    ],
    "duration": "2 months",
    "deadline": "2026-06-17",
    "startDate": "2026-07-01",
    "postedAt": "Posted 8 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Remote",
    "stipend": "EGP 4,750 / month",
    "rating": 4.4,
    "reviews": 109,
    "featured": false,
    "department": "Data",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 53,
    "companyAbout": "AI company hiring interns for applied ML and data products.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-8-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-08",
        "displayDate": "May 8, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-9",
    "isDemo": true,
    "employerId": "employer-robocairo",
    "company": "RoboCairo",
    "companyName": "RoboCairo",
    "title": "Robotics Software Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "C++",
      "Robotics"
    ],
    "languages": [
      "C++"
    ],
    "duration": "3 months",
    "deadline": "2026-06-18",
    "startDate": "2026-07-02",
    "postedAt": "Posted 9 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Hybrid",
    "stipend": "EGP 5,000 / month",
    "rating": 4.5,
    "reviews": 116,
    "featured": false,
    "department": "Robotics",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 58,
    "companyAbout": "Robotics startup building perception and embedded prototypes.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-9-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-09",
        "displayDate": "May 9, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-10",
    "isDemo": true,
    "employerId": "employer-delta",
    "company": "Delta Fintech",
    "companyName": "Delta Fintech",
    "title": "Fintech Backend Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Node.js",
      "SQL"
    ],
    "languages": [
      "JavaScript",
      "SQL"
    ],
    "duration": "2 months",
    "deadline": "2026-06-19",
    "startDate": "2026-07-03",
    "postedAt": "Posted 10 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Remote",
    "stipend": "EGP 5,250 / month",
    "rating": 4.6,
    "reviews": 123,
    "featured": false,
    "department": "Backend",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 63,
    "companyAbout": "Fintech product team looking for backend and data interns.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-10-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-10",
        "displayDate": "May 10, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-11",
    "isDemo": true,
    "employerId": "employer-demo-1",
    "company": "TechBridge",
    "companyName": "TechBridge",
    "title": "Portfolio Product Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "React",
      "Product"
    ],
    "languages": [
      "JavaScript"
    ],
    "duration": "3 months",
    "deadline": "2026-06-20",
    "startDate": "2026-07-04",
    "postedAt": "Posted 11 days ago",
    "location": "New Cairo, Egypt",
    "workMode": "Hybrid",
    "stipend": "EGP 5,500 / month",
    "rating": 4.2,
    "reviews": 130,
    "featured": true,
    "department": "Product",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 68,
    "companyAbout": "TechBridge hires internship-ready students with strong portfolios, clean documentation, and practical software experience.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-11-yasmin",
        "studentId": "student-demo-1",
        "status": "accepted",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-11",
        "displayDate": "May 11, 2026",
        "nextStep": "Offer accepted",
        "note": "Accepted as part of the portfolio evaluation flow."
      }
    ]
  },
  {
    "id": "internship-12",
    "isDemo": true,
    "employerId": "employer-niletech",
    "company": "NileTech AI",
    "companyName": "NileTech AI",
    "title": "Machine Learning Intern",
    "details": "Work on practical product features with mentorship, documentation, and weekly review sessions.",
    "overview": "A hands-on internship designed for students with strong portfolios and practical software experience.",
    "responsibilities": [
      "Build and document production-style features.",
      "Collaborate with mentors and review progress weekly.",
      "Present a final portfolio-ready deliverable."
    ],
    "requirements": [
      "Active student portfolio.",
      "Strong fundamentals in the required skills.",
      "Good communication and documentation habits."
    ],
    "skills": [
      "Python",
      "ML"
    ],
    "languages": [
      "Python"
    ],
    "duration": "2 months",
    "deadline": "2026-06-21",
    "startDate": "2026-07-05",
    "postedAt": "Posted 12 days ago",
    "location": "Cairo, Egypt",
    "workMode": "Remote",
    "stipend": "EGP 5,750 / month",
    "rating": 4.3,
    "reviews": 137,
    "featured": false,
    "department": "AI",
    "status": "Open",
    "isFilled": false,
    "isArchived": false,
    "archived": false,
    "applicants": 73,
    "companyAbout": "AI company hiring interns for applied ML and data products.",
    "benefits": [
      "Mentorship",
      "Certificate",
      "Portfolio project",
      "Flexible schedule"
    ],
    "eligibility": [
      "Undergraduate Students",
      "GUC students preferred",
      "Portfolio recommended"
    ],
    "applications": [
      {
        "id": "application-12-yasmin",
        "studentId": "student-demo-1",
        "status": "rejected",
        "coverLetter": "I am interested because my portfolio contains related projects and I can contribute quickly.",
        "appliedAt": "2026-05-12",
        "displayDate": "May 12, 2026",
        "nextStep": "Application closed",
        "note": "Rejected in the evaluation flow."
      }
    ],
    ... extraDemoInternships,
  }

];

export const notificationsSeed = [
  {
    "id": "notif-invite-1",
    "userId": "student-demo-1",
    "type": "invite",
    "title": "Collaboration invite received",
    "text": "Farida has invited you to join Project Portfolio Web Platform.",
    "unread": true,
    "createdAt": "2026-05-08T12:00:00.000Z",
    "relatedProjectId": "project-portfolio-hub",
    "time": "May 8, 2026 at 12:00 pm"
  },
  {
    "id": "notif-employer-1",
    "userId": "student-demo-1",
    "type": "message",
    "title": "New message from Omar",
    "text": "Omar from TechBridge asked to view your portfolio before the interview.",
    "unread": true,
    "createdAt": "2026-05-08T13:00:00.000Z",
    "relatedUserId": "employer-demo-1",
    "time": "May 8, 2026 at 1:00 pm"
  },
  {
    "id": "notif-flag-1",
    "userId": "student-demo-1",
    "type": "flag",
    "title": "Project flagged",
    "text": "Autonomous Vehicle Perception System was flagged: Dataset attribution needed before final public showcase.",
    "unread": true,
    "createdAt": "2026-05-04T12:00:00.000Z",
    "relatedProjectId": "project-bfmc-raven",
    "time": "May 4, 2026 at 12:00 pm"
  },
  {
    "id": "notif-link-1",
    "userId": "admin-demo-1",
    "type": "link-request",
    "title": "Course link request",
    "text": "Dr. Mervat requested to link Bachelor Project in DMET 401.",
    "unread": true,
    "createdAt": "2026-05-05T12:00:00.000Z",
    "relatedUserId": "instructor-demo-1",
    "time": "May 5, 2026 at 12:00 pm"
  },
  {
    "id": "notif-feedback-1",
    "userId": "student-demo-1",
    "type": "feedback",
    "title": "Instructor comment added",
    "text": "Dr. Mervat added a comment to your portfolio project tasks.",
    "unread": false,
    "createdAt": "2026-05-07T12:00:00.000Z",
    "relatedProjectId": "project-portfolio-hub",
    "time": "May 7, 2026 at 12:00 pm"
  },
  {
    "id": "notif-internship-1",
    "userId": "student-demo-1",
    "type": "internship",
    "title": "Internship application accepted",
    "text": "Your Greenbyte Software Engineering Intern application was accepted.",
    "unread": false,
    "createdAt": "2026-05-08T15:00:00.000Z",
    "relatedInternshipId": "internship-5",
    "time": "May 8, 2026 at 3:00 pm"
  },
  {
    "id": "notif-feedback-sync-audit",
    "userId": "student-demo-1",
    "title": "New instructor feedback",
    "text": "Dr. Mervat added feedback on Project Portfolio Web Platform.",
    "unread": true,
    "type": "feedback",
    "time": "9/5/2026 at 6:30 pm",
    "createdAt": "2026-05-09T18:30:00.000Z"
  },
  //{
    //"id": "notif-link-request-admin",
    //"userId": "admin-demo-1",
    //"title": "Course link request",
    //"text": "Dr. Mervat requested to link Bachelor Project in DMET 401.",
    //"unread": true,
    //"type": "admin",
    //"time": "9/5/2026 at 6:30 pm",
    //"createdAt": "2026-05-09T18:30:00.000Z"
  //},
  {
    "id": "notif-collab-message",
    "userId": "student-demo-1",
    "title": "Collaborator message",
    "text": "Farida sent a message about the CSEN 603 demo flow.",
    "unread": true,
    "type": "message",
    "time": "9/5/2026 at 6:30 pm",
    "createdAt": "2026-05-09T18:30:00.000Z"
  },
  {
  id: "notif-instructor-invite-1",
  userId: "instructor-demo-1",
  type: "invite",
  title: "Project supervision invite",
  text: "Yasmin Khaled invited you to supervise Autonomous Vehicle Perception System.",
  unread: true,
  createdAt: "2026-05-09T10:30:00.000Z",
  relatedProjectId: "project-bfmc-raven",
  relatedUserId: "student-demo-1",
  time: "May 9, 2026 at 10:30 am"
}
];

export const chatsSeed = [
  {
    "id": "chat-student-employer",
    "isDemo": true,
    "participantIds": [
      "student-demo-1",
      "employer-demo-1"
    ],
    "name": "Omar Adel",
    "avatar": "O",
    "online": true,
    "unread": 1,
    "unreadBy": [
      "student-demo-1"
    ],
    "messages": [
      {
        "id": "msg-1",
        "senderId": "employer-demo-1",
        "sender": "other",
        "text": "Hi Yasmin, I reviewed your autonomous vehicle and portfolio projects. Can we discuss a frontend/AI internship?",
        "createdAt": "2026-05-08T15:00:00.000Z",
        "time": "15:00"
      },
    ], //here we need some scripted relpies so that i can chat with the employeer , any other chat i will only be able to send without replies
    "scriptedReplyIndex": 0,
    "scriptedReplies": [
      "Absolutely, Yasmin. Your autonomous vehicle work is exactly the kind of practical AI experience we look for. Could you send me your availability for a quick interview?",
      "Great, thank you. I’ll share your profile with our technical team and we can continue from there."
    ],
  },
  {
    "id": "chat-student-collab",
    "isDemo": true,
    "participantIds": [
      "student-demo-1",
      "student-farida"
    ],
    "name": "Farida Tarek",
    "avatar": "F",
    "online": false,
    "unread": 1,
    "unreadBy": [
      "student-demo-1"
    ],
    "messages": [
      {
        "id": "msg-3",
        "senderId": "student-farida",
        "sender": "other",
        "text": "I updated the discovery filters and linked them to the shared seed structure.",
        "createdAt": "2026-05-08T16:00:00.000Z",
        "time": "16:00"
      }
    ]
  },
  {
    "id": "chat-student-instructor",
    "isDemo": true,
    "participantIds": [
      "student-demo-1",
      "instructor-demo-1"
    ],
    "name": "Dr. Mervat Abulkheir",
    "avatar": "M",
    "online": false,
    "unread": 0,
    "unreadBy": [],
    "messages": [
      {
        "id": "msg-4",
        "senderId": "instructor-demo-1",
        "sender": "other",
        "text": "Please add the dataset attribution before the final public showcase.",
        "createdAt": "2026-05-04T12:10:00.000Z",
        "time": "12:10"
      } //add sending something from student-demo-1 to this chat after instructor-demo-1 reply 
    ]
  }
];

export const reportsSeed = [
  {
    "id": "report-bfmc",
    "projectId": "project-bfmc-raven",
    "reportedById": "instructor-demo-1",
    "reason": "Dataset attribution needed before final public showcase.",
    "status": "appeal-submitted",
    "active": false,
    "appeal": {
      "id": "appeal-bfmc",
      "studentId": "student-demo-1",
      "message": "We added dataset references and model training notes in the README.",
      "status": "pending"
    },
    "createdAt": "2026-05-04T12:00:00.000Z"
  }
];

export const demoSeed = {
  version: DEMO_DATA_VERSION,
  users: usersSeed,
  courses: coursesSeed,
  projects: projectsSeed,
  internships: internshipsSeed,
  notifications: notificationsSeed,
  chats: chatsSeed,
  reports: reportsSeed,
  linkRequests: [
    {
      id: "link-request-dmet401-mervat",
      instructorId: "instructor-demo-1",
      courseId: "course-bachelor",
      requestedCourseCode: "DMET 401",
      requestedCourseName: "Bachelor Project",
      type: "link",
      status: "pending",
      reason: "Mervat requests to link the Bachelor Project supervision flow in DMET 401.",
      createdAt: "2026-05-04T11:00:00.000Z"
    }
  ]
};
