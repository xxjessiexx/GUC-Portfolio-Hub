import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ClipboardCheck,
  Eye,
  Link2,
  Unlink,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import {
  AdminReviewDrawer,
  DrawerSection,
} from "@/components/adminModule/AdminReviewDrawer";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

function getRequestCopy(request) {
  const action = String(request?.action || request?.type || "link").toLowerCase().includes("unlink")
    ? "unlink"
    : "link";
  const isUnlink = action === "unlink";
  const courseLabel = request?.course || "this course";
  const instructor = request?.instructor || "This instructor";

  return {
    action,
    isUnlink,
    title: isUnlink ? "Course unlink request" : "Course link request",
    label: isUnlink ? "Unlink request" : "Link request",
    verb: isUnlink ? "unlink from" : "link to",
    approvedPast: isUnlink ? "unlinked from" : "linked to",
    icon: isUnlink ? Unlink : Link2,
    toneClass: isUnlink
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-sky-200 bg-sky-50 text-sky-700",
    sentence: `${instructor} requested to ${isUnlink ? "unlink from" : "link to"} ${courseLabel}.`,
  };
}

function formatDate(value) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleString();
}

function ActionCell({ row, onReview, onApprove, onReject }) {
  const isPending = row.status === "pending";

  return (
    <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
      <AppButton
        size="sm"
        variant="glass"
        className="justify-start xl:justify-center"
        onClick={() => onReview(row)}
      >
        <Eye className="size-4" />
        Review
      </AppButton>

      <AppButton
        size="sm"
        variant="brand"
        className="justify-start xl:justify-center"
        disabled={!isPending}
        onClick={() => onApprove(row)}
      >
        <Check className="size-4" />
        Approve
      </AppButton>

      <AppButton
        size="sm"
        variant="danger"
        className="justify-start xl:justify-center"
        disabled={!isPending}
        onClick={() => onReject(row)}
      >
        <X className="size-4" />
        Reject
      </AppButton>
    </div>
  );
}

