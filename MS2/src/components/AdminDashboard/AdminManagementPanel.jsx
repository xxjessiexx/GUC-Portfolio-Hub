import { BookOpen, Power, Search, UserPlus } from "lucide-react";
import { AdminBadge, AdminSection, AdminMiniButton } from "./AdminDashboardPrimitives";

export function UserManagementPanel({ users }) {
  return (
    <AdminSection
      title="User management"
      subtitle="View all users by role and activate or deactivate any account."
      action={<AdminMiniButton variant="outline" icon={UserPlus}>Add admin</AdminMiniButton>}
    >
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--input-bg)] px-4 py-3 text-[color:var(--muted)]">
        <Search className="h-4 w-4" />
        <span className="text-sm font-semibold">Search users by name, email, or role</span>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.email}
            className="flex items-center justify-between gap-4 rounded-[22px] border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
          >
            <div className="min-w-0">
              <h3 className="font-black text-[color:var(--ink)]">{user.name}</h3>
              <p className="mt-1 truncate text-sm font-semibold text-[color:var(--muted)]">{user.email}</p>
              <p className="mt-1 text-xs font-bold text-[color:var(--primary)]">{user.role}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <AdminBadge tone={user.status === "Deactivated" ? "danger" : user.status === "Pending approval" ? "gold" : "blue"}>
                {user.status}
              </AdminBadge>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-[color:var(--border-blue)] bg-white/60 text-[color:var(--primary)] shadow-sm transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-[color:var(--accent)]"
                aria-label="Toggle user activation"
              >
                <Power className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}

export function CourseManagementPanel({ courses }) {
  return (
    <AdminSection
      title="Course management"
      subtitle="Create, view, edit, and delete courses with course name and code."
      action={<AdminMiniButton variant="brand" icon={BookOpen}>New course</AdminMiniButton>}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.code}
            className="rounded-[22px] border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--primary)]">{course.code}</p>
            <h3 className="mt-1 font-black text-[color:var(--ink)]">{course.name}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <AdminBadge tone="blue">{course.projects} projects</AdminBadge>
              <AdminBadge tone="neutral">{course.instructors} instructors</AdminBadge>
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}
