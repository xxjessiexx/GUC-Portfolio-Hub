import { Search, UserPlus, X } from "lucide-react";

function getDisplayName(user) {
  return (
    user?.name ||
    user?.fullName ||
    user?.companyName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Unknown User"
  );
}

function getImageForUser(user) {
  return user?.avatar || user?.image || user?.profileImage || "";
}

function UserAvatar({ user }) {
  const src = getImageForUser(user);
  const name = getDisplayName(user);
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgba(156,213,255,0.35)] text-sm font-black text-[var(--primary)] ring-2 ring-white">
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

export default function ProjectInvitePickerModal({
  open,
  mode,
  query,
  candidates = [],
  message,
  onClose,
  onQueryChange,
  onSelectUser,
}) {
  if (!open) return null;

  const isInstructorMode = mode === "instructor";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#152536]/35 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/70 bg-[#F7F8F0] p-0 text-[color:var(--ink)] shadow-[0_30px_90px_rgba(53,88,114,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border-blue)]/70 bg-white/55 px-7 py-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--primary)]">
              {isInstructorMode ? "Course instructor" : "Student collaborator"}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[color:var(--ink)]">
              {isInstructorMode ? "Invite instructor" : "Invite collaborator"}
            </h2>

            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[color:var(--muted)]">
              {isInstructorMode
                ? "Search instructors linked to the selected course. They will appear as no reply until they respond."
                : "Search students from the same list used on the project page. They will appear as no reply until they respond."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/70 bg-white/80 text-[color:var(--primary)] shadow-[0_10px_28px_rgba(53,88,114,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
            aria-label="Close invite picker"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-7 py-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" />

            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by email, first name, or last name"
              className="min-h-12 w-full rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 pl-11 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] outline-none placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]"
              autoFocus
            />
          </div>

          {message ? (
            <p className="rounded-2xl border border-[color:var(--primary)]/10 bg-[rgba(156,213,255,0.18)] px-4 py-3 text-xs font-bold text-[var(--primary)]">
              {message}
            </p>
          ) : null}

          <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
            {candidates.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--primary)]/20 bg-white/55 p-6">
                <p className="text-sm font-black text-[color:var(--ink)]">
                  No matching users
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[color:var(--muted)]">
                  {isInstructorMode
                    ? "Select a course first or search for another linked instructor."
                    : "No available student collaborators match this search."}
                </p>
              </div>
            ) : (
              candidates.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-[0_12px_30px_rgba(53,88,114,0.06)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={user} />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[color:var(--ink)]">
                        {getDisplayName(user)}
                      </p>
                      <p className="truncate text-xs font-semibold text-[color:var(--muted)]">
                        {user.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectUser(user)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-xs font-black text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[var(--dark)]"
                  >
                    <UserPlus className="size-4" />
                    Invite
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-[color:var(--border-blue)]/70 bg-white/40 px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-2xl border border-[color:var(--border-blue)] bg-white px-5 font-black text-[color:var(--ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}