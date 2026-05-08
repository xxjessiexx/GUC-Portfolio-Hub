import { Search, SlidersHorizontal } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

export function AdminToolbar({ search, onSearchChange, status, onStatusChange, statusOptions = [], actionLabel, onAction }) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[color:var(--border-soft)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
      <label className="flex min-h-11 flex-1 items-center gap-3 rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-elevated)] px-4">
        <Search className="h-4 w-4 text-[color:var(--muted)]" />
        <input
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search records..."
          className="w-full bg-transparent text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {statusOptions.length > 0 && (
          <label className="flex h-11 items-center gap-2 rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-elevated)] px-3 text-sm font-bold text-[color:var(--primary)]">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={status} onChange={(event) => onStatusChange?.(event.target.value)} className="bg-transparent outline-none">
              <option value="all">All statuses</option>
              {statusOptions.map((option) => <option key={option} value={option}>{option.replaceAll("-", " ")}</option>)}
            </select>
          </label>
        )}

        {actionLabel && <AppButton variant="brand" size="sm" onClick={onAction}>{actionLabel}</AppButton>}
      </div>
    </div>
  );
}
