import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  CheckCircle2,
  Download,
  Eye,
  MessageSquare,
  Star,
  Users,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import InitialsAvatar from "@/components/common/InitialsAvatar";
import MetricCard from "@/components/common/MetricCard";
import FilterSelect from "@/components/common/FilterSelect";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";

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
  return STATUS_LABELS[normalized] ||
    normalized.charAt(0).toUpperCase() + normalized.slice(1);
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

  const strength =
    application.strength ||
    (score >= 90
      ? "Excellent"
      : score >= 82
      ? "Very Good"
      : score >= 74
      ? "Good"
      : "Fair");

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
    strength,
    projects: projects.length,
    score,
    status: toStatusLabel(application.status),
    portfolioId: student.id,
  };
}

function statusStyles(status) {
  if (status === "Accepted") return "bg-green-100 text-green-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  if (status === "Nominated")
    return "bg-[color:var(--gold)]/25 text-[color:var(--primary)]";
  if (status === "Shortlisted")
    return "bg-[color:var(--accent)]/30 text-[color:var(--primary)]";
  return "bg-purple-100 text-purple-700";
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

  const loadApplicants = () => {
    const selectedInternship = getInternshipById(resolveInternshipId(internshipId));
    setInternship(selectedInternship);
    setApplicants(
      (selectedInternship?.applications || [])
        .map((application) => buildApplicant(application, selectedInternship))
        .filter(Boolean)
    );
  };

  useEffect(() => {
    loadApplicants();

    const handleStoreChange = () => loadApplicants();
    window.addEventListener("demo-db-change", handleStoreChange);
    return () => window.removeEventListener("demo-db-change", handleStoreChange);
  }, [internshipId]);

  const majors = ["All Majors", ...new Set(applicants.map((a) => a.major))];
  const semesters = [
    "All Semesters",
    ...new Set(applicants.map((a) => a.semester)),
  ];

  const filteredApplicants = useMemo(() => {
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

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesMajor =
        selectedMajor === "All Majors" || applicant.major === selectedMajor;

      const matchesSemester =
        selectedSemester === "All Semesters" ||
        applicant.semester === selectedSemester;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        applicant.status === selectedStatus;

      return matchesSearch && matchesMajor && matchesSemester && matchesStatus;
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
    shortlisted: applicants.filter((a) => a.status === "Shortlisted").length,
    accepted: applicants.filter((a) => a.status === "Accepted").length,
    rejected: applicants.filter((a) => a.status === "Rejected").length,
  };

  const updateApplicantStatus = (id, status) => {
    const applicant = applicants.find((item) => item.id === id);
    if (!applicant) return;

    setApplicantStatus(
      resolveInternshipId(internshipId),
      applicant.userId,
      toStoreStatus(status)
    );
    setApplicants((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const exportCandidates = () => {
    const headers = [
      "Name",
      "University",
      "Major",
      "Semester",
      "Skills",
      "Portfolio Strength",
      "Projects",
      "Score",
      "Status",
    ];

    const rows = applicants.map((a) => [
      a.name,
      a.university,
      a.major,
      a.semester,
      a.skills.join(" | "),
      a.strength,
      a.projects,
      a.score,
      a.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "internship-candidates.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
                Applicants — {internship?.title || "Software Engineering Intern"}
              </h1>

              <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
                {internship?.companyName || internship?.company || "Greenbyte Solutions"} • Internship ID: {internshipId}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <AppButton className="rounded-2xl border border-white/70 bg-white/60 px-5 font-black text-[color:var(--primary)] hover:bg-white/80">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Search
              </AppButton>

              <AppButton
                onClick={exportCandidates}
                className="rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white hover:bg-[color:var(--dark)]"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Candidates
              </AppButton>
            </div>
          </div>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Applicants"
              value={stats.total}
              icon={Users}
              helper="100% of all applicants"
            />
            <MetricCard
              title="Shortlisted"
              value={stats.shortlisted}
              icon={Bookmark}
              helper="Initial strong matches"
            />
            <MetricCard
              title="Accepted"
              value={stats.accepted}
              icon={CheckCircle2}
              helper="Confirmed candidates"
            />
            <MetricCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              helper="Not selected"
            />
          </section>

          <div className="w-full">
            <div className="space-y-6">
              <SearchFilterToolbar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by name, skills, or university..."
                showSort
                sortValue={`Sort by: ${sortBy}`}
                onSortChange={(value) => setSortBy(value.replace("Sort by: ", ""))}
                sortOptions={[
                  "Sort by: Top Score",
                  "Sort by: Top Contributors",
                  "Sort by: Name A-Z",
                ]}
                showFilters
                filtersOpen={filtersOpen}
                onToggleFilters={() => setFiltersOpen((current) => !current)}
                filterTitle="Filter applicants"
                onClearFilters={() => {
                  setSelectedMajor("All Majors");
                  setSelectedSemester("All Semesters");
                  setSelectedStatus("All Statuses");
                }}
              >
                <FilterSelect
                  value={`Major: ${selectedMajor}`}
                  onChange={(value) => setSelectedMajor(value.replace("Major: ", ""))}
                  options={majors.map((major) => `Major: ${major}`)}
                />

                <FilterSelect
                  value={`Semester: ${selectedSemester}`}
                  onChange={(value) =>
                    setSelectedSemester(value.replace("Semester: ", ""))
                  }
                  options={semesters.map((semester) => `Semester: ${semester}`)}
                />

                <FilterSelect
                  value={`Status: ${selectedStatus}`}
                  onChange={(value) => setSelectedStatus(value.replace("Status: ", ""))}
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

              <AppCard className="overflow-hidden">
                <div className="hidden grid-cols-[1.35fr_0.85fr_0.65fr_1.1fr_0.9fr_0.55fr_0.55fr_0.8fr_0.75fr] border-b border-[color:var(--primary)]/10 px-5 py-4 text-sm font-black text-[color:var(--dark)] lg:grid">
                  <p>Applicant</p>
                  <p>Major</p>
                  <p>Semester</p>
                  <p>Top Skills</p>
                  <p>Strength</p>
                  <p>Projects</p>
                  <p>Score</p>
                  <p>Status</p>
                  <p>Actions</p>
                </div>

                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="grid gap-4 border-b border-[color:var(--primary)]/10 px-5 py-5 last:border-b-0 lg:grid-cols-[1.4fr_0.95fr_0.5fr_1.15fr_0.95fr_0.45fr_0.55fr_0.85fr_0.75fr] lg:items-center"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/public-portfolio?userId=${applicant.userId}`)
                      }
                      className="flex items-center gap-3 text-left"
                    >
                      {applicant.image ? (
                        <img
                          src={applicant.image}
                          alt={applicant.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
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

                      <div>
                        <p className="font-black text-[color:var(--ink)] hover:text-[color:var(--primary)]">
                          {applicant.name}
                          <Star className="ml-1 inline h-3.5 w-3.5 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                        </p>
                        <p className="text-sm font-semibold text-[color:var(--muted)]">
                          {applicant.university}
                        </p>
                      </div>
                    </button>

                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      {applicant.major}
                    </p>

                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      {applicant.semester}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {applicant.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[color:var(--accent)]/25 px-2 py-1 text-[10px] font-black text-[color:var(--primary)]"
                        >
                          {skill}
                        </span>
                      ))}

                      {applicant.skills.length > 3 && (
                        <span className="text-xs font-black text-[color:var(--muted)]">
                          +{applicant.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <StrengthBar strength={applicant.strength} />

                    <p className="text-sm font-black text-[color:var(--ink)]">
                      {applicant.projects}
                    </p>

                    <span className="w-fit rounded-xl bg-green-100 px-2.5 py-1 text-xs font-black text-green-700">
                      {applicant.score}
                    </span>

                    <Select
                      value={applicant.status}
                      onValueChange={(value) =>
                        updateApplicantStatus(applicant.id, value)
                      }
                    >
                      <SelectTrigger
                        className={`h-10 rounded-2xl border-0 px-3 text-xs font-black shadow-sm ${statusStyles(
                          applicant.status
                        )}`}
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="z-[9999] rounded-2xl"
                      >
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Nominated">Nominated</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Reviewing">Reviewing</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                         

                           navigate(`/public-portfolio?userId=${applicant.userId}`)
  }
                        
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/60 text-[color:var(--primary)]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/60 text-[color:var(--primary)]"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </AppCard>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

function StrengthBar({ strength }) {
  const count =
    strength === "Excellent"
      ? 5
      : strength === "Very Good"
      ? 4
      : strength === "Good"
      ? 3
      : 2;

  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((item) => (
          <span
            key={item}
            className={`h-1.5 w-6 rounded-full ${
              item <= count ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
        {strength}
      </p>
    </div>
  );
}

