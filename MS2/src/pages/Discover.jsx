
// src/pages/DiscoverPage.jsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { extraPortfolioProjects50 } from "@/data/seed/extra-ms2-projects-50";
import { getAllProjects,getCollection,
  normalizeRole, } from "@/data/demoStore";

import {
  Sparkles,
  FolderOpen,
  UserRound,
  GraduationCap,
  TrendingUp,
  Atom,
  Braces,
  Code2,
  Coffee,
  Database,
  FileCode2,
  Globe,
  Palette,
  Server,
  Smartphone,
  Cpu,
  Boxes,
  Layers3,
  Star,
} from "lucide-react";

/* =========================================================
   DEMO DATA
========================================================= */


const getTopicIcon = (topic) => {
  const value = String(topic || "").toLowerCase();

  // React
  if (value.includes("react")) {
    return Atom;
  }

  // Python
  if (value.includes("python")) {
    return FileCode2;
  }

  // Node / Express / backend
  if (
    value.includes("node") ||
    value.includes("express") ||
    value.includes("backend")
  ) {
    return Server;
  }

  // Java
  if (value.includes("java") && !value.includes("javascript")) {
    return Coffee;
  }

  // JavaScript / TypeScript
  if (
    value.includes("javascript") ||
    value.includes("typescript")
  ) {
    return Braces;
  }

  // Tailwind / CSS / styling
  if (
    value.includes("tailwind") ||
    value === "css" ||
    value.includes("scss") ||
    value.includes("sass")
  ) {
    return Palette;
  }

  // MongoDB / SQL / database
  if (
    value.includes("mongo") ||
    value.includes("sql") ||
    value.includes("database") ||
    value.includes("postgres")
  ) {
    return Database;
  }

  // Angular
  if (value.includes("angular")) {
    return Layers3;
  }

  // Mobile
  if (
    value.includes("flutter") ||
    value.includes("android") ||
    value.includes("mobile") ||
    value.includes("react native")
  ) {
    return Smartphone;
  }

  // Embedded / IoT
  if (
    value.includes("embedded") ||
    value.includes("iot") ||
    value.includes("arduino") ||
    value.includes("raspberry")
  ) {
    return Cpu;
  }

  // Web
  if (
    value.includes("html") ||
    value.includes("web")
  ) {
    return Globe;
  }

  // General programming fallback
  if (
    value.includes("c++") ||
    value === "c" ||
    value.includes("programming")
  ) {
    return Code2;
  }

  return Boxes;
};

const recommendedProjects = extraPortfolioProjects50
  .filter((project) => {
    const type = (project.type || "").toLowerCase();

    return (
      project.isDemo &&
      project.status === "approved" &&
      project.visibility === "public" &&
      !type.includes("portfolio")
    );
  })
  .sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }

    return (b.rating || 0) - (a.rating || 0);
  })
  .slice(0, 4);







/* =========================================================
   PAGE
========================================================= */

export default function DiscoverPage() {
  const navigate = useNavigate();

  /* =======================================================
     SECTION REFERENCES
  ======================================================= */

  const forYouRef = useRef(null);
  const projectsRef = useRef(null);
  const portfoliosRef = useRef(null);
  const instructorsRef = useRef(null);
  const trendingRef = useRef(null);


  /* =======================================================
     SCROLL TO SECTION
  ======================================================= */

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const allProjects = getAllProjects();

const topicCounts = {};

allProjects.forEach((project) => {
  const topics = [
    ...(project.tags || []),
    ...(project.technologies || []),
    ...(project.languages || []),
  ];

  // Prevent the same project from counting a topic more than once
  const uniqueTopics = [...new Set(topics)];

  uniqueTopics.forEach((topic) => {
    if (!topic) return;

    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });
});

const trendingTopics = Object.entries(topicCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([label, count]) => ({
    label,
    count,
    icon: getTopicIcon(label),
  }));

  

const allUsers = getCollection("users");

// ─────────────────────────────────────────────
// PROJECT PREVIEW
// ─────────────────────────────────────────────

const projectPreview = [...allProjects]
  .filter(
    (project) =>
      project.visibility?.toLowerCase() === "public" &&
      project.status?.toLowerCase() === "approved"
  )
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 3)
  .map((project) => ({
    id: project.id,
    title: project.title || project.name,
    category:
      project.courseName ||
      project.program ||
      project.type ||
      "Project",

    // Keep the same property expected by your current UI
    likes: project.likes || project.rating || 0,
  }));


