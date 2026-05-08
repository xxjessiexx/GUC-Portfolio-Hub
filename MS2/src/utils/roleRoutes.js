export function normalizeUserRole(role) {
  const normalized = String(role || "").trim().toLowerCase();

  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("instructor")) return "instructor";
  if (normalized.includes("employer")) return "employer";
  if (normalized.includes("company")) return "employer";
  if (normalized.includes("student")) return "student";

  return "";
}

export function getDashboardRouteByRole(role) {
  const normalizedRole = normalizeUserRole(role);

  const routes = {
    student: "/student-dashboard",
    instructor: "/instructor-dashboard",
    employer: "/employer-dashboard",
    admin: "/admin-dashboard",
  };

  return routes[normalizedRole] || "/login";
}

export function getStoredCurrentUser() {
  try {
    const storedUser = sessionStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserRole(user) {
  return normalizeUserRole(
    user?.accountRole ||
      user?.systemRole ||
      user?.role ||
      user?.userType
  );
}