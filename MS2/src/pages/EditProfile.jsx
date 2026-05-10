import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import MiniProfileSummary from "@/components/profile/MiniProfileSummary";
import EditableProfileField from "@/components/profile/EditableProfileField";
import ProfileSelectField from "@/components/profile/ProfileSelectField";
import SkillsEditor from "@/components/profile/SkillsEditor";
import DangerActions from "@/components/profile/DangerActions";


import { useUserProfile } from "@/context/UserProfileContext";

export default function EditProfile() {
  const { profile, updateProfile } = useUserProfile();

  const semesterOptions = Array.from({ length: 10 }, (_, index) =>
    String(index + 1)
  );

  const facultyOptions = ["Faculty of Engineering"];
  const majorOptions = ["Computer Science"];

  return (
    <DashboardLayout >
      <div className="space-y-6">
        <SectionHeader
          title="Profile Information"
          subtitle="Manage your personal information, skills, and portfolio links."
        />

        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-6">
            <AppCard className="p-8">
              <MiniProfileSummary
                profile={profile}
                updateProfile={updateProfile}
              />
            </AppCard>
          </div>

          <div className="space-y-6">
            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Basic Information
              </h3>

              {/* READ-ONLY FIELD */}
              <div className="grid gap-3 border-b border-[color:var(--primary)]/10 py-4 md:grid-cols-[180px_1fr] md:items-center">
                <p className="text-sm font-black text-[color:var(--dark)]">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-[color:var(--muted)]">
                  {profile.name}
                </p>
              </div>

              {/* READ-ONLY FIELD */}
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

            <AppCard className="p-6">
              <SkillsEditor
                skills={profile.skills}
                onChange={(skills) => updateProfile({ skills })}
              />
            </AppCard>

            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Portfolio Links
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

            <AppCard className="p-6">
              <DangerActions />
            </AppCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}