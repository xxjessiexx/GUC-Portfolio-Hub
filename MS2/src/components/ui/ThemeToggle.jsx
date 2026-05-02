import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className = "", variant = "light" }) {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;
  return (
    <motion.button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={tapScale}
      transition={{ duration: 0.22, ease: easeOutExpo }}
      className={cn(
        "relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border shadow-sm transition",
        variant === "dark"
          ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
          : "border-white/70 bg-white/55 text-[#355872] backdrop-blur-xl hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(156,213,255,0.28),transparent_62%)]" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -35, scale: 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 35, scale: 0.75 }}
          transition={{ duration: 0.22, ease: easeOutExpo }}
          className="relative z-10"
        >
          <Icon className="h-5 w-5" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
