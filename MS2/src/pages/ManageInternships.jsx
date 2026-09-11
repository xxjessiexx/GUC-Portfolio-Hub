import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  BriefcaseBusiness,
  Check,
  CircleDot,
  Copy,
  Edit3,
  Eye,
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import Pagination from "@/components/common/Pagination";
import {
  createInternship,
  deleteInternship as deleteInternshipFromStore,
  getCurrentUser,
  getInternshipsForEmployer,
  updateInternship,
} from "@/data/demoStore";

const ITEMS_PER_PAGE = 5;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Drafts" },
  { id: "closed", label: "Closed" },
  { id: "archived", label: "Archived" },
];

const STATUS_LABELS = {
  all: "All Statuses",
  active: "Active",
  draft: "Draft",
  closed: "Closed",
  archived: "Archived",
};


const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "deadline", label: "Deadline soonest" },
  { value: "applicants", label: "Most applicants" },
  { value: "title", label: "Title A–Z" },
];

function getLocationLabel(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return (
      value.label ||
      value.name ||
      value.address ||
      value.city ||
      fallback
    );
  }

  return String(value);
}

function safeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isPastDeadline(value) {
  const date = safeDate(value);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  date.setHours(0, 0, 0, 0);
  return date < today;
}

function getOperationalStatus(internship) {
  const rawStatus = String(internship.status || "").trim().toLowerCase();

  if (
    internship.isArchived ||
    internship.archived ||
    rawStatus.includes("archived")
  ) {
    return "archived";
  }

  if (rawStatus.includes("draft")) {
    return "draft";
  }

  if (
    internship.isFilled ||
    internship.positionFilled ||
    rawStatus.includes("filled") ||
    rawStatus.includes("closed") ||
    rawStatus.includes("completed") ||
    isPastDeadline(internship.deadline)
  ) {
    return "closed";
  }

  return "active";
}

function getApplicantCount(internship) {
  if (Number.isFinite(Number(internship.applicants))) {
    return Number(internship.applicants);
  }

  return Array.isArray(internship.applications)
    ? internship.applications.length
    : 0;
}

function getNeedsReviewCount(internship) {
  if (!Array.isArray(internship.applications)) return 0;

  return internship.applications.filter((application) => {
    const status = String(application.status || "").toLowerCase();
    return (
      !status ||
      status === "pending" ||
      status === "reviewing" ||
      status === "submitted"
    );
  }).length;
}

function getCreatedTime(internship) {
  return (
    safeDate(internship.updatedAt)?.getTime() ||
    safeDate(internship.createdAt)?.getTime() ||
    safeDate(internship.deadline)?.getTime() ||
    0
  );
}

