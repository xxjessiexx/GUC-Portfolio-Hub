import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  FolderKanban,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function scrollToHowItWorks() {
  document.getElementById("how-it-works")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function HeroSection({
  farX,
  farY,
  midX,
  midY,
  frontX,
  frontY,
}) {
  return (
    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-14 py-14 lg:grid-cols-[0.92fr_1.08fr]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#355872]/10 bg-white/58 px-4 py-2 text-sm font-extrabold text-[#355872] shadow-[0_10px_28px_rgba(53,88,114,0.08)] backdrop-blur-xl">
          <GraduationCap className="h-4 w-4" />
          The student portfolio platform for GUC
        </div>

        <h1 className="max-w-2xl text-6xl font-black leading-[0.95] tracking-[-0.06em] text-[#102630] max-md:text-5xl">
          Showcase.
          <br />
          Collaborate.{" "}
          <span className="text-[#355872]">Inspire.</span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-8 text-[#647684]">
          Build a polished academic portfolio for your GUC projects, demos,
          GitHub work, collaborators, feedback, and achievements — all in one
          place.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link to="/register">
            <Button className="h-14 rounded-2xl bg-[linear-gradient(135deg,#2C3947_0%,#355872_58%,#7AAACE_100%)] px-7 text-base font-extrabold text-white shadow-[0_18px_38px_rgba(53,88,114,0.24)] transition hover:-translate-y-1">
              Create Your Portfolio
            </Button>
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={scrollToHowItWorks}
            className="h-14 rounded-2xl border-[#355872]/14 bg-white/55 px-7 text-base font-extrabold text-[#355872] backdrop-blur-xl hover:bg-white/85"
          >
            See How It Works
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <div className="relative h-[600px] max-lg:h-[530px]">
        <motion.div
          style={{ x: farX, y: farY }}
          className="absolute right-0 top-10 h-[470px] w-[88%] overflow-hidden rounded-[38px] border border-white/75 bg-white/35 shadow-[0_34px_100px_rgba(36,57,73,0.2)]"
        >
          <img
            src="https://guc.edu.eg/international-students/images/1.jpg"
            alt="German University in Cairo campus"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(7,28,44,0.18),transparent_45%,rgba(53,88,114,0.12))]" />
        </motion.div>

        <motion.div
          style={{ x: midX, y: midY }}
          className="absolute left-8 top-0 z-10 min-w-[170px] rounded-[26px] border border-white/75 bg-white/78 p-5 shadow-[0_22px_65px_rgba(53,88,114,0.16)] backdrop-blur-2xl"
        >
          <FolderKanban className="mb-4 h-7 w-7 text-[#355872]" />
          <p className="text-3xl font-black text-[#102630]">1,200+</p>
          <p className="text-sm font-semibold text-[#7B8794]">
            Student projects
          </p>
        </motion.div>

        <motion.div
          style={{ x: frontX, y: frontY }}
          className="absolute bottom-8 left-0 z-10 w-[360px] overflow-hidden rounded-[30px] border border-white/10 bg-[#071C2C]/94 p-6 text-white shadow-[0_30px_90px_rgba(7,28,44,0.3)] backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(122,170,206,0.18),transparent_28%),radial-gradient(circle_at_88%_90%,rgba(230,199,123,0.08),transparent_32%)]" />

          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9CD5FF]">
              Your academic identity
            </p>

            <h3 className="mt-3 text-2xl font-black leading-tight">
              Your work deserves more than a folder.
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/62">
              Turn coursework into a portfolio employers, instructors, and
              classmates can understand at a glance.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-black text-[#9CD5FF]">
                Projects
              </span>

              <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-black text-white/72">
                Portfolio
              </span>

              <span className="rounded-full bg-[#E6C77B]/12 px-3 py-1.5 text-xs font-black text-[#E6C77B]">
                GUC
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
