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
    title: "Smart Study Buddy",
    type: "Course Project",
    desc: "AI-powered study companion with demo and GitHub links.",
    tag: "AI / Web",
  },
  {
    title: "Campus Navigator",
    type: "Bachelor Project",
    desc: "Interactive navigation platform for campus locations.",
    tag: "Mobile / UX",
  },
  {
    title: "EcoTrack",
    type: "Data Science",
    desc: "Analytics dashboard for environmental impact insights.",
    tag: "Data / Dashboard",
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
    title: "Publish publicly",
    text: "Make selected work visible for students, instructors, and employers.",
    icon: Search,
  },
];

const developers = [
  {
    name: "Yasmin Khaled",
    role: "Frontend & UI/UX",
    desc: "Designing the premium SaaS experience, interactions, and polished student journeys.",
    initials: "YK",
  },
  {
    name: "Teammate 1",
    role: "Project Management",
    desc: "Organizing requirements, workflows, and making sure features match the MS2 scope.",
    initials: "T1",
  },
  {
    name: "Teammate 2",
    role: "Frontend Developer",
    desc: "Building reusable components, responsive pages, and interactive UI behavior.",
    initials: "T2",
  },
];

export default function Landing() {
  const mouseX = useSpring(0, { stiffness: 42, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 42, damping: 20 });

  const farX = useTransform(mouseX, (v) => v * 0.22);
  const farY = useTransform(mouseY, (v) => v * 0.22);
  const midX = useTransform(mouseX, (v) => v * 0.55);
  const midY = useTransform(mouseY, (v) => v * 0.55);
  const frontX = useTransform(mouseX, (v) => v * 0.9);
  const frontY = useTransform(mouseY, (v) => v * 0.9);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 70;
      const y = (event.clientY / window.innerHeight - 0.5) * 70;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#F7F8F0_0%,#EAF4FA_45%,#D8ECF8_100%)] text-[#102630]">
      <section className="relative min-h-screen px-6 py-6">
        <motion.div
          style={{ x: farX, y: farY }}
          className="pointer-events-none fixed -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,#9CD5FF_0%,rgba(122,170,206,0.25)_55%,transparent_72%)] blur-3xl"
        />

        <motion.div
          style={{ x: midX, y: midY }}
          className="pointer-events-none fixed -bottom-56 -right-48 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.58)_0%,rgba(230,199,123,0.16)_52%,transparent_72%)] blur-3xl"
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

    <StepsSection steps={steps}/>

    <DevelopersSection developers={developers}/>

    <Footer />

    </main>
  );
}