import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Download,
  MessageSquare,
  Search,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppButton } from "@/components/ui/AppButton";
import AppSelect from "@/components/common/AppSelect";
import InitialsAvatar from "@/components/common/InitialsAvatar";
import FilterSelect from "@/components/common/FilterSelect";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import NotificationToast from "@/components/notificationPage/notificationsToast";

import {
  getInternshipById,
  getProjectsForUser,
  getUserById,
  setApplicantStatus,
} from "@/data/demoStore";

const INTERNSHIP_ID_ALIASES = {
  "emp-int-1": "internship-1",
  "emp-int-2": "internship-2",
  "emp-int-3": "internship-3",
};

function resolveInternshipId(internshipId) {
  return INTERNSHIP_ID_ALIASES[internshipId] || internshipId;
}

const STATUS_LABELS = {
  pending: "Reviewing",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  nominated: "Nominated",
  accepted: "Accepted",
  rejected: "Rejected",
};

function toStatusLabel(value) {
  const normalized = String(value || "pending").trim().toLowerCase();

  return (
    STATUS_LABELS[normalized] ||
    normalized.charAt(0).toUpperCase() + normalized.slice(1)
  );
}

function toStoreStatus(value) {
  return String(value || "pending").trim().toLowerCase();
}

function buildApplicant(application, internship) {
  const student = getUserById(application.studentId);
  if (!student) return null;

  const projects = getProjectsForUser(student.id) || [];

  const internshipSkills = new Set(
    (internship?.skills || []).map((skill) => String(skill).toLowerCase())
  );

  const matchedSkills = (student.skills || []).filter((skill) =>
    internshipSkills.has(String(skill).toLowerCase())
  ).length;

  const score = Number(
    application.score ??
      Math.min(98, 72 + matchedSkills * 5 + Math.min(projects.length, 6) * 2)
  );

  return {
    id: application.id || `${internship?.id || "internship"}-${student.id}`,
    userId: student.id,
    name: student.name || student.email || "Student",
    image:
      student.profileImage ||
      student.image ||
      student.avatar ||
      "",
    university: student.university || student.faculty || "GUC",
    major: student.major || student.faculty || "Computer Science",
    semester:
      student.semester != null
        ? `${String(student.semester).replace(/(st|nd|rd|th)$/i, "")}th`
        : student.level || "—",
    skills: student.skills || [],
    projects: projects.length,
    score,
    status: toStatusLabel(application.status),
    portfolioId: student.id,
  };
}

function statusTone(status) {
  if (status === "Accepted") {
    return "border-[#B8D9C3] bg-[#EAF7EE] text-[#3E7250]";
  }

  if (status === "Rejected") {
    return "border-[#E8C8C8] bg-[#FCEEEE] text-[#9A5757]";
  }

  if (status === "Shortlisted" || status === "Nominated") {
    return "border-[#DFC873] bg-[#F8EDC4] text-[#7B6324]";
  }

  return "border-[#C6D8E2] bg-[#EDF4F8] text-[#557C97]";
}


