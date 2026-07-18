import AppBadge from "@/components/ui/AppBadge";

const toneByStatus = {
  active: "blue",
  approved: "blue",
  accepted: "blue",
  resolved: "blue",

  inactive: "inactive",

  pending: "gold",
  flagged: "gold",
  "under-review": "gold",
  "needs-review": "gold",
  submitted: "gold",

  rejected: "muted",
  none: "muted",
};

export function AdminStatusBadge({ status }) {
  const label = String(status || "unknown").replaceAll("-", " ");
  const tone = toneByStatus[status] || "muted";

  return <AppBadge tone={tone}>{label}</AppBadge>;
}
