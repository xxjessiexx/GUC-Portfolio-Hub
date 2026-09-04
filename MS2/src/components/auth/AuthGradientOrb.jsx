import { motion } from "framer-motion";
import {
  Eye,
  FolderKanban,
  TrendingUp,
  Users2,
} from "lucide-react";

const projects = [
  {
    title: "Project Portfolio Web Platform",
    course: "CSEN 603 · Software Engineering",
    tech: ["React", "Vite", "Tailwind CSS"],
    featured: true,
    visual: "portfolio",
  },
  {
    title: "Autonomous Vehicle Perception",
    course: "Advanced Software Project",
    tech: ["OpenCV", "YOLO", "ROS 2"],
    visual: "perception",
  },
  {
    title: "Mental Wellness Check-in App",
    course: "Student Portfolio Showcase",
    tech: ["Flutter", "Firebase", "UX Research"],
    visual: "mobile",
  },
];

const features = [
  {
    icon: FolderKanban,
    title: "Organize your work",
    description: "Projects, demos & files.",
    iconClass: "bg-[#EDF5FC] text-[#4F7DA5]",
  },
  {
    icon: Users2,
    title: "Work together",
    description: "Teams, roles & feedback.",
    iconClass: "bg-[#FFF5DA] text-[#AE8423]",
  },
  {
    icon: TrendingUp,
    title: "Show your growth",
    description: "Build your academic story.",
    iconClass: "bg-[#EAF7EE] text-[#4B9963]",
  },
];