// ─────────────────────────────────────────────
// PORTFOLIO PREVIEW
// ─────────────────────────────────────────────

const portfolioPreview = allUsers
  .filter(
    (user) =>
      normalizeRole(
        user.role || user.accountRole || user.systemRole
      ) === "student"
  )
  .map((student) => {
    const studentProjects = allProjects.filter(
      (project) =>
        String(project.ownerId) === String(student.id) ||
        project.collaboratorIds?.some(
          (id) => String(id) === String(student.id)
        )
    );

    return {
      id: student.id,
      name: student.name,

      major:
        student.major ||
        student.faculty ||
        student.program ||
        "GUC Student",

      projects: studentProjects.length,
    };
  })
  .sort((a, b) => b.projects - a.projects)
  .slice(0, 3);


// ─────────────────────────────────────────────
// INSTRUCTOR PREVIEW
// ─────────────────────────────────────────────

const instructorPreview = allUsers
  .filter(
    (user) =>
      normalizeRole(
        user.role || user.accountRole || user.systemRole
      ) === "instructor"
  )
  .map((instructor) => {
    const instructorProjects = allProjects.filter((project) =>
      project.instructorIds?.some(
        (id) => String(id) === String(instructor.id)
      )
    );

    return {
      id: instructor.id,
      name: instructor.name,

      major:
        instructor.major ||
        instructor.department ||
        instructor.faculty ||
        instructor.title ||
        "GUC Instructor",

      projects: instructorProjects.length,
    };
  })
  .sort((a, b) => b.projects - a.projects)
  .slice(0, 3);

  return (
    <DashboardLayout>

      <div className="mx-auto w-full max-w-[1480px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <PageHeader
          className="mb-10"
          title="Discover"
          description="Discover projects, portfolios, and course instructors across the GUC community."
        />


        <div className="space-y-10">

          {/* =================================================
              SECTION NAVIGATION
          ================================================= */}

          <nav
            className="
              sticky
              top-0
              z-30

              grid
              grid-cols-2

              border-b
              border-[var(--card-border)]

              bg-[var(--background)]/90

              backdrop-blur-xl

              sm:grid-cols-5
            "
          >

            <DiscoverTab
              icon={Sparkles}
              label="For You"
              onClick={() =>
                scrollToSection(forYouRef)
              }
            />


            <DiscoverTab
              icon={FolderOpen}
              label="Projects"
              onClick={() =>
                scrollToSection(projectsRef)
              }
            />


            <DiscoverTab
              icon={UserRound}
              label="Portfolios"
              onClick={() =>
                scrollToSection(portfoliosRef)
              }
            />


            <DiscoverTab
              icon={GraduationCap}
              label="Instructors"
              onClick={() =>
                scrollToSection(instructorsRef)
              }
            />


            <DiscoverTab
              icon={TrendingUp}
              label="Trending"
              onClick={() =>
                scrollToSection(trendingRef)
              }
            />

          </nav>


          {/* =================================================
              FOR YOU
          ================================================= */}

         {/* =================================================
    FOR YOU
================================================= */}

<section ref={forYouRef} className="scroll-mt-28">
  <SectionTitle
    icon={Sparkles}
    title="For You"
    subtitle="Curated picks based on your interests."
  />

  <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
    {recommendedProjects.map((project) => {
      const creatorName =
        project.creatorName ||
        project.ownerName ||
        project.studentName ||
        project.authorName ||
        null;

      return (
        <article
          key={project.id}
          className="
            group
            overflow-hidden
            rounded-[28px]
            border
            border-[var(--card-border)]
            bg-[var(--card-bg)]
            shadow-[var(--shadow-soft)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
        >
          {/* IMAGE */}
          <div className="relative h-[190px] overflow-hidden">
            <img
              src={project.image || project.thumbnail}
              alt={project.title}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />

            {/* CATEGORY / COURSE BADGE */}
            <span
              className="
                absolute
                bottom-4
                left-4
                rounded-full
                bg-[#355872]
                px-4
                py-2
                text-[11px]
                font-black
                text-white
                shadow-md
              "
            >
              {project.courseCode || project.type}
            </span>
          </div>

          {/* CONTENT */}
          <div className="flex min-h-[220px] flex-col p-6">

            {/* TITLE */}
            <h3
              className="
                text-[19px]
                font-black
                leading-tight
                tracking-[-0.02em]
                text-[var(--ink)]
              "
            >
              {project.title}
            </h3>

            {/* DESCRIPTION */}
            <p
              className="
                mt-3
                line-clamp-2
                text-[13px]
                font-semibold
                leading-6
                text-[var(--muted)]
              "
            >
              {project.description}
            </p>

            {/* BOTTOM */}
            <div className="mt-auto flex items-center justify-between pt-6">

              {/* CREATOR */}
              <div className="min-w-0">
                {creatorName ? (
                  <p
                    className="
                      truncate
                      text-[13px]
                      font-black
                      text-[var(--ink)]
                    "
                  >
                    {creatorName}
                  </p>
                ) : (
                  <p
                    className="
                      truncate
                      text-[12px]
                      font-bold
                      text-[var(--muted)]
                    "
                  >
                    {project.courseName}
                  </p>
                )}
              </div>

              {/* RATING */}
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                  text-[var(--muted)]
                "
              >
                <Star
                  size={19}
                  strokeWidth={2}
                  className="text-[var(--muted)]"
                />

                <span
                  className="
                    text-[13px]
                    font-black
                    text-[var(--muted)]
                  "
                >
                  {project.rating ?? "N/A"}
                </span>
              </div>

            </div>
          </div>
        </article>
      );
    })}
  </div>
</section>


          {/* =================================================
              TRENDING
          ================================================= */}

          <section
            ref={trendingRef}
            className="scroll-mt-28"
          >

            <SectionTitle
              icon={TrendingUp}
              title="Trending Topics"
              subtitle="Popular disciplines and interests across GUC right now."
            />


            <div
              className="
                mt-4

                grid
                grid-cols-2

                gap-3

                md:grid-cols-3
                xl:grid-cols-6
              "
            >

              {trendingTopics.map((topic) => {
                const Icon = topic.icon;

                return (

                  <button
                    key={topic.label}
                    type="button"
                    onClick={() =>
  navigate(
    `/explore-projects?search=${encodeURIComponent(topic.label)}`
  )
}

                    className="
                      flex
                      items-center

                      gap-3

                      rounded-2xl

                      border
                      border-[var(--card-border)]

                      bg-[var(--card-bg)]

                      p-3

                      text-left

                      shadow-[var(--shadow-soft)]

                      transition-all
                      duration-200

                      hover:-translate-y-0.5
                      hover:shadow-md
                    "
                  >

                    <span
                      className="
                        flex

                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        bg-[#9CD5FF]/20

                        text-[#355872]

                        dark:text-[#8FC5E8]
                      "
                    >
                      <Icon size={18} />
                    </span>


                    <span className="min-w-0">

                      <span
                        className="
                          block
                          truncate

                          text-xs
                          font-black

                          text-[var(--ink)]
                        "
                      >
                        {topic.label}
                      </span>


                      <span
                        className="
                          mt-0.5
                          block

                          text-[10px]
                          font-semibold

                          text-[var(--muted)]
                        "
                      >
                        {topic.count} projects
                      </span>

                    </span>

                  </button>

                );
              })}

            </div>

          </section>


          {/* =================================================
              PROJECTS
          ================================================= */}

          <ExploreFeature
            sectionRef={projectsRef}

            eyebrow="Explore Projects"

            title="Discover real student projects"

            description="
              Browse projects from every discipline — engineering,
              prototypes, AI models, design systems, business plans,
              and more.
            "

            button="Browse Projects"

            onClick={() =>
              navigate("/explore-projects")
            }

            preview={
              <DarkPreview
                icon={FolderOpen}
                title="Projects"
                items={projectPreview}
                type="project"
              />
            }
          />


          {/* =================================================
              PORTFOLIOS
          ================================================= */}

          <ExploreFeature
            sectionRef={portfoliosRef}

            reverse

            eyebrow="Explore Portfolios"

            title="Meet the talent behind the work"

            description="
              Discover student portfolios showcasing real skills,
              hands-on experience, projects, and achievements
              across all GUC departments.
            "

            button="Browse Portfolios"

            onClick={() =>
              navigate("/explore-portfolio")
            }

            preview={
              <PortfolioPreview
                items={portfolioPreview}
              />
            }
          />


          {/* =================================================
              INSTRUCTORS
          ================================================= */}

          <ExploreFeature
            sectionRef={instructorsRef}

            eyebrow="Explore Instructors"

            title="Learn from inspiring mentors"

            description="
              Find instructors, explore their research areas,
              and discover projects and students they've mentored.
            "

            button="Explore Instructors"

            onClick={() =>
              navigate("/explore-instructors")
            }

            preview={
              <DarkPreview
                icon={GraduationCap}
                title="Instructors"
                items={instructorPreview}
                type="instructor"
              />
            }
          />

        </div>

      </div>

    </DashboardLayout>
  );
}


/* =========================================================
   DISCOVER TAB
========================================================= */

function DiscoverTab({
  icon: Icon,
  label,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}

      className="
        group
        relative

        flex
        items-center
        justify-center

        gap-2

        px-3
        py-4

        text-sm
        font-black

        text-[var(--muted)]

        transition-colors
        duration-200

        hover:text-[var(--primary)]
      "
    >

      <Icon
        size={17}
        strokeWidth={2.2}

        className="
          transition-transform
          duration-200

          group-hover:scale-110
        "
      />

      {label}


      {/* HOVER LINE */}

      <span
        className="
          absolute
          bottom-0

          left-1/2

          h-[3px]
          w-0

          -translate-x-1/2

          rounded-full

          bg-[#7AAACE]

          transition-all
          duration-300

          group-hover:w-[70%]
        "
      />

    </button>

  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}) {

  return (

    <div>

      <div
        className="
          flex
          items-center

          gap-2

          text-[var(--ink)]
        "
      >

        <Icon
          size={22}
          className="text-[var(--primary)]"
        />


        <h2
          className="
            text-xl
            font-black
          "
        >
          {title}
        </h2>

      </div>


      <p
        className="
          mt-1

          text-xs
          font-semibold

          text-[var(--muted)]
        "
      >
        {subtitle}
      </p>

    </div>

  );
}


/* =========================================================
   EXPLORE FEATURE
========================================================= */

function ExploreFeature({
  sectionRef,
  eyebrow,
  title,
  description,
  button,
  onClick,
  preview,
  reverse = false,
}) {

  return (

    <section
      ref={sectionRef}

      className="
        scroll-mt-28

        overflow-hidden

        rounded-[28px]

        border
        border-[var(--card-border)]

        bg-[var(--card-bg)]

        p-3

        shadow-[var(--shadow-soft)]
      "
    >

      <div
        className={`
          grid
          items-stretch

          gap-4

          lg:grid-cols-2

          ${
            reverse
              ? "lg:[&>*:first-child]:order-2"
              : ""
          }
        `}
      >

        {/* PREVIEW */}

        <div>
          {preview}
        </div>


        {/* DESCRIPTION */}

        <div
          className="
            relative

            flex

            min-h-[300px]

            flex-col
            justify-center

            overflow-hidden

            rounded-[22px]

            px-8
            py-10

            sm:px-12
          "
        >

          {/* DECORATION */}

          <div
            className="
              pointer-events-none

              absolute

              -bottom-24
              -right-20

              h-64
              w-64

              rounded-full

              bg-[#9CD5FF]/15
            "
          />


          <div className="relative z-10">

            <p
              className="
                text-[10px]
                font-black
                uppercase

                tracking-[0.18em]

                text-[#7AAACE]
              "
            >
              {eyebrow}
            </p>


            <h2
              className="
                mt-3

                max-w-[500px]

                text-3xl
                font-black

                tracking-[-0.035em]

                text-[var(--ink)]
              "
            >
              {title}
            </h2>


            <p
              className="
                mt-3

                max-w-[520px]

                whitespace-normal

                text-sm
                font-semibold
                leading-6

                text-[var(--muted)]
              "
            >
              {description}
            </p>


            <button
              type="button"
              onClick={onClick}

              className="
                mt-6

                inline-flex

                items-center
                justify-center

                rounded-xl

                bg-[#355872]

                px-5
                py-3

                text-sm
                font-black

                text-white

                shadow-lg

                transition-all
                duration-200

                hover:-translate-y-0.5

                hover:bg-[#2C4A61]
              "
            >
              {button}
            </button>

          </div>

        </div>

      </div>

    </section>

  );
}


/* =========================================================
   DARK PREVIEW
========================================================= */

function DarkPreview({
  icon: Icon,
  title,
  items,
  type,
}) {

  return (

    <div
      className="
        h-full

        min-h-[300px]

        rounded-[22px]

        bg-gradient-to-br

        from-[#355872]
        to-[#163D69]

        p-5

        text-white

        shadow-inner
      "
    >

      {/* TITLE */}

      <div
        className="
          mb-4

          flex
          items-center

          gap-2

          text-xs
          font-black
          uppercase

          tracking-[0.14em]

          text-white/75
        "
      >

        <span
          className="
            flex

            h-9
            w-9

            items-center
            justify-center

            rounded-xl

            bg-white/10
          "
        >
          <Icon size={17} />
        </span>

        {title}

      </div>


      {/* ITEMS */}

      <div className="space-y-3">

        {items.map((item) => (

          <div
            key={item.title || item.name}

            className="
              flex
              items-center
              justify-between

              gap-3

              rounded-xl

              border
              border-white/10

              bg-white/[0.08]

              px-4
              py-3
            "
          >

            <div className="min-w-0">

              <p
                className="
                  truncate

                  text-sm
                  font-black
                "
              >
                {item.title || item.name}
              </p>


              <p
                className="
                  mt-0.5

                  truncate

                  text-[10px]
                  font-semibold

                  text-white/55
                "
              >
                {item.category || item.major}
              </p>

            </div>


            <span
              className="
                shrink-0

                rounded-full

                bg-white/10

                px-3
                py-1

                text-[10px]
                font-bold

                text-white/75
              "
            >

              {type === "project"
                ? `${item.likes} likes`
                : `${item.projects} projects`
              }

            </span>

          </div>

        ))}

      </div>

    </div>

  );
}


/* =========================================================
   PORTFOLIO PREVIEW
========================================================= */

function PortfolioPreview({
  items,
}) {

  return (

    <div
      className="
        h-full

        min-h-[300px]

        rounded-[22px]

        border
        border-[var(--card-border)]

        bg-[var(--surface-soft)]

        p-5
      "
    >

      {/* TITLE */}

      <div
        className="
          mb-4

          flex
          items-center

          gap-2

          text-xs
          font-black
          uppercase

          tracking-[0.14em]

          text-[var(--primary)]
        "
      >

        <UserRound size={18} />

        Portfolios

      </div>


      {/* PORTFOLIOS */}

      <div className="space-y-3">

        {items.map((item) => (

          <div
            key={item.name}

            className="
              flex
              items-center
              justify-between

              gap-4

              rounded-xl

              border
              border-[var(--card-border)]

              bg-[var(--card-bg)]

              px-4
              py-3

              shadow-sm
            "
          >

            <div
              className="
                flex
                min-w-0

                items-center

                gap-3
              "
            >

              {/* AVATAR */}

              <div
                className="
                  flex

                  h-10
                  w-10

                  shrink-0

                  items-center
                  justify-center

                  rounded-full

                  bg-[#9CD5FF]/25

                  text-sm
                  font-black

                  text-[#355872]

                  dark:text-[#8FC5E8]
                "
              >
                {item.name.charAt(0)}
              </div>


              <div className="min-w-0">

                <p
                  className="
                    truncate

                    text-sm
                    font-black

                    text-[var(--ink)]
                  "
                >
                  {item.name}
                </p>


                <p
                  className="
                    truncate

                    text-[10px]
                    font-semibold

                    text-[var(--muted)]
                  "
                >
                  {item.major}
                </p>

              </div>

            </div>


            <span
              className="
                shrink-0

                rounded-full

                bg-[#9CD5FF]/15

                px-3
                py-1

                text-[10px]
                font-black

                text-[#355872]

                dark:text-[#8FC5E8]
              "
            >
              {item.projects} proj
            </span>

          </div>

        ))}

      </div>

    </div>

  );
}