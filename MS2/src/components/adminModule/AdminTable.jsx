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


export function AdminGridTable({ columns, rows, gridTemplate, emptyMessage }) {
  return (
    <AppCard className="overflow-hidden">
      <div
        className={`hidden ${gridTemplate} border-b border-[color:var(--primary)]/10 px-8 py-4 text-sm font-black text-[color:var(--dark)] lg:grid lg:items-center lg:gap-4`}
      >
        {columns.map((column) => (
          <p key={column.key}>{column.label}</p>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            {emptyMessage || "No records found"}
          </h2>
          <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
            Try changing your search or filter options.
          </p>
        </div>
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className={`grid gap-4 border-b border-[color:var(--primary)]/10 px-8 py-5 last:border-b-0 ${gridTemplate} lg:items-center lg:gap-4`}
          >
            {columns.map((column) => (
              <div key={column.key}>
                {column.render ? column.render(row) : row[column.key]}
              </div>
            ))}
          </div>
        ))
      )}
    </AppCard>
  );
}