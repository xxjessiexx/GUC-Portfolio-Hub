import { motion, useReducedMotion } from "framer-motion";

const orbitTransition = {
  duration: 18,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror",
};

export default function AppShellBackground({ children, parallax }) {
  const prefersReducedMotion = useReducedMotion();
  const farStyle = parallax?.far ? { x: parallax.far.x, y: parallax.far.y } : undefined;
  const midStyle = parallax?.mid ? { x: parallax.mid.x, y: parallax.mid.y } : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--gradient-page)] text-[color:var(--ink)] transition-colors duration-300">
      <motion.div
        style={farStyle}
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.08], rotate: [0, 8] }}
        transition={orbitTransition}
        className="pointer-events-none fixed -left-44 -top-44 h-[620px] w-[620px] rounded-full bg-[var(--gradient-glow-primary)] blur-3xl"
      />
      <motion.div
        style={midStyle}
        animate={prefersReducedMotion ? undefined : { scale: [1, 0.92], rotate: [0, -10] }}
        transition={{ ...orbitTransition, duration: 22 }}
        className="pointer-events-none fixed -bottom-56 -right-48 h-[720px] w-[720px] rounded-full bg-[var(--gradient-glow-gold)] blur-3xl"
      />
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, 20, -8], x: [0, 12, -10] }}
        transition={{ duration: 16, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        className="pointer-events-none fixed left-[10%] top-28 h-72 w-72 rounded-full bg-white/20 blur-3xl dark:bg-white/5"
      />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
      {children}
    </main>
  );
}
