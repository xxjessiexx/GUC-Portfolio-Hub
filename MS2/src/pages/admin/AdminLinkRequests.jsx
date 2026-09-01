import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  Link2,
  Unlink,
  X,
} from "lucide-react";

import SideToast from "@/components/ui/SideToast";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

function getRequestCopy(request) {
  const action = String(
    request?.action || request?.type || "link"
  )
    .toLowerCase()
    .includes("unlink")
    ? "unlink"
    : "link";

  const isUnlink = action === "unlink";
  const courseLabel = request?.course || "this course";
  const instructor =
    request?.instructor || "This instructor";

  return {
    action,
    isUnlink,

    title: isUnlink
      ? "Course unlink request"
      : "Course link request",

    label: isUnlink
      ? "Unlink request"
      : "Link request",

    verb: isUnlink
      ? "unlink from"
      : "link to",

    approvedPast: isUnlink
      ? "unlinked from"
      : "linked to",

    icon: isUnlink
      ? Unlink
      : Link2,

    toneClass: isUnlink
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-sky-200 bg-sky-50 text-sky-700",

    sentence: `${instructor} requested to ${
      isUnlink
        ? "unlink from"
        : "link to"
    } ${courseLabel}.`,
  };
}

function formatDate(value) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleString();
}

export default function AdminLinkRequests() {
  const {
    linkRequests,
    actions,
  } = useAdminModuleData();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState(null);

  const [decision, setDecision] =
    useState(null);

  const [note, setNote] =
    useState("");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [toastData, setToastData] =
    useState({
      open: false,
      title: "",
      description: "",
      type: "success",
    });

  useEffect(() => {
    if (!toastData.open) {
      return;
    }

    const timer = setTimeout(() => {
      setToastData((current) => ({
        ...current,
        open: false,
      }));
    }, 4000);

    return () =>
      clearTimeout(timer);
  }, [toastData.open]);

  const filtered = useMemo(() => {
    const normalizedSearch =
      search.toLowerCase().trim();

    return linkRequests.filter(
      (request) => {
        const copy =
          getRequestCopy(request);

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
          haystack.includes(
            normalizedSearch
          ) &&
          (status === "all" ||
            request.status ===
              status)
        );
      }
    );
  }, [
    linkRequests,
    search,
    status,
  ]);

  const pendingRequests =
    linkRequests.filter(
      (request) =>
        request.status === "pending"
    );

  const openDecision = (
    request,
    nextStatus
  ) => {
    if (
      request.status !== "pending"
    ) {
      return;
    }

    setDecision({
      request,
      nextStatus,
    });

    setNote("");
    setOpenMenu(null);
  };

  const confirmDecision = () => {
    if (!decision) {
      return;
    }

    if (
      decision.nextStatus ===
        "rejected" &&
      !note.trim()
    ) {
      return;
    }

    const copy =
      getRequestCopy(
        decision.request
      );

    const decisionNote =
      note.trim();

    const updatedRequest =
      actions.setLinkRequestStatus(
        decision.request.id,
        decision.nextStatus,
        decisionNote
      );

    if (
      decision.nextStatus ===
      "approved"
    ) {
      setToastData({
        open: true,
        title: `${copy.title} approved`,
        description: `${
          decision.request.instructor
        } is now ${
          copy.approvedPast
        } ${
          decision.request.course
        }.`,
        type: "success",
      });
    } else {
      setToastData({
        open: true,
        title: `${copy.title} rejected`,
        description: `${decision.request.instructor}'s request was rejected.`,
        type: "success",
      });
    }

    setSelectedRequest(
      (prev) => {
        if (
          !prev ||
          prev.id !==
            decision.request.id
        ) {
          return prev;
        }

        return (
          updatedRequest || {
            ...prev,
            status:
              decision.nextStatus,
            decisionNote,
            reviewedAt:
              new Date().toISOString(),
          }
        );
      }
    );

    setDecision(null);
    setNote("");
  };

  const decisionCopy =
    decision
      ? getRequestCopy(
          decision.request
        )
      : null;

  const selectedCopy =
    selectedRequest
      ? getRequestCopy(
          selectedRequest
        )
      : null;

  const requestColumns = [
    {
      key: "instructor",
      label: "Instructor",

      render: (row) => (
        <div>
          <p className="font-black text-[color:var(--ink)]">
            {row.instructor}
          </p>

          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {row.email ||
              "No email recorded"}
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
            {row.requestedCourseCode ||
              row.course?.split(
                " - "
              )?.[0] ||
              "Course"}
          </p>

          <p className="mt-1 text-xs font-semibold leading-5 text-[color:var(--muted)]">
            {row.requestedCourseName ||
              row.course}
          </p>
        </div>
      ),
    },

    {
      key: "action",
      label: "Request type",

      render: (row) => {
        const copy =
          getRequestCopy(row);

        const Icon =
          copy.icon;

        return (
          <span
            className={`
              inline-flex
              items-center
              gap-2
              rounded-2xl
              border
              px-3
              py-2
              text-xs
              font-black
              uppercase
              tracking-[0.12em]
              ${copy.toneClass}
            `}
          >
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
        const copy =
          getRequestCopy(row);

        return (
          <div>
            <p className="text-sm font-bold leading-6 text-[color:var(--ink)]">
              {copy.sentence}
            </p>

            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[color:var(--muted)]">
              Reason:{" "}
              {row.reason ||
                "No reason provided."}
            </p>
          </div>
        );
      },
    },

    {
      key: "status",
      label: "Status",

      render: (row) => (
        <AdminStatusBadge
          status={row.status}
        />
      ),
    },

    {
      key: "actions",
      label: "Actions",

      render: (row) => (
        <AdminTableActions
          rowId={row.id}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          actions={[
            {
              label: "Review request",
              icon: Eye,
              onClick: () => {
                setSelectedRequest(row);
                setOpenMenu(null);
              },
            },

            {
              label: "Approve request",
              icon: Check,
              disabled:
                row.status !==
                "pending",
              onClick: () =>
                openDecision(
                  row,
                  "approved"
                ),
            },

            {
              label: "Reject request",
              icon: X,
              danger: true,
              disabled:
                row.status !==
                "pending",
              onClick: () =>
                openDecision(
                  row,
                  "rejected"
                ),
            },
          ].filter(
            (action) =>
              !action.disabled
          )}
        />
      ),
    },
  ];

  return (
    
    <AdminPageShell
      notifications={pendingRequests.map(
        (request) => {
          const copy =
            getRequestCopy(
              request
            );

          return {
            id: request.id,
            title: copy.title,
            body: copy.sentence,
          };
        }
      )}
    >
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        
        title="Link requests"
        description="Accept or reject course link and unlink requests from course instructors. Approved requests update the instructor-course links everywhere in the demo database."
        icon={Link2}
      />

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={[
          "pending",
          "approved",
          "rejected",
        ]}
      />

      <AdminGridTable
        rows={filtered}
        columns={requestColumns}
        gridTemplate="lg:grid-cols-[1.25fr_1.15fr_0.95fr_1.45fr_0.75fr_0.55fr]"
        emptyMessage="No requests found"
      />

      {selectedRequest ? (
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
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">
                  Instructor Access Request
                </p>

                <h2 className="mt-2 text-3xl font-black text-[color:var(--ink)]">
                  {
                    selectedRequest.course
                  }
                </h2>

                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  {
                    selectedRequest.instructor
                  }{" "}
                  •{" "}
                  {selectedRequest.email ||
                    "No email recorded"}
                </p>
              </div>

              <AppButton
                variant="ghost"
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
                className="h-11 w-11 rounded-full px-0"
              >
                ✕
              </AppButton>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Request Summary
                </p>

                <p className="mt-3 text-sm font-black text-[color:var(--ink)]">
                  {
                    selectedCopy?.sentence
                  }
                </p>

                <p className="mt-2 text-xs font-semibold text-[color:var(--muted)]">
                  Submitted:{" "}
                  {formatDate(
                    selectedRequest.submittedAt ||
                      selectedRequest.createdAt
                  )}
                </p>
              </div>

              <div className="rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Request Type
                </p>

                <p className="mt-3 font-bold text-[color:var(--ink)]">
                  {
                    selectedCopy?.label
                  }
                </p>
              </div>

              <div className="rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Instructor Message
                </p>

                <p className="mt-3 text-sm font-semibold leading-7 text-[color:var(--ink)]">
                  {selectedRequest.reason ||
                    "No reason provided."}
                </p>
              </div>

              <div className="rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Decision Note
                </p>

                <p className="mt-3 text-sm font-semibold text-[color:var(--ink)]">
                  {selectedRequest.decisionNote ||
                    "No decision note yet."}
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <AppButton
                  variant="glass"
                  onClick={() =>
                    setSelectedRequest(
                      null
                    )
                  }
                >
                  Close
                </AppButton>

                {selectedRequest.status ===
                "pending" ? (
                  <>
                    <AppButton
                      variant="brand"
                      className="bg-gradient-to-r from-[#355872] via-[#4f7fa3] to-[#7AAACE] text-white shadow-[0_14px_32px_rgba(53,88,114,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(53,88,114,0.28)]"
                      onClick={() => {
                        const request =
                          selectedRequest;
                        setSelectedRequest(
                          null
                        );
                        openDecision(
                          request,
                          "approved"
                        );
                      }}
                    >
                      <Check className="size-4" />
                      Approve request
                    </AppButton>

                    <AppButton
                      variant="danger"
                      onClick={() => {
                        const request =
                          selectedRequest;
                        setSelectedRequest(
                          null
                        );
                        openDecision(
                          request,
                          "rejected"
                        );
                      }}
                    >
                      <X className="size-4" />
                      Reject request
                    </AppButton>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
            ? `Reject ${
                decisionCopy?.label?.toLowerCase() ||
                "request"
              }?`
            : `Approve ${
                decisionCopy?.label?.toLowerCase() ||
                "request"
              }?`
        }
        description={
          decisionCopy?.sentence ||
          ""
        }
        confirmLabel={
          decision?.nextStatus ===
          "rejected"
            ? "Reject request"
            : "Approve request"
        }
        noteLabel={
          decision?.nextStatus ===
          "rejected"
            ? "Rejection reason"
            : "Admin note / reason"
        }
        notePlaceholder={
          decision?.nextStatus ===
          "rejected"
            ? "Explain why this course request is rejected..."
            : "Optional note for audit history..."
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
        onConfirm={
          confirmDecision
        }
      />

      <SideToast
        open={toastData.open}
        title={toastData.title}
        description={
          toastData.description
        }
        type={toastData.type}
        onClose={() =>
          setToastData(
            (current) => ({
              ...current,
              open: false,
            })
          )
        }
      />
       </div>
    </main>
    </AdminPageShell>
  );
}