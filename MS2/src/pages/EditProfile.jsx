import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import ProfilePhotoUploader from "@/components/profile/ProfilePhotoUploader";
import EditableProfileField from "@/components/profile/EditableProfileField";
import ProfileSelectField from "@/components/profile/ProfileSelectField";

import { notifications } from "@/data/studentDashboardData";
import { useUserProfile } from "@/context/UserProfileContext";

export default function EditProfile() {
  const { profile, updateProfile } = useUserProfile();

  const semesterOptions = Array.from({ length: 10 }, (_, index) =>
    String(index + 1)
  );

  const facultyOptions = ["Faculty of Engineering"];
  const majorOptions = ["Computer Science"];

  return (
    <DashboardLayout notifications={notifications}>
      <div className="space-y-6">
        <SectionHeader
          title="Profile Information"
          subtitle="Manage your personal information and portfolio details."
        />

        <AppCard className="p-8 text-center">
          <ProfilePhotoUploader
            image={profile.image}
            setImage={(image) => updateProfile({ image })}
            name={profile.name}
          />

          <h2 className="mt-4 text-2xl font-black text-[color:var(--ink)]">
            {profile.name}
          </h2>

          <p className="text-sm font-semibold text-[color:var(--muted)]">
            {profile.role}
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
            {profile.bio}
          </p>
        </AppCard>

        <AppCard className="p-6">
          <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
            Basic Information
          </h3>

          <EditableProfileField
            label="Full Name"
            value={profile.name}
            onSave={(value) => updateProfile({ name: value })}
          />

          <EditableProfileField
            label="Email"
            value={profile.email}
            onSave={(value) => updateProfile({ email: value })}
          />

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
      </div>
    </DashboardLayout>
  );
}