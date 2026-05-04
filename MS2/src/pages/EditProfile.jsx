import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import MiniProfileSummary from "@/components/profile/MiniProfileSummary";
import EditableProfileField from "@/components/profile/EditableProfileField";
import ProfileSelectField from "@/components/profile/ProfileSelectField";
import SkillsEditor from "@/components/profile/SkillsEditor";
import DangerActions from "@/components/profile/DangerActions";

import { notifications } from "@/data/studentDashboardData";
import { useUserProfile } from "@/context/UserProfileContext";

import { Link2 } from "lucide-react";

export default function EditProfile() {
  const { profile, updateProfile } = useUserProfile();

  const semesterOptions = Array.from({ length: 10 }, (_, i) =>
    String(i + 1)
  );

  const facultyOptions = [
    "Media Engineering and Technology",
    "Management Technology",
  ];

  const majorOptions = ["MET", "DMET", "CSEN", "BI", "Mechatronics"];

  return (
    <DashboardLayout notifications={notifications}>
      <div className="space-y-6">
        <SectionHeader
          title="Profile Information"
          subtitle="Manage your personal information, skills, and portfolio links."
        />

        <div className="grid items-start gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          
          {/* ================= LEFT CARD ================= */}
          <AppCard className="p-8">
            <MiniProfileSummary
              profile={profile}
              updateProfile={updateProfile}
            />

            <div className="my-6 h-px bg-[color:var(--primary)]/10" />

            {/* ===== SKILLS DISPLAY ===== */}
            <div>
              <h3 className="mb-4 text-lg font-black text-[color:var(--ink)]">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/10 px-3 py-1.5 text-sm font-bold text-[color:var(--primary)]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    No skills added yet.
                  </p>
                )}
              </div>
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
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Edit Portfolio Links
              </h3>

              <EditableProfileField
                label="LinkedIn URL"
                value={profile.links.linkedin}
                onSave={(value) =>
                  updateProfile({
                    links: { ...profile.links, linkedin: value },
                  })
                }
              />

              <EditableProfileField
                label="GitHub URL"
                value={profile.links.github}
                onSave={(value) =>
                  updateProfile({
                    links: { ...profile.links, github: value },
                  })
                }
              />

              <EditableProfileField
                label="Behance URL"
                value={profile.links.behance}
                onSave={(value) =>
                  updateProfile({
                    links: { ...profile.links, behance: value },
                  })
                }
              />
            </AppCard>

            {/* ===== ACCOUNT ACTIONS ===== */}
            <AppCard className="p-6">
              <DangerActions />
            </AppCard>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}