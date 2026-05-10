import { useMemo, useState } from "react";
import { Eye, FileWarning, CheckCircle2, XCircle } from "lucide-react";
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

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const projectsGrid =
  "lg:grid-cols-[1.5fr_1.7fr_0.9fr_0.8fr_0.8fr_0.7fr]";

export default function AdminFlaggedProjects() {
  const { flaggedProjects, appeals, actions } = useAdminModuleData();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(
    () =>
      flaggedProjects.filter((project) => {
        const haystack =
          `${project.title} ${project.student} ${project.course} ${project.reason}`.toLowerCase();

        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "all" || project.status === status)
        );
      }),
    [flaggedProjects, search, status]
  );

  const openProjectDecision = (project, active) => {
    setDecision({ type: "project", project, active });
    setNote("");
  };

  const openAppealDecision = (appeal, nextStatus) => {
    setDecision({ type: "appeal", appeal, nextStatus });
    setNote("");
  };

  const confirmDecision = () => {
    const projectNeedsNote =
      decision.type === "project" && !decision.active && !note.trim();

    const appealNeedsNote =
      decision.type === "appeal" &&
      decision.nextStatus === "rejected" &&
      !note.trim();

    if (projectNeedsNote || appealNeedsNote) return;

    if (decision.type === "project") {
      actions.setProjectActive(decision.project.id, decision.active, note.trim());

      toast.success(
        decision.active ? "Project activated" : "Project deactivated"
      );

      setSelectedProject((prev) =>
        prev?.id === decision.project.id
          ? {
              ...prev,
              active: decision.active,
              adminNote: note.trim(),
              status: decision.active ? "resolved" : "flagged",
            }
          : prev
      );
    } else {
      actions.setAppealStatus(decision.appeal.id, decision.nextStatus, note.trim());
      toast.success(`Appeal ${decision.nextStatus}`);
    }

    setDecision(null);
  };

  const projectColumns = [
    {
      key: "title",
      label: "Project",
      render: (project) => (
        <div>
          <p className="font-black text-[color:var(--ink)]">{project.title}</p>
          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {project.student} • {project.course}
          </p>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (project) => (
        <p className="line-clamp-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
          {project.reason}
        </p>
      ),
    },
    {
      key: "flaggedBy",
      label: "Flagged by",
      render: (project) => (
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {project.flaggedBy}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (project) => <AdminStatusBadge status={project.status} />,
    },
    {
      key: "active",
      label: "Project",
      render: (project) => (
        <AdminStatusBadge status={project.active ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (project) => (
        <AdminTableActions
          rowId={project.id}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          actions={[
            {
              label: "Review project",
              icon: Eye,
              onClick: () => setSelectedProject(project),
            },
            {
              label: "Activate project",
              icon: CheckCircle2,
              onClick: () => openProjectDecision(project, true),
            },
            {
              label: "Deactivate project",
              icon: XCircle,
              danger: true,
              onClick: () => openProjectDecision(project, false),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Safety & Moderation"
        title="Flagged Projects and Appeals"
        description="Review flagged projects, inspect appeal messages, record decisions, and activate or deactivate projects with confirmation notes."
        icon={FileWarning}
      />

      <SearchFilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search flagged projects..."
        showFilters
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((current) => !current)}
        filterTitle="Filter flagged projects"
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
            "Status: flagged",
            "Status: under-review",
            "Status: resolved",
          ]}
        />
      </SearchFilterToolbar>

      <AdminGridTable
        columns={projectColumns}
        rows={filtered}
        gridTemplate={projectsGrid}
        emptyMessage="No flagged projects found"
      />

      <AppCard className="p-6">
        <SectionHeader
          eyebrow="Student Appeals"
          title="Appeal Inbox"
          subtitle="Appeals submitted by students for deactivated or flagged projects."
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {appeals.map((appeal) => (
            <div
              key={appeal.id}
              className="rounded-3xl border border-white/70 bg-white/55 p-5 shadow-[0_14px_35px_rgba(53,88,114,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-[color:var(--ink)]">
                    {appeal.student}
                  </p>
                  <p className="text-xs font-semibold text-[color:var(--muted)]">
                    {appeal.submittedAt}
                  </p>
                </div>

                <AdminStatusBadge status={appeal.status} />
              </div>

              <p className="mt-4 text-sm font-semibold leading-7 text-[color:var(--muted)]">
                {appeal.message}
              </p>

              {appeal.decisionNote ? (
                <p className="mt-3 rounded-2xl bg-white/65 p-3 text-xs font-bold leading-5 text-[color:var(--muted)]">
                  Admin note: {appeal.decisionNote}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <AppButton
                  variant="primary"
                  size="sm"
                  className="bg-[color:var(--primary)] text-white hover:opacity-90"
                  onClick={() => openAppealDecision(appeal, "accepted")}
                >
                  Accept appeal
                </AppButton>

                <AppButton
                  variant="danger"
                  size="sm"
                  onClick={() => openAppealDecision(appeal, "rejected")}
                >
                  Reject
                </AppButton>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      <AdminReviewDrawer
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        eyebrow="Project moderation"
        title={selectedProject?.title}
        subtitle={
          selectedProject
            ? `${selectedProject.student} • ${selectedProject.course}`
            : ""
        }
        status={selectedProject?.status}
        footer={
          selectedProject ? (
            <div className="flex flex-wrap justify-end gap-2">
              <AppButton
                variant="brand"
                onClick={() => openProjectDecision(selectedProject, true)}
              >
                Activate project
              </AppButton>

              <AppButton
                variant="danger"
                onClick={() => openProjectDecision(selectedProject, false)}
              >
                Deactivate project
              </AppButton>
            </div>
          ) : null
        }
      >
        {selectedProject ? (
          <div className="space-y-4">
            <DrawerSection title="Flag reason">
              {selectedProject.reason}
            </DrawerSection>

            <DrawerSection title="Flag source">
              {selectedProject.flaggedBy}
            </DrawerSection>

            <DrawerSection title="Project state">
              <div className="flex gap-2">
                <AdminStatusBadge
                  status={selectedProject.active ? "active" : "inactive"}
                />
                <AdminStatusBadge status={selectedProject.appealStatus || "none"} />
              </div>
            </DrawerSection>

            <DrawerSection title="Latest admin note">
              {selectedProject.adminNote || "No admin note yet."}
            </DrawerSection>
          </div>
        ) : null}
      </AdminReviewDrawer>

      <AdminActionDialog
        open={Boolean(decision)}
        tone={
          (decision?.type === "project" && !decision?.active) ||
          decision?.nextStatus === "rejected"
            ? "danger"
            : "brand"
        }
        title={
          decision?.type === "appeal"
            ? `${
                decision?.nextStatus === "accepted" ? "Accept" : "Reject"
              } this appeal?`
            : `${decision?.active ? "Activate" : "Deactivate"} this project?`
        }
        description={
          decision?.type === "appeal"
            ? decision?.appeal?.message
            : decision?.project?.reason
        }
        confirmLabel={
          decision?.type === "appeal"
            ? `${
                decision?.nextStatus === "accepted" ? "Accept" : "Reject"
              } appeal`
            : `${decision?.active ? "Activate" : "Deactivate"} project`
        }
        noteRequired={
          (decision?.type === "project" && !decision?.active) ||
          decision?.nextStatus === "rejected"
        }
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </AdminPageShell>
  );
}