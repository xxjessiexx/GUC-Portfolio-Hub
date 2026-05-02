import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <motion.nav
      className="relative z-20 mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/70 bg-white/55 px-6 py-4 shadow-[0_18px_60px_rgba(53,88,114,0.12)] backdrop-blur-2xl"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="grid h-11 w-11 place-items-center rounded-2xl bg-[#9CD5FF]/35 shadow-[0_0_0_6px_rgba(156,213,255,0.14)]"
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <GraduationCap className="h-6 w-6 text-[#355872]" />
        </motion.div>

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

        <Link to="/register">
          <Button className="rounded-2xl bg-[#2C3947] px-6 font-bold text-white hover:bg-[#355872]">
            Sign up
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}