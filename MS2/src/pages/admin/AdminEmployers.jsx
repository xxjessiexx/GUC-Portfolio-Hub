import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Download,
  Eye,
  FileCheck2,
  XCircle,
} from "lucide-react";

import SideToast from "@/components/ui/SideToast";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import { getCollection } from "@/data/demoStore";

const employerGrid =
  "lg:grid-cols-[1.5fr_1.2fr_1.7fr_0.8fr_0.7fr]";

function downloadDocument(employer, document) {
  const content = [
    "GUC Portfolio Hub - Employer Verification Document",
    `Company: ${employer.companyName}`,
    `Contact: ${employer.contactName}`,
    `Email: ${employer.email}`,
    `Document: ${document.name}`,
    `Type: ${document.type}`,
    `Status: ${document.status}`,
    "",
    "Prototype note: this simulates document download for the MS2 frontend demo.",
  ].join("\n");

  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;

  link.download = `${employer.companyName
    .replace(/\s+/g, "-")
    .toLowerCase()}-${document.name.replace(/\s+/g, "-")}.txt`;

  link.click();

  URL.revokeObjectURL(url);
}

export default function AdminEmployers() {
  const { employers, actions } = useAdminModuleData();

  const dbEmployers = useMemo(() => {
    return (getCollection("users") || [])
      .filter((user) => user.role === "employer")
      .map((user) => ({
        id: user.id,
        companyName: user.companyName || user.name,
        contactName: user.position || user.name,
        email: user.email,
        biography:
          user.companyBio ||
          user.bio ||
          "No company bio added.",
        industry: user.industry || "Not specified",
        location:
          typeof user.location === "string"
            ? user.location
            : user.location?.label || "Not specified",
        status:
          user.verificationStatus ||
          user.status ||
          "pending",
        submittedAt: user.createdAt || "Seeded",
        documents: user.uploadedDocuments || [],
      }));
  }, []);

  const displayedEmployers =
    dbEmployers.length > 0 ? dbEmployers : employers;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedEmployer, setSelectedEmployer] =
    useState(null);

  const [previewDocument, setPreviewDocument] =
    useState(null);

  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [openMenu, setOpenMenu] =
    useState(null);

  const [toastData, setToastData] = useState({
    open: false,
    title: "",
    description: "",
    type: "success",
  });

  useEffect(() => {
    if (!toastData.open) return;

    const timer = setTimeout(() => {
      setToastData((current) => ({
        ...current,
        open: false,
      }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toastData.open]);

  const filtered = useMemo(
    () =>
      displayedEmployers.filter((employer) => {
        const haystack =
          `${employer.companyName} ${employer.email} ${employer.industry} ${employer.location}`.toLowerCase();

        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "all" ||
            employer.status === status)
        );
      }),
    [displayedEmployers, search, status]
  );

  const openDecision = (
    employer,
    nextStatus
  ) => {
    setDecision({
      employer,
      nextStatus,
    });

    setNote("");
  };

  const confirmDecision = () => {
    if (!decision) return;

    if (
      decision.nextStatus === "rejected" &&
      !note.trim()
    ) {
      return;
    }

    actions.setEmployerStatus(
      decision.employer.id,
      decision.nextStatus,
      note.trim()
    );

    setToastData({
      open: true,
      title:
        decision.nextStatus === "approved"
          ? "Employer approved"
          : "Employer rejected",
      description: `${decision.employer.companyName} was marked ${decision.nextStatus}.`,
      type: "success",
    });

    setSelectedEmployer((prev) =>
      prev?.id === decision.employer.id
        ? {
            ...prev,
            status: decision.nextStatus,
            reviewNote: note.trim(),
          }
        : prev
    );

    setDecision(null);
    setNote("");
  };

  const employerColumns = [
    {
      key: "company",
      label: "Company",
      render: (employer) => (
        <div>
          <p className="font-black text-[color:var(--ink)]">
            {employer.companyName}
          </p>

          <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[color:var(--muted)]">
            {employer.biography}
          </p>
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact",
      render: (employer) => (
        <div>
          <p className="text-sm font-black text-[color:var(--ink)]">
            {employer.contactName}
          </p>

          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {employer.email}
          </p>
        </div>
      ),
    },

    {
      key: "documents",
      label: "Documents",
      render: (employer) => (
        <div className="space-y-2">
          {(employer.documents || []).length >
          0 ? (
            employer.documents.map(
              (document) => (
                <div
                  key={document.id}
                  className="
                    rounded-2xl
                    border
                    border-[color:var(--border-blue)]
                    bg-[var(--surface-soft)]
                    px-3
                    py-2
                  "
                >
                  <p className="text-sm font-black text-[color:var(--ink)]">
                    {document.name}
                  </p>

                  <p className="text-xs font-semibold text-[color:var(--muted)]">
                    {document.type} •{" "}
                    {document.status}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <AppButton
                      variant="glass"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();

                        setPreviewDocument({
                          employer,
                          document,
                        });
                      }}
                    >
                      <Eye className="size-4" />
                      Preview
                    </AppButton>

                    <AppButton
                      variant="glass"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();

                        downloadDocument(
                          employer,
                          document
                        );
                      }}
                    >
                      <Download className="size-4" />
                      Download
                    </AppButton>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              No documents uploaded
            </p>
          )}
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (employer) => (
        <AdminStatusBadge
          status={employer.status}
        />
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (employer) => (
        <AdminTableActions
          rowId={employer.id}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          actions={[
            {
              label: "Review employer",
              icon: Eye,
              onClick: () =>
                setSelectedEmployer(employer),
            },

            ...(employer.status !== "approved"
              ? [
                  {
                    label: "Approve employer",
                    icon: FileCheck2,
                    success: true,
                    onClick: () =>
                      openDecision(
                        employer,
                        "approved"
                      ),
                  },
                ]
              : []),

            ...(employer.status !== "rejected"
              ? [
                  {
                    label: "Reject employer",
                    icon: XCircle,
                    danger: true,
                    onClick: () =>
                      openDecision(
                        employer,
                        "rejected"
                      ),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPageShell>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        
        title="Company Applications"
        description="Review company details, inspect documents, record a decision reason, and approve or reject employer accounts."
        icon={Building2}
      />

      <SearchFilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search employers..."
        showFilters
        filtersOpen={filtersOpen}
        onToggleFilters={() =>
          setFiltersOpen(
            (current) => !current
          )
        }
        filterTitle="Filter employers"
        onClearFilters={() =>
          setStatus("all")
        }
      >
        <FilterSelect
          value={`Status: ${
            status === "all"
              ? "All statuses"
              : status
          }`}
          onChange={(value) =>
            setStatus(
              value.replace(
                "Status: ",
                ""
              ) === "All statuses"
                ? "all"
                : value.replace(
                    "Status: ",
                    ""
                  )
            )
          }
          options={[
            "Status: All statuses",
            "Status: pending",
            "Status: needs-review",
            "Status: approved",
            "Status: rejected",
          ]}
        />
      </SearchFilterToolbar>

      <AdminGridTable
        columns={employerColumns}
        rows={filtered}
        gridTemplate={employerGrid}
        emptyMessage="No employers found"
      />

      {/* Employer Review Modal */}
      {selectedEmployer ? (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-start
            justify-center
            overflow-y-auto
            bg-[#0b1721]/45
            px-4
            pt-32
            pb-8
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-4xl
              rounded-[32px]
              border
              border-[#D7E1E8]
              bg-[var(--card-bg-strong)]
              p-6
              shadow-[0_28px_90px_rgba(16,32,45,0.24)]
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-[color:var(--primary)]
                  "
                >
                  Employer Review
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-[color:var(--ink)]
                  "
                >
                  {
                    selectedEmployer.companyName
                  }
                </h2>

                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  {selectedEmployer.industry} •{" "}
                  {
                    selectedEmployer.location
                  }
                </p>
              </div>

              <AppButton
                variant="ghost"
                onClick={() =>
                  setSelectedEmployer(null)
                }
                className="h-11 w-11 rounded-full px-0"
              >
                ✕
              </AppButton>
            </div>

            <div className="mt-6 space-y-5">
              {/* Profile */}
              <div
                className="
                  rounded-3xl
                  border
                  border-[color:var(--border-blue)]
                  bg-[var(--surface-soft)]
                  p-5
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-[color:var(--muted)]
                  "
                >
                  Profile
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    leading-7
                    text-[color:var(--ink)]
                  "
                >
                  {
                    selectedEmployer.biography
                  }
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    <span className="font-black text-[color:var(--ink)]">
                      Contact:
                    </span>{" "}
                    {
                      selectedEmployer.contactName
                    }
                  </p>

                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    <span className="font-black text-[color:var(--ink)]">
                      Email:
                    </span>{" "}
                    {
                      selectedEmployer.email
                    }
                  </p>

                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    <span className="font-black text-[color:var(--ink)]">
                      Industry:
                    </span>{" "}
                    {
                      selectedEmployer.industry
                    }
                  </p>

                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    <span className="font-black text-[color:var(--ink)]">
                      Location:
                    </span>{" "}
                    {
                      selectedEmployer.location
                    }
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div
                className="
                  rounded-3xl
                  border
                  border-[color:var(--border-blue)]
                  bg-[var(--surface-soft)]
                  p-5
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-[color:var(--muted)]
                  "
                >
                  Uploaded Documents
                </p>

                <div className="mt-4 space-y-3">
                  {selectedEmployer
                    .documents?.length >
                  0 ? (
                    selectedEmployer.documents.map(
                      (document) => (
                        <div
                          key={
                            document.id
                          }
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-2xl
                            border
                            border-[color:var(--border-blue)]
                            bg-[var(--card-bg-strong)]
                            p-4
                          "
                        >
                          <div>
                            <p className="font-black text-[color:var(--ink)]">
                              {
                                document.name
                              }
                            </p>

                            <p className="text-xs font-semibold text-[color:var(--muted)]">
                              {
                                document.type
                              }{" "}
                              •{" "}
                              {
                                document.status
                              }
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <AppButton
                              variant="glass"
                              size="sm"
                              onClick={() =>
                                setPreviewDocument(
                                  {
                                    employer:
                                      selectedEmployer,
                                    document,
                                  }
                                )
                              }
                            >
                              <Eye className="size-4" />
                              Preview
                            </AppButton>

                            <AppButton
                              variant="glass"
                              size="sm"
                              onClick={() =>
                                downloadDocument(
                                  selectedEmployer,
                                  document
                                )
                              }
                            >
                              <Download className="size-4" />
                              Download
                            </AppButton>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      No documents uploaded.
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-3">
                <AppButton
                  variant="glass"
                  onClick={() =>
                    setSelectedEmployer(null)
                  }
                >
                  Close
                </AppButton>

                {selectedEmployer.status !== "rejected" ? (
                  <AppButton
                    variant="danger"
                    onClick={() => {
                      const employer = selectedEmployer;
                      setSelectedEmployer(null);
                      openDecision(
                        employer,
                        "rejected"
                      );
                    }}
                  >
                    Reject company
                  </AppButton>
                ) : null}

                {selectedEmployer.status !== "approved" ? (
                  <AppButton
                    variant="brand"
                    className="bg-gradient-to-r from-[#355872] via-[#4f7fa3] to-[#7AAACE] text-white shadow-[0_14px_32px_rgba(53,88,114,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(53,88,114,0.28)]"
                    onClick={() => {
                      const employer = selectedEmployer;
                      setSelectedEmployer(null);
                      openDecision(
                        employer,
                        "approved"
                      );
                    }}
                  >
                    Approve company
                  </AppButton>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Document Preview Modal */}
      {previewDocument ? (
        <div
          className="
            fixed
            inset-0
            z-[10000]
            flex
            items-start
            justify-center
            overflow-y-auto
            bg-[#0b1721]/45
            px-4
            pt-28
            pb-8
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-4xl
              overflow-hidden
              rounded-[32px]
              border
              border-[#D7E1E8]
              bg-[var(--card-bg-strong)]
              shadow-[0_28px_90px_rgba(16,32,45,0.24)]
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-[color:var(--border-blue)]
                bg-[var(--surface-soft)]
                p-5
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-[color:var(--primary)]
                  "
                >
                  Document Preview
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-[color:var(--ink)]
                  "
                >
                  {
                    previewDocument
                      .document.name
                  }
                </h2>

                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  {
                    previewDocument
                      .employer.companyName
                  }{" "}
                  •{" "}
                  {previewDocument
                    .document.type ||
                    "Document"}
                </p>
              </div>

              <AppButton
                variant="ghost"
                onClick={() =>
                  setPreviewDocument(null)
                }
                className="h-11 w-11 rounded-full px-0"
              >
                ✕
              </AppButton>
            </div>

            <div className="bg-[var(--surface-soft)] p-6">
              <div
                className="
                  mx-auto
                  min-h-[560px]
                  max-w-3xl
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  p-10
                  shadow-lg
                "
              >
                <div className="border-b border-slate-200 pb-5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                    GUC Portfolio Hub
                  </p>

                  <h3 className="mt-3 text-3xl font-black text-slate-900">
                    {
                      previewDocument
                        .document.name
                    }
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {previewDocument
                      .document.type ||
                      "Verification document"}{" "}
                    •{" "}
                    {previewDocument
                      .document.status ||
                      "uploaded"}
                  </p>
                </div>

                <div className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
                  <p>
                    <b>Company:</b>{" "}
                    {
                      previewDocument
                        .employer
                        .companyName
                    }
                  </p>

                  <p>
                    <b>Contact:</b>{" "}
                    {
                      previewDocument
                        .employer
                        .contactName
                    }
                  </p>

                  <p>
                    <b>Email:</b>{" "}
                    {
                      previewDocument
                        .employer.email
                    }
                  </p>

                  <p>
                    <b>Document Type:</b>{" "}
                    {previewDocument
                      .document.type ||
                      "Verification document"}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {previewDocument
                      .document.status ||
                      "uploaded"}
                  </p>

                  <div
                    className="
                      mt-8
                      rounded-xl
                      border
                      border-dashed
                      border-slate-300
                      bg-slate-50
                      p-6
                      text-center
                    "
                  >
                    Prototype PDF preview
                    content
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Confirmation Dialog */}
      <AdminActionDialog
        open={Boolean(decision)}
        tone={
          decision?.nextStatus ===
          "rejected"
            ? "danger"
            : "brand"
        }
        title={
          decision?.nextStatus ===
          "rejected"
            ? "Reject employer application?"
            : "Approve employer application?"
        }
        description={
          decision
            ? `${decision.employer.companyName} will be marked ${decision.nextStatus}. This decision will appear in recent admin activity.`
            : ""
        }
        confirmLabel={
          decision?.nextStatus ===
          "rejected"
            ? "Reject application"
            : "Approve application"
        }
        noteRequired={
          decision?.nextStatus ===
          "rejected"
        }
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => {
          setDecision(null);
          setNote("");
        }}
        onConfirm={confirmDecision}
      />
      </div>
      </main>

      {/* Custom Toast */}
      <SideToast
        open={toastData.open}
        title={toastData.title}
        description={toastData.description}
        type={toastData.type}
        onClose={() =>
          setToastData((current) => ({
            ...current,
            open: false,
          }))
        }
      />
    </AdminPageShell>
  );
}