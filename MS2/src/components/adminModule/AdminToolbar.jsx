import { Search } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import AppSelect from "@/components/common/AppSelect";

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
          <div className="min-w-[190px]">
            <AppSelect
              value={status}
              onChange={onStatusChange}
              options={[
                { value: "all", label: "All statuses" },
                ...statusOptions.map((option) => ({
                  value: option,
                  label: option.replaceAll("-", " "),
                })),
              ]}
              placeholder="All statuses"
              className="h-11"
            />
          </div>
        )}

        {actionLabel && <AppButton variant="brand" size="sm" onClick={onAction}>{actionLabel}</AppButton>}
      </div>
    </div>
  );
}
