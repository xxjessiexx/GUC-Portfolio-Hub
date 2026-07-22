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
    <div className="flex h-10 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgba(156,213,255,0.35)] text-sm font-black text-[var(--primary)] ring-2 ring-[1.5px]
ring-[var(--card-border)]">
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
    <div className="
fixed
inset-0
z-[9999]
flex
items-center
justify-center
bg-[rgba(44,57,71,.30)]
backdrop-blur-md
p-8
">
      <div
  
className="
relative
w-full
max-w-[870px]
min-h-[620px]
max-h-[88vh]
overflow-hidden
rounded-[32px]

bg-[var(--auth-card-bg)]
border
border-[#7AAACE]/40
shadow-[0_20px_60px_rgba(53,88,114,.18),0_0_0_1px_rgba(122,170,206,.18)]
shadow-[var(--auth-card-shadow)]

backdrop-blur-2xl
backdrop-saturate-150
flex
flex-col
translate-y-8

"

>

  <div
    className="
    absolute
    inset-0
    pointer-events-none
    overflow-hidden
    "
>
    <div
        className="
        absolute
        -top-24
        -right-24
        h-72
        w-72
        rounded-full
        bg-[var(--accent)]
        opacity-20
        blur-[90px]
        "
    />

    <div
        className="
        absolute
        -bottom-20
        -left-20
        h-60
        w-60
        rounded-full
        bg-[var(--secondary)]
        opacity-10
        blur-[80px]
        "
    />
</div>
        <div
className="
flex
items-start
justify-between
gap-6
border-b
border-[var(--border-blue)]
bg-[image:var(--dashboard-preview-gradient)]
px-8
py-7
"
>
          <div>
           <h2 className="text-[32px]
leading-none font-black text-white">
    {isInstructorMode
        ? "Invite Instructor"
        : "Invite Collaborators"}
</h2>

<p className="mt-2   text-base text-white/80 max-w-lg leading-6">
    {isInstructorMode
        ? "Search and invite the course instructor."
        : "Search students and invite them to collaborate on this project."}
</p>
          </div>


          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--card-border)]
bg-[var(--surface-elevated)]
backdrop-blur-lg
text-[color:var(--primary)] shadow-sm
transition-all hover:bg-[var(--surface-strong)]
hover:scale-105"
            aria-label="Close invite picker"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        <div
className="
bg-gradient-to-b
    from-[#7AAACE]/10
    to-transparent
space-y-6
px-8
py-6
bg-transparent
before:absolute
before:inset-0
before:bg-[linear-gradient(180deg,rgba(255,255,255,.08),transparent)]
before:pointer-events-none
relative
dark:bg-transparent
"
>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" />

            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by email, first name, or last name"
             className="
h-14
w-full
rounded-xl
border
border-[var(--border-blue)]
bg-[var(--surface-elevated)]
px-5
pl-11
text-base
text-[var(--ink)]
shadow-[var(--shadow-soft)]
placeholder:text-[var(--muted)]
focus:border-[var(--secondary)]
focus:ring-2
focus:ring-[var(--secondary)]
"
              autoFocus
            />
          </div>

          {message ? (
            <p className="rounded-2xl border border-[color:var(--primary)]/10 bg-[rgba(156,213,255,0.18)] px-4 py-3 text-xs font-bold text-[var(--primary)]">
              {message}
            </p>
          ) : null}

          <div className="invite-scroll max-h-[340px] space-y-2 overflow-y-auto pr-2">
            {candidates.length === 0 ? (
              <div className="flex
flex-col
items-start
justify-center
rounded-[26px]
border
border-dashed
border-[var(--card-border)]
bg-[var(--surface)]
backdrop-blur-lg
py-16
text-center">
                <p className="text-sm font-black text-[color:var(--ink)]">
                  No matching users
                </p>
                <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
                  {isInstructorMode
                    ? "Select a course first or search for another linked instructor."
                    : "No available student collaborators match this search."}
                </p>
              </div>
            ) : (
              candidates.map((user) => (
                <div
                  key={user.id}
                  className="
group
flex
items-start
justify-between
gap-5
rounded-xl
border
border-[var(--card-border)]
bg-white/55
dark:bg-white/5
backdrop-blur-lg
px-5
py-4
transition-all
duration-200
hover:bg-[var(--surface-strong)]
hover:shadow-[var(--shadow-brand)]
hover:-translate-y-1
"
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
                    className="
inline-flex
h-9
items-center
gap-2
rounded-lg
bg-[image:var(--gradient-brand)]
px-4
text-sm
font-semibold
text-white
transition
hover:scale-105
hover:brightness-110
"
                  >
                    <UserPlus className="size-4 hover:scale-105" />
                    Invite
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
}