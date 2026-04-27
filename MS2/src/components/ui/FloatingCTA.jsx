import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FloatingCTA() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 220);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  if (!isLandingPage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 36 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 22,
          }}
          className="fixed bottom-6 left-1/2 z-[999] w-[min(calc(100%-32px),860px)] -translate-x-1/2 will-change-transform"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/25 bg-[linear-gradient(135deg,rgba(44,57,71,0.96),rgba(53,88,114,0.94)_55%,rgba(122,170,206,0.9))] px-6 py-4 text-white shadow-[0_22px_65px_rgba(36,57,73,0.32)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#E6C77B]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex min-w-0 items-center gap-4 text-center md:text-left">
                <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20 sm:grid">
                  <Sparkles className="h-5 w-5 text-[#E6C77B]" />
                </div>

                <div>
                  <h2 className="text-lg font-black md:text-xl">
                    Ready to showcase your work?
                  </h2>
                  <p className="mt-1 hidden text-sm font-medium text-white/75 sm:block">
                    Create your portfolio and publish your best GUC projects.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-3">
                <Link to="/Register">
                  <Button className="rounded-2xl bg-white px-5 font-black text-[#355872] hover:bg-white/90">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/projects" className="hidden sm:block">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-white/30 bg-white/10 px-5 font-black text-white hover:bg-white/15"
                  >
                    Explore
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}