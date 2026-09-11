import { useEffect, useState } from "react";
import { Check, Link2, Pencil, X } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";
import CourseBadge from "@/components/ui/CourseBadge";
import EditableProfileField from "@/components/profile/EditableProfileField";
import MiniProfileSummary from "@/components/profile/MiniProfileSummary";
import ProfileSelectField from "@/components/profile/ProfileSelectField";
import SkillsEditor from "@/components/profile/SkillsEditor";
import { useUserProfile } from "@/context/UserProfileContext";

const facultyOptions = [
  "Engineering and Technology",
  "Management Technology",
  "Pharmacy and Biotechnology",
  "Applied Sciences and Arts",
  "Law and Legal Studies",
  "Dentistry",
];

const majorOptions = [
  "MET",
  "DMET",
  "CSEN",
  "IET",
  "EMS",
  "BI",
  "Applied Sciences and Arts",
  "Architecture",
  "Pharmacy and Biotechnology",
  "Civil",
  "Dentistry",
  "Law and Legal Studies",
  "Management",
  "Mechatronics",
];

const semesterOptions = Array.from({ length: 10 }, (_, index) =>
  String(index + 1)
);

export default function StudentProfileSettings() {
  const { profile, updateProfile } = useUserProfile();

  const [editingLinks, setEditingLinks] = useState(false);
  const [linksDraft, setLinksDraft] = useState({
    linkedin: profile.links?.linkedin || "",
    github: profile.links?.github || "",
    behance: profile.links?.behance || "",
  });

  useEffect(() => {
    if (editingLinks) return;

    setLinksDraft({
      linkedin: profile.links?.linkedin || "",
      github: profile.links?.github || "",
      behance: profile.links?.behance || "",
    });
  }, [profile.links, editingLinks]);

  const startEditingLinks = () => {
    setLinksDraft({
      linkedin: profile.links?.linkedin || "",
      github: profile.links?.github || "",
      behance: profile.links?.behance || "",
    });

    setEditingLinks(true);
  };

  const cancelEditingLinks = () => {
    setEditingLinks(false);
  };

  const saveLinks = () => {
    updateProfile({
      links: linksDraft,
    });

    setEditingLinks(false);
  };

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[0.72fr_1.28fr]">
      <AppCard
        className="
          p-6
          !border-[#D3E1E8]
          !bg-[#F9FCFE]
          !shadow-[0_18px_44px_rgba(53,88,114,0.09)]
          dark:!border-white/10
          dark:!bg-[#0E2232]
        "
      >
        <MiniProfileSummary
          profile={profile}
          updateProfile={updateProfile}
        />

        <div className="my-6 h-px bg-[#D8E6ED] dark:bg-white/10" />

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Skills
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills?.length > 0 ? (
              profile.skills.map((skill) => (
                <CourseBadge key={skill} course={skill} />
              ))
            ) : (
              <p className="text-sm font-semibold text-[color:var(--muted)]">
                No skills added yet.
              </p>
            )}
          </div>
        </div>

        <div className="my-6 h-px bg-[#D8E6ED] dark:bg-white/10" />

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Portfolio links
          </p>

          <div className="mt-3 space-y-3">
            {[
              ["LinkedIn", profile.links?.linkedin],
              ["GitHub", profile.links?.github],
              ["Behance", profile.links?.behance],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Link2 className="h-4 w-4 shrink-0 text-[#55758B] dark:text-[#9CD5FF]" />
                  <span className="text-[12px] font-black text-[color:var(--ink)]">
                    {label}
                  </span>
                </div>

                <span className="max-w-[180px] truncate text-right text-[12px] font-semibold text-[color:var(--muted)]">
                  {value || "Not added"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AppCard>

      <div className="space-y-5">
        <AppCard
          className="
            p-6
            !border-[#D3E1E8]
            !bg-[#F9FCFE]
            !shadow-[0_18px_44px_rgba(53,88,114,0.09)]
            dark:!border-white/10
            dark:!bg-[#0E2232]
          "
        >
          <div className="mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B89736] dark:text-[#E6C77B]">
              Personal details
            </p>
            <h3 className="mt-1 text-[20px] font-black tracking-[-0.025em] text-[color:var(--ink)]">
              Profile information
            </h3>
          </div>

          <div className="grid gap-3 border-b border-[#D8E6ED] py-4 md:grid-cols-[180px_1fr] md:items-center dark:border-white/10">
            <p className="text-sm font-black text-[color:var(--ink)]">
              Full name
            </p>
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              {profile.name}
            </p>
          </div>

          <div className="grid gap-3 border-b border-[#D8E6ED] py-4 md:grid-cols-[180px_1fr] md:items-center dark:border-white/10">
            <p className="text-sm font-black text-[color:var(--ink)]">
              Email
            </p>
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              {profile.email}
            </p>
          </div>

          <EditableProfileField
            label="Bio"
            value={profile.bio}
            onSave={(value) => updateProfile({ bio: value })}
          />

          <ProfileSelectField
            label="Faculty"
            value={profile.faculty}
            options={facultyOptions}
            onChange={(value) => updateProfile({ faculty: value })}
          />

          <ProfileSelectField
            label="Major"
            value={profile.major}
            options={majorOptions}
            onChange={(value) =>
              updateProfile({
                major: value,
                role: `${value} Student`,
              })
            }
          />

          <ProfileSelectField
            label="Semester"
            value={String(profile.semester || "")}
            options={semesterOptions}
            onChange={(value) => updateProfile({ semester: value })}
          />
        </AppCard>

        <AppCard
          className="
            p-6
            !border-[#D3E1E8]
            !bg-[#F9FCFE]
            !shadow-[0_18px_44px_rgba(53,88,114,0.09)]
            dark:!border-white/10
            dark:!bg-[#0E2232]
          "
        >
          <SkillsEditor
            skills={profile.skills || []}
            onChange={(skills) => updateProfile({ skills })}
          />
        </AppCard>

        <AppCard
          className="
            p-6
            !border-[#D3E1E8]
            !bg-[#F9FCFE]
            !shadow-[0_18px_44px_rgba(53,88,114,0.09)]
            dark:!border-white/10
            dark:!bg-[#0E2232]
          "
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B89736] dark:text-[#E6C77B]">
                Links
              </p>
              <h3 className="mt-1 text-[20px] font-black tracking-[-0.025em] text-[color:var(--ink)]">
                Portfolio links
              </h3>
            </div>

            {!editingLinks ? (
              <button
                type="button"
                onClick={startEditingLinks}
                className="
                  grid h-10 w-10 place-items-center rounded-[12px]
                  border border-[#CBDDE7] bg-[#F3F8FB]
                  text-[#355872] transition
                  hover:bg-[#EAF3F8]
                  dark:border-white/10 dark:bg-white/[0.05] dark:text-[#9CD5FF]
                "
                aria-label="Edit portfolio links"
                title="Edit portfolio links"
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelEditingLinks}
                  className="
                    grid h-10 w-10 place-items-center rounded-[12px]
                    border border-[#CBDDE7] bg-white
                    text-[color:var(--muted)] transition
                    hover:bg-[#F2F7FA]
                    dark:border-white/10 dark:bg-white/[0.05]
                  "
                  aria-label="Cancel link changes"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={saveLinks}
                  className="
                    grid h-10 w-10 place-items-center rounded-[12px]
                    bg-[#355872] text-white
                    transition hover:bg-[#294C64]
                    dark:bg-[#9CD5FF] dark:text-[#071521]
                  "
                  aria-label="Save portfolio links"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              ["linkedin", "LinkedIn URL"],
              ["github", "GitHub URL"],
              ["behance", "Behance URL"],
            ].map(([field, label]) => (
              <div key={field}>
                <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-center">
                  <p className="text-sm font-black text-[color:var(--ink)]">
                    {label}
                  </p>

                  {editingLinks ? (
                    <input
                      type="text"
                      value={linksDraft[field]}
                      onChange={(event) =>
                        setLinksDraft((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      className="
                        w-full rounded-[13px]
                        border border-[#D2E1E8] bg-white
                        px-4 py-3 text-sm font-semibold
                        text-[color:var(--ink)] outline-none
                        transition
                        focus:border-[#7AAACE]
                        focus:ring-4 focus:ring-[#7AAACE]/15
                        dark:border-white/10 dark:bg-[#142B3D]
                      "
                      placeholder={`Enter ${label}`}
                    />
                  ) : (
                    <p className="truncate text-sm font-semibold text-[color:var(--muted)]">
                      {profile.links?.[field] || "Not added"}
                    </p>
                  )}
                </div>

                {field !== "behance" ? (
                  <div className="mt-4 h-px bg-[#D8E6ED] dark:bg-white/10" />
                ) : null}
              </div>
            ))}
          </div>
        </AppCard>
      </div>
    </div>
  );
}
