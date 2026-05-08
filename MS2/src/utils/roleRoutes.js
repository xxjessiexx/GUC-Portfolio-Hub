export function normalizeUserRole(role) {
  const normalized = String(role || "student").trim().toLowerCase();

  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("instructor")) return "instructor";
  if (normalized.includes("employer")) return "employer";
  if (normalized.includes("company")) return "employer";
  if (normalized.includes("student")) return "student";

  return normalized;
}

export function getDashboardRouteByRole(role) {
  const normalizedRole = normalizeUserRole(role);

  const routes = {
    student: "/student-dashboard",
    instructor: "/instructor-dashboard",
    employer: "/employer-dashboard",
    admin: "/admin-dashboard",
  };

  return routes[normalizedRole] || "/student-dashboard";
}