import {
  Activity,
  FileText,
  MessageSquareText,
  RefreshCcw,
} from "lucide-react";
import { formatProjectDate } from "@/utils/projectPage/projectPageHelpers";

function getEventIcon(event) {
  if (String(event?.tab || "") === "tasks") return MessageSquareText;
  if (String(event?.tab || "") === "bachelor thesis") return FileText;
  if (String(event?.type || "").includes("update")) return RefreshCcw;
  return Activity;
}

function ActivityRow({ event, onOpen }) {
  const Icon = getEventIcon(event);
  const canOpen = Boolean(onOpen && (event?.tab || event?.targetId));
  const Wrapper = canOpen ? "button" : "div";

  return (
    <Wrapper
      {...(canOpen
        ? {
            type: "button",
            onClick: () => onOpen(event),
          }
        : {})}
      className={`group flex w-full items-start gap-3 rounded-[14px] px-2 py-2 text-left ${
        canOpen ? "transition hover:bg-white/70" : ""
      }`}
    >
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF3F8] text-[#557C97]">
        <Icon className="h-3.5 w-3.5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-black text-[#294A61]">
          {event?.label || "Project activity"}
        </span>
        <span className="mt-0.5 block text-[9.5px] font-semibold leading-4 text-[#7A8D98]">
          {event?.detail || event?.actorName || "Project activity"}
          {event?.createdAt ? ` · ${formatProjectDate(event.createdAt)}` : ""}
        </span>
      </span>
    </Wrapper>
  );
}

export default function ProjectActivityPanel({
  mode = "member",
  events = [],
  onOpenEvent,
}) {
  const instructor = mode === "instructor";
  const visibleEvents = (events || []).slice(0, instructor ? 6 : 7);

  return (
    <section className="mt-5 rounded-[20px] border border-[#D5E2E8] bg-white/58 px-4 py-4 shadow-[0_10px_26px_rgba(53,88,114,0.045)]">
      <div className="flex items-center gap-2">
        {instructor ? (
          <RefreshCcw className="h-3.5 w-3.5 text-[#8F711E]" />
        ) : (
          <Activity className="h-3.5 w-3.5 text-[#5E87A0]" />
        )}
        <p
          className={`text-[9px] font-black uppercase tracking-[0.15em] ${
            instructor ? "text-[#8A6A18]" : "text-[#5F849B]"
          }`}
        >
          {instructor ? "Review updates" : "Recent activity"}
        </p>
      </div>

      {visibleEvents.length ? (
        <div className="mt-2.5 space-y-0.5">
          {visibleEvents.map((event) => (
            <ActivityRow
              key={event.id || `${event.type}-${event.targetId}-${event.createdAt}`}
              event={event}
              onOpen={onOpenEvent}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[14px] bg-[#F5F9FB] px-3.5 py-3 text-[10.5px] font-semibold leading-5 text-[#778A96]">
          {instructor
            ? "No new project changes since your last review."
            : "No recent project activity yet."}
        </div>
      )}
    </section>
  );
}
