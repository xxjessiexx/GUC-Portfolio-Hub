import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import InstructorProfileSummary from "@/components/profile/InstructorProfileSummary";
import DangerActions from "@/components/profile/DangerActions";
import { useUserProfile } from "@/context/UserProfileContext";

const defaultResearch = [
  "Software Engineering",
  "Artificial Intelligence",
  "Data Science",
  "Database Systems",
  "Machine Learning",
  "Information Systems",
];

const defaultEducation = [
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


const inputClassName =
  "h-11 w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white/70 px-4 text-sm font-semibold text-[color:var(--ink)] outline-none transition focus:border-[color:var(--primary)] dark:border-white/10 dark:bg-white/[0.055]";

function EditControls({ isEditing, onEdit, onCancel, onSave }) {
  return isEditing ? (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--primary)]/10 bg-[color:var(--primary)]/5 text-[color:var(--muted)] transition hover:bg-[color:var(--primary)]/10 hover:text-[color:var(--ink)]"
        aria-label="Cancel changes"
        title="Cancel"
      >
        <X className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary)] text-white transition hover:opacity-90"
        aria-label="Save profile changes"
        title="Save"
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={onEdit}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)] transition hover:bg-[color:var(--primary)]/10"
      aria-label="Edit profile"
      title="Edit profile"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
}

