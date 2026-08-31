import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import MiniProfileSummary from "@/components/profile/MiniProfileSummary";
import EditableProfileField from "@/components/profile/EditableProfileField";
import ProfileSelectField from "@/components/profile/ProfileSelectField";
import SkillsEditor from "@/components/profile/SkillsEditor";
import DangerActions from "@/components/profile/DangerActions";
import CourseBadge from "@/components/ui/CourseBadge";
import { useUserProfile } from "@/context/UserProfileContext";

import { Link2, Pencil, Check, X } from "lucide-react";
import { useState } from "react";

export default function EditStudentProfile() {
  const { profile, updateProfile } = useUserProfile();

  const semesterOptions = Array.from({ length: 10 }, (_, i) =>
    String(i + 1)
  );

  const facultyOptions = [
    "Engineering and Technology",
    "Management Technology",
  ];

  const majorOptions = ["MET", "DMET", "CSEN", "BI", "Mechatronics"];

  const [editingLinks, setEditingLinks] = useState(false);

const [linksDraft, setLinksDraft] = useState({
  linkedin: profile.links?.linkedin || "",
  github: profile.links?.github || "",
  behance: profile.links?.behance || "",
});

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

const [editingSingleLink, setEditingSingleLink] = useState(null);

const [singleLinkValue, setSingleLinkValue] = useState("");

const startEditingSingleLink = (field) => {
  setEditingSingleLink(field);
  setSingleLinkValue(profile.links?.[field] || "");
};

const cancelEditingSingleLink = () => {
  setEditingSingleLink(null);
  setSingleLinkValue("");
};

const saveSingleLink = () => {
  updateProfile({
    links: {
      ...profile.links,
      [editingSingleLink]: singleLinkValue,
    },
  });

  setEditingSingleLink(null);
  setSingleLinkValue("");
};
  return (
    <DashboardLayout >
       <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
              Profile Information
            </h1>

            <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
              Manage your personal information, skills, and portfolio links.
            </p>
          </div>
        

        <div className="grid items-start gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          
          {/* ================= LEFT CARD ================= */}
          <AppCard className="p-8">
            <MiniProfileSummary
              profile={profile}
              updateProfile={updateProfile}
            />

            <div className="my-6 h-px bg-[color:var(--primary)]/10" />

            {/* ===== SKILLS DISPLAY ===== */}
           <div className="flex flex-wrap gap-2">
  {profile.skills?.length > 0 ? (
    profile.skills.map((skill) => (
      <CourseBadge
        key={skill}
        course={skill}
      />
    ))
  ) : (
    <p className="text-sm font-semibold text-[color:var(--muted)]">
      No skills added yet.
    </p>
  )}
</div>

            <div className="my-6 h-px bg-[color:var(--primary)]/10" />

            {/* ===== LINKS DISPLAY ===== */}
            <div>
              <h3 className="mb-4 text-lg font-black text-[color:var(--ink)]">
                Portfolio Links
              </h3>

              <div className="space-y-4">
                {[
                  ["LinkedIn", profile.links?.linkedin],
                  ["GitHub", profile.links?.github],
                  ["Behance", profile.links?.behance],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-[color:var(--primary)]" />
                      <p className="text-sm font-black text-[color:var(--dark)]">
                        {label}
                      </p>
                    </div>

                    <p className="max-w-[180px] truncate text-right text-sm font-semibold text-[color:var(--muted)]">
                      {value || "Not added"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AppCard>

          {/* ================= RIGHT CARD ================= */}
          <div className="space-y-6">

            {/* ===== BASIC INFO ===== */}
            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Basic Information
              </h3>

              {/* Name (NON-EDITABLE) */}
              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-[color:var(--muted)]">
                  {profile.name}
                </p>
              </div>

              {/* Email (NON-EDITABLE) */}
              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">
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
                value={String(profile.semester)}
                options={semesterOptions}
                onChange={(value) => updateProfile({ semester: value })}
              />
            </AppCard>

            {/* ===== SKILLS EDITOR ===== */}
            <AppCard className="p-6">
              <SkillsEditor
                skills={profile.skills}
                onChange={(skills) => updateProfile({ skills })}
              />
            </AppCard>

            {/* ===== LINKS EDITOR ===== */}
            <AppCard className="p-6">
  <div className="mb-5 flex items-center justify-between">
    <h3 className="text-xl font-black text-[color:var(--ink)]">
      Portfolio Links
    </h3>

    {!editingLinks ? (
      <button
        type="button"
        onClick={startEditingLinks}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-xl
          text-[color:var(--primary)]
          transition
          hover:bg-[color:var(--primary)]/10
        "
        aria-label="Edit all portfolio links"
      >
        <Pencil className="h-4 w-4" />
      </button>
    ) : (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={cancelEditingLinks}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            text-[color:var(--muted)]
            transition
            hover:bg-[color:var(--primary)]/10
          "
        >
          <X className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={saveLinks}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            bg-[color:var(--primary)]
            text-white
            transition
            hover:opacity-90
          "
        >
          <Check className="h-4 w-4" />
        </button>
      </div>
    )}
  </div>

  {/* PUT YOUR BLOCK HERE */}
  <div className="space-y-4">
    {[
      ["linkedin", "LinkedIn URL"],
      ["github", "GitHub URL"],
      ["behance", "Behance URL"],
    ].map(([field, label]) => {
      const isEditingThis = editingSingleLink === field;

      return (
        <div key={field}>
          <div className="grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-center">
            <p className="text-sm font-black text-[color:var(--dark)]">
              {label}
            </p>

            {editingLinks ? (
              <input
                type="text"
                value={linksDraft[field]}
                onChange={(e) =>
                  setLinksDraft({
                    ...linksDraft,
                    [field]: e.target.value,
                  })
                }
                className="
                  w-full rounded-xl
                  border border-[color:var(--primary)]/20
                  bg-transparent
                  px-4 py-3
                  text-sm font-semibold
                  text-[color:var(--ink)]
                  outline-none
                  transition
                  focus:border-[color:var(--primary)]
                "
              />
            ) : isEditingThis ? (
              <input
                type="text"
                value={singleLinkValue}
                onChange={(e) =>
                  setSingleLinkValue(e.target.value)
                }
                className="
                  w-full rounded-xl
                  border border-[color:var(--primary)]/20
                  bg-transparent
                  px-4 py-3
                  text-sm font-semibold
                  text-[color:var(--ink)]
                  outline-none
                  transition
                  focus:border-[color:var(--primary)]
                "
              />
            ) : (
              <p className="truncate text-sm font-semibold text-[color:var(--muted)]">
                {profile.links?.[field] || "Not added"}
              </p>
            )}

            {!editingLinks && (
              <div className="flex items-center gap-1">
                {isEditingThis ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEditingSingleLink}
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg
                        text-[color:var(--muted)]
                        transition
                        hover:bg-[color:var(--primary)]/10
                      "
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={saveSingleLink}
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg
                        bg-[color:var(--primary)]
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      startEditingSingleLink(field)
                    }
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-lg
                      text-[color:var(--primary)]
                      transition
                      hover:bg-[color:var(--primary)]/10
                    "
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 h-px bg-[color:var(--primary)]/10" />
        </div>
      );
    })}
  </div>
</AppCard>
            {/* ===== ACCOUNT ACTIONS ===== */}
            <AppCard className="p-6">
              <DangerActions />
            </AppCard>

          </div>
        </div>
      </div>
      </main>
    </DashboardLayout>
  );
}