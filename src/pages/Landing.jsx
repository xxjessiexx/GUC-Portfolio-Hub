import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

import {
  ArrowRight,
  BookOpen,
  Eye,
  FolderKanban,
  GraduationCap,
  PlayCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/70 bg-white/55 px-6 py-4 shadow-[0_18px_60px_rgba(53,88,114,0.12)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#9CD5FF]/35 shadow-[0_0_0_6px_rgba(156,213,255,0.14)]">
              <GraduationCap className="h-6 w-6 text-[#355872]" />
            </div>

            <span className="text-xl font-black tracking-tight text-[#2C3947]">
              GUC Portfolio Hub
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-bold text-[#2C3947] md:flex">
            <Link to="/">Home</Link>
            <Link to="/projects">Explore Projects</Link>
            <Link to="/portfolios">Portfolios</Link>
            <Link to="/internships">Internships</Link>
          </div>

          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="rounded-2xl font-bold">
                Log in
              </Button>
            </Link>

            <Link to="/Register">
              <Button className="rounded-2xl bg-[#2C3947] px-6 font-bold text-white hover:bg-[#355872]">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9CD5FF]/60 bg-white/60 px-4 py-2 text-sm font-extrabold text-[#355872] shadow-sm backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-[#E6C77B]" />
              Built by GUC students for GUC students
            </div>

            <h1 className="max-w-2xl text-6xl font-black leading-[0.95] tracking-[-0.06em] text-[#102630] max-md:text-5xl">
              Showcase. Collaborate.{" "}
              <span className="relative text-[#355872]">
                Inspire.
                <span className="absolute -bottom-2 left-1 h-1 w-full rounded-full bg-[linear-gradient(90deg,#E6C77B,transparent)]" />
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f6f7d]">
              A central platform for GUC students to publish course projects,
              bachelor work, portfolios, demos, GitHub links, and thesis files in
              one polished space.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/projects">
                <Button className="h-14 rounded-2xl bg-[linear-gradient(135deg,#2C3947,#355872_45%,#7AAACE)] px-7 text-base font-extrabold text-white shadow-[0_20px_38px_rgba(53,88,114,0.28)] transition hover:-translate-y-1">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl border-[#355872]/20 bg-white/55 px-7 text-base font-extrabold text-[#355872] backdrop-blur-xl hover:bg-white/80"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="relative h-[620px] max-lg:h-[540px]">
            <motion.div
              style={{ x: farX, y: farY }}
              className="absolute right-0 top-10 h-[470px] w-[82%] overflow-hidden rounded-[42px] border border-white/80 bg-white/50 shadow-[0_34px_100px_rgba(36,57,73,0.22)] backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(53,88,114,0.35),rgba(156,213,255,0.1)),url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,57,71,0.55),transparent)]" />
            </motion.div>

            <motion.div
              style={{ x: midX, y: midY }}
              className="absolute left-12 top-0 rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_24px_70px_rgba(53,88,114,0.18)] backdrop-blur-2xl"
            >
              <FolderKanban className="mb-5 h-8 w-8 text-[#355872]" />
              <p className="text-3xl font-black">1,200+</p>
              <p className="text-sm font-semibold text-[#7B8794]">
                Public projects
              </p>
            </motion.div>

            <motion.div
              style={{ x: frontX, y: frontY }}
              className="absolute bottom-20 left-0 w-[330px] rounded-[30px] border border-white/80 bg-white/75 p-6 shadow-[0_30px_90px_rgba(36,57,73,0.22)] backdrop-blur-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-full bg-[#9CD5FF]/30 px-3 py-1 text-xs font-black text-[#355872]">
                  Featured
                </div>
                <div className="rounded-full bg-[#E6C77B]/25 px-3 py-1 text-xs font-black text-[#355872]">
                  Public
                </div>
              </div>

              <h3 className="text-2xl font-black text-[#102630]">
                Smart Study Buddy
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7B8794]">
                AI-powered project by GUC students with demo, GitHub, and team
                portfolio links.
              </p>

              <div className="mt-5 flex gap-3">
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#355872]">
                  GitHub
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#355872]">
                  Demo
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#355872]">
                  Team
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{ x: midX, y: midY }}
              className="absolute bottom-8 right-8 rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_24px_70px_rgba(53,88,114,0.16)] backdrop-blur-2xl"
            >
              <Users className="mb-4 h-8 w-8 text-[#355872]" />
              <p className="text-3xl font-black">2,500+</p>
              <p className="text-sm font-semibold text-[#7B8794]">
                Students & collaborators
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#355872]">
                Explore
              </p>

              <h2 className="text-4xl font-black tracking-tight text-[#102630]">
                Discover amazing student work
              </h2>

              <p className="mt-3 max-w-xl text-[#7B8794]">
                Browse public projects without signing in. Save, message, or
                apply after logging in.
              </p>
            </div>

            <Link to="/projects">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-[#355872]/20 bg-white/60 font-bold text-[#355872]"
              >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, rotateX: 3, rotateY: -3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <Card className="overflow-hidden rounded-[30px] border-white/80 bg-white/70 shadow-[0_24px_70px_rgba(53,88,114,0.13)] backdrop-blur-2xl">
                  <div className="h-44 bg-[linear-gradient(135deg,#2C3947,#355872_45%,#7AAACE)] p-5">
                    <div className="flex h-full flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-4">
                      <div>
                        <div className="mb-3 h-3 w-24 rounded-full bg-white/45" />
                        <div className="mb-2 h-3 w-36 rounded-full bg-white/30" />
                        <div className="mb-2 h-3 w-28 rounded-full bg-white/25" />
                      </div>

                      <div className="flex items-center gap-2 text-white/80">
                        <PlayCircle className="h-5 w-5" />
                        <BookOpen className="h-5 w-5" />
                        <Eye className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-[#9CD5FF]/25 px-3 py-1 text-xs font-black text-[#355872]">
                        {project.type}
                      </span>
                      <span className="text-xs font-black text-[#7B8794]">
                        {project.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#102630]">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#7B8794]">
                      {project.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-white/70 bg-white/55 p-10 shadow-[0_24px_80px_rgba(53,88,114,0.14)] backdrop-blur-2xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-[#355872]">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#102630]">
              From project idea to public portfolio
            </h2>
          </div>

          <div className="relative grid gap-8 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[#7AAACE]/50 to-transparent md:block" />

            {steps.map(({ number, title, text, icon: Icon }) => (
              <div key={title} className="relative text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-white/80 bg-[#9CD5FF]/30 shadow-[0_14px_35px_rgba(53,88,114,0.14)]">
                  <Icon className="h-8 w-8 text-[#355872]" />
                </div>

                <span className="mb-3 inline-flex rounded-full bg-[#E6C77B]/25 px-3 py-1 text-xs font-black text-[#355872]">
                  {number}
                </span>

                <h3 className="text-lg font-black text-[#102630]">{title}</h3>

                <p className="mx-auto mt-3 max-w-[230px] text-sm leading-6 text-[#7B8794]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-widest text-[#355872]">
              Meet the Developers
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#102630]">
              Built by GUC students, for GUC students
            </h2>

            <p className="mt-4 leading-7 text-[#7B8794]">
              The team behind the platform — designing, building, and refining a
              student-first experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -10,
                  rotateX: 4,
                  rotateY: index % 2 === 0 ? -4 : 4,
                  scale: 1.015,
                }}
                transition={{ duration: 0.35 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[32px] border border-white/80 bg-white/60 p-7 shadow-[0_24px_70px_rgba(53,88,114,0.13)] backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(156,213,255,0.32),transparent_55%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#E6C77B]/20 blur-2xl" />

                <div className="relative z-10">
                  <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full border border-white/80 bg-[linear-gradient(135deg,#355872,#7AAACE)] text-2xl font-black text-white shadow-[0_18px_45px_rgba(53,88,114,0.25)]">
                    {dev.initials}
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-black text-[#102630]">
                      {dev.name}
                    </h3>

                    <p className="mt-1 text-sm font-extrabold text-[#355872]">
                      {dev.role}
                    </p>

                    <p className="mx-auto mt-4 max-w-[260px] text-sm leading-6 text-[#7B8794]">
                      {dev.desc}
                    </p>
                  </div>

                  <div className="mt-7 flex justify-center gap-3">
                    {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-[#355872]/10 bg-white/65 text-[#355872] shadow-sm transition hover:-translate-y-1 hover:bg-[#9CD5FF]/25"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
<footer className="relative z-10 mt-10 border-t border-white/10 bg-[linear-gradient(135deg,#2C3947,#355872)] text-white backdrop-blur-2xl">
  <div className="mx-auto max-w-7xl px-6 py-20">

    <div className="grid gap-12 md:grid-cols-4">
      
      {/* BRAND */}
      <div>
        <h3 className="text-xl font-black text-white tracking-tight">
          GUC Portfolio Hub
        </h3>

        <p className="mt-4 text-sm leading-6 text-white/70">
          A platform for GUC students to showcase projects, collaborate with peers,
          and connect with instructors and employers.
        </p>
      </div>

      {/* PLATFORM */}
      <div>
        <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
          Platform
        </h4>

        <ul className="space-y-3 text-sm">
          {[
            ["Explore Projects", "/projects"],
            ["Portfolios", "/portfolios"],
            ["Internships", "/internships"],
          ].map(([label, link]) => (
            <li key={label}>
              <Link
                to={link}
                className="text-white/70 transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* USERS */}
      <div>
        <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
          Users
        </h4>

        <ul className="space-y-3 text-sm text-white/70">
          <li className="hover:text-white transition">Students</li>
          <li className="hover:text-white transition">Instructors</li>
          <li className="hover:text-white transition">Employers</li>
        </ul>
      </div>

      {/* COMPANY */}
      <div>
        <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
          Company
        </h4>

        <ul className="space-y-3 text-sm text-white/70">
          <li className="hover:text-white transition">About</li>
          <li className="hover:text-white transition">Contact</li>
          <li className="hover:text-white transition">Privacy Policy</li>
        </ul>
      </div>

    </div>

    {/* DIVIDER */}
    <div className="mt-14 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

      <p className="text-sm text-white/50">
        © {new Date().getFullYear()} GUC Portfolio Hub. All rights reserved.
      </p>

      <div className="flex items-center gap-6 text-sm text-white/60">
        <span className="hover:text-white transition cursor-pointer">Terms</span>
        <span className="hover:text-white transition cursor-pointer">Privacy</span>

        {/* subtle gold accent */}
        <span className="h-1 w-1 rounded-full bg-[#E6C77B]" />
      </div>

    </div>

  </div>
</footer>
    </main>
  );
}