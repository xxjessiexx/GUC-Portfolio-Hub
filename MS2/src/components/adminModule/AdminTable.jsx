import { AppCard } from "@/components/ui/AppCard";

export function AdminTable({ columns, rows, emptyMessage = "No records found." }) {
  return (
    <AppCard variant="glass" radius="lg" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-[color:var(--border-blue)] bg-[var(--surface-strong)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-sm font-semibold text-[color:var(--muted)]">{emptyMessage}</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-b border-[color:var(--border-blue)]/70 transition hover:bg-[color:var(--accent)]/10 last:border-b-0">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-middle text-sm font-semibold text-[color:var(--ink)]">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppCard>
  );
}
