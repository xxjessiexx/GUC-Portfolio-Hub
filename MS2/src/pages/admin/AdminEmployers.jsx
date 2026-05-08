import { useMemo, useState } from "react";
import { Building2, Download, FileCheck2 } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { EmployerDocuments } from "@/components/adminModule/AdminOverviewPanels";
import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminEmployers() {
  const { employers, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => employers.filter((employer) => {
    const haystack = `${employer.companyName} ${employer.email} ${employer.industry} ${employer.location}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || employer.status === status);
  }), [employers, search, status]);

  const downloadDocument = (name) => alert(`Demo download: ${name}`);

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Employer verification" title="Company applications" description="Review company details, verify uploaded documents, and approve or reject employer accounts." icon={Building2} />
      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["pending", "needs-review", "approved", "rejected"]} />
      <AdminTable
        rows={filtered}
        columns={[
          { key: "company", label: "Company", render: (row) => <div className="max-w-xs"><p className="font-black">{row.companyName}</p><p className="text-xs leading-5 text-[color:var(--muted)]">{row.biography}</p></div> },
          { key: "contact", label: "Contact", render: (row) => <div><p>{row.contactName}</p><p className="text-xs text-[color:var(--muted)]">{row.email}</p></div> },
          { key: "documents", label: "Documents", render: (row) => <div className="min-w-[260px]"><EmployerDocuments documents={row.documents} /></div> },
          { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
          { key: "actions", label: "Actions", render: (row) => (
            <div className="flex flex-wrap gap-2">
              <AppButton variant="glass" size="sm" onClick={() => row.documents?.[0] && downloadDocument(row.documents[0].name)}><Download className="h-4 w-4" />Download</AppButton>
              <AppButton variant="brand" size="sm" onClick={() => actions.setEmployerStatus(row.id, "approved")}><FileCheck2 className="h-4 w-4" />Approve</AppButton>
              <AppButton variant="danger" size="sm" onClick={() => actions.setEmployerStatus(row.id, "rejected")}>Reject</AppButton>
            </div>
          )},
        ]}
      />
    </AdminPageShell>
  );
}
