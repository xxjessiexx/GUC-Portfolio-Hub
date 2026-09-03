import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  FolderKanban,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";

import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import ProjectSection from "@/components/landing/ProjectSection";
import StepsSection from "@/components/landing/StepsSection";
import DevelopersSection from "@/components/landing/DevelopersSection";
import Footer from "@/components/landing/Footer";

const projects = [
  {
    title: "Project Portfolio Web Platform",
    type: "Course Project",
    course: "CSEN 603 · Software Engineering",
    desc: "A role-based university portfolio platform for projects, portfolios, collaboration, instructor feedback, and career discovery.",
    tag: "React / UI",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    technologies: ["React", "Vite", "Tailwind CSS"],
  },
  {
    title: "Autonomous Vehicle Perception System",
    type: "Course Project",
    course: "CSEN 502 · Advanced Software Project",
    desc: "A perception pipeline for lane detection, traffic signs, pedestrians, and vehicles using distributed embedded systems.",
    tag: "AI / Robotics",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    technologies: ["OpenCV", "YOLO", "Raspberry Pi"],
  },
  {
    title: "Mental Wellness Check-in App",
    type: "Portfolio Project",
    course: "Student Portfolio Showcase",
    desc: "A privacy-focused check-in experience helping students track mood, habits, and access support resources.",
    tag: "Mobile / UX",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    technologies: ["Flutter", "Firebase", "UX Research"],
  },
];

const steps = [
  {
    number: "01",
    title: "Create your portfolio",
    text: "Set up your academic identity, skills, achievements, and contact visibility.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Add your projects",
    text: "Attach descriptions, GitHub links, demos, collaborators, and thesis files.",
    icon: FolderKanban,
  },
  {
    number: "03",
    title: "Collaborate & review",
    text: "Invite teammates, manage tasks, and receive instructor feedback.",
    icon: Users,
  },
  {
    number: "04",
    title: "Publish your best work",
    text: "Choose what appears on your portfolio for students, instructors, and employers.",
    icon: Search,
  },
];

const developers = [
{
  name: "Farida",
  role: "React Frontend Developer",
  desc: "Collaborated on the React frontend, responsive page implementation, and shared UI components.",
  initials: "F",
  image: "/team/farida.jpg",
  links: {
    github: "",
    linkedin: "",
    email: "",
  },
},
{
  name: "Yasmin Khaled",
  role: "Scrum Master · UI/UX Designer · React Frontend",
  desc: "Led the Scrum workflow and UI/UX direction while collaborating with the team on the React frontend.",
  initials: "YK",
  image: "/team/yasmin-khaled.jpg",
  links: {
    github: "https://github.com/xxjessiexx",
    linkedin: "https://www.linkedin.com/in/yasmin-khaled-727767257",
    email: "mailto:yasmin.khaled.aly@gmail.com",
  },
},
  {
    name: "Mai Mohamed",
    role: "React Frontend Developer",
    desc: "Collaborated on the React frontend, responsive page implementation, and shared UI components.",
    initials: "MM",
    image: "/team/mai-mohamed.jpg",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "Salma Hazem",
    role: "React Frontend Developer",
    desc: "Collaborated on the React frontend, responsive page implementation, and shared UI components.",
    initials: "SH",
    image: "/team/salma-hazem.jpg",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "Yasmin Ahmed",
    role: "React Frontend Developer",
    desc: "Collaborated on the React frontend, responsive page implementation, and shared UI components.",
    initials: "YA",
    image: "/team/yasmin-ahmed.jpg",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
];

export default function Landing() {
  const mouseX = useSpring(0, {
    stiffness: 42,
    damping: 20,
  });

  const mouseY = useSpring(0, {
    stiffness: 42,
    damping: 20,
  });

  const farX = useTransform(
    mouseX,
    (value) => value * 0.22
  );

  const farY = useTransform(
    mouseY,
    (value) => value * 0.22
  );

  const midX = useTransform(
    mouseX,
    (value) => value * 0.55
  );

  const midY = useTransform(
    mouseY,
    (value) => value * 0.55
  );

  const frontX = useTransform(
    mouseX,
    (value) => value * 0.9
  );

  const frontY = useTransform(
    mouseY,
    (value) => value * 0.9
  );

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth - 0.5) * 70;

      const y =
        (event.clientY / window.innerHeight - 0.5) *
        70;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F6FAFC] text-[#102630]">
      <section
        id="home"
        className="relative min-h-screen scroll-mt-6 overflow-hidden bg-[linear-gradient(135deg,#F7F8F0_0%,#EEF7FB_48%,#D8ECF8_100%)] px-6 py-6"
      >
        <motion.div
          style={{
            x: farX,
            y: farY,
          }}
          className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,#9CD5FF_0%,rgba(122,170,206,0.25)_55%,transparent_72%)] blur-3xl"
        />

        <motion.div
          style={{
            x: midX,
            y: midY,
          }}
          className="pointer-events-none absolute -bottom-56 -right-48 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.48)_0%,rgba(230,199,123,0.12)_52%,transparent_72%)] blur-3xl"
        />

        <NavBar />

        <HeroSection
          farX={farX}
          farY={farY}
          midX={midX}
          midY={midY}
          frontX={frontX}
          frontY={frontY}
        />
      </section>

      <ProjectSection projects={projects} />

      <StepsSection steps={steps} />

      <DevelopersSection
        developers={developers}
      />

      <Footer />
    </main>
  );
}