export default function EditInstructorProfile() {
  const { profile, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [researchInput, setResearchInput] = useState("");
  const [draft, setDraft] = useState(() => createDraft(profile));

  function createDraft(source) {
    const officeHoursData = source.officeHoursData || {
      days: ["Sun", "Tue", "Thu"],
      startTime: "10:00",
      endTime: "12:00",
    };

    return {
      department: source.department || "Computer Science and Engineering",
      bio:
        source.bio ||
        "I am a computer science educator and researcher with expertise in software engineering, database systems, and artificial intelligence.",
      
      education: (source.education || []).map((item) => ({ ...item })),
      
      officeHoursData: {
        days: [...officeHoursData.days],
        startTime: officeHoursData.startTime,
        endTime: officeHoursData.endTime,
      },
    };
  }

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

  const formatOfficeHours = (data) =>
    `${data.days.join(", ")} (${formatTime(data.startTime)} - ${formatTime(
      data.endTime
    )})`;

  const displayOfficeHours = profile.officeHours || formatOfficeHours(createDraft(profile).officeHoursData);
  const draftOfficeHours = formatOfficeHours(draft.officeHoursData);

  const startEditing = () => {
    setDraft(createDraft(profile));
    setResearchInput("");
    
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(createDraft(profile));
    setResearchInput("");
    
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (draft.officeHoursData.days.length === 0) return;

    updateProfile({
      department: draft.department,
      bio: draft.bio,
      
      education: draft.education,
      officeHoursData: draft.officeHoursData,
      officeHours: draftOfficeHours,
    });

    setIsEditing(false);
  };

  const toggleDay = (day) => {
    setDraft((prev) => {
      const days = prev.officeHoursData.days.includes(day)
        ? prev.officeHoursData.days.filter((item) => item !== day)
        : [...prev.officeHoursData.days, day];

      return {
        ...prev,
        officeHoursData: { ...prev.officeHoursData, days },
      };
    });
  };

 const addResearch = () => {
  const trimmed = researchInput.trim();
  const currentResearch = profile.research || defaultResearch;

  if (!trimmed || currentResearch.includes(trimmed)) return;

  updateProfile({
    research: [...currentResearch, trimmed],
  });

  setResearchInput("");
};

const removeResearch = (itemToRemove) => {
  const currentResearch = profile.research || defaultResearch;

  updateProfile({
    research: currentResearch.filter(
      (item) => item !== itemToRemove
    ),
  });
};


  const shownDepartment = isEditing ? draft.department : profile.department || "Computer Science and Engineering";
  

  return (
    <DashboardLayout>
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
                department: shownDepartment,
                officeHours: isEditing ? draftOfficeHours : displayOfficeHours,
                joinedGuc: profile.joinedGuc || "September 2010",
              
              }}
              updateProfile={updateProfile}
            />
          </AppCard>

          <div className="space-y-6">
            <AppCard className="p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl font-black text-[color:var(--ink)]">
                  Basic Information
                </h3>
                <EditControls
                  isEditing={isEditing}
                  onEdit={startEditing}
                  onCancel={cancelEditing}
                  onSave={saveChanges}
                />
              </div>

              {[
                ["Full Name", profile.name || "Dr. Mervat Abuelkheir"],
                ["Email", profile.email || "mervat.abuelkheir@guc.edu.eg"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center"
                >
                  <p className="text-sm font-black text-[color:var(--dark)]">{label}</p>
                  <p className="text-sm font-semibold text-[color:var(--muted)]">{value}</p>
                </div>
              ))}

              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">Department</p>
                {isEditing ? (
                  <input
                    value={draft.department}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, department: event.target.value }))
                    }
                    className={inputClassName}
                  />
                ) : (
                  <p className="text-sm font-semibold text-[color:var(--muted)]">{shownDepartment}</p>
                )}
              </div>

              <div className="grid gap-3 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <p className="pt-2 text-sm font-black text-[color:var(--dark)]">Office Hours</p>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                        const selected = draft.officeHoursData.days.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
                              selected
                                ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                                : "border-[color:var(--primary)]/15 bg-white/70 text-[color:var(--muted)] hover:bg-[color:var(--primary)]/10"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="time"
                        value={draft.officeHoursData.startTime}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            officeHoursData: {
                              ...prev.officeHoursData,
                              startTime: event.target.value,
                            },
                          }))
                        }
                        className={inputClassName}
                      />
                      <input
                        type="time"
                        value={draft.officeHoursData.endTime}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            officeHoursData: {
                              ...prev.officeHoursData,
                              endTime: event.target.value,
                            },
                          }))
                        }
                        className={inputClassName}
                      />
                    </div>
                    <p className="text-xs font-semibold text-[color:var(--muted)]">{draftOfficeHours}</p>
                  </div>
                ) : (
                  <p className="pt-2 text-sm font-semibold text-[color:var(--muted)]">{displayOfficeHours}</p>
                )}
              </div>
            </AppCard>

            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">Biography</h3>
              {isEditing ? (
                <textarea
                  rows={5}
                  value={draft.bio}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, bio: event.target.value }))
                  }
                  className={`${inputClassName} min-h-[130px] resize-none py-3`}
                />
              ) : (
                <p className="text-sm font-semibold leading-7 text-[color:var(--muted)]">
                  {profile.bio || createDraft(profile).bio}
                </p>
              )}
            </AppCard>

           <AppCard className="p-6">
  <div className="mb-4">
    <h3 className="text-xl font-black text-[color:var(--ink)]">
      Research Interests
    </h3>

    <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
      Add or remove your research areas. Changes are saved automatically.
    </p>
  </div>

  <div
    className="
      flex flex-wrap items-center gap-3
      rounded-[24px]
      border border-[color:var(--primary)]/12
      bg-white/75
      px-4 py-4
    "
  >
    {(profile.research || defaultResearch).map((item) => (
      <span
        key={item}
        className="
          inline-flex h-11 items-center gap-2
          rounded-full
          border border-[#7AAACE]/55
          bg-[#5F86A3]
          px-5
          text-sm font-bold
          text-white
        "
      >
        {item}

        <button
          type="button"
          onClick={() => removeResearch(item)}
          className="
            grid h-5 w-5 place-items-center
            rounded-full
            transition
            hover:bg-white/15
          "
          aria-label={`Remove ${item}`}
          title={`Remove ${item}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </span>
    ))}

    <input
      value={researchInput}
      onChange={(event) =>
        setResearchInput(event.target.value)
      }
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          addResearch();
        }
      }}
      onBlur={addResearch}
      placeholder="Enter research interest"
      className="
        min-w-[180px] flex-1
        bg-transparent
        text-sm font-semibold
        text-[color:var(--ink)]
        outline-none
      "
    />
  </div>
</AppCard>

           <AppCard className="p-6">
  <div className="mb-4 flex items-center justify-between gap-4">
    <div>
      <h3 className="text-xl font-black text-[color:var(--ink)]">
        Education Background
      </h3>

      <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
        Add your degrees, certificates, and academic qualifications.
      </p>
    </div>

    {isEditing && (
      <button
        type="button"
        onClick={() =>
          setDraft((prev) => ({
            ...prev,
            education: [
              ...prev.education,
              {
                degree: "",
                university: "",
              },
            ],
          }))
        }
        className="
          inline-flex items-center gap-2
          rounded-2xl
          bg-[color:var(--primary)]
          px-4 py-2
          text-sm font-black text-white
          transition
          hover:bg-[color:var(--dark)]
        "
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
    )}
  </div>

  {(isEditing ? draft.education : profile.education || []).length === 0 ? (
    <div
      className="
        flex min-h-[130px]
        flex-col items-center justify-center
        rounded-2xl
        border border-dashed border-[color:var(--primary)]/20
        bg-[color:var(--primary)]/[0.025]
        px-6 py-8
        text-center
      "
    >
      <p className="font-bold text-[color:var(--ink)]">
        No education background added yet
      </p>

      <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-[color:var(--muted)]">
        Add a degree, certificate, diploma, or other academic
        qualification together with the university or institution.
      </p>

      {isEditing && (
        <button
          type="button"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              education: [
                ...prev.education,
                {
                  degree: "",
                  university: "",
                },
              ],
            }))
          }
          className="
            mt-4 inline-flex items-center gap-2
            rounded-xl
            bg-[color:var(--primary)]/10
            px-4 py-2
            text-sm font-black
            text-[color:var(--primary)]
            transition
            hover:bg-[color:var(--primary)]/15
          "
        >
          <Plus className="h-4 w-4" />
          Add education
        </button>
      )}
    </div>
  ) : (
    <div className="space-y-3">
      {(isEditing
        ? draft.education
        : profile.education || []
      ).map((item, index) => (
        <div
          key={index}
          className="
            grid gap-3
            border-b border-[color:var(--primary)]/10
            py-3
            md:grid-cols-[1fr_1fr_auto]
            md:items-center
          "
        >
          {isEditing ? (
            <>
              <input
                value={item.degree}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    education: prev.education.map(
                      (entry, entryIndex) =>
                        entryIndex === index
                          ? {
                              ...entry,
                              degree: event.target.value,
                            }
                          : entry
                    ),
                  }))
                }
                placeholder="e.g. Ph.D. in Computer Science"
                className={inputClassName}
              />

              <input
                value={item.university}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    education: prev.education.map(
                      (entry, entryIndex) =>
                        entryIndex === index
                          ? {
                              ...entry,
                              university: event.target.value,
                            }
                          : entry
                    ),
                  }))
                }
                placeholder="e.g. German University in Cairo"
                className={inputClassName}
              />

              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    education: prev.education.filter(
                      (_, entryIndex) =>
                        entryIndex !== index
                    ),
                  }))
                }
                className="
                  grid h-9 w-9 place-items-center
                  rounded-xl
                  text-red-500
                  transition
                  hover:bg-red-50
                "
                aria-label="Remove education"
                title="Remove education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">
                  Qualification
                </p>

                <p className="mt-1 text-sm font-black text-[color:var(--dark)]">
                  {item.degree || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">
                  Institution
                </p>

                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  {item.university || "Not specified"}
                </p>
              </div>

              <span />
            </>
          )}
        </div>
      ))}
    </div>
  )}
</AppCard>


            <AppCard className="p-6">
              <DangerActions />
            </AppCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