function ProjectThumbnail({ type }) {
  if (type === "portfolio") {
    return (
      <div
        className="
          relative
          h-[58px]
          w-[78px]
          shrink-0
          overflow-hidden
          rounded-[11px]
          border border-white/10
          bg-[#081B2B]
          shadow-[0_8px_18px_rgba(0,0,0,0.18)]
        "
      >
        {/* fake sidebar */}
        <div className="absolute bottom-0 left-0 top-0 w-[18px] bg-[#071522]">
          <div className="mx-auto mt-2 h-[5px] w-[8px] rounded-[2px] bg-[#7AAACE]" />
          <div className="mx-auto mt-2 h-[2px] w-[9px] rounded-full bg-white/18" />
          <div className="mx-auto mt-2 h-[2px] w-[9px] rounded-full bg-white/10" />
          <div className="mx-auto mt-2 h-[2px] w-[9px] rounded-full bg-white/10" />
        </div>

        {/* dashboard */}
        <div className="absolute left-[23px] right-[5px] top-[6px]">
          <div className="h-[4px] w-[28px] rounded-full bg-white/35" />

          <div className="mt-[6px] grid grid-cols-2 gap-[3px]">
            <div className="h-[18px] rounded-[4px] bg-[#2E5472]">
              <div className="m-[3px] h-[3px] w-[10px] rounded-full bg-[#9CD5FF]/55" />
            </div>

            <div className="h-[18px] rounded-[4px] bg-[#385E7A]">
              <div className="m-[3px] h-[3px] w-[11px] rounded-full bg-[#E6C77B]/55" />
            </div>
          </div>

          <div className="mt-[4px] h-[9px] rounded-[4px] bg-white/[0.06]" />
        </div>
      </div>
    );
  }

  if (type === "perception") {
    return (
      <div
        className="
          relative
          h-[58px]
          w-[78px]
          shrink-0
          overflow-hidden
          rounded-[11px]
          border border-white/10
          bg-[linear-gradient(180deg,#829DB0_0%,#BCC9D0_48%,#273848_49%,#172636_100%)]
          shadow-[0_8px_18px_rgba(0,0,0,0.16)]
        "
      >
        <div className="absolute bottom-[11px] left-[9px] h-[2px] w-[58px] rotate-[-5deg] bg-white/35" />

        <div
          className="
            absolute
            bottom-[17px]
            left-[27px]
            h-[13px]
            w-[32px]
            rounded-[5px_8px_4px_4px]
            bg-[#101B25]
          "
        >
          <div className="absolute -top-[4px] left-[6px] h-[6px] w-[17px] skew-x-[-12deg] rounded-t-[4px] bg-[#1E3446]" />

          <div className="absolute -bottom-[3px] left-[4px] h-[6px] w-[6px] rounded-full bg-[#050B10]" />
          <div className="absolute -bottom-[3px] right-[4px] h-[6px] w-[6px] rounded-full bg-[#050B10]" />

          <div className="absolute bottom-[2px] right-0 h-[2px] w-[11px] bg-[#E56B48]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        h-[58px]
        w-[78px]
        shrink-0
        overflow-hidden
        rounded-[11px]
        border border-white/10
        bg-[linear-gradient(135deg,#203B55,#6B9ABC)]
        shadow-[0_8px_18px_rgba(0,0,0,0.16)]
      "
    >
      <div
        className="
          absolute
          left-[12px]
          top-[8px]
          h-[43px]
          w-[23px]
          rounded-[6px]
          border
          border-white/45
          bg-[#10283F]
        "
      >
        <div className="mx-auto mt-[5px] h-[2px] w-[9px] rounded-full bg-white/24" />

        <div className="mx-auto mt-[7px] grid w-[14px] grid-cols-2 gap-[2px]">
          <div className="h-[5px] rounded-[1px] bg-[#9CD5FF]" />
          <div className="h-[5px] rounded-[1px] bg-[#E6C77B]" />
          <div className="h-[5px] rounded-[1px] bg-white/22" />
          <div className="h-[5px] rounded-[1px] bg-[#9CD5FF]/50" />
        </div>
      </div>

      <div className="absolute bottom-[13px] right-[7px] space-y-[4px]">
        <div className="h-[3px] w-[29px] rounded-full bg-white/26" />
        <div className="h-[3px] w-[22px] rounded-full bg-white/16" />
      </div>
    </div>
  );
}

function ProjectRow({ project, index }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: 0.18 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.18,
        },
      }}
      className={`
        relative
        overflow-hidden
        rounded-[16px]
        border
        p-3
        ${
          project.featured
            ? `
              border-[#E6C77B]/42
              bg-[#244762]
              shadow-[0_13px_28px_rgba(0,0,0,0.16)]
            `
            : `
              border-white/[0.09]
              bg-[#17344A]
              shadow-[0_7px_18px_rgba(0,0,0,0.08)]
            `
        }
      `}
    >
      {project.featured && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(
              115deg,
              rgba(156,213,255,0.08),
              transparent_55%
            )]
          "
        />
      )}

      <div className="relative flex gap-3">
        <ProjectThumbnail type={project.visual} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-black text-white">
                {project.title}
              </p>

              <p className="mt-1 truncate text-[7px] font-semibold text-white/36">
                {project.course}
              </p>
            </div>

            <span
              className="
                inline-flex
                shrink-0
                items-center
                gap-1
                rounded-full
                border border-[#9CD5FF]/23
                bg-[#9CD5FF]/10
                px-1.5
                py-[3px]
                text-[6px]
                font-black
                text-[#C5E9FF]
              "
            >
              <Eye className="h-[8px] w-[8px]" />
              Public
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="
                  rounded-full
                  border border-[#9CD5FF]/18
                  bg-[#9CD5FF]/8
                  px-1.5
                  py-[2px]
                  text-[6px]
                  font-bold
                  text-[#BFE5FF]
                "
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AuthGradientOrb() {
  return (
    <section
      aria-label="GUC Portfolio Hub preview"
      className="relative h-full min-h-0 w-full"
    >
      <div className="relative flex h-full min-h-0 flex-col">
        {/* EDITORIAL INTRO */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="shrink-0"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[2px] w-11 rounded-full bg-[#E6C77B]" />

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.22em]
                text-[#6798BD]
              "
            >
              Student work, elevated
            </span>
          </div>

          <h2
            className="
              max-w-[540px]
              text-[42px]
              font-black
              leading-[0.98]
              tracking-[-0.052em]
              text-[color:var(--ink)]
            "
          >
            Your projects already tell a story.
          </h2>

          <p
            className="
              mt-3
              max-w-[510px]
              text-[14px]
              leading-6
              text-[color:var(--muted)]
            "
          >
            Give coursework, demos, collaborations, and achievements a place
            worth showing.
          </p>
        </motion.div>

        {/* SHOWCASE */}

        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative
            mt-5
            flex
            min-h-0
            flex-1
            flex-col
            overflow-hidden
            rounded-[28px]
            border border-white/55
            shadow-[0_28px_62px_rgba(49,78,104,0.18)]
          "
        >
          {/* NAVY PRODUCT SURFACE */}

          <div
            className="
              relative
              grid
              min-h-0
              flex-1
              grid-cols-[0.82fr_1.18fr]
              overflow-hidden
            "
            style={{
              background:
                "linear-gradient(135deg, #0B2234 0%, #102C43 52%, #183D59 100%)",
            }}
          >
            {/* internal light */}
            <div
              className="
                pointer-events-none
                absolute
                -left-24
                -top-24
                h-[310px]
                w-[310px]
                rounded-full
                bg-[radial-gradient(circle,rgba(122,170,206,0.19),transparent_67%)]
              "
            />

            {/* FEATURED PROJECT */}

            <div
              className="
                relative
                z-10
                flex
                min-h-0
                flex-col
                p-5
                text-white
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-[#E6C77B]
                "
              >
                Featured Project
              </p>

              <p className="mt-3 text-[11px] font-bold text-[#79B0E3]">
                CSEN 603
              </p>

              <h3
                className="
                  mt-2
                  max-w-[215px]
                  text-[30px]
                  font-black
                  leading-[1]
                  tracking-[-0.04em]
                  text-white
                "
              >
                Project Portfolio Web Platform
              </h3>

              <p
                className="
                  mt-3
                  max-w-[220px]
                  text-[11px]
                  leading-[1.7]
                  text-white/70
                "
              >
                A role-based platform for projects, portfolios, collaboration,
                instructor feedback, and career discovery.
              </p>

              {/* tiny product-preview accent */}
              <div
                className="
                  mt-4
                  overflow-hidden
                  rounded-[15px]
                  border border-white/10
                  bg-[#081D2D]
                  p-2
                  shadow-[0_12px_28px_rgba(0,0,0,0.16)]
                "
              >
                <div className="flex gap-2">
                  <div className="w-[18px] rounded-[5px] bg-[#061522] p-[4px]">
                    <div className="h-[3px] rounded-full bg-[#7AAACE]" />
                    <div className="mt-[5px] h-[2px] rounded-full bg-white/14" />
                    <div className="mt-[4px] h-[2px] rounded-full bg-white/10" />
                    <div className="mt-[4px] h-[2px] rounded-full bg-white/10" />
                  </div>

                  <div className="flex-1">
                    <div className="h-[3px] w-[38px] rounded-full bg-white/25" />

                    <div className="mt-[6px] grid grid-cols-2 gap-1.5">
                      <div className="h-[21px] rounded-[5px] bg-[#31546E]" />
                      <div className="h-[21px] rounded-[5px] bg-[#28485F]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* collaborators */}
              <div
                className="
                  mt-auto
                  flex
                  items-center
                  gap-2.5
                  pt-3
                "
              >
                <div className="flex -space-x-2">
                  {["YK", "F", "MM", "+2"].map((person) => (
                    <div
                      key={person}
                      className="
                        grid
                        h-7
                        w-7
                        place-items-center
                        rounded-full
                        border-2
                        border-[#D9ECF8]
                        bg-[linear-gradient(135deg,#89B6D9,#507696)]
                        text-[8px]
                        font-black
                        text-white
                        shadow-[0_4px_10px_rgba(0,0,0,0.18)]
                      "
                    >
                      {person}
                    </div>
                  ))}
                </div>

                <span className="text-[10px] font-semibold text-white/70">
                  5 collaborators
                </span>
              </div>
            </div>

            {/* PORTFOLIO WORKSPACE */}

            <div className="relative z-10 min-h-0 p-3 pl-0">
              <div
                className="
                  relative
                  flex
                  h-full
                  min-h-0
                  flex-col
                  overflow-hidden
                  rounded-[22px]
                  border border-[#A3D3EF]/18
                  bg-[#091F30]
                  shadow-[0_24px_48px_rgba(0,0,0,0.31)]
                "
              >
                {/* subtle top edge highlight */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-[18px]
                    right-[18px]
                    top-0
                    h-px
                    bg-[linear-gradient(90deg,transparent,rgba(156,213,255,0.28),transparent)]
                  "
                />

                <div
                  className="
                    relative
                    shrink-0
                    border-b
                    border-white/[0.07]
                    px-3.5
                    py-3
                  "
                >
                  <p className="text-[12px] font-black text-white">
                    My Projects
                  </p>

                  <p className="mt-0.5 text-[8px] text-white/32">
                    Portfolio workspace
                  </p>
                </div>

                <div
                  className="
                    min-h-0
                    flex-1
                    space-y-2
                    overflow-hidden
                    p-3
                  "
                >
                  {projects.map((project, index) => (
                    <ProjectRow
                      key={project.title}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>

                <div
                  className="
                    mx-3
                    mb-3
                    flex
                    shrink-0
                    items-center
                    justify-between
                    rounded-[12px]
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    px-2.5
                    py-1.5
                  "
                >
                  <span className="text-[7px] font-semibold text-white/38">
                    GitHub & demos connected
                  </span>

                  <span className="text-[7px] font-black text-[#A9DCFA]">
                    Portfolio ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM FEATURE STRIP */}

          <div
            className="
              grid
              shrink-0
              grid-cols-3
              divide-x
              divide-[#355872]/10
              bg-[rgba(249,252,254,0.98)]
            "
          >
            {features.map(
              ({
                icon: Icon,
                title,
                description,
                iconClass,
              }) => (
                <div
                  key={title}
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3.5
                  "
                >
                  <div
                    className={`
                      grid
                      h-10
                      w-10
                      shrink-0
                      place-items-center
                      rounded-[13px]
                      shadow-[0_6px_15px_rgba(53,88,114,0.06)]
                      ${iconClass}
                    `}
                  >
                    <Icon className="h-[16px] w-[16px]" />
                  </div>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-black
                        leading-4
                        text-[#283C4D]
                      "
                    >
                      {title}
                    </p>

                    <p
                      className="
                        mt-[2px]
                        text-[8px]
                        leading-[1.5]
                        text-[#728390]
                      "
                    >
                      {description}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}