import { useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { motion } from "framer-motion";

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
};

function DeveloperPhoto({ dev }) {
  const [failed, setFailed] = useState(false);

  if (!dev.image || failed) {
    return (
      <div
        className="
          grid h-20 w-20
          place-items-center
          rounded-full
          border-4 border-white
          bg-[linear-gradient(135deg,#2C3947,#5F91B6)]
          text-lg font-black
          text-white
          shadow-[0_12px_26px_rgba(44,57,71,0.22)]
        "
      >
        {dev.initials}
      </div>
    );
  }

  return (
    <div
      className="
        h-20 w-20
        shrink-0
        overflow-hidden
        rounded-full
        border-4 border-white
        shadow-[0_12px_26px_rgba(44,57,71,0.22)]
      "
    >
      <img
        src={dev.image}
        alt={dev.name}
        onError={() => setFailed(true)}
        className="
          h-full w-full
          object-cover
          object-center
        "
      />
    </div>
  );
}

function SocialLinks({ dev }) {
  const links = Object.entries(dev.links || {}).filter(
    ([, href]) => Boolean(href)
  );

  if (!links.length) {
    return null;
  }

  return (
    <div className="mt-auto flex justify-center gap-2 pt-4">
      {links.map(([type, href]) => {
        const Icon = socialIcons[type];

        if (!Icon) return null;

        return (
          <a
            key={type}
            href={href}
            target={type === "email" ? undefined : "_blank"}
            rel={type === "email" ? undefined : "noreferrer"}
            aria-label={`${dev.name} ${type}`}
            className="
              grid h-8 w-8
              place-items-center
              rounded-full
              bg-[#2C3947]
              text-white
              shadow-[0_6px_15px_rgba(44,57,71,0.18)]
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-[#4F7EA4]
            "
          >
            <Icon className="h-3.5 w-3.5" />
          </a>
        );
      })}
    </div>
  );
}

function DeveloperCard({ dev, index }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -4,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
      }}
      className="
        relative
        flex min-h-[270px]
        flex-col items-center
        overflow-hidden
        rounded-[24px]
        border border-[#355872]/16
        bg-white
        px-6 py-6
        text-center
        shadow-[0_16px_36px_rgba(44,57,71,0.13)]
        transition-all duration-200
        hover:shadow-[0_22px_46px_rgba(44,57,71,0.18)]
      "
    >
      <div
        className="
          absolute left-0 right-0 top-0
          h-[5px]
          bg-[linear-gradient(90deg,#2C3947,#355872,#7AAACE)]
        "
      />

      <DeveloperPhoto dev={dev} />

      <h3
        className="
          mt-4
          text-lg font-black
          tracking-tight
          text-[#102630]
        "
      >
        {dev.name}
      </h3>

      <p
        className="
          mt-1
          max-w-[230px]
          text-[10px] font-black
          uppercase
          leading-4
          tracking-[0.07em]
          text-[#355872]
        "
      >
        {dev.role}
      </p>

      <div
        className="
          mt-3
          h-[2px] w-9
          rounded-full
          bg-[#5F91B6]
        "
      />

      <p
        className="
          mt-3
          max-w-[235px]
          text-xs
          leading-5
          text-[#5F6F7D]
        "
      >
        {dev.desc}
      </p>

      <SocialLinks dev={dev} />
    </motion.article>
  );
}

export default function DevelopersSection({
  developers,
}) {
  return (
    <section
  id="developers"
  className="
    relative z-10
    scroll-mt-4
    overflow-hidden
    bg-[#DDEFF8]
    px-6
    py-16
  "
>
  <div
    className="
      pointer-events-none
      absolute -left-40 top-10
      h-[380px] w-[380px]
      rounded-full
      bg-[radial-gradient(circle,rgba(156,213,255,0.18),transparent_68%)]
      blur-3xl
    "
  />

  <div
    className="
      pointer-events-none
      absolute -right-40 bottom-0
      h-[420px] w-[420px]
      rounded-full
      bg-[radial-gradient(circle,rgba(53,88,114,0.07),transparent_70%)]
      blur-3xl
    "
  />


      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p
            className="
              text-xs font-black
              uppercase
              tracking-[0.18em]
              text-[#355872]
            "
          >
            Meet the Developers
          </p>

          <h2
            className="
              mt-2
              max-w-2xl
              text-4xl font-black
              leading-tight
              tracking-tight
              text-[#102630]
            "
          >
            Built by GUC students, for GUC students.
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm leading-6
              text-[#5F6F7D]
            "
          >
            Five students collaborating across UI/UX and React frontend
            development.
          </p>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-6
          "
        >
          {developers.map((dev, index) => {
            let positionClass = "lg:col-span-2";

            if (index === 3) {
              positionClass =
                "lg:col-span-2 lg:col-start-2";
            }

            return (
              <div
                key={dev.name}
                className={positionClass}
              >
                <DeveloperCard
                  dev={dev}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}