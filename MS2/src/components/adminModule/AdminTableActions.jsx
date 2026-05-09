import { MoreHorizontal } from "lucide-react";

export default function AdminTableActions({ rowId, openMenu, setOpenMenu, actions }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpenMenu((current) => (current === rowId ? null : rowId))
        }
        className="grid h-12 w-12 place-items-center rounded-2xl border border-white/70 bg-white/70 text-[color:var(--primary)] shadow-[0_10px_30px_rgba(53,88,114,0.08)] transition hover:bg-white"
      >
        <MoreHorizontal className="size-5" />
      </button>

      {openMenu === rowId && (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(16,32,45,0.18)]">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                action.onClick();
                setOpenMenu(null);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition ${
                action.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-[color:var(--ink)] hover:bg-[color:var(--accent)]/10"
              }`}
            >
              {action.icon && <action.icon className="size-4" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}