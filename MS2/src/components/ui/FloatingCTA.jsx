import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { ArrowRight } from "lucide-react";

export default function FloatingCTA() {
  const location = useLocation();

  const isLandingPage =
    location.pathname === "/";

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    if (!isLandingPage) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        const developersSection =
          document.getElementById("developers");

        const developersTop =
          developersSection?.offsetTop ??
          Infinity;

        const showAfter =
          520;

        const hideBeforeDevelopers =
          developersTop - 220;

        setVisible(
          window.scrollY > showAfter &&
            window.scrollY <
              hideBeforeDevelopers
        );
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );
    };
  }, [isLandingPage]);

  if (!isLandingPage) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 18,
            scale: 0.98,
          }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 24,
          }}
          className="
            fixed bottom-5
            left-4 right-4
            z-[999]
            mx-auto
            max-w-xl
          "
        >
          <div className="
            rounded-[20px]
            border border-white/12
            bg-[#071C2C]/94
            px-4 py-3
            text-white
            shadow-[0_22px_60px_rgba(7,28,44,0.28)]
            backdrop-blur-2xl
          ">
            <div className="
              flex items-center
              justify-between
              gap-4
            ">
              <div className="min-w-0">
                <p className="
                  truncate
                  text-sm font-black
                ">
                  Ready to build your GUC portfolio?
                </p>

                <p className="
                  mt-0.5 hidden
                  text-xs font-medium
                  text-white/55
                  sm:block
                ">
                  Turn your work into something worth showing.
                </p>
              </div>

              <Link
                to="/register"
                className="
                  inline-flex shrink-0
                  items-center gap-2
                  rounded-xl
                  bg-white
                  px-4 py-2
                  text-xs font-black
                  text-[#355872]
                  transition
                  hover:-translate-y-0.5
                "
              >
                Get Started

                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}