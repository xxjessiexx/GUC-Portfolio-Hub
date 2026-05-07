import {
  Building2,
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

export default function EmployerProfileSummary({ profile, updateProfile }) {
  const companyName = profile.companyName || "NexaTech Solutions";
  const industry = profile.industry || "Information Technology";
  const companySize = profile.companySize || "51–200 employees";
  const headquarters = profile.headquarters || "New Cairo, Egypt";
  const verificationStatus = profile.verificationStatus || "Verified";

  return (
    <div className="text-center">
      <ProfilePhotoUploader
        image={profile.image}
        setImage={(image) => updateProfile({ image })}
        name={companyName}
      />

      <h2 className="mt-4 text-2xl font-black text-[color:var(--ink)]">
        {companyName}
      </h2>

      <p className="text-sm font-semibold text-[color:var(--muted)]">
        Employer Account
      </p>

      <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[color:var(--muted)]">
        {profile.companyBio ||
          "Connecting students with meaningful internship opportunities."}
      </p>

      <div className="my-6 h-px bg-[color:var(--primary)]/10" />

      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <BriefcaseBusiness className="h-4 w-4 text-[color:var(--primary)]" />
            Industry
          </span>
          <span className="text-right text-sm font-semibold text-[color:var(--muted)]">
            {industry}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <Users className="h-4 w-4 text-[color:var(--primary)]" />
            Company Size
          </span>
          <span className="text-right text-sm font-semibold text-[color:var(--muted)]">
            {companySize}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <MapPin className="h-4 w-4 text-[color:var(--primary)]" />
            Headquarters
          </span>
          <span className="text-right text-sm font-semibold text-[color:var(--muted)]">
            {headquarters}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-black text-[color:var(--dark)]">
            <ShieldCheck className="h-4 w-4 text-[color:var(--primary)]" />
            Verification
          </span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
            {verificationStatus}
          </span>
        </div>
      </div>
    </div>
  );
}