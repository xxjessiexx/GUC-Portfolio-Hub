export function formatProjectDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getImageForUser(user, fallbackIndex = 1) {
  return (
    user?.avatar ||
    user?.image ||
    user?.profileImage ||
    `https://i.pravatar.cc/40?img=${fallbackIndex}`
  );
}

export function getDisplayName(user) {
  return (
    user?.name ||
    user?.fullName ||
    user?.companyName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Unknown User"
  );
}

export function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();

  if (role.includes("instructor")) return "instructor";
  if (role.includes("admin")) return "admin";
  if (role.includes("employer")) return "employer";

  return "student";
}

export function makeId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Date.now()}`;
}