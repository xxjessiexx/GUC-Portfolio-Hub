import { useMemo, useState } from "react";
import {
  Building2,
  Download,
  Eye,
  FileCheck2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import {
  AdminReviewDrawer,
  DrawerSection,
} from "@/components/adminModule/AdminReviewDrawer";
import { EmployerDocuments } from "@/components/adminModule/AdminOverviewPanels";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

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

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
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

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(
    () =>
      employers.filter((employer) => {
        const haystack =
          `${employer.companyName} ${employer.email} ${employer.industry} ${employer.location}`.toLowerCase();

        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "all" || employer.status === status)
        );
      }),
    [employers, search, status]
  );

  const openDecision = (employer, nextStatus) => {
    setDecision({ employer, nextStatus });
    setNote("");
  };

  const confirmDecision = () => {
    if (decision.nextStatus === "rejected" && !note.trim()) return;

    actions.setEmployerStatus(
      decision.employer.id,
      decision.nextStatus,
      note.trim()
    );

    toast.success(`Employer ${decision.nextStatus}`, {
      description: `${decision.employer.companyName} was marked ${decision.nextStatus}.`,
    });

    setDecision(null);

    setSelectedEmployer((prev) =>
      prev?.id === decision.employer.id
        ? {
            ...prev,
            status: decision.nextStatus,
            reviewNote: note.trim(),
          }
        : prev
    );
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
      render: (employer) => <EmployerDocuments documents={employer.documents} />,
    },
    {
      key: "status",
      label: "Status",
      render: (employer) => <AdminStatusBadge status={employer.status} />,
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
              onClick: () => setSelectedEmployer(employer),
            },
            {
              label: "Approve employer",
              icon: FileCheck2,
              onClick: () => openDecision(employer, "approved"),
            },
            {
              label: "Reject employer",
              icon: XCircle,
              danger: true,
              onClick: () => openDecision(employer, "rejected"),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Employer Verification"
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
        onToggleFilters={() => setFiltersOpen((current) => !current)}
        filterTitle="Filter employers"
        onClearFilters={() => setStatus("all")}
      >
        <FilterSelect
          value={`Status: ${status === "all" ? "All statuses" : status}`}
          onChange={(value) =>
            setStatus(
              value.replace("Status: ", "") === "All statuses"
                ? "all"
                : value.replace("Status: ", "")
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

      <AdminReviewDrawer
        open={Boolean(selectedEmployer)}
        onClose={() => setSelectedEmployer(null)}
        eyebrow="Company review"
        title={selectedEmployer?.companyName}
        subtitle={
          selectedEmployer
            ? `${selectedEmployer.industry} • ${selectedEmployer.location} • submitted ${selectedEmployer.submittedAt}`
            : ""
        }
        status={selectedEmployer?.status}
        footer={
          selectedEmployer ? (
            <div className="flex flex-wrap justify-end gap-2">
              <AppButton
                variant="glass"
                onClick={() =>
                  selectedEmployer.documents?.[0] &&
                  downloadDocument(selectedEmployer, selectedEmployer.documents[0])
                }
              >
                <Download className="size-4" />
                Download first doc
              </AppButton>

              <AppButton
                variant="brand"
                onClick={() => openDecision(selectedEmployer, "approved")}
              >
                Approve company
              </AppButton>

              <AppButton
                variant="danger"
                onClick={() => openDecision(selectedEmployer, "rejected")}
              >
                Reject company
              </AppButton>
            </div>
          ) : null
        }
      >
        {selectedEmployer ? (
          <div className="space-y-4">
            <DrawerSection title="Profile">
              <p>{selectedEmployer.biography}</p>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <b>Contact:</b> {selectedEmployer.contactName}
                </p>
                <p>
                  <b>Email:</b> {selectedEmployer.email}
                </p>
                <p>
                  <b>Industry:</b> {selectedEmployer.industry}
                </p>
                <p>
                  <b>Location:</b> {selectedEmployer.location}
                </p>
              </div>
            </DrawerSection>

            <DrawerSection title="Uploaded documents">
              <div className="space-y-3">
                {selectedEmployer.documents?.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border-blue)] bg-white/70 p-3"
                  >
                    <div>
                      <p className="font-black">{document.name}</p>
                      <p className="text-xs text-[color:var(--muted)]">
                        {document.type} • {document.status}
                      </p>
                    </div>

                    <AppButton
                      variant="glass"
                      size="sm"
                      onClick={() =>
                        downloadDocument(selectedEmployer, document)
                      }
                    >
                      <Download className="size-4" />
                      Download
                    </AppButton>
                  </div>
                ))}
              </div>
            </DrawerSection>

            <DrawerSection title="Latest admin note">
              {selectedEmployer.reviewNote || "No admin decision note yet."}
            </DrawerSection>
          </div>
        ) : null}
      </AdminReviewDrawer>

      <AdminActionDialog
        open={Boolean(decision)}
        tone={decision?.nextStatus === "rejected" ? "danger" : "brand"}
        title={
          decision?.nextStatus === "rejected"
            ? "Reject employer application?"
            : "Approve employer application?"
        }
        description={
          decision
            ? `${decision.employer.companyName} will be marked ${decision.nextStatus}. This decision will appear in recent admin activity.`
            : ""
        }
        confirmLabel={
          decision?.nextStatus === "rejected"
            ? "Reject application"
            : "Approve application"
        }
        noteRequired={decision?.nextStatus === "rejected"}
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </AdminPageShell>
  );
}