import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  FileText,
  ListTodo,
  MessageSquareText,
  RefreshCcw,
} from "lucide-react";

import { formatProjectDate } from "@/utils/projectPage/projectPageHelpers";

function iconFor(tab) {
  if (tab === "tasks") return ListTodo;
  if (tab === "feedback") return MessageSquareText;
  if (tab === "bachelor thesis") return FileText;
  return RefreshCcw;
}

export default function ProjectChangesPopover({ changes = [], onSelectChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!changes.length) return null;

  const countLabel = `${changes.length} ${changes.length === 1 ? "change" : "changes"} since your review`;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10.5px] font-black transition ${
          open
            ? "border-[#DEC77E] bg-[#FFF6D9] text-[#765B16] shadow-[0_8px_20px_rgba(173,137,45,0.12)]"
            : "border-[#E6D8AE] bg-[#FFF9EA] text-[#82651C] hover:border-[#DCC379] hover:bg-[#FFF5D5]"
        }`}
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        <span>{countLabel}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+9px)] z-40 w-[340px] overflow-hidden rounded-[18px] border border-[#D7E3EA] bg-white shadow-[0_20px_50px_rgba(38,72,95,0.18)]">
          <div className="border-b border-[#E6EDF1] px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7892A2]">
              Since your last review
            </p>
          </div>

          <div className="p-2">
            {changes.map((change, index) => {
              const Icon = iconFor(change.tab);
              return (
                <button
                  key={change.id || `${change.type}-${change.targetId}-${change.createdAt}-${index}`}
                  type="button"
                  onClick={() => {
                    onSelectChange?.(change);
                    setOpen(false);
                  }}
                  className="group flex w-full items-start gap-3 rounded-[13px] px-3 py-2.5 text-left transition hover:bg-[#F5F9FB]"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFF7E2] text-[#9A7618]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11.5px] font-black text-[#294A61]">
                      {change.label || "Project content updated"}
                    </span>
                    {change.detail ? (
                      <span className="mt-0.5 block line-clamp-2 text-[10px] font-semibold leading-4 text-[#7A8D98]">
                        {change.detail}
                      </span>
                    ) : null}
                    {change.createdAt ? (
                      <span className="mt-1 block text-[9px] font-bold text-[#9AA8B0]">
                        {formatProjectDate(change.createdAt)}
                      </span>
                    ) : null}
                  </span>
                  <ChevronRight className="mt-2 h-3.5 w-3.5 shrink-0 text-[#A7B4BC] transition-transform group-hover:translate-x-0.5 group-hover:text-[#557C97]" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
