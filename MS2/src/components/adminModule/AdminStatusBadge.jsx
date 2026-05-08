import AppBadge from "@/components/ui/AppBadge";

const toneByStatus = {
  active: "blue",
  approved: "blue",
  accepted: "blue",
  resolved: "blue",
  inactive: "muted",
  pending: "gold",
  "needs-review": "gold",
  flagged: "gold",
  rejected: "muted",
  "under-review": "gold",
  submitted: "gold",
  none: "muted",
};

export function AdminStatusBadge({ status }) {
  const label = String(status || "unknown").replaceAll("-", " ");
  const tone = toneByStatus[status] || "muted";

  return <AppBadge tone={tone}>{label}</AppBadge>;
}
