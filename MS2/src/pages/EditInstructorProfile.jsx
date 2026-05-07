import { useState } from "react";
import { Plus, Pencil } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import InstructorProfileSummary from "@/components/profile/InstructorProfileSummary";
import EditableProfileField from "@/components/profile/EditableProfileField";
import SkillsEditor from "@/components/profile/SkillsEditor";
import DangerActions from "@/components/profile/DangerActions";

import { notifications } from "@/data/studentDashboardData";
import { useUserProfile } from "@/context/UserProfileContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditInstructorProfile() {
  const { profile, updateProfile } = useUserProfile();

  const [courseInput, setCourseInput] = useState("");

  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [eduForm, setEduForm] = useState({
    degree: "",
    university: "",
  });

  const [officeDialogOpen, setOfficeDialogOpen] = useState(false);
  const [officeDays, setOfficeDays] = useState(
    profile.officeHoursData?.days || ["Sun", "Tue", "Thu"]
  );
  const [startTime, setStartTime] = useState(
    profile.officeHoursData?.startTime || "10:00"
  );
  const [endTime, setEndTime] = useState(
    profile.officeHoursData?.endTime || "12:00"
  );

  const department = profile.department || "Computer Science and Engineering";

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const officeHours =
    profile.officeHours ||
    `${officeDays.join(", ")} (${formatTime(startTime)} - ${formatTime(
      endTime
    )})`;

  const research = profile.research || [
    "Software Engineering",
    "Artificial Intelligence",
    "Data Science",
    "Database Systems",
    "Machine Learning",
    "Information Systems",
  ];

  const education = profile.education || [
    {
      degree: "Ph.D. in Computer Science",
      university: "University of Waterloo, Canada",
    },
    {
      degree: "M.Sc. in Computer Science",
      university: "German University in Cairo",
    },
    {
      degree: "B.Sc. in Computer Science",
      university: "Cairo University",
    },
  ];

  const courses = profile.courses || [
    "CSEN 601 — Software Engineering",
    "CSEN 604 — Database Systems",
    "CSEN 603 — Artificial Intelligence",
    "CSEN 701 — Web Applications",
  ];

  const toggleDay = (day) => {
    setOfficeDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const saveOfficeHours = () => {
    if (officeDays.length === 0) return;

    const formatted = `${officeDays.join(", ")} (${formatTime(
      startTime
    )} - ${formatTime(endTime)})`;

    updateProfile({
      officeHours: formatted,
      officeHoursData: {
        days: officeDays,
        startTime,
        endTime,
      },
    });

    setOfficeDialogOpen(false);
  };

  const openAddEducation = () => {
    setEditingEduIndex(null);
    setEduForm({ degree: "", university: "" });
    setEduDialogOpen(true);
  };

  const openEditEducation = (index) => {
    setEditingEduIndex(index);
    setEduForm({
      degree: education[index].degree,
      university: education[index].university,
    });
    setEduDialogOpen(true);
  };

  const saveEducation = () => {
    if (!eduForm.degree.trim() || !eduForm.university.trim()) return;

    const updatedEducation = [...education];

    if (editingEduIndex !== null) {
      updatedEducation[editingEduIndex] = eduForm;
    } else {
      updatedEducation.push(eduForm);
    }

    updateProfile({ education: updatedEducation });
    setEduDialogOpen(false);
  };

  const addCourse = () => {
    const trimmed = courseInput.trim();
    if (!trimmed || courses.includes(trimmed)) return;

    updateProfile({
      courses: [...courses, trimmed],
    });

    setCourseInput("");
  };

  const unlinkCourse = (course) => {
    updateProfile({
      courses: courses.filter((item) => item !== course),
    });
  };

  return (
    <DashboardLayout notifications={notifications}>
      <div className="space-y-6">
        <SectionHeader
          title="Instructor Profile Information"
          subtitle="Manage your personal information, biography, research interests, education background, and teaching courses."
        />

        <div className="grid items-start gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <AppCard className="p-8">
            <InstructorProfileSummary
              profile={{
                ...profile,
                department,
                officeHours,
                joinedGuc: profile.joinedGuc || "September 2010",
                courses,
              }}
              updateProfile={updateProfile}
            />
          </AppCard>

          <div className="space-y-6">
            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Basic Information
              </h3>

              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-[color:var(--muted)]">
                  {profile.name || "Dr. Mervat Abuelkheir"}
                </p>
              </div>

              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">
                  Email
                </p>
                <p className="text-sm font-semibold text-[color:var(--muted)]">
                  {profile.email || "mervat.abuelkheir@guc.edu.eg"}
                </p>
              </div>

              <EditableProfileField
                label="Department"
                value={department}
                onSave={(value) => updateProfile({ department: value })}
              />

              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr_auto] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">
                  Office Hours
                </p>

                <p className="text-sm font-semibold text-[color:var(--muted)]">
                  {officeHours}
                </p>

                <button
                  type="button"
                  onClick={() => setOfficeDialogOpen(true)}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-[color:var(--primary)] transition hover:bg-[color:var(--accent)]/25 dark:bg-white/10 dark:text-[color:var(--accent)] dark:hover:bg-white/15"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </AppCard>

            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Biography
              </h3>

              <EditableProfileField
                label="Biography"
                value={
                  profile.bio ||
                  "I am a computer science educator and researcher with expertise in software engineering, database systems, and artificial intelligence."
                }
                onSave={(value) => updateProfile({ bio: value })}
              />
            </AppCard>

            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Research Interests
              </h3>

              <SkillsEditor
                skills={research}
                onChange={(value) => updateProfile({ research: value })}
              />
            </AppCard>

            <AppCard className="p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl font-black text-[color:var(--ink)]">
                  Education Background
                </h3>

                <button
                  type="button"
                  onClick={openAddEducation}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--primary)] px-4 py-2 text-sm font-black text-white transition hover:bg-[color:var(--dark)]"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {education.map((item, index) => (
                  <div
                    key={`${item.degree}-${index}`}
                    className="grid gap-3 border-b border-[color:var(--primary)]/10 py-3 md:grid-cols-[1fr_1fr_auto] md:items-center"
                  >
                    <p className="text-sm font-black text-[color:var(--dark)]">
                      {item.degree}
                    </p>

                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      {item.university}
                    </p>

                    <button
                      type="button"
                      onClick={() => openEditEducation(index)}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-[color:var(--primary)] transition hover:bg-[color:var(--accent)]/25 dark:bg-white/10 dark:text-[color:var(--accent)] dark:hover:bg-white/15"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </AppCard>

            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Courses Teaching
              </h3>

              <div className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--primary)]/15 bg-white/70 p-3">
                {courses.map((course) => (
                  <AlertDialog key={course}>
                    <div className="flex items-center gap-2 rounded-xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/10 px-3 py-1.5 text-sm font-bold text-[color:var(--primary)]">
                      <span>{course}</span>

                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="text-red-500 transition hover:text-red-600"
                        >
                          ×
                        </button>
                      </AlertDialogTrigger>
                    </div>

                    <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] backdrop-blur-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
                          Unlink course?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-base text-[color:var(--muted)]">
                          This will unlink you from "{course}". Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-2xl">
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => unlinkCourse(course)}
                          className="rounded-2xl bg-red-500 font-bold text-white hover:bg-red-600"
                        >
                          Yes, unlink
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}

                <input
                  placeholder="Link course by code or name"
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCourse();
                    }
                  }}
                  className="min-w-[180px] flex-1 bg-transparent text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
                />
              </div>
            </AppCard>

            <AppCard className="p-6">
              <DangerActions />
            </AppCard>
          </div>
        </div>
      </div>

      <AlertDialog open={officeDialogOpen} onOpenChange={setOfficeDialogOpen}>
        <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
              Edit Office Hours
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base leading-7 text-[color:var(--muted)]">
              Select recurring weekly days and choose the time range.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-black text-[color:var(--dark)]">
                Days
              </p>

              <div className="flex flex-wrap gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => {
                    const selected = officeDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
                          selected
                            ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                            : "border-[color:var(--primary)]/15 bg-white/70 text-[color:var(--muted)] hover:bg-[color:var(--primary)]/10"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-black text-[color:var(--dark)]">
                  Start Time
                </p>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-4 text-sm font-semibold text-[color:var(--ink)] outline-none"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-black text-[color:var(--dark)]">
                  End Time
                </p>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-4 text-sm font-semibold text-[color:var(--ink)] outline-none"
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={saveOfficeHours}
              className="rounded-2xl bg-[color:var(--primary)] font-bold text-white hover:bg-[color:var(--dark)]"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={eduDialogOpen} onOpenChange={setEduDialogOpen}>
        <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
              {editingEduIndex !== null ? "Edit Education" : "Add Education"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base leading-7 text-[color:var(--muted)]">
              Enter the certificate, degree, or education background details.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <input
              value={eduForm.degree}
              onChange={(e) =>
                setEduForm({ ...eduForm, degree: e.target.value })
              }
              placeholder="Degree / Certificate name"
              className="h-11 w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-4 text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70"
            />

            <input
              value={eduForm.university}
              onChange={(e) =>
                setEduForm({ ...eduForm, university: e.target.value })
              }
              placeholder="University / Institution"
              className="h-11 w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white/75 px-4 text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={saveEducation}
              className="rounded-2xl bg-[color:var(--primary)] font-bold text-white hover:bg-[color:var(--dark)]"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}