export default function AdminLinkRequests() {
  const { linkRequests, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return linkRequests.filter((request) => {
      const copy = getRequestCopy(request);
      const haystack = [
        request.instructor,
        request.email,
        request.course,
        request.requestedCourseCode,
        request.requestedCourseName,
        copy.label,
        request.reason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        haystack.includes(normalizedSearch) &&
        (status === "all" || request.status === status)
      );
    });
  }, [linkRequests, search, status]);

  const pendingRequests = linkRequests.filter(
    (request) => request.status === "pending"
  );

  const openDecision = (request, nextStatus) => {
    if (request.status !== "pending") return;
    setDecision({ request, nextStatus });
    setNote("");
  };

  const confirmDecision = () => {
    if (!decision) return;
    if (decision.nextStatus === "rejected" && !note.trim()) return;

    const copy = getRequestCopy(decision.request);
    const decisionNote = note.trim();

    const updatedRequest = actions.setLinkRequestStatus(
      decision.request.id,
      decision.nextStatus,
      decisionNote
    );

    if (decision.nextStatus === "approved") {
      toast.success(`${copy.title} approved`, {
        description: `${decision.request.instructor} is now ${copy.approvedPast} ${decision.request.course}.`,
      });
    } else {
      toast.success(`${copy.title} rejected`, {
        description: `${decision.request.instructor}'s request was rejected.`,
      });
    }

    setDecision(null);
    setSelectedRequest((prev) => {
      if (!prev || prev.id !== decision.request.id) return prev;
      return updatedRequest || {
        ...prev,
        status: decision.nextStatus,
        decisionNote,
        reviewedAt: new Date().toISOString(),
      };
    });
  };

  const decisionCopy = decision ? getRequestCopy(decision.request) : null;
  const selectedCopy = selectedRequest ? getRequestCopy(selectedRequest) : null;

  return (
    <AdminPageShell
      notifications={pendingRequests.map((request) => {
        const copy = getRequestCopy(request);
        return {
          id: request.id,
          title: copy.title,
          body: copy.sentence,
        };
      })}
    >
      <AdminPageHeader
        eyebrow="Instructor course access"
        title="Link requests"
        description="Accept or reject course link and unlink requests from course instructors. Approved requests update the instructor-course links everywhere in the demo database."
        icon={Link2}
      />

      <AppCard variant="strong" radius="lg" padding="lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[color:var(--accent)]/15 p-3 text-[color:var(--primary)]">
              <Bell className="size-5" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">
                Admin notifications
              </p>
              <h2 className="mt-1 text-2xl font-black text-[color:var(--ink)]">
                {pendingRequests.length} pending course request
                {pendingRequests.length === 1 ? "" : "s"}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                New instructor link/unlink requests appear here and stay pending until an admin approves or rejects them.
              </p>
            </div>
          </div>

          <AdminStatusBadge status={pendingRequests.length ? "pending" : "resolved"} />
        </div>
      </AppCard>

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={["pending", "approved", "rejected"]}
      />

      <AdminGridTable
        rows={filtered}
        gridTemplate="lg:grid-cols-[1.25fr_1.15fr_0.95fr_1.45fr_0.75fr_1.55fr]"
        columns={[
          {
            key: "instructor",
            label: "Instructor",
            render: (row) => (
              <div>
                <p className="font-black text-[color:var(--ink)]">
                  {row.instructor}
                </p>
                <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
                  {row.email || "No email recorded"}
                </p>
              </div>
            ),
          },
          {
            key: "course",
            label: "Course",
            render: (row) => (
              <div>
                <p className="font-black text-[color:var(--ink)]">
                  {row.requestedCourseCode || row.course?.split(" - ")?.[0] || "Course"}
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[color:var(--muted)]">
                  {row.requestedCourseName || row.course}
                </p>
              </div>
            ),
          },
          {
            key: "action",
            label: "Request type",
            render: (row) => {
              const copy = getRequestCopy(row);
              const Icon = copy.icon;

              return (
                <span className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${copy.toneClass}`}>
                  <Icon className="size-4" />
                  {copy.label}
                </span>
              );
            },
          },
          {
            key: "reason",
            label: "Message",
            render: (row) => {
              const copy = getRequestCopy(row);

              return (
                <div>
                  <p className="text-sm font-bold leading-6 text-[color:var(--ink)]">
                    {copy.sentence}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[color:var(--muted)]">
                    Reason: {row.reason || "No reason provided."}
                  </p>
                </div>
              );
            },
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <AdminStatusBadge status={row.status} />,
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <ActionCell
                row={row}
                onReview={setSelectedRequest}
                onApprove={(request) => openDecision(request, "approved")}
                onReject={(request) => openDecision(request, "rejected")}
              />
            ),
          },
        ]}
      />

      <AdminReviewDrawer
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        eyebrow="Instructor access request"
        title={selectedRequest?.course}
        subtitle={
          selectedRequest
            ? `${selectedRequest.instructor} • ${selectedRequest.email || "No email recorded"}`
            : ""
        }
        status={selectedRequest?.status}
        footer={
          selectedRequest ? (
            <div className="flex flex-wrap justify-end gap-2">
              <AppButton
                variant="brand"
                disabled={selectedRequest.status !== "pending"}
                onClick={() => openDecision(selectedRequest, "approved")}
              >
                <Check className="size-4" />
                Approve request
              </AppButton>
              <AppButton
                variant="danger"
                disabled={selectedRequest.status !== "pending"}
                onClick={() => openDecision(selectedRequest, "rejected")}
              >
                <X className="size-4" />
                Reject request
              </AppButton>
            </div>
          ) : null
        }
      >
        {selectedRequest ? (
          <div className="space-y-4">
            <DrawerSection title="Request summary">
              <div className="flex items-start gap-3 rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-4">
                <div className="rounded-2xl bg-[color:var(--accent)]/15 p-3 text-[color:var(--primary)]">
                  <ClipboardCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[color:var(--ink)]">
                    {selectedCopy?.sentence}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
                    Submitted: {formatDate(selectedRequest.submittedAt || selectedRequest.createdAt)}
                  </p>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="Request type">
              <p className="font-bold text-[color:var(--ink)]">
                {selectedCopy?.label}
              </p>
            </DrawerSection>

            <DrawerSection title="Instructor message">
              {selectedRequest.reason || "No reason provided."}
            </DrawerSection>

            <DrawerSection title="Decision note">
              {selectedRequest.decisionNote || "No decision note yet."}
            </DrawerSection>
          </div>
        ) : null}
      </AdminReviewDrawer>

      <AdminActionDialog
        open={Boolean(decision)}
        tone={decision?.nextStatus === "rejected" ? "danger" : "brand"}
        title={
          decision?.nextStatus === "rejected"
            ? `Reject ${decisionCopy?.label?.toLowerCase() || "request"}?`
            : `Approve ${decisionCopy?.label?.toLowerCase() || "request"}?`
        }
        description={decisionCopy?.sentence || ""}
        confirmLabel={
          decision?.nextStatus === "rejected"
            ? "Reject request"
            : "Approve request"
        }
        noteLabel={
          decision?.nextStatus === "rejected"
            ? "Rejection reason"
            : "Admin note / reason"
        }
        notePlaceholder={
          decision?.nextStatus === "rejected"
            ? "Explain why this course request is rejected..."
            : "Optional note for audit history..."
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