function formatDate(value) {
  const date = safeDate(value);
  if (!date) return "No deadline";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function StatusPill({ status }) {
  const config = {
    active: {
      label: "Active",
      dot: "bg-emerald-500",
      shell: "border-emerald-200/80 bg-emerald-50/75 text-emerald-700",
    },
    draft: {
      label: "Draft",
      dot: "bg-[#D6B65F]",
      shell: "border-[#E7D6A1] bg-[#FAF5E7] text-[#876E2F]",
    },
    closed: {
      label: "Closed",
      dot: "bg-[#7D8E99]",
      shell: "border-[#CDD8DE] bg-[#F0F4F6] text-[#627480]",
    },
    archived: {
      label: "Archived",
      dot: "bg-[#A7B2B9]",
      shell: "border-[#D4DDE1] bg-[#F6F8F9] text-[#768791]",
    },
  }[status];

  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-black ${config.shell}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function CountTab({ active, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-11 items-center gap-2 px-3 text-[12px] font-black transition ${
        active
          ? "text-[#17384E]"
          : "text-[#7B8D98] hover:text-[#355872]"
      }`}
    >
      {label}
      <span
        className={`min-w-5 rounded-full px-1.5 py-0.5 text-[10px] ${
          active
            ? "bg-[#F2E5B8] text-[#7A6327]"
            : "bg-[#E9F0F3] text-[#7A8D99]"
        }`}
      >
        {count}
      </span>

      {active ? (
        <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-[#E6C77B]" />
      ) : null}
    </button>
  );
}

function EmptyState({ hasFilters, onCreate, onClear }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-[18px] border border-[#C9DBE4] bg-white/65 text-[#557C97] shadow-[0_10px_26px_rgba(53,88,114,0.07)]">
        <BriefcaseBusiness className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-xl font-black tracking-[-0.025em] text-[#142A3A]">
        {hasFilters ? "No internships match these filters" : "No internships yet"}
      </h2>

      <p className="mt-2 max-w-md text-[13px] font-semibold leading-6 text-[#718391]">
        {hasFilters
          ? "Try a different search or clear the current filters."
          : "Create your first internship and it will appear here as part of your hiring workspace."}
      </p>

      <div className="mt-5 flex items-center gap-2.5">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="h-11 rounded-[14px] border border-[#C9DBE4] bg-white/65 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white"
          >
            Clear filters
          </button>
        ) : null}

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#355872] px-5 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.16)] transition hover:bg-[#294A61]"
        >
          <Plus className="h-4 w-4" />
          Create internship
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({ internship, onCancel, onConfirm }) {
  if (!internship) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#102434]/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[24px] border border-white/80 bg-[#F9FBFC] p-6 shadow-[0_28px_80px_rgba(17,42,59,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-500">
              Delete internship
            </p>
            <h2 className="mt-2 text-xl font-black tracking-[-0.025em] text-[#142A3A]">
              Delete “{internship.title}”?
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="grid h-9 w-9 place-items-center rounded-full text-[#718391] transition hover:bg-[#EAF2F6]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-[13px] font-semibold leading-6 text-[#718391]">
          This removes the internship and its application data from the demo
          store. This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-[14px] px-4 text-[12px] font-black text-[#718391] transition hover:bg-[#EAF2F6]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-red-500 px-5 text-[12px] font-black text-white transition hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function RowMenu({
  internship,
  status,
  isOpen,
  onToggle,
  onView,
  onApplicants,
  onEdit,
  onDuplicate,
  onToggleClosed,
  onToggleArchived,
  onDelete,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointer = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        onToggle(false);
      }
    };

    window.addEventListener("pointerdown", handlePointer);
    return () => window.removeEventListener("pointerdown", handlePointer);
  }, [isOpen, onToggle]);

  return (
    <div ref={menuRef} className="relative flex justify-end">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle(!isOpen);
        }}
        className={`grid h-9 w-9 place-items-center rounded-xl transition ${
          isOpen
            ? "bg-[#DFEAF0] text-[#294F69]"
            : "text-[#718391] hover:bg-[#EAF2F6] hover:text-[#355872]"
        }`}
        aria-label={`Actions for ${internship.title}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-11 z-40 w-52 overflow-hidden rounded-[16px] border border-[#C9DBE4] bg-[#FBFCFD] p-1.5 shadow-[0_18px_44px_rgba(17,42,59,0.18)]"
          onClick={(event) => event.stopPropagation()}
        >
          <MenuButton icon={Eye} label="View posting" onClick={onView} />
          <MenuButton icon={Edit3} label="Edit" onClick={onEdit} />
          <MenuButton icon={Copy} label="Duplicate as draft" onClick={onDuplicate} />

          <div className="my-1 h-px bg-[#E0E8EC]" />

          {status !== "archived" ? (
            <MenuButton
              icon={status === "closed" ? CircleDot : Check}
              label={status === "closed" ? "Reopen internship" : "Close internship"}
              onClick={onToggleClosed}
              disabled={status === "draft"}
            />
          ) : null}

          <MenuButton
            icon={status === "archived" ? ArchiveRestore : Archive}
            label={status === "archived" ? "Restore from archive" : "Archive"}
            onClick={onToggleArchived}
          />

          <div className="my-1 h-px bg-[#E0E8EC]" />

          <MenuButton
            icon={Trash2}
            label="Delete"
            onClick={onDelete}
            danger
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuButton({ icon: Icon, label, onClick, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-black transition ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : disabled
            ? "cursor-not-allowed text-[#A8B4BB]"
            : "text-[#355872] hover:bg-[#EAF2F6]"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function ManageInternships() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState(() =>
    getInternshipsForEmployer(getCurrentUser()?.id)
  );
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef(null);

  const refresh = () => {
    setInternships(getInternshipsForEmployer(getCurrentUser()?.id));
  };

  useEffect(() => {
    refresh();

    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, []);

  useEffect(() => {
    if (!feedback) return;

    const timeout = window.setTimeout(() => setFeedback(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: internships.length,
      active: 0,
      draft: 0,
      closed: 0,
      archived: 0,
    };

    internships.forEach((internship) => {
      counts[getOperationalStatus(internship)] += 1;
    });

    return counts;
  }, [internships]);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          internships
            .map((item) => String(item.department || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [internships]
  );

  const workModes = useMemo(
    () =>
      Array.from(
        new Set(
          internships
            .map((item) => String(item.workMode || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [internships]
  );

  const visibleInternships = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = internships.filter((internship) => {
      const status = getOperationalStatus(internship);

      const matchesStatus =
        activeStatus === "all" || status === activeStatus;

      const matchesSearch =
        !query ||
        [
          internship.title,
          internship.department,
          getLocationLabel(internship.location),
          internship.workMode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        department === "all" || internship.department === department;

      const matchesWorkMode =
        workMode === "all" || internship.workMode === workMode;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesDepartment &&
        matchesWorkMode
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "deadline") {
        const aTime = safeDate(a.deadline)?.getTime() || Number.MAX_SAFE_INTEGER;
        const bTime = safeDate(b.deadline)?.getTime() || Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      }

      if (sortBy === "applicants") {
        return getApplicantCount(b) - getApplicantCount(a);
      }

      if (sortBy === "title") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }

      return getCreatedTime(b) - getCreatedTime(a);
    });
  }, [
    internships,
    activeStatus,
    searchTerm,
    department,
    workMode,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(visibleInternships.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedInternships = visibleInternships.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);

    requestAnimationFrame(() => {
      resultsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    department !== "all" ||
    workMode !== "all" ||
    activeStatus !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setDepartment("all");
    setWorkMode("all");
    setActiveStatus("all");
    setFiltersOpen(false);
    setCurrentPage(1);
  };

  const runUpdate = (internship, updates, message) => {
    updateInternship(internship.id, updates);
    setOpenMenuId(null);
    setFeedback(message);
    refresh();
  };

  const toggleClosed = (internship) => {
    const status = getOperationalStatus(internship);

    if (status === "closed") {
      const currentDeadline = safeDate(internship.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const needsNewDeadline =
        !currentDeadline || currentDeadline.getTime() < today.getTime();

      const reopenedDeadline = needsNewDeadline
        ? (() => {
            const nextDeadline = new Date(today);
            nextDeadline.setDate(nextDeadline.getDate() + 30);
            return nextDeadline.toISOString().slice(0, 10);
          })()
        : internship.deadline;

      runUpdate(
        internship,
        {
          status: "Active",
          deadline: reopenedDeadline,
          isFilled: false,
          positionFilled: false,
          isArchived: false,
          archived: false,
        },
        needsNewDeadline
          ? "Internship reopened. Deadline extended by 30 days."
          : "Internship reopened."
      );
      return;
    }

    runUpdate(
      internship,
      {
        status: "Closed",
        isFilled: false,
        positionFilled: false,
      },
      "Internship closed to new applications."
    );
  };

  const toggleArchived = (internship) => {
    const status = getOperationalStatus(internship);
    const restoring = status === "archived";

    runUpdate(
      internship,
      restoring
        ? {
            status: "Active",
            isArchived: false,
            archived: false,
          }
        : {
            status: "Archived",
            isArchived: true,
            archived: true,
          },
      restoring ? "Internship restored from archive." : "Internship archived."
    );
  };

  const duplicateInternship = (internship) => {
    const {
      id,
      employer,
      applications,
      applicants,
      reviews,
      rating,
      createdAt,
      updatedAt,
      isArchived,
      archived,
      isFilled,
      positionFilled,
      ...copy
    } = internship;

    createInternship({
      ...copy,
      title: `${internship.title} Copy`,
      status: "draft",
      applications: [],
      applicants: 0,
      isArchived: false,
      archived: false,
      isFilled: false,
      positionFilled: false,
    });

    setOpenMenuId(null);
    setFeedback("Draft duplicate created.");
    setActiveStatus("draft");
    refresh();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteInternshipFromStore(deleteTarget.id);
    setDeleteTarget(null);
    setOpenMenuId(null);
    setFeedback("Internship deleted.");
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <PageHeader
          title="Internships"
          description="Manage your company’s internship opportunities, applicants, and hiring status."
          action={
            <button
              type="button"
              onClick={() => navigate("/create-internship")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)] px-7 text-sm font-black text-white shadow-[0_12px_30px_rgba(53,88,114,.22)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(53,88,114,.30)]"
            >
              <Plus className="h-4 w-4" />
              Create Internship
            </button>
          }
        />

        <SearchFilterToolbar
          searchValue={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search internships by title, department, location, or work mode..."
          showSort
          sortValue={`Sort by: ${
            SORT_OPTIONS.find((option) => option.value === sortBy)?.label ||
            "Newest"
          }`}
          onSortChange={(value) => {
            const label = value.replace("Sort by: ", "");
            const option = SORT_OPTIONS.find((item) => item.label === label);
            setSortBy(option?.value || "newest");
            setCurrentPage(1);
          }}
          sortOptions={SORT_OPTIONS.map(
            (option) => `Sort by: ${option.label}`
          )}
          showFilters
          filtersOpen={filtersOpen}
          onToggleFilters={() =>
            setFiltersOpen((current) => !current)
          }
          filterTitle="Filter internships"
          onClearFilters={hasFilters ? clearFilters : undefined}
        >
          <FilterSelect
            value={`Status: ${STATUS_LABELS[activeStatus]}`}
            onChange={(value) => {
              const selected = value.replace("Status: ", "");
              const statusEntry = Object.entries(STATUS_LABELS).find(
                ([, label]) => label === selected
              );
              setActiveStatus(statusEntry?.[0] || "all");
              setCurrentPage(1);
            }}
            options={Object.values(STATUS_LABELS).map(
              (label) => `Status: ${label}`
            )}
          />

          <FilterSelect
            value={`Department: ${
              department === "all" ? "All Departments" : department
            }`}
            onChange={(value) => {
              const selected = value.replace("Department: ", "");
              setDepartment(
                selected === "All Departments" ? "all" : selected
              );
              setCurrentPage(1);
            }}
            options={[
              "Department: All Departments",
              ...departments.map((item) => `Department: ${item}`),
            ]}
          />

          <FilterSelect
            value={`Work mode: ${
              workMode === "all" ? "All Modes" : workMode
            }`}
            onChange={(value) => {
              const selected = value.replace("Work mode: ", "");
              setWorkMode(selected === "All Modes" ? "all" : selected);
              setCurrentPage(1);
            }}
            options={[
              "Work mode: All Modes",
              ...workModes.map((item) => `Work mode: ${item}`),
            ]}
          />
        </SearchFilterToolbar>

        <section ref={resultsTopRef} className="scroll-mt-28">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[var(--ink)]">
                {visibleInternships.length} internship
                {visibleInternships.length === 1 ? "" : "s"} found
              </h2>

              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                {statusCounts.active} active · {statusCounts.draft} draft
                {statusCounts.draft === 1 ? "" : "s"} · {statusCounts.closed} closed
              </p>
            </div>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[12px] font-black text-[var(--primary)] transition hover:opacity-70"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {paginatedInternships.length ? (
            <div className="space-y-4">
              {paginatedInternships.map((internship) => {
                const status = getOperationalStatus(internship);
                const applicants = getApplicantCount(internship);
                const needsReview = getNeedsReviewCount(internship);
                const hasDescription = Boolean(
                  internship.shortDescription || internship.description
                );

                return (
                  <article
                    key={internship.id}
                    className="group overflow-hidden rounded-[30px] border border-white bg-white/95 p-0 shadow-[0_22px_55px_rgba(53,88,114,0.13)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_30px_68px_rgba(53,88,114,0.18)] dark:border-[var(--card-border)] dark:bg-[var(--surface)]"
                  >
                    <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
                      {/* LEFT FOCAL PANEL — same grammar as Project Invitations */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/internships/${internship.id}`)
                        }
                        className="relative flex min-h-[235px] flex-col overflow-hidden bg-[linear-gradient(145deg,#071D2C_0%,#102F45_52%,#1E4964_100%)] p-7 text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#79B0E3]"
                      >
                        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.19),transparent_69%)]" />
                        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(230,199,123,0.11),transparent_70%)]" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,rgba(4,18,28,0.14))]" />

                        <div className="relative">
                          <div className="flex items-center justify-between gap-3">
                            <p
                              className={`text-[9px] font-black uppercase tracking-[0.18em] ${
                                status === "active"
                                  ? "text-[#9BD2AE]"
                                  : status === "draft"
                                    ? "text-[#E6C77B]"
                                    : "text-[#93C4E0]"
                              }`}
                            >
                              {status === "active"
                                ? "Active Internship"
                                : status === "draft"
                                  ? "Draft Internship"
                                  : status === "archived"
                                    ? "Archived Internship"
                                    : "Closed Internship"}
                            </p>

                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                status === "active"
                                  ? "bg-[#9BD2AE]"
                                  : status === "draft"
                                    ? "bg-[#E6C77B]"
                                    : "bg-[#9DB7C6]"
                              }`}
                            />
                          </div>

                          <div
                            className={`mt-4 h-[2px] rounded-full ${
                              status === "active" || status === "draft"
                                ? "w-10 bg-[#E6C77B]"
                                : "w-8 bg-[#7AAACE]/75"
                            }`}
                          />

                          <p className="mt-5 text-[11px] font-black tracking-[0.075em] text-[#8FC3E5]">
                            {internship.department || "INTERNSHIP"}
                          </p>

                          <h2 className="mt-3 max-w-[220px] text-[29px] font-black leading-[1.01] tracking-[-0.045em] text-white">
                            {internship.title || "Untitled Internship"}
                          </h2>
                        </div>

                        <div className="relative mt-auto pt-7">
                          <div className="border-t border-white/12 pt-4">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black text-white/90">
                              {internship.workMode ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <CircleDot className="h-3.5 w-3.5 text-[#A7D9FA]" />
                                  {internship.workMode}
                                </span>
                              ) : null}

                              {getLocationLabel(internship.location) ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-[#A7D9FA]" />
                                  {getLocationLabel(internship.location)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* RIGHT CONTENT — compact, focused hierarchy */}
                      <div className="relative flex min-w-0 flex-col px-7 py-6 sm:px-8">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.10),transparent_70%)]" />

                        <div className="relative flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#B89736]">
                              {status === "draft"
                                ? "Publishing"
                                : "Hiring Activity"}
                            </p>

                            {status === "draft" ? (
                              <>
                                <p className="mt-1.5 text-[22px] font-black leading-tight tracking-[-0.03em] text-[color:var(--ink)]">
                                  Draft not published
                                </p>
                                <p className="mt-2 text-[13px] font-medium leading-6 text-[color:var(--muted)]">
                                  Finish the internship before students can apply.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="mt-1.5 text-[22px] font-black leading-tight tracking-[-0.03em] text-[color:var(--ink)]">
                                  {applicants} applicant
                                  {applicants === 1 ? "" : "s"}
                                </p>

                                <p
                                  className={`mt-2 text-[13px] leading-6 ${
                                    needsReview > 0
                                      ? "font-black text-[#B89736]"
                                      : "font-medium text-[color:var(--muted)]"
                                  }`}
                                >
                                  {needsReview > 0
                                    ? `${needsReview} waiting for review`
                                    : "Applicant review is up to date"}
                                </p>
                              </>
                            )}
                          </div>

                          <RowMenu
                            internship={internship}
                            status={status}
                            isOpen={openMenuId === internship.id}
                            onToggle={(next) =>
                              setOpenMenuId(next ? internship.id : null)
                            }
                            onView={() =>
                              navigate(`/internships/${internship.id}`)
                            }
                            onApplicants={() =>
                              navigate(
                                `/manage-applicants/${internship.id}`
                              )
                            }
                            onEdit={() =>
                              navigate(
                                `/edit-internship/${internship.id}`
                              )
                            }
                            onDuplicate={() =>
                              duplicateInternship(internship)
                            }
                            onToggleClosed={() =>
                              toggleClosed(internship)
                            }
                            onToggleArchived={() =>
                              toggleArchived(internship)
                            }
                            onDelete={() => {
                              setOpenMenuId(null);
                              setDeleteTarget(internship);
                            }}
                          />
                        </div>

                        <div className="relative mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--muted)]">
                              Deadline
                            </p>
                            <p className="mt-1 text-[11px] font-black text-[#355872]">
                              {formatDate(internship.deadline)}
                            </p>
                          </div>

                          <span className="hidden h-8 w-px bg-[#D3E1E9] sm:block" />

                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--muted)]">
                              Duration
                            </p>
                            <p className="mt-1 text-[11px] font-black text-[#355872]">
                              {internship.duration || "Not specified"}
                            </p>
                          </div>

                          <span className="hidden h-8 w-px bg-[#D3E1E9] sm:block" />

                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--muted)]">
                              Status
                            </p>
                            <div className="mt-1">
                              <StatusPill status={status} />
                            </div>
                          </div>
                        </div>

                        {hasDescription ? (
                          <p className="relative mt-5 max-w-3xl text-[13px] font-medium leading-6 text-[color:var(--muted)]">
                            {internship.shortDescription ||
                              internship.description}
                          </p>
                        ) : null}

                        <div
                          className="relative mt-6 border-t border-[#DAE6EC] pt-4"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {status === "draft" ? (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/edit-internship/${internship.id}`
                                )
                              }
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)] px-5 text-[11px] font-black text-white shadow-[0_9px_20px_rgba(53,88,114,0.20)] transition-all hover:-translate-y-[1px] hover:brightness-105 hover:shadow-[0_12px_25px_rgba(53,88,114,0.24)]"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Continue draft
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/manage-applicants/${internship.id}`
                                )
                              }
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)] px-5 text-[11px] font-black text-white shadow-[0_9px_20px_rgba(53,88,114,0.20)] transition-all hover:-translate-y-[1px] hover:brightness-105 hover:shadow-[0_12px_25px_rgba(53,88,114,0.24)]"
                            >
                              <Users className="h-3.5 w-3.5" />
                              View applicants
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              hasFilters={hasFilters}
              onClear={clearFilters}
              onCreate={() => navigate("/create-internship")}
            />
          )}

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={visibleInternships.length}
            pageStartIndex={pageStartIndex}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={goToPage}
            ariaLabel="Internship management pagination"
          />
        </section>
      </div>

      {feedback ? (
        <div className="fixed bottom-6 right-6 z-[90] flex max-w-sm items-center gap-3 rounded-[16px] border border-[#C9DBE4] bg-[#FBFCFD] px-4 py-3 shadow-[0_18px_44px_rgba(17,42,59,0.16)]">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E8F1F5] text-[#355872]">
            <Check className="h-4 w-4" />
          </div>
          <p className="text-[12px] font-black text-[#355872]">
            {feedback}
          </p>
        </div>
      ) : null}

      <ConfirmDialog
        internship={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
