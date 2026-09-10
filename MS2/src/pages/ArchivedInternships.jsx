import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArchiveRestore,
  BriefcaseBusiness,
  CalendarDays,
  CircleDot,
  Eye,
  MapPin,
  Search,
  Trash2,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import Pagination from "@/components/common/Pagination";
import {
  deleteInternship,
  getCurrentUser,
  getInternshipsForEmployer,
  updateInternship,
} from "@/data/demoStore";

const ITEMS_PER_PAGE = 5;

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

function formatDate(value) {
  const date = safeDate(value);
  if (!date) return "No deadline";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isArchived(internship) {
  const status = String(internship.status || "").trim().toLowerCase();

  return Boolean(
    internship.archived ||
      internship.isArchived ||
      status.includes("archived")
  );
}

function ConfirmDelete({ internship, onCancel, onConfirm }) {
  if (!internship) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#102434]/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[24px] border border-white/80 bg-[#F9FBFC] p-6 shadow-[0_28px_80px_rgba(17,42,59,0.24)]">
        <h2 className="text-xl font-black tracking-[-0.025em] text-[#142A3A]">
          Permanently delete “{internship.title}”?
        </h2>

        <p className="mt-3 text-[13px] font-semibold leading-6 text-[#718391]">
          This removes the archived internship and its stored application data.
          This action cannot be undone.
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
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchivedInternships() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState(() =>
    getInternshipsForEmployer(getCurrentUser()?.id)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState("");

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
    const timeout = window.setTimeout(() => setFeedback(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const archived = useMemo(
    () => internships.filter(isArchived),
    [internships]
  );

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          archived
            .map((item) => String(item.department || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [archived]
  );

  const workModes = useMemo(
    () =>
      Array.from(
        new Set(
          archived
            .map((item) => String(item.workMode || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [archived]
  );

  const visible = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = archived.filter((internship) => {
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

      return matchesSearch && matchesDepartment && matchesWorkMode;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }

      if (sortBy === "deadline") {
        const aDate = safeDate(a.deadline)?.getTime() || Number.MAX_SAFE_INTEGER;
        const bDate = safeDate(b.deadline)?.getTime() || Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      }

      const aTime =
        safeDate(a.updatedAt)?.getTime() ||
        safeDate(a.createdAt)?.getTime() ||
        0;
      const bTime =
        safeDate(b.updatedAt)?.getTime() ||
        safeDate(b.createdAt)?.getTime() ||
        0;

      return bTime - aTime;
    });
  }, [archived, searchTerm, department, workMode, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginated = visible.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    department !== "all" ||
    workMode !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setDepartment("all");
    setWorkMode("all");
    setCurrentPage(1);
  };

  const restoreInternship = (internship) => {
    updateInternship(internship.id, {
      status: "Closed",
      archived: false,
      isArchived: false,
    });

    setFeedback("Internship restored to Manage Internships.");
    refresh();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteInternship(deleteTarget.id);
    setDeleteTarget(null);
    setFeedback("Archived internship deleted.");
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <PageHeader
          title="Internship Archive"
          description="Keep old internship listings out of your active workspace without losing access to them."
          
        />

        <SearchFilterToolbar
          searchValue={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search archived internships..."
          showSort
          sortValue={`Sort by: ${
            sortBy === "title"
              ? "Title A–Z"
              : sortBy === "deadline"
                ? "Deadline"
                : "Recently archived"
          }`}
          onSortChange={(value) => {
            const label = value.replace("Sort by: ", "");
            setSortBy(
              label === "Title A–Z"
                ? "title"
                : label === "Deadline"
                  ? "deadline"
                  : "newest"
            );
            setCurrentPage(1);
          }}
          sortOptions={[
            "Sort by: Recently archived",
            "Sort by: Deadline",
            "Sort by: Title A–Z",
          ]}
          showFilters
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
          filterTitle="Filter archive"
          onClearFilters={hasFilters ? clearFilters : undefined}
        >
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

        <section>
          <div className="mb-5">
            <h2 className="font-bold text-[var(--ink)]">
              {visible.length} archived internship
              {visible.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
              Restoring an internship returns it to Manage Internships as closed.
            </p>
          </div>

          {paginated.length ? (
            <div className="space-y-4">
              {paginated.map((internship) => (
                <article
                  key={internship.id}
                  className="overflow-hidden rounded-[26px] border border-[#C9DBE4] bg-[#FBFCFA] shadow-[0_16px_38px_rgba(53,88,114,0.08)]"
                >
                  <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/internships/${internship.id}`)
                      }
                      className="relative flex min-h-[210px] flex-col bg-[linear-gradient(145deg,#071D2C_0%,#102F45_52%,#1E4964_100%)] p-7 text-left text-white"
                    >
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#93C4E0]">
                          Archived Internship
                        </p>

                        <span className="mt-4 block h-[2px] w-9 rounded-full bg-[#7AAACE]/80" />

                        <p className="mt-5 text-[11px] font-black uppercase tracking-[0.10em] text-[#8FC3E5]">
                          {internship.department || "Internship"}
                        </p>

                        <h3 className="mt-3 max-w-[220px] text-[27px] font-black leading-[1.02] tracking-[-0.045em]">
                          {internship.title || "Untitled Internship"}
                        </h3>
                      </div>

                      <div className="mt-auto border-t border-white/15 pt-4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black text-white/85">
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
                    </button>

                    <div className="flex min-h-[210px] flex-col px-7 py-6 sm:px-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#78A9C6]">
                            Archive Details
                          </p>

                          <p className="mt-2 text-[15px] font-black text-[#183247]">
                            This listing is hidden from your active hiring workspace.
                          </p>
                        </div>

                        <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#EAF2F6] text-[#557C97]">
                          <BriefcaseBusiness className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#8B9BA5]">
                            Deadline
                          </p>
                          <p className="mt-1 text-[11px] font-black text-[#355872]">
                            {formatDate(internship.deadline)}
                          </p>
                        </div>

                        <span className="hidden h-8 w-px bg-[#D3E1E9] sm:block" />

                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#8B9BA5]">
                            Duration
                          </p>
                          <p className="mt-1 text-[11px] font-black text-[#355872]">
                            {internship.duration || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#DAE6EC] pt-4">
                        <button
                          type="button"
                          onClick={() => restoreInternship(internship)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)] px-5 text-[11px] font-black text-white shadow-[0_9px_20px_rgba(53,88,114,0.20)] transition hover:-translate-y-[1px]"
                        >
                          <ArchiveRestore className="h-3.5 w-3.5" />
                          Restore internship
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/internships/${internship.id}`)
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-[13px] px-4 text-[11px] font-black text-[#557C97] transition hover:bg-[#EAF2F6]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View posting
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(internship)}
                          className="ml-auto inline-flex h-10 items-center gap-2 rounded-[13px] px-4 text-[11px] font-black text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[#C9DBE4] bg-[#FBFCFA] px-6 py-16 text-center shadow-[0_16px_38px_rgba(53,88,114,0.06)]">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-[18px] bg-[#EAF2F6] text-[#557C97]">
                <ArchiveRestore className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-black text-[#183247]">
                {hasFilters
                  ? "No archived internships match these filters"
                  : "Your archive is empty"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-[13px] font-semibold leading-6 text-[#718391]">
                Archived internships will appear here when you remove old
                opportunities from your active hiring workspace.
              </p>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 h-10 rounded-[13px] border border-[#C5D6E0] bg-white px-4 text-[11px] font-black text-[#355872]"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={visible.length}
            pageStartIndex={pageStartIndex}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            ariaLabel="Archived internship pagination"
          />
        </section>
      </div>

      {feedback ? (
        <div className="fixed bottom-6 right-6 z-[90] rounded-[14px] border border-[#C9DBE4] bg-[#FBFCFD] px-4 py-3 text-[11px] font-black text-[#355872] shadow-[0_16px_40px_rgba(17,42,59,0.14)]">
          {feedback}
        </div>
      ) : null}

      <ConfirmDelete
        internship={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
