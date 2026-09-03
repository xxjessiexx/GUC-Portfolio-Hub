import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  BriefcaseBusiness,
  FolderKanban,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    text: "Showcase your strongest academic work",
  },
  {
    icon: UsersRound,
    text: "Collaborate with teammates and instructors",
  },
  {
    icon: BriefcaseBusiness,
    text: "Build a portfolio you can carry beyond GUC",
  },
];

export default function AuthGradientOrb() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 40,
    damping: 24,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 40,
    damping: 24,
  });

  const farX = useTransform(
    smoothX,
    [-1, 1],
    [-10, 10]
  );

  const farY = useTransform(
    smoothY,
    [-1, 1],
    [-8, 8]
  );

  const midX = useTransform(
    smoothX,
    [-1, 1],
    [10, -10]
  );

  const midY = useTransform(
    smoothY,
    [-1, 1],
    [8, -8]
  );

  const handlePointerMove = (event) => {
    const bounds =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - bounds.left) /
      bounds.width;

    const y =
      (event.clientY - bounds.top) /
      bounds.height;

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
      aria-label="About GUC Portfolio Hub"
      className="
        relative
        hidden
        w-full
        lg:flex
        lg:min-h-[560px]
        lg:items-center
        lg:justify-center
      "
    >
      <div
        className="
          relative
          w-full
          max-w-[560px]
        "
      >
        {/* ---------------------------
            Decorative atmosphere
        ---------------------------- */}

        <motion.div
          aria-hidden="true"
          style={{
            x: farX,
            y: farY,
          }}
          className="
            pointer-events-none
            absolute
            -right-10
            -top-20
            h-[210px]
            w-[210px]
            rounded-full
            border
            border-white/50
            bg-white/18
            shadow-[inset_0_0_30px_rgba(255,255,255,0.35)]
            backdrop-blur-lg
          "
        />

        <motion.div
          aria-hidden="true"
          style={{
            x: midX,
            y: midY,
          }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            -left-6
            top-[155px]
            h-[58px]
            w-[58px]
            rounded-full
            border
            border-white/55
            bg-white/24
            shadow-[0_12px_34px_rgba(83,117,145,0.08)]
            backdrop-blur-lg
          "
        />

        <motion.div
          aria-hidden="true"
          style={{
            x: farX,
            y: farY,
          }}
          className="
            pointer-events-none
            absolute
            -right-2
            top-[280px]
            h-4
            w-4
            rounded-full
            bg-[color:var(--gold)]
            shadow-[0_0_18px_rgba(230,199,123,0.28)]
          "
        />

        {/* soft aura behind panel */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[430px]
            w-[430px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[radial-gradient(
              circle,
              rgba(156,213,255,0.16)_0%,
              rgba(122,170,206,0.06)_45%,
              transparent_72%
            )]
            blur-3xl
          "
        />

        {/* ---------------------------
            Editorial message panel
        ---------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[500px]

            rounded-[34px]

            border
            border-white/60

            bg-white/38

            px-10
            py-9

            shadow-[0_26px_70px_rgba(83,117,145,0.10)]

            backdrop-blur-2xl
          "
        >
          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.22em]
              text-[color:var(--primary)]
            "
          >
            For GUC Students
          </p>

          <div
            className="
              mt-3
              h-[3px]
              w-12
              rounded-full
              bg-[linear-gradient(
                90deg,
                var(--gold),
                rgba(230,199,123,0.14)
              )]
            "
          />

          <h2
            className="
              mt-6
              max-w-[420px]

              text-[32px]
              font-black
              leading-[1.08]
              tracking-[-0.04em]

              text-[color:var(--dark)]
            "
          >
            Your best work shouldn&apos;t stay buried
            in coursework.
          </h2>

          <p
            className="
              mt-4
              max-w-[400px]

              text-[14px]
              font-medium
              leading-6

              text-[color:var(--muted)]
            "
          >
            Turn projects, demos, GitHub work,
            achievements, and collaborations into a
            portfolio that grows with you.
          </p>

          <div className="mt-7 space-y-4">
            {features.map(
              ({
                icon: Icon,
                text,
              }) => (
                <div
                  key={text}
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center

                      rounded-[12px]

                      border
                      border-white/65

                      bg-white/48

                      text-[color:var(--primary)]

                      shadow-[0_7px_18px_rgba(83,117,145,0.07)]
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <p
                    className="
                      text-[13px]
                      font-bold
                      leading-5
                      text-[color:var(--primary)]
                    "
                  >
                    {text}
                  </p>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}