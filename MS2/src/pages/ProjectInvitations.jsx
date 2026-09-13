import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FolderKanban,
  GraduationCap,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import FilterSelect from "@/components/common/FilterSelect";

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
            ) : status === "accepted" ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen(invitation);
                }}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-[13px]
                  border
                  border-[#CDD9E0]
                  bg-[#FDFEFE]
                  px-4
                  text-[11px]
                  font-black
                  text-[#355872]
                  shadow-[0_4px_10px_rgba(53,88,114,0.04)]
                  transition-all
                  hover:border-[#B5C6CF]
                  hover:bg-white
                  dark:border-white/10
                  dark:bg-white/[0.04]
                  dark:text-[#A9C5D4]
                  dark:hover:bg-white/[0.07]
                "
              >
                Open project
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <p
                className="
                  text-[9px]
                  font-semibold
                  text-[color:var(--muted)]
                "
              >
                You declined this invitation.
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

const ITEMS_PER_PAGE = 4;

export default function ProjectInvitations() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [selectedSort, setSelectedSort] =
    useState("Newest");

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

      const filtered = invitations.filter(
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

      return [...filtered].sort((a, b) => {
        if (selectedSort === "Oldest") {
          return (
            new Date(a.sentAt || 0).getTime() -
            new Date(b.sentAt || 0).getTime()
          );
        }

        if (selectedSort === "Project A-Z") {
          return String(a.projectTitle || "").localeCompare(
            String(b.projectTitle || "")
          );
        }

        return (
          new Date(b.sentAt || 0).getTime() -
          new Date(a.sentAt || 0).getTime()
        );
      });
    }, [
      invitations,
      activeFilter,
      searchTerm,
      selectedSort,
    ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredInvitations.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const pageStartIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedInvitations =
    filteredInvitations.slice(
      pageStartIndex,
      pageStartIndex + ITEMS_PER_PAGE
    );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const changePage = (page) => {
    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    setCurrentPage(nextPage);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

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



  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px]">
        <PageHeader
          title="Project Invitations"
          description="Review projects you've been invited to and decide which teams you want to join."
        />

          {/* =================================================
              SEARCH + SORT + FILTERS
          ================================================== */}

          <div className="mt-7">
            <SearchFilterToolbar
              searchValue={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search invitations by project, course, inviter, or technology..."
              showSort
              sortValue={`Sort by: ${selectedSort}`}
              onSortChange={(value) => {
                setSelectedSort(
                  value.replace("Sort by: ", "")
                );
                setCurrentPage(1);
              }}
              sortOptions={[
                "Sort by: Newest",
                "Sort by: Oldest",
                "Sort by: Project A-Z",
              ]}
              showFilters
              filtersOpen={filtersOpen}
              onToggleFilters={() =>
                setFiltersOpen((current) => !current)
              }
              filterTitle="Filter invitations"
              onClearFilters={() => {
                setActiveFilter("all");
                setCurrentPage(1);
              }}
            >
              <FilterSelect
                value={`Status: ${
                  activeFilter === "all"
                    ? "All"
                    : activeFilter === "rejected"
                      ? "Declined"
                      : activeFilter.charAt(0).toUpperCase() +
                        activeFilter.slice(1)
                }`}
                onChange={(value) => {
                  const selected = value
                    .replace("Status: ", "")
                    .toLowerCase();

                  setActiveFilter(
                    selected === "declined"
                      ? "rejected"
                      : selected
                  );
                  setCurrentPage(1);
                }}
                options={[
                  "Status: All",
                  "Status: Pending",
                  "Status: Accepted",
                  "Status: Declined",
                ]}
              />
            </SearchFilterToolbar>
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
              {paginatedInvitations.map(
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

              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={filteredInvitations.length}
                pageStartIndex={pageStartIndex}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={changePage}
                ariaLabel="Invitation results pagination"
              />
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
    </DashboardLayout>
  );
}