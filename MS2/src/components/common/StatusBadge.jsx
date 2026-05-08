const statusClasses = {
  Open: "bg-green-100 text-green-700",
  Filled: "bg-[color:var(--accent)]/30 text-[color:var(--primary)]",
  Archived: "bg-gray-100 text-gray-600",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Nominated: "bg-[color:var(--gold)]/25 text-[color:var(--primary)]",
  Shortlisted: "bg-[color:var(--accent)]/30 text-[color:var(--primary)]",
  Reviewing: "bg-purple-100 text-purple-700",
  Pending: "bg-[color:var(--gold)]/25 text-[color:var(--primary)]",
  "Under Review": "bg-[color:var(--accent)]/30 text-[color:var(--primary)]",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${
        statusClasses[status] || "bg-gray-100 text-gray-600"
      } ${className}`}
    >
      {status}
    </span>
  );
}