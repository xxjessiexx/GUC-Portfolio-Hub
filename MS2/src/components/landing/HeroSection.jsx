import { Link } from "react-router-dom";
import { motion} from "framer-motion";

import {
  ArrowRight,
  FolderKanban,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection({farX, farY, midX, midY,frontX, frontY}){
    return (    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
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
        </div>);
}