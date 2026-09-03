import { motion } from "framer-motion";
import { Code2, LockKeyhole } from "lucide-react";

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.38,
        delay: index * 0.04,
      }}
      className="
        group
        overflow-hidden
        rounded-[24px]
        border border-white/10
        bg-white/[0.055]
        shadow-[0_16px_42px_rgba(0,0,0,0.14)]
        backdrop-blur-xl
      "
    >
      <div className="grid min-h-[156px] lg:grid-cols-[29%_71%]">
        <div className="relative min-h-[156px] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="
              absolute inset-0
              h-full w-full
              object-cover
              transition duration-500
              group-hover:scale-[1.03]
            "
          />

          <div
            className="
              absolute inset-0
              bg-[linear-gradient(155deg,rgba(7,28,44,0.04),rgba(7,28,44,0.70))]
            "
          />

          <div
            className="
              absolute left-4 top-4
              rounded-full
              border border-white/15
              bg-[#071C2C]/72
              px-2.5 py-1
              text-[9px] font-black
              text-white
              backdrop-blur-xl
            "
          >
            {project.type}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p
              className="
                text-[8px] font-black
                uppercase
                tracking-[0.14em]
                text-white/58
              "
            >
              {project.course}
            </p>

            <h3
              className="
                mt-1
                max-w-sm
                text-lg font-black
                leading-tight
                text-white
                sm:text-xl
              "
            >
              {project.title}
            </h3>
          </div>
        </div>

        <div
          className="
            flex flex-col
            justify-center
            px-5 py-4
            sm:px-6
          "
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="
                rounded-full
                bg-[#9CD5FF]/12
                px-2.5 py-1
                text-[10px] font-black
                text-[#9CD5FF]
              "
            >
              {project.tag}
            </span>

            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-white/[0.06]
                px-2.5 py-1
                text-[10px] font-black
                text-white/62
              "
            >
              <LockKeyhole className="h-3 w-3" />
              Full details inside
            </span>
          </div>

          <p
            className="
              mt-3
              max-w-3xl
              text-[13px]
              leading-6
              text-white/64
            "
          >
            {project.desc}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="
                mr-1 inline-flex
                items-center gap-1
                text-[8px] font-black
                uppercase
                tracking-[0.14em]
                text-[#9CD5FF]
              "
            >
              <Code2 className="h-3 w-3" />
              Tech
            </span>

            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="
                  rounded-full
                  border border-white/10
                  bg-white/[0.07]
                  px-2.5 py-1
                  text-[10px] font-black
                  text-white/78
                "
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}