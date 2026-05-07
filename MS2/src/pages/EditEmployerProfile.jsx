import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MapPin,
  MoreVertical,
  Trash2,
  Upload,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import EmployerProfileSummary from "@/components/profile/EmployerProfileSummary";
import EditableProfileField from "@/components/profile/EditableProfileField";
import DangerActions from "@/components/profile/DangerActions";

import { notifications } from "@/data/studentDashboardData";
import { useUserProfile } from "@/context/UserProfileContext";

export default function EditEmployerProfile() {
  const { profile, updateProfile } = useUserProfile();
  const [openDocMenuIndex, setOpenDocMenuIndex] = useState(null);

  useEffect(() => {
    const closeMenu = () => setOpenDocMenuIndex(null);
    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const companyName = profile.companyName || "NexaTech Solutions";
  const companyEmail = profile.companyEmail || "info@nexatechsolutions.com";
  const contactEmail = profile.contactEmail || "hr@nexatechsolutions.com";
  const contactPhone = profile.contactPhone || "+20 112 345 6789";
  const website = profile.website || "https://www.nexatechsolutions.com";
  const industry = profile.industry || "Information Technology";
  const companySize = profile.companySize || "51–200 employees";
  const headquarters = profile.headquarters || "New Cairo, Egypt";

  const address =
    profile.address ||
    "Building 90, AUC Avenue, New Cairo 11835, Cairo Governorate, Egypt";

  const googleMapsUrl =
    profile.googleMapsUrl ||
    "https://www.google.com/maps/search/New+Cairo+Egypt";

  const companyBio =
    profile.companyBio ||
    "NexaTech Solutions is a forward-thinking technology company specializing in custom software development, cloud solutions, and data analytics. We are passionate about innovation and dedicated to empowering the next generation of tech professionals through mentorship and internship opportunities.";

  const documents = profile.verificationDocuments || [
    {
      name: "Tax Certificate.pdf",
      details: "Uploaded on May 8, 2025 • 245 KB",
      status: "Verified",
      fileUrl: null,
    },
    {
      name: "Commercial Register.pdf",
      details: "Uploaded on May 8, 2025 • 312 KB",
      status: "Verified",
      fileUrl: null,
    },
  ];

  const updateDocuments = (updatedDocuments) => {
    updateProfile({ verificationDocuments: updatedDocuments });
  };

  const handleUploadDocument = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newDocument = {
      name: file.name,
      details: `Uploaded now • ${(file.size / 1024).toFixed(0)} KB`,
      status: "Pending",
      fileUrl: URL.createObjectURL(file),
    };

    updateDocuments([...documents, newDocument]);
    event.target.value = "";
  };

  const handleDownloadDocument = (doc) => {
    if (!doc.fileUrl) return;

    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  };

  const removeDocument = (index) => {
    updateDocuments(documents.filter((_, docIndex) => docIndex !== index));
    setOpenDocMenuIndex(null);
  };

  const markDocumentStatus = (index, status) => {
    const updatedDocuments = documents.map((doc, docIndex) =>
      docIndex === index ? { ...doc, status } : doc
    );

    updateDocuments(updatedDocuments);
    setOpenDocMenuIndex(null);
  };

  return (
    <DashboardLayout notifications={notifications}>
      <div className="space-y-6">
        <SectionHeader
          title="Company Profile Information"
          subtitle="Manage your company profile, contact information, verification documents, and location."
        />

        <div className="grid items-start gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <AppCard className="p-8">
            <EmployerProfileSummary
              profile={{
                ...profile,
                companyName,
                industry,
                companySize,
                headquarters,
                companyBio,
                verificationStatus: profile.verificationStatus || "Verified",
              }}
              updateProfile={updateProfile}
            />
          </AppCard>

          <div className="min-w-0 space-y-6">
            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Company Information
              </h3>

              <EditableProfileField
                label="Company Name"
                value={companyName}
                onSave={(value) => updateProfile({ companyName: value })}
              />

              <EditableProfileField
                label="Company Email"
                value={companyEmail}
                onSave={(value) => updateProfile({ companyEmail: value })}
              />

              <EditableProfileField
                label="Contact Email"
                value={contactEmail}
                onSave={(value) => updateProfile({ contactEmail: value })}
              />

              <EditableProfileField
                label="Contact Phone"
                value={contactPhone}
                onSave={(value) => updateProfile({ contactPhone: value })}
              />

              <EditableProfileField
                label="Website"
                value={website}
                onSave={(value) => updateProfile({ website: value })}
              />

              <EditableProfileField
                label="Industry"
                value={industry}
                onSave={(value) => updateProfile({ industry: value })}
              />

              <EditableProfileField
                label="Company Size"
                value={companySize}
                onSave={(value) => updateProfile({ companySize: value })}
              />

              <EditableProfileField
                label="Address"
                value={address}
                onSave={(value) => updateProfile({ address: value })}
              />
            </AppCard>

            <AppCard className="p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Company Biography
              </h3>

              <EditableProfileField
                label="Biography"
                value={companyBio}
                onSave={(value) => updateProfile({ companyBio: value })}
              />
            </AppCard>

            <AppCard className="overflow-hidden p-6">
              <h3 className="mb-4 text-xl font-black text-[color:var(--ink)]">
                Company Location
              </h3>

              <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                <div className="relative min-h-[280px] overflow-hidden rounded-3xl border border-[color:var(--primary)]/10 bg-[#dcecf6]">
                  <div className="absolute inset-0 opacity-70">
                    <div className="absolute left-0 top-12 h-8 w-full rotate-[-8deg] bg-white/70" />
                    <div className="absolute left-0 top-36 h-7 w-full rotate-[12deg] bg-white/60" />
                    <div className="absolute left-20 top-0 h-full w-8 rotate-[18deg] bg-white/60" />
                    <div className="absolute left-56 top-0 h-full w-7 rotate-[-12deg] bg-white/50" />
                    <div className="absolute bottom-10 left-10 h-20 w-32 rounded-full bg-green-200/60" />
                    <div className="absolute right-12 top-14 h-24 w-36 rounded-full bg-green-200/50" />
                    <div className="absolute bottom-8 right-20 h-14 w-14 rounded-full bg-blue-200/70" />
                  </div>

                  <div className="absolute left-8 top-8 rounded-2xl bg-white/95 px-4 py-3 text-sm font-black text-[color:var(--primary)] shadow-sm">
                    <MapPin className="mr-2 inline h-4 w-4" />
                    {headquarters}
                  </div>

                  <div className="absolute left-1/2 top-1/2 max-w-[80%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <MapPin className="mx-auto h-20 w-20 fill-[color:var(--primary)]/20 text-[color:var(--primary)]" />
                    <p className="mt-3 break-words text-2xl font-black text-[color:var(--ink)]">
                      {headquarters}
                    </p>
                  </div>

                  <div className="absolute bottom-5 right-5">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in Google Maps"
                      className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xl font-black text-[color:var(--primary)] shadow transition hover:bg-[color:var(--accent)]/25"
                    >
                      +
                    </a>
                  </div>
                </div>

                <div className="min-w-0 rounded-3xl border border-[color:var(--primary)]/10 bg-white/70 p-5">
                  <p className="break-words text-lg font-black text-[color:var(--ink)]">
                    {headquarters}
                  </p>

                  <p className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                    Selected location
                  </p>

                  <div className="my-5 h-px bg-[color:var(--primary)]/10" />

                  <p className="text-sm font-black text-[color:var(--dark)]">
                    Address
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold leading-6 text-[color:var(--muted)]">
                    {address}
                  </p>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex h-11 items-center justify-center rounded-2xl bg-[color:var(--primary)] px-4 text-sm font-black text-white transition hover:bg-[color:var(--dark)]"
                  >
                    Choose on Google Maps
                  </a>
                </div>
              </div>

              <div className="mt-5">
                    <EditableProfileField
                        label="Google Maps Link"
                        value={googleMapsUrl}
                        onSave={(value) => updateProfile({ googleMapsUrl: value })}
                    />
                    </div>
            </AppCard>

            <AppCard className="p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl font-black text-[color:var(--ink)]">
                  Verification Documents
                </h3>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[color:var(--primary)] px-4 py-2 text-sm font-black text-white transition hover:bg-[color:var(--dark)]">
                  <Upload className="h-4 w-4" />
                  Upload Document

                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleUploadDocument}
                  />
                </label>
              </div>

              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={`${doc.name}-${index}`}
                    className="relative flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 px-4 py-3"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[color:var(--dark)]">
                          {doc.name}
                        </p>
                        <p className="truncate text-xs font-semibold text-[color:var(--muted)]">
                          {doc.details}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          doc.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doc.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(doc)}
                        disabled={!doc.fileUrl}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[color:var(--primary)] transition hover:bg-[color:var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-40"
                        title={
                          doc.fileUrl
                            ? "Download document"
                            : "Demo file not downloadable"
                        }
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenDocMenuIndex(
                            openDocMenuIndex === index ? null : index
                          );
                        }}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[color:var(--muted)] transition hover:bg-[color:var(--accent)]/25"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {openDocMenuIndex === index && (
                      <div
                        onClick={(event) => event.stopPropagation()}
                        className={`absolute right-4 z-50 w-56 rounded-2xl border border-[color:var(--primary)]/10 bg-white p-2 shadow-[0_18px_45px_rgba(44,57,71,0.18)] ${
                          index === documents.length - 1
                            ? "bottom-12"
                            : "top-12"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => markDocumentStatus(index, "Verified")}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as verified
                        </button>

                        <button
                          type="button"
                          onClick={() => markDocumentStatus(index, "Pending")}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-yellow-700 hover:bg-yellow-50"
                        >
                          <Clock className="h-4 w-4" />
                          Mark as pending
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadDocument(doc)}
                          disabled={!doc.fileUrl}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-[color:var(--primary)] hover:bg-[color:var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>

                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove document
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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