export default function ManageApplicants() {
  const navigate = useNavigate();
  const { internshipId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [internship, setInternship] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("All Majors");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Top Score");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const loadApplicants = () => {
    const selectedInternship = getInternshipById(
      resolveInternshipId(internshipId)
    );

    setInternship(selectedInternship);

    setApplicants(
      (selectedInternship?.applications || [])
        .map((application) =>
          buildApplicant(application, selectedInternship)
        )
        .filter(Boolean)
    );
  };

  useEffect(() => {
    loadApplicants();

    const handleStoreChange = () => loadApplicants();

    window.addEventListener("demo-db-change", handleStoreChange);

    return () =>
      window.removeEventListener("demo-db-change", handleStoreChange);
  }, [internshipId]);


  const majors = ["All Majors", ...new Set(applicants.map((a) => a.major))];

  const semesters = [
    "All Semesters",
    ...new Set(applicants.map((a) => a.semester)),
  ];

  const filteredApplicants = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = applicants.filter((applicant) => {
      const searchableText = [
        applicant.name,
        applicant.university,
        applicant.major,
        applicant.semester,
        ...applicant.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesMajor =
        selectedMajor === "All Majors" ||
        applicant.major === selectedMajor;

      const matchesSemester =
        selectedSemester === "All Semesters" ||
        applicant.semester === selectedSemester;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        applicant.status === selectedStatus;

      return (
        matchesSearch &&
        matchesMajor &&
        matchesSemester &&
        matchesStatus
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Top Score") return b.score - a.score;
      if (sortBy === "Top Contributors") return b.projects - a.projects;
      if (sortBy === "Name A-Z") return a.name.localeCompare(b.name);

      return 0;
    });
  }, [
    applicants,
    searchTerm,
    selectedMajor,
    selectedSemester,
    selectedStatus,
    sortBy,
  ]);

  const stats = {
    total: applicants.length,
    shortlisted: applicants.filter(
      (applicant) =>
        applicant.status === "Shortlisted" ||
        applicant.status === "Nominated"
    ).length,
    accepted: applicants.filter(
      (applicant) => applicant.status === "Accepted"
    ).length,
    rejected: applicants.filter(
      (applicant) => applicant.status === "Rejected"
    ).length,
  };

  const updateApplicantStatus = (id, status) => {
    const applicant = applicants.find((item) => item.id === id);
    if (!applicant) return;

    const updated = setApplicantStatus(
      resolveInternshipId(internshipId),
      applicant.userId,
      toStoreStatus(status)
    );

    if (!updated) {
      setFeedbackToast({
        id: `candidate-status-error-${Date.now()}`,
        title: "Status not updated",
        message: `Could not update ${applicant.name}'s application status.`,
        type: "application-error",
        createdAt: new Date().toISOString(),
      });
      return;
    }

    setApplicants((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setFeedbackToast({
      id: `candidate-status-${Date.now()}`,
      title: "Application status updated",
      message: `${applicant.name} moved to ${status}.`,
      type: "application",
      createdAt: new Date().toISOString(),
    });
  };

  const exportCandidates = () => {
    const headers = [
      "Name",
      "University",
      "Major",
      "Semester",
      "Skills",
      "Projects",
      "Score",
      "Status",
    ];

    const rows = applicants.map((applicant) => [
      applicant.name,
      applicant.university,
      applicant.major,
      applicant.semester,
      applicant.skills.join(" | "),
      applicant.projects,
      applicant.score,
      applicant.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "internship-candidates.csv";
    link.click();

    URL.revokeObjectURL(url);
  };



  const clearFilters = () => {
    setSelectedMajor("All Majors");
    setSelectedSemester("All Semesters");
    setSelectedStatus("All Statuses");
  };

  return (
    <DashboardLayout>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">
          <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#557C97]">
                <span className="h-[3px] w-8 rounded-full bg-[#E6C77B]" />
                Candidate Review
              </p>

              <h1 className="max-w-4xl text-4xl font-black tracking-[-0.045em] text-[color:var(--ink)] sm:text-5xl">
                {internship?.title || "Software Engineering Intern"}
              </h1>

              <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
                {internship?.companyName ||
                  internship?.company ||
                  "Employer"}
                <span className="mx-2 text-[#B7C4CC]">•</span>
                Applicants
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <AppButton
                onClick={exportCandidates}
                className="rounded-2xl bg-[linear-gradient(135deg,#2C3947_0%,#355872_58%,#7AAACE_100%)] px-5 font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.18)] hover:brightness-105"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Candidates
              </AppButton>
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] font-bold text-[color:var(--muted)]">
            <span className="font-black text-[#355872]">
              {stats.total} applicants
            </span>
            <span className="text-[#B8C4CB]">•</span>
            <span className="font-black text-[#9A7A2F]">
              {stats.shortlisted} shortlisted
            </span>
            <span className="text-[#B8C4CB]">•</span>
            <span>{stats.accepted} accepted</span>
            <span className="text-[#B8C4CB]">•</span>
            <span>{stats.rejected} rejected</span>
          </div>

          <SearchFilterToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by name, skills, or university..."
            showSort
            sortValue={`Sort by: ${sortBy}`}
            onSortChange={(value) =>
              setSortBy(value.replace("Sort by: ", ""))
            }
            sortOptions={[
              "Sort by: Top Score",
              "Sort by: Top Contributors",
              "Sort by: Name A-Z",
            ]}
            showFilters
            filtersOpen={filtersOpen}
            onToggleFilters={() =>
              setFiltersOpen((current) => !current)
            }
            filterTitle="Filter applicants"
            onClearFilters={clearFilters}
          >
            <FilterSelect
              value={`Major: ${selectedMajor}`}
              onChange={(value) =>
                setSelectedMajor(value.replace("Major: ", ""))
              }
              options={majors.map((major) => `Major: ${major}`)}
            />

            <FilterSelect
              value={`Semester: ${selectedSemester}`}
              onChange={(value) =>
                setSelectedSemester(value.replace("Semester: ", ""))
              }
              options={semesters.map(
                (semester) => `Semester: ${semester}`
              )}
            />

            <FilterSelect
              value={`Status: ${selectedStatus}`}
              onChange={(value) =>
                setSelectedStatus(value.replace("Status: ", ""))
              }
              options={[
                "Status: All Statuses",
                "Status: Shortlisted",
                "Status: Nominated",
                "Status: Accepted",
                "Status: Rejected",
                "Status: Reviewing",
              ]}
            />
          </SearchFilterToolbar>

          <section className="space-y-3.5">
            {filteredApplicants.length ? (
              filteredApplicants.map((applicant) => (
                <article
                  key={applicant.id}
                  role="link"
                  tabIndex={0}
                  onClick={() =>
                    navigate(
                      `/public-portfolio?userId=${applicant.userId}&internshipId=${encodeURIComponent(resolveInternshipId(internshipId))}`
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(
                        `/public-portfolio?userId=${applicant.userId}&internshipId=${encodeURIComponent(resolveInternshipId(internshipId))}`
                      );
                    }
                  }}
                  className={`group cursor-pointer overflow-hidden rounded-[26px] border bg-[var(--surface)] shadow-[0_16px_38px_rgba(53,88,114,0.08)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7AAACE]/18 hover:-translate-y-[2px] hover:shadow-[0_22px_46px_rgba(53,88,114,0.12)] ${
                    applicant.status === "Shortlisted" ||
                    applicant.status === "Nominated"
                      ? "border-[#D8BF69] border-l-[3px]"
                      : "border-[#C9DBE4]"
                  }`}
                >
                  <div className="grid xl:grid-cols-[minmax(0,1fr)_250px]">
                    <div className="min-w-0 px-5 py-5 sm:px-6">
                      <div className="flex min-w-0 items-start gap-4">
                        {applicant.image ? (
                          <img
                            src={applicant.image}
                            alt={applicant.name}
                            className="h-16 w-16 shrink-0 rounded-[18px] border-2 border-white object-cover shadow-[0_8px_18px_rgba(53,88,114,0.12)]"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              event.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}

                        <div className={applicant.image ? "hidden" : ""}>
                          <InitialsAvatar name={applicant.name} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-[19px] font-black tracking-[-0.025em] text-[color:var(--ink)] transition-colors group-hover:text-[#355872]">
                                {applicant.name}
                              </h3>

                              <p className="mt-1 text-[12px] font-bold text-[color:var(--muted)]">
                                {applicant.major}
                                <span className="mx-2 text-[#B8C4CB]">•</span>
                                {applicant.semester}
                                <span className="mx-2 text-[#B8C4CB]">•</span>
                                {applicant.university}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {applicant.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-[#355872]/10 px-2.5 py-1.5 text-[10px] font-black text-[#355872]"
                              >
                                {skill}
                              </span>
                            ))}

                            {applicant.skills.length > 3 ? (
                              <span className="rounded-full border border-[#D0DEE6] bg-white/55 px-2.5 py-1.5 text-[10px] font-black text-[#6F828E]">
                                +{applicant.skills.length - 3}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-3 text-[11px] font-semibold text-[color:var(--muted)]">
                            <strong className="font-black text-[#355872]">
                              {applicant.projects}
                            </strong>{" "}
                            portfolio project
                            {applicant.projects === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#DCE7ED] px-5 py-5 xl:border-l xl:border-t-0 xl:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div>
                            <span className="text-[34px] font-black leading-none tracking-[-0.05em] text-[#183247]">
                              {applicant.score}
                            </span>

                            <span className="mt-2 block h-[3px] w-9 rounded-full bg-[#D8B84E]" />

                            <p className="mt-2 text-[11px] font-black text-[#9A7A2F]">
                              {applicant.score >= 90
                                ? "Excellent match"
                                : applicant.score >= 80
                                  ? "Strong match"
                                  : applicant.score >= 70
                                    ? "Good match"
                                    : "Moderate match"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(
                              `/chat?targetUserId=${applicant.userId}&internshipId=${encodeURIComponent(resolveInternshipId(internshipId))}`
                            );
                          }}
                          aria-label={`Message ${applicant.name}`}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] border border-[#C7D7E0] bg-white/62 text-[#355872] transition hover:bg-white"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>

                      <div
                        className="mt-5"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <AppSelect
                          value={applicant.status}
                          onChange={(value) =>
                            updateApplicantStatus(
                              applicant.id,
                              value
                            )
                          }
                          options={[
                            "Shortlisted",
                            "Nominated",
                            "Accepted",
                            "Rejected",
                            "Reviewing",
                          ]}
                          placeholder="Select status"
                          className={`h-10 w-full text-xs font-black ${statusTone(
                            applicant.status
                          )}`}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#C7D7E0] bg-white/45 px-6 py-14 text-center">
                <Search className="mx-auto h-6 w-6 text-[#7AAACE]" />

                <h3 className="mt-4 text-lg font-black text-[color:var(--ink)]">
                  No applicants match these filters
                </h3>

                <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
                  Try another search or clear the current filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <NotificationToast
        toast={feedbackToast}
        onClose={() => setFeedbackToast(null)}
      />
    </DashboardLayout>
  );
}
