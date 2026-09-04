import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FolderKanban,
  GraduationCap,
  Search,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";

import {
  getCurrentUser,
  getProjectInvitationsForUser,
  respondToProjectInvitation,
} from "@/data/demoStore";

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase();
}

function formatDate(value) {
  if (!value) return "Recently";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Recently";
  }
}

function getCourse(invitation) {
  if (
    invitation.courseCode &&
    invitation.courseName
  ) {
    return `${invitation.courseCode} · ${invitation.courseName}`;
  }

  return (
    invitation.courseCode ||
    invitation.courseName ||
    "Portfolio Project"
  );
}

function getInitials(name) {
  return String(name || "?")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   STATUS
========================================================= */

function InvitationStatus({ status }) {
  const normalized = normalizeStatus(status);

  if (normalized === "accepted") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-[#ECF8F0]
          px-2.5
          py-1
          text-[10px]
          font-black
          text-[#43845A]
          ring-1
          ring-[#CFE8D7]
        "
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Accepted
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-[#F8EEEE]
          px-2.5
          py-1
          text-[10px]
          font-black
          text-[#95626A]
          ring-1
          ring-[#E9D6D9]
        "
      >
        <XCircle className="h-3.5 w-3.5" />
        Declined
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-[#FFF6DE]
        px-2.5
        py-1
        text-[10px]
        font-black
        text-[#94701F]
        ring-1
        ring-[#E8D6A1]/60
      "
    >
      <Clock3 className="h-3.5 w-3.5" />
      Awaiting response
    </span>
  );
}

/* =========================================================
   INVITATION CARD
========================================================= */

function InvitationCard({
  invitation,
  onOpen,
  onDecision,
}) {
  const status = normalizeStatus(
    invitation.status
  );

  const pending = status === "pending";

  const instructor =
    String(
      invitation.role || ""
    ).toLowerCase() === "instructor";

  return (
    <AppCard
      className={`
        group
        overflow-hidden
        rounded-[30px]
        border
        bg-white/95
        p-0
        backdrop-blur-xl

        shadow-[0_22px_55px_rgba(53,88,114,0.13)]

        transition-all
        duration-300

        hover:-translate-y-[3px]
        hover:shadow-[0_30px_68px_rgba(53,88,114,0.18)]

        ${
          pending
            ? `
              border-[#E8D49C]
              ring-1
              ring-[#E6C77B]/25
            `
            : `
              border-white
            `
        }
      `}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(invitation)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            onOpen(invitation);
          }
        }}
        className="
          grid
          cursor-pointer
          lg:grid-cols-[290px_minmax(0,1fr)]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[#79B0E3]
        "
      >
        {/* =====================================================
            LEFT FOCAL PANEL
        ====================================================== */}

        <div
          className="
            relative
            flex
            min-h-[235px]
            flex-col
            overflow-hidden
            bg-[linear-gradient(145deg,#071D2C_0%,#102F45_52%,#1E4964_100%)]
            p-7
            text-white
          "
        >
          {/* atmosphere */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-56
              w-56
              rounded-full
              bg-[radial-gradient(circle,rgba(156,213,255,0.19),transparent_69%)]
            "
          />

          <div
            className="
              pointer-events-none
              -bottom-16
              -left-10
              absolute
              h-44
              w-44
              rounded-full
              bg-[radial-gradient(circle,rgba(230,199,123,0.11),transparent_70%)]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-[42%]
              bg-[linear-gradient(180deg,transparent,rgba(4,18,28,0.14))]
            "
          />

          <div className="relative">
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <p
                className={`
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  ${
                    pending
                      ? "text-[#E6C77B]"
                      : "text-[#93C4E0]"
                  }
                `}
              >
                {pending
                  ? "Project Invitation"
                  : status === "accepted"
                  ? "Joined Project"
                  : "Past Invitation"}
              </p>

              {status === "accepted" && (
                <CheckCircle2
                  className="
                    h-4
                    w-4
                    text-[#9BD2AE]
                  "
                />
              )}

              {status === "rejected" && (
                <XCircle
                  className="
                    h-4
                    w-4
                    text-[#D6A1A7]
                  "
                />
              )}
            </div>

            {/* GOLD FOCUS RULE */}

            <div
              className={`
                mt-4
                h-[2px]
                rounded-full

                ${
                  pending
                    ? "w-10 bg-[#E6C77B]"
                    : "w-8 bg-[#7AAACE]/75"
                }
              `}
            />

            <p
              className="
                mt-5
                text-[11px]
                font-black
                tracking-[0.075em]
                text-[#8FC3E5]
              "
            >
              {invitation.courseCode ||
                "GUC PROJECT"}
            </p>

            <h2
              className="
                mt-3
                max-w-[220px]
                text-[29px]
                font-black
                leading-[1.01]
                tracking-[-0.045em]
                text-white
              "
            >
              {invitation.projectTitle}
            </h2>
          </div>

          {/* ROLE */}

          <div
            className="
              relative
              mt-auto
              pt-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-2.5
                border-t
                border-white/12
                pt-4
              "
            >
              <div
                className="
                  grid
                  h-8
                  w-8
                  place-items-center
                  rounded-[10px]
                  bg-white/8
                  ring-1
                  ring-white/10
                "
              >
                {instructor ? (
                  <GraduationCap
                    className="
                      h-4
                      w-4
                      text-[#A7D9FA]
                    "
                  />
                ) : (
                  <UserRound
                    className="
                      h-4
                      w-4
                      text-[#A7D9FA]
                    "
                  />
                )}
              </div>

              <div>
                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.13em]
                    text-white/42
                  "
                >
                  Invited as
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-black
                    text-white
                  "
                >
                  {instructor
                    ? "Instructor"
                    : "Collaborator"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}

        <div
          className="
            relative
            flex
            min-w-0
            flex-col
            px-7
            py-6
            sm:px-8
          "
        >
          {/* faint corner atmosphere */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              h-48
              w-48
              rounded-full
              bg-[radial-gradient(circle,rgba(156,213,255,0.10),transparent_70%)]
            "
          />

          {/* =================================================
              TOP
          ================================================== */}

          <div
            className="
              relative
              flex
              flex-wrap
              items-start
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  grid
                  h-10
                  w-10
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[linear-gradient(135deg,#355872,#7AAACE)]
                  text-[10px]
                  font-black
                  text-white
                  shadow-[0_6px_15px_rgba(53,88,114,0.18)]
                  ring-4
                  ring-[#EAF4FA]
                "
              >
                {getInitials(
                  invitation.ownerName
                )}
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.17em]
                    text-[#78A5C1]
                  "
                >
                  Invited by
                </p>

                <p
                  className="
                    mt-0.5
                    text-[14px]
                    font-black
                    text-[color:var(--ink)]
                  "
                >
                  {invitation.ownerName}
                </p>
              </div>
            </div>

            <div className="text-right">
              <InvitationStatus
                status={status}
              />

              <p
                className="
                  mt-2
                  text-[9px]
                  font-bold
                  text-[color:var(--muted)]
                "
              >
                {formatDate(
                  invitation.sentAt
                )}
              </p>
            </div>
          </div>

          {/* =================================================
              MAIN FOCAL COPY
          ================================================== */}

          <div
            className="
              relative
              mt-5
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.17em]
                text-[#78A9C6]
              "
            >
              Invitation details
            </p>

            <h3
              className="
                mt-1.5
                text-[22px]
                font-black
                leading-tight
                tracking-[-0.03em]
                text-[color:var(--ink)]
              "
            >
              {invitation.projectTitle}
            </h3>

            <p
              className="
                mt-2
                max-w-3xl
                text-[13px]
                font-medium
                leading-6
                text-[color:var(--muted)]
              "
            >
              {invitation.projectDescription}
            </p>
          </div>

          {/* =================================================
              COURSE + TAGS
          ================================================== */}

          <div
            className="
              relative
              mt-4
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
            "
          >
            <p
              className="
                text-[10px]
                font-black
                text-[#355872]
              "
            >
              {getCourse(invitation)}
            </p>

            {invitation.tags?.length >
              0 && (
              <>
                <span
                  className="
                    hidden
                    h-4
                    w-px
                    bg-[#D3E1E9]
                    sm:block
                  "
                />

                <div
                  className="
                    flex
                    flex-wrap
                    gap-1.5
                  "
                >
                  {invitation.tags
                    .slice(0, 4)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="
                          rounded-full
                          border
                          border-[#C4DAE7]
                          bg-[#F0F7FB]
                          px-2.5
                          py-1
                          text-[9px]
                          font-bold
                          text-[#577D97]
                        "
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* =================================================
              ACTION ROW
          ================================================== */}

          <div
            className="
              relative
              mt-auto
              flex
              flex-col
              gap-3
              border-t
              border-[#DAE6EC]
              pt-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(invitation);
              }}
              className="
                group/open
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-black
                text-[#628DA7]
                transition

                hover:text-[#355872]
              "
            >
              View project

              <ArrowRight
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  group-hover/open:translate-x-1
                "
              />
            </button>

            {pending ? (
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    onDecision(
                      invitation,
                      "rejected"
                    );
                  }}
                  className="
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    gap-1.5
                    rounded-[13px]
                    border
                    border-[#CDD9E0]
                    bg-[#FDFEFE]
                    px-4
                    text-[11px]
                    font-black
                    text-[#617480]
                    shadow-[0_4px_10px_rgba(53,88,114,0.04)]
                    transition-all

                    hover:border-[#B5C6CF]
                    hover:bg-white
                    hover:text-[#405665]
                  "
                >
                  <X className="h-3.5 w-3.5" />

                  Decline
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    onDecision(
                      invitation,
                      "accepted"
                    );
                  }}
                  className="
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-[13px]
                    bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)]
                    px-5
                    text-[11px]
                    font-black
                    text-white
                    shadow-[0_9px_20px_rgba(53,88,114,0.20)]
                    transition-all

                    hover:-translate-y-[1px]
                    hover:brightness-105
                    hover:shadow-[0_12px_25px_rgba(53,88,114,0.24)]
                  "
                >
                  <Check className="h-3.5 w-3.5" />

                  Accept invitation
                </button>
              </div>
            ) : (
              <p
                className="
                  text-[9px]
                  font-semibold
                  text-[color:var(--muted)]
                "
              >
                {status === "accepted"
                  ? "You joined this project."
                  : "You declined this invitation."}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppCard>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ProjectInvitations() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [invitations, setInvitations] =
    useState(() =>
      getProjectInvitationsForUser(
        currentUser?.id
      )
    );

  /* =========================================================
     COUNTS
  ========================================================= */

  const counts = useMemo(() => {
    return invitations.reduce(
      (accumulator, invitation) => {
        const status =
          normalizeStatus(
            invitation.status
          );

        accumulator.all += 1;

        accumulator[status] =
          (accumulator[status] || 0) + 1;

        return accumulator;
      },
      {
        all: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
      }
    );
  }, [invitations]);

  /* =========================================================
     FILTERING
  ========================================================= */

  const filteredInvitations =
    useMemo(() => {
      const query = searchTerm
        .trim()
        .toLowerCase();

      return invitations.filter(
        (invitation) => {
          const status =
            normalizeStatus(
              invitation.status
            );

          const matchesStatus =
            activeFilter === "all" ||
            status === activeFilter;

          const haystack = [
            invitation.projectTitle,
            invitation.projectDescription,
            invitation.ownerName,
            invitation.courseCode,
            invitation.courseName,
            invitation.role,
            ...(invitation.tags || []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            haystack.includes(query);

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );
    }, [
      invitations,
      activeFilter,
      searchTerm,
    ]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const openProject = (invitation) => {
    if (!invitation?.projectId) return;

    const projectIds = Array.from(
      new Set(filteredInvitations.map((item) => String(item.projectId)))
    );

    navigate(
      `/project?projectId=${encodeURIComponent(invitation.projectId)}`,
      {
        state: {
          projectFlow: {
            originPath: `${location.pathname}${location.search}`,
            originLabel: "Project Invitations",
            projectIds,
          },
        },
      }
    );
  };

  /* =========================================================
     ACCEPT / DECLINE
  ========================================================= */

  const handleDecision = (
    invitation,
    decision
  ) => {
    respondToProjectInvitation(
      invitation.projectId,
      currentUser?.id,
      decision
    );

    setInvitations(
      getProjectInvitationsForUser(
        currentUser?.id
      )
    );
  };

  const filters = [
    {
      id: "all",
      label: "All",
      count: counts.all,
    },
    {
      id: "pending",
      label: "Pending",
      count: counts.pending,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: counts.accepted,
    },
    {
      id: "rejected",
      label: "Declined",
      count: counts.rejected,
    },
  ];

  return (
    <DashboardLayout>
      <main
        className="
          px-4
          py-7
          pb-24
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <header>
            <h1
              className="
                text-[42px]
                font-black
                leading-none
                tracking-[-0.045em]
                text-[color:var(--ink)]
                sm:text-[48px]
              "
            >
              Project Invitations
            </h1>

            <p
              className="
                mt-3
                max-w-3xl
                text-[14px]
                font-semibold
                leading-6
                text-[color:var(--muted)]
              "
            >
              Review projects you&apos;ve
              been invited to and decide
              which teams you want to join.
            </p>
          </header>

          {/* =================================================
              TOOLBAR SURFACE
          ================================================== */}

          <div
            className="
              mt-7
              rounded-[22px]
              border
              border-white/85
              bg-white/72
              px-5
              py-3.5
              shadow-[0_12px_32px_rgba(53,88,114,0.08)]
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* FILTERS */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-7
                "
              >
                {filters.map((filter) => {
                  const active =
                    activeFilter ===
                    filter.id;

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter.id
                        )
                      }
                      className={`
                        relative
                        py-2
                        text-[12px]
                        font-black
                        transition-colors

                        ${
                          active
                            ? "text-[#28485E]"
                            : "text-[#8193A0] hover:text-[#355872]"
                        }
                      `}
                    >
                      {filter.label}

                      <span
                        className={`
                          ml-1.5
                          text-[9px]

                          ${
                            active
                              ? "text-[#6C9CC0]"
                              : "text-[#A5B1B9]"
                          }
                        `}
                      >
                        {filter.count}
                      </span>

                      {active && (
                        <span
                          className="
                            absolute
                            -bottom-[5px]
                            left-0
                            h-[3px]
                            w-full
                            rounded-full
                            bg-[linear-gradient(90deg,#E6C77B_0%,#79B0E3_100%)]
                          "
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* SEARCH */}

              <div
                className="
                  relative
                  w-full
                  lg:w-[330px]
                "
              >
                <Search
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-[#879DAA]
                  "
                />

                <input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search invitations..."
                  className="
                    h-11
                    w-full
                    rounded-[15px]
                    border
                    border-[#D5E2E9]
                    bg-white/88
                    pl-11
                    pr-4
                    text-[12px]
                    font-semibold
                    text-[color:var(--ink)]
                    outline-none
                    transition

                    placeholder:text-[#96A5AF]

                    focus:border-[#8DB6CF]
                    focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(122,170,206,0.10)]
                  "
                />
              </div>
            </div>
          </div>

          {/* =================================================
              PENDING FOCUS MESSAGE
          ================================================== */}

          {activeFilter === "all" &&
            counts.pending > 0 && (
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-3
                  rounded-[20px]
                  border
                  border-[#EAD9A9]
                  bg-[linear-gradient(90deg,#FFF9E9_0%,rgba(255,255,255,0.62)_100%)]
                  px-5
                  py-3.5
                  shadow-[0_10px_26px_rgba(174,137,53,0.07)]
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
                    bg-[#F6E6B3]
                    text-[#98731F]
                  "
                >
                  <Clock3 className="h-4 w-4" />
                </div>

                <div>
                  <p
                    className="
                      text-[12px]
                      font-black
                      text-[#65521B]
                    "
                  >
                    {counts.pending}{" "}
                    {counts.pending === 1
                      ? "invitation is"
                      : "invitations are"}{" "}
                    waiting for your
                    response.
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      font-medium
                      text-[#8E7949]
                    "
                  >
                    Open the project to
                    review it before
                    deciding.
                  </p>
                </div>
              </div>
            )}

          {/* =================================================
              INVITATION CARDS
          ================================================== */}

          {filteredInvitations.length >
          0 ? (
            <div
              className="
                mt-6
                grid
                gap-5
              "
            >
              {filteredInvitations.map(
                (invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={
                      invitation
                    }
                    onOpen={openProject}
                    onDecision={
                      handleDecision
                    }
                  />
                )
              )}
            </div>
          ) : (
            <AppCard
              className="
                mt-6
                rounded-[28px]
                border
                border-white
                bg-white/88
                px-6
                py-12
                text-center
                shadow-[0_18px_45px_rgba(53,88,114,0.10)]
              "
            >
              <div
                className="
                  mx-auto
                  grid
                  h-12
                  w-12
                  place-items-center
                  rounded-[15px]
                  bg-[#EAF4FA]
                  text-[#5A819B]
                "
              >
                <FolderKanban className="h-5 w-5" />
              </div>

              <h2
                className="
                  mt-4
                  text-lg
                  font-black
                  text-[color:var(--ink)]
                "
              >
                No invitations found
              </h2>

              <p
                className="
                  mx-auto
                  mt-1
                  max-w-lg
                  text-[12px]
                  font-medium
                  leading-5
                  text-[color:var(--muted)]
                "
              >
                Try another filter or
                search. Project
                invitations will appear
                here when someone asks you
                to join their team.
              </p>
            </AppCard>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}