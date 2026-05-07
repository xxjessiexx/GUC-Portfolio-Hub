import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowDownUp,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Users,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notifications } from "@/data/studentDashboardData";
import { employerInternshipsData } from "@/data/employerInternshipsData";

function isDeadlinePassed(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  return deadlineDate < today;
}

function statusStyles(status) {
  if (status === "Open") return "bg-green-100 text-green-700";
  if (status === "Filled")
    return "bg-[color:var(--accent)]/30 text-[color:var(--primary)]";
  return "bg-gray-100 text-gray-600";
}

export default function ManageInternships() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState(employerInternshipsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("Newest");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [message, setMessage] = useState("");
  const [editingInternship, setEditingInternship] = useState(null);
  const [showAllCandidates, setShowAllCandidates] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
const [notesOpen, setNotesOpen] = useState(false);
const [notes, setNotes] = useState("");
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const departments = [
    "All Departments",
    ...new Set(internships.map((item) => item.department)),
  ];

  const locations = [
    "All Locations",
    ...new Set(internships.map((item) => item.location)),
  ];

  const filteredInternships = useMemo(() => {
    const filtered = internships.filter((internship) => {
      const matchesSearch = internship.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        internship.department === selectedDepartment;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        internship.status === selectedStatus;

      const matchesLocation =
        selectedLocation === "All Locations" ||
        internship.location === selectedLocation;

      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesLocation
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Newest") return new Date(b.deadline) - new Date(a.deadline);
      if (sortBy === "Oldest") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "Most Applicants") return b.applicants - a.applicants;
      if (sortBy === "Least Applicants") return a.applicants - b.applicants;
      return 0;
    });
  }, [
    internships,
    searchTerm,
    selectedDepartment,
    selectedStatus,
    selectedLocation,
    sortBy,
  ]);

  const stats = {
    active: internships.filter((item) => !item.isArchived).length,
    applicants: internships.reduce((sum, item) => sum + item.applicants, 0),
    filled: internships.filter((item) => item.isFilled).length,
    archived: internships.filter((item) => item.isArchived).length,
  };

  const markAsFilled = (id) => {
    setInternships((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isFilled: true, status: "Filled" } : item
      )
    );

    setOpenMenuId(null);
    setMessage("Internship marked as filled.");
  };

  const archiveInternship = (internship) => {
    if (!isDeadlinePassed(internship.deadline)) {
      setMessage(
        "You cannot archive this internship before the application deadline passes."
      );
      setOpenMenuId(null);
      return;
    }

    setInternships((current) =>
      current.map((item) =>
        item.id === internship.id
          ? { ...item, isArchived: true, status: "Archived" }
          : item
      )
    );

    setOpenMenuId(null);
    setMessage("Internship archived successfully.");
  };

  const viewEmployerInternship = (internship) => {
    const mappedId =
      internship.id === "emp-int-1"
        ? "int-1"
        : internship.id === "emp-int-2"
        ? "int-3"
        : "int-2";

    navigate(`/internships/${mappedId}`);
  };

  const saveEditedInternship = () => {
    setInternships((current) =>
      current.map((item) =>
        item.id === editingInternship.id ? editingInternship : item
      )
    );

    setEditingInternship(null);
    setMessage("Internship details updated successfully.");
  };

  const candidates = [
    { name: "Mariam Khaled", major: "Data Science • GUC" },
    { name: "Youssef Ashraf", major: "Computer Science • GUC" },
    { name: "Nourhan Hany", major: "Information Systems • GUC" },
    { name: "Omar Tarek", major: "Software Engineering • GUC" },
    { name: "Farida Samir", major: "Business Informatics • GUC" },
  ];

  const activities = [
    { text: "48 new applications", subtext: "Data Analyst Intern", time: "1h ago" },
    { text: "New saved candidate", subtext: "Youssef Ashraf", time: "2h ago" },
    { text: "Interview scheduled", subtext: "UI/UX Design Intern", time: "3h ago" },
    { text: "Internship filled", subtext: "Marketing Intern", time: "1d ago" },
    { text: "Application withdrawn", subtext: "Product Research Intern", time: "2d ago" },
  ];

  return (
    <DashboardLayout notifications={notifications}>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
                Manage Internships
              </h1>

              <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
                Create, manage, archive, and track internship postings and
                applications.
              </p>
            </div>

            <AppButton
              type="button"
              onClick={() => navigate("/create-internship")}
              className="min-h-12 rounded-2xl bg-[color:var(--primary)] px-6 font-black text-white hover:bg-[color:var(--dark)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Internship
            </AppButton>
          </div>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Active Internships" value={stats.active} icon={BriefcaseBusiness} helper="12% vs last month" />
            <StatCard title="Applications Received" value={stats.applicants} icon={Users} helper="18% vs last month" />
            <StatCard title="Positions Filled" value={stats.filled} icon={CheckCircle2} helper="30% vs last month" />
            <StatCard title="Archived Internships" value={stats.archived} icon={Archive} helper="8% vs last month" />
          </section>

          {message && (
            <AppCard className="p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-[color:var(--primary)]">
                  {message}
                </p>

                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="text-sm font-black text-[color:var(--muted)] hover:text-[color:var(--primary)]"
                >
                  Dismiss
                </button>
              </div>
            </AppCard>
          )}

          <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
            <div className="space-y-6">
              <AppCard className="p-5">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_11rem_11rem_11rem_13rem]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search internships..."
                      className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] pl-11 font-semibold text-[color:var(--ink)]"
                    />
                  </div>

                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-black text-[color:var(--ink)] shadow-sm">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[9999] rounded-2xl">
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-black text-[color:var(--ink)] shadow-sm">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[9999] rounded-2xl">
                      <SelectItem value="All Statuses">All Statuses</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Filled">Filled</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-black text-[color:var(--ink)] shadow-sm">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[9999] rounded-2xl">
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-black text-[color:var(--ink)] shadow-sm">
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="truncate">Sort: {sortBy}</span>
                        <ArrowDownUp className="h-4 w-4 shrink-0" />
                      </div>
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[9999] rounded-2xl">
                      <SelectItem value="Newest">Newest</SelectItem>
                      <SelectItem value="Oldest">Oldest</SelectItem>
                      <SelectItem value="Most Applicants">Most Applicants</SelectItem>
                      <SelectItem value="Least Applicants">Least Applicants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AppCard>

              <AppCard className="overflow-visible">
                <div className="hidden grid-cols-[1.45fr_0.75fr_0.9fr_0.85fr_0.85fr_0.7fr_0.7fr_auto] border-b border-[color:var(--primary)]/10 px-5 py-4 text-sm font-black text-[color:var(--dark)] lg:grid">
                  <p>Internship</p>
                  <p>Department</p>
                  <p>Location</p>
                  <p>Duration</p>
                  <p>Deadline</p>
                  <p>Applicants</p>
                  <p>Status</p>
                  <p></p>
                </div>

                {filteredInternships.map((internship, index) => {
                  const canArchive = isDeadlinePassed(internship.deadline);
                  const shouldOpenUp = index >= filteredInternships.length - 2;

                  return (
                    <div
                      key={internship.id}
                      className="relative grid gap-4 border-b border-[color:var(--primary)]/10 px-5 py-5 last:border-b-0 lg:grid-cols-[1.45fr_0.75fr_0.9fr_0.85fr_0.85fr_0.7fr_0.7fr_auto] lg:items-center"
                    >
                      <div>
                        <button
                          type="button"
                          onClick={() => viewEmployerInternship(internship)}
                          className="text-left"
                        >
                          <h2 className="font-black text-[color:var(--ink)] hover:text-[color:var(--primary)]">
                            {internship.title}
                          </h2>
                        </button>

                        <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                          {internship.department}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-[color:var(--muted)]">
                        {internship.department}
                      </p>

                      <p className="flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)]">
                        <MapPin className="h-4 w-4" />
                        {internship.location}
                      </p>

                      <p className="text-sm font-semibold text-[color:var(--muted)]">
                        {internship.duration}
                      </p>

                      <p className="text-sm font-semibold text-[color:var(--muted)]">
                        {internship.deadline}
                      </p>

                      <p className="text-sm font-black text-[color:var(--ink)]">
                        {internship.applicants}
                      </p>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${statusStyles(
                          internship.status
                        )}`}
                      >
                        {internship.status}
                      </span>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenMenuId((current) =>
                              current === internship.id ? null : internship.id
                            );
                          }}
                          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/60 text-[color:var(--primary)] transition hover:bg-white/80"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {openMenuId === internship.id && (
                          <div
                            onClick={(event) => event.stopPropagation()}
                            className={`absolute right-0 z-[9999] w-60 rounded-2xl border border-white/70 bg-white p-2 shadow-[0_24px_70px_rgba(53,88,114,0.18)] ${
                              shouldOpenUp ? "bottom-12" : "top-12"
                            }`}
                          >
                            <ActionItem
                              icon={Eye}
                              label="View details"
                              onClick={() => viewEmployerInternship(internship)}
                            />

                            <ActionItem
                              icon={Edit}
                              label="Edit internship"
                              onClick={() => {
                                setEditingInternship(internship);
                                setOpenMenuId(null);
                              }}
                            />

                            <ActionItem
                              icon={Users}
                              label="View applicants"
                              onClick={() => {
                                navigate(`/manage-applicants/${internship.id}`);
                                setOpenMenuId(null);
                            }}
                            />

                            {!internship.isFilled && (
                              <ActionItem
                                icon={CheckCircle2}
                                label="Mark as filled"
                                onClick={() => markAsFilled(internship.id)}
                              />
                            )}

                            <ActionItem
                              icon={Archive}
                              label={canArchive ? "Archive internship" : "Archive disabled"}
                              danger={canArchive}
                              disabled={!canArchive}
                              onClick={() => archiveInternship(internship)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </AppCard>
            </div>

            <aside className="space-y-6">
              <AppCard className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[color:var(--ink)]">
                      Suggested Candidates
                    </h2>
                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      From your favorites
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAllCandidates((prev) => !prev)}
                    className="text-sm font-black text-[color:var(--primary)]"
                  >
                    View all
                  </button>
                </div>

                {(showAllCandidates ? candidates : candidates.slice(0, 3)).map(
                  (candidate) => (
                    <Candidate
                      key={candidate.name}
                      name={candidate.name}
                      major={candidate.major}
                      onView={() =>
                        setMessage(
                          "Candidate profile page will be created later and linked from here."
                        )
                      }
                    />
                  )
                )}
              </AppCard>

              <AppCard className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-black text-[color:var(--ink)]">
                    Recent Activity
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowAllActivity((prev) => !prev)}
                    className="text-sm font-black text-[color:var(--primary)]"
                  >
                    View all
                  </button>
                </div>

                {(showAllActivity ? activities : activities.slice(0, 4)).map(
                  (activity) => (
                    <Activity
                      key={`${activity.text}-${activity.time}`}
                      text={activity.text}
                      subtext={activity.subtext}
                      time={activity.time}
                    />
                  )
                )}
              </AppCard>

              <AppCard className="p-6">
                <h2 className="text-xl font-black text-[color:var(--ink)]">
                  Boost your visibility
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                  Promote your internship to reach more qualified candidates.
                </p>

                <AppButton
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Promote Now is kept as a future employer visibility feature."
                    )
                  }
                  className="mt-5 rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white hover:bg-[color:var(--dark)]"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Promote Now
                </AppButton>
              </AppCard>
            </aside>
          </div>
        </div>

        {editingInternship && (
          <EditInternshipModal
            internship={editingInternship}
            setInternship={setEditingInternship}
            onClose={() => setEditingInternship(null)}
            onSave={saveEditedInternship}
          />
        )}
      </main>
    </DashboardLayout>
  );
}

function EditInternshipModal({ internship, setInternship, onClose, onSave }) {
  const updateField = (field, value) => {
    setInternship((current) => ({ ...current, [field]: value }));
  };

  return (
<div className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto bg-black/30 px-6 pb-10 pt-28 backdrop-blur-sm">
  <div className="w-full max-w-3xl rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(44,57,71,0.3)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            Edit Internship
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-100 text-[color:var(--muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" value={internship.title} onChange={(value) => updateField("title", value)} />
          <Field label="Department" value={internship.department} onChange={(value) => updateField("department", value)} />
          <Field label="Location" value={internship.location} onChange={(value) => updateField("location", value)} />
          <Field label="Duration" value={internship.duration} onChange={(value) => updateField("duration", value)} />
          <Field label="Deadline" type="date" value={internship.deadline} onChange={(value) => updateField("deadline", value)} />
          <Field label="Applicants" type="number" value={internship.applicants} onChange={(value) => updateField("applicants", Number(value))} />

          <div>
            <label className="mb-2 block text-sm font-black text-[color:var(--ink)]">
              Status
            </label>

            <select
              value={internship.status}
              onChange={(event) => {
                const status = event.target.value;
                setInternship((current) => ({
                  ...current,
                  status,
                  isFilled: status === "Filled",
                  isArchived: status === "Archived",
                }));
              }}
              className="h-12 w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white px-4 font-bold text-[color:var(--ink)] outline-none"
            >
              <option>Open</option>
              <option>Filled</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl border border-gray-200 bg-white px-6 font-black text-[color:var(--muted)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="h-12 rounded-2xl bg-[color:var(--primary)] px-6 font-black text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[color:var(--ink)]">
        {label}
      </label>

      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[color:var(--primary)]/15 bg-white px-4 font-bold text-[color:var(--ink)]"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, helper }) {
  return (
    <AppCard className="p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--accent)]/25 text-[color:var(--primary)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-black text-[color:var(--muted)]">{title}</p>
          <p className="mt-1 text-4xl font-black text-[color:var(--ink)]">{value}</p>
          <p className="mt-1 text-xs font-bold text-green-600">↗ {helper}</p>
        </div>
      </div>
    </AppCard>
  );
}

function ActionItem({ icon: Icon, label, onClick, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black transition ${
        disabled
          ? "cursor-not-allowed text-[color:var(--muted)]/45"
          : danger
          ? "text-red-500 hover:bg-red-50"
          : "text-[color:var(--ink)] hover:bg-[color:var(--accent)]/20"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Candidate({ name, major, onView }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/70 bg-white/55 p-4 last:mb-0">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--accent)]/25 text-sm font-black text-[color:var(--primary)]">
          {initials}
        </div>

        <div>
          <p className="font-black text-[color:var(--ink)]">{name}</p>
          <p className="text-sm font-semibold text-[color:var(--muted)]">{major}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onView}
        className="rounded-xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-black text-[color:var(--primary)]"
      >
        View
      </button>
    </div>
  );
}

function Activity({ text, subtext, time }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4 last:mb-0">
      <div>
        <p className="font-black text-[color:var(--ink)]">{text}</p>
        <p className="text-sm font-semibold text-[color:var(--muted)]">{subtext}</p>
      </div>

      <span className="text-xs font-bold text-[color:var(--muted)]">{time}</span>
    </div>
  );
}