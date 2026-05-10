import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export default function AuthGradientOrb() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 24 });

  const blobX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const blobY = useTransform(smoothY, [-1, 1], [-14, 14]);

  const auraX = useTransform(smoothX, [-1, 1], [12, -12]);
  const auraY = useTransform(smoothY, [-1, 1], [10, -10]);

  const accentX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const accentY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    mouseX.set((x - 0.5) * 2);
    mouseY.set((y - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative hidden min-h-[620px] w-full lg:block"
      aria-label="Future-focused login visual"
    >
      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex h-[620px] w-full max-w-[620px] items-center justify-center"
      >
        {/* soft hero panel */}
        <div className="relative h-[560px] w-[540px] overflow-hidden rounded-[44px] border border-white/50 bg-[linear-gradient(180deg,rgba(234,244,250,0.92),rgba(247,248,240,0.72))] shadow-[0_28px_90px_rgba(83,117,145,0.12)] backdrop-blur-2xl">
          {/* background glow */}
          <motion.div
            style={{ x: auraX, y: auraY }}
            className="pointer-events-none absolute left-1/2 top-[43%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.30)_0%,rgba(122,170,206,0.14)_45%,transparent_72%)] blur-3xl"
          />

          {/* decorative subtle shapes */}
          <motion.div
            style={{ x: accentX, y: accentY }}
            className="absolute right-10 top-10 h-16 w-16 rounded-[22px] border border-white/40 bg-white/26 backdrop-blur-xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 4, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            style={{ x: accentX, y: accentY }}
            className="absolute bottom-36 left-10 h-4 w-4 rounded-full bg-[color:var(--gold)] shadow-[0_0_24px_rgba(230,199,123,0.55)]"
            animate={{
              y: [0, 10, 0],
              opacity: [0.45, 1, 0.45],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            style={{ x: accentX, y: accentY }}
            className="absolute right-14 top-[42%] h-4 w-4 rounded-full bg-[color:var(--accent)] shadow-[0_0_24px_rgba(156,213,255,0.7)]"
            animate={{
              y: [0, -12, 0],
              opacity: [0.45, 1, 0.45],
              scale: [1, 1.35, 1],
            }}
            transition={{
              duration: 4.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* main blob area */}
          <div className="absolute inset-x-0 top-12 flex justify-center">
            <motion.div
              style={{ x: blobX, y: blobY }}
              animate={{
                y: [0, -14, 0],
                rotate: [0, 3, -2, 0],
                scale: [1, 1.025, 0.995, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative h-[300px] w-[300px]"
            >
              {/* blob base */}
              <motion.div
                className="absolute inset-0 rounded-[44%_56%_58%_42%/42%_42%_58%_58%] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_28%,rgba(225,244,250,0.96)_62%,rgba(156,213,255,0.85)_100%)] shadow-[0_30px_90px_rgba(83,117,145,0.16)]"
                animate={{
                  borderRadius: [
                    "44% 56% 58% 42% / 42% 42% 58% 58%",
                    "52% 48% 46% 54% / 50% 40% 60% 50%",
                    "46% 54% 58% 42% / 56% 48% 52% 44%",
                    "44% 56% 58% 42% / 42% 42% 58% 58%",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* soft blue tint */}
              <motion.div
                className="absolute bottom-3 left-8 h-[120px] w-[190px] rounded-full bg-[color:var(--accent)]/28 blur-2xl"
                animate={{
                  x: [0, 12, -8, 0],
                  y: [0, -10, 8, 0],
                  scale: [1, 1.08, 0.96, 1],
                }}
                transition={{
                  duration: 7.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* highlight */}
              <motion.div
                className="absolute left-[18%] top-[16%] h-[92px] w-[110px] rounded-full bg-white/46 blur-2xl"
                animate={{
                  x: [0, 12, -4, 0],
                  y: [0, -8, 8, 0],
                  opacity: [0.48, 0.76, 0.52, 0.48],
                }}
                transition={{
                  duration: 6.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* outer rim */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/35 shadow-[inset_0_1px_24px_rgba(255,255,255,0.28)]"
                animate={{ opacity: [0.55, 0.82, 0.55] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          {/* copy */}
          <div className="absolute bottom-14 left-12 right-12">
            <div className="mb-4 inline-flex rounded-full border border-white/50 bg-white/38 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[color:var(--primary)] backdrop-blur-xl">
              Built for what’s next
            </div>

            <h3 className="text-[30px] font-black leading-tight text-[color:var(--dark)]">
              The future starts here.
            </h3>

            <p className="mt-3 max-w-[370px] text-[15px] font-medium leading-7 text-[color:var(--muted)]">
              A home for the next generation of developers to build projects,
              grow portfolios, and shape the work they want to be known for.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}