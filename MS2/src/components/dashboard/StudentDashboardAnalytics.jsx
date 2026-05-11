import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Eye,
  FolderKanban,
  GitCommitHorizontal,
  GitPullRequest,
  MessageSquareText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVITY_SCALE = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const CHART_COLORS = ["#355872", "#6f9fbd", "#9CD5FF", "#6B8F71", "#E6C77B", "#8A7FB6", "#2C3947"];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function safeDate(value, fallback = new Date()) {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initials(name = "User") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProjectDeadline(project) {
  const taskDates = (project.tasks || [])
    .map((task) => task.deadline || task.dueDate)
    .filter(Boolean);

  if (taskDates.length) {
    return taskDates.sort((a, b) => new Date(a) - new Date(b))[0];
  }

  return project.deadline || project.dueDate || project.updatedAt || project.createdAt;
}

function getActivityEvents(projects) {
  return projects.flatMap((project) => {
    const fallbackDate = project.updatedAt || project.createdAt || new Date().toISOString();
    const events = [];

    events.push({ date: project.createdAt || fallbackDate, type: "created", projectId: project.id });
    events.push({ date: project.updatedAt || fallbackDate, type: "updated", projectId: project.id });

    (project.tasks || []).forEach((task) => {
      events.push({
        date: task.completedAt || task.updatedAt || task.deadline || task.dueDate || fallbackDate,
        type: task.status === "completed" ? "task-completed" : "task",
        projectId: project.id,
      });
    });

    (project.feedback || []).forEach((feedback) => {
      events.push({ date: feedback.createdAt || fallbackDate, type: "feedback", projectId: project.id });
    });

    (project.comments || []).forEach((comment) => {
      events.push({ date: comment.createdAt || fallbackDate, type: "comment", projectId: project.id });
    });

    (project.collaboratorIds || []).forEach((_, index) => {
      const baseDate = safeDate(project.createdAt || fallbackDate);
      events.push({
        date: new Date(baseDate.getTime() + (index + 1) * 2 * DAY_MS).toISOString(),
        type: "collaborator",
        projectId: project.id,
      });
    });

    return events.filter((event) => event.date);
  });
}

function buildContributionWeeks(events, days = 371) {
  const today = startOfDay(new Date());
  const start = new Date(today.getTime() - (days - 1) * DAY_MS);
  const paddedStart = new Date(start.getTime() - start.getDay() * DAY_MS);
  const counts = new Map();

  events.forEach((event) => {
    const key = dateKey(safeDate(event.date));
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const weeks = [];
  for (let current = new Date(paddedStart); current <= today; current = new Date(current.getTime() + DAY_MS)) {
    if (current.getDay() === 0) weeks.push([]);
    const copy = new Date(current);
    weeks[weeks.length - 1].push({
      date: copy,
      count: counts.get(dateKey(copy)) || 0,
      isInsideRange: copy >= start && copy <= today,
    });
  }

  return weeks.slice(-53);
}

function monthLabelsForWeeks(weeks) {
  const labels = new Array(weeks.length).fill("");
  let lastMonth = null;

  weeks.forEach((week, index) => {
    const firstVisibleDay = week.find((day) => day?.isInsideRange)?.date || week[0]?.date;
    if (!firstVisibleDay) return;
    const month = firstVisibleDay.getMonth();
    if (month !== lastMonth && firstVisibleDay.getDate() <= 7) {
      labels[index] = MONTHS[month];
      lastMonth = month;
    }
  });

  return labels;
}

function normalizeLanguageName(language) {
  const raw = String(language || "").trim();
  if (!raw) return "";
  if (/^javascript$/i.test(raw)) return "JavaScript";
  if (/^node\.?js$/i.test(raw)) return "Node.js";
  if (/^tailwind css$/i.test(raw)) return "Tailwind";
  if (/^ui\/ux$/i.test(raw)) return "UI/UX";
  return raw;
}

function getLanguageStats(projects) {
  const counts = projects
    .flatMap((project) => project.languages || project.technologies || project.tags || [])
    .map(normalizeLanguageName)
    .filter(Boolean)
    .reduce((acc, language) => {
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {});

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0) || 1;

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, count], index) => ({
      name,
      count,
      fill: CHART_COLORS[index % CHART_COLORS.length],
      percent: Math.max(1, Math.round((count / total) * 100)),
    }));
}

function getTopCollaborator(project) {
  const collaborators = project.collaborators || [];
  if (!collaborators.length) return null;

  return collaborators
    .map((collaborator) => {
      const score =
        (project.comments || []).filter((comment) => comment.userId === collaborator.id).length * 2 +
        (project.tasks || []).filter((task) => task.assigneeId === collaborator.id).length * 2 +
        (project.feedback || []).filter((item) => item.userId === collaborator.id).length +
        (project.invitationStatuses || []).filter((item) => item.userId === collaborator.id && item.status === "accepted").length +
        1;

      return { ...collaborator, score };
    })
    .sort((a, b) => b.score - a.score)[0];
}

function getDeadlineItems(projects) {
  return projects
    .map((project) => ({
      id: project.id,
      title: project.title,
      subtitle: project.courseName || titleCase(project.type) || "Project",
      date: safeDate(getProjectDeadline(project)),
    }))
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);
}

function getCalendarCells(viewDate, deadlines) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first.getTime() - first.getDay() * DAY_MS);
  const deadlineMap = new Map(deadlines.map((item) => [dateKey(item.date), item]));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getTime() + index * DAY_MS);
    return {
      date,
      isCurrentMonth: date.getMonth() === month,
      deadline: deadlineMap.get(dateKey(date)),
      isToday: dateKey(date) === dateKey(new Date()),
    };
  });
}

function makeSparklineData(seed = 1) {
  return Array.from({ length: 8 }, (_, index) => ({
    name: index,
    value: Math.max(1, seed + Math.round(Math.sin(index * 1.15 + seed) * 2) + index + (index % 3)),
  }));
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-lg font-black tracking-tight text-[color:var(--ink)]">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-[46ch] text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function TinyAreaChart({ data, color = "#7AAACE" }) {
  return (
    <div className="h-14 w-36">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 2, bottom: 0, left: 2 }}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#spark-${color.replace("#", "")})`}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatMetricCard({ icon: Icon, value, label, detail, chartData, tone = "blue", children }) {
  const color = tone === "gold" ? "#E6C77B" : "#7AAACE";

  return (
    <AppCard className="min-h-[124px] p-5" hover>
      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--primary)] ring-1 ring-[color:var(--border-blue)]">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-3xl font-black leading-none text-[color:var(--ink)]">{value}</p>
          <p className="mt-2 text-sm font-black text-[color:var(--muted)]">{label}</p>
          {detail ? <p className="mt-2 text-xs font-black text-[color:var(--primary)]">↗ {detail}</p> : null}
        </div>
        <div className="flex shrink-0 items-center justify-center">
          {children || <TinyAreaChart data={chartData} color={color} />}
        </div>
      </div>
    </AppCard>
  );
}

function CompletionRing({ percent }) {
  const clean = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    <div
      className="grid h-24 w-24 place-items-center rounded-full"
      style={{ background: `conic-gradient(#7AAACE ${clean}%, rgba(122,170,206,0.18) 0)` }}
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--surface-elevated)] text-sm font-black text-[color:var(--primary)] shadow-inner">
        {clean}%
      </div>
    </div>
  );
}

function ActivityMini({ icon: Icon, value, label, note }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border-blue)] bg-white/65 p-3 shadow-sm dark:bg-white/[0.03]">
      <Icon className="h-4 w-4 text-[color:var(--primary)]" />
      <p className="mt-2 text-2xl font-black text-[color:var(--ink)]">{value}</p>
      <p className="text-xs font-black text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--primary)]">▲ {note}</p>
    </div>
  );
}

function ContributionsCard({ events }) {
  const weeks = useMemo(() => buildContributionWeeks(events), [events]);
  const monthLabels = useMemo(() => monthLabelsForWeeks(weeks), [weeks]);
  const totals = useMemo(() => {
    const comments = events.filter((event) => event.type === "comment" || event.type === "feedback").length;
    const pullRequests = events.filter((event) => event.type === "collaborator").length;
    const updates = events.filter((event) => event.type === "updated" || event.type === "task" || event.type === "task-completed").length;
    return { contributions: events.length, comments, pullRequests, updates };
  }, [events]);

  return (
    <AppCard className="p-5">
      <SectionTitle
        title="Project Activity"
        description="GitHub-style contribution history from project updates, tasks, feedback, and comments."
        action={<span className="rounded-full border border-[color:var(--border-soft)] bg-white/70 px-4 py-2 text-xs font-black text-[color:var(--primary)] shadow-sm">Last year</span>}
      />

      <div className="rounded-[22px] border border-[color:var(--border-blue)] bg-white/70 p-4 shadow-inner dark:bg-white/[0.03]">
        <div className="flex items-start gap-3">
          <div className="mt-7 grid gap-[3px] pr-1 text-[11px] font-semibold text-[color:var(--muted)]" style={{ gridTemplateRows: "repeat(7, 10px)" }}>
            <span />
            <span>Mon</span>
            <span />
            <span>Wed</span>
            <span />
            <span>Fri</span>
            <span />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, 10px)` }}>
              {monthLabels.map((label, index) => (
                <span key={`${label}-${index}`} className="h-5 text-[11px] font-semibold text-[color:var(--muted)]">
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-2 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, 10px)` }}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid gap-[3px]" style={{ gridTemplateRows: "repeat(7, 10px)" }}>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const item = week.find((day) => day.date.getDay() === dayIndex);
                    const level = item?.isInsideRange ? Math.min(item.count, 4) : 0;
                    return (
                      <motion.span
                        key={dayIndex}
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (weekIndex * 7 + dayIndex) * 0.0015 }}
                        className="h-2.5 w-2.5 rounded-[2px] ring-1 ring-black/[0.04]"
                        style={{ backgroundColor: ACTIVITY_SCALE[level] }}
                        title={item ? `${item.count} activities on ${item.date.toDateString()}` : ""}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs font-semibold text-[color:var(--muted)]">
          <span>Less</span>
          {ACTIVITY_SCALE.map((color) => (
            <span key={color} className="h-2.5 w-2.5 rounded-[2px] ring-1 ring-black/[0.04]" style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ActivityMini icon={GitCommitHorizontal} value={totals.contributions} label="Contributions" note="last year" />
        <ActivityMini icon={MessageSquareText} value={totals.comments} label="Comments" note="feedback" />
        <ActivityMini icon={GitPullRequest} value={totals.pullRequests} label="Collab Touches" note="teammates" />
        <ActivityMini icon={RefreshCw} value={totals.updates} label="Project Updates" note="tasks" />
      </div>
    </AppCard>
  );
}

function LanguagesCard({ languages }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = languages[activeIndex] || languages[0];

  return (
    <AppCard className="p-5">
      <SectionTitle title="Languages Used Overall" description="Distribution across all your projects." />

      <div className="grid gap-4">
        <div className="relative mx-auto h-[210px] w-full max-w-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={({ active: isActive, payload }) => {
                  if (!isActive || !payload?.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-2xl border border-[color:var(--border-blue)] bg-white px-3 py-2 text-xs font-black shadow-xl">
                      <p className="text-[color:var(--ink)]">{item.name}</p>
                      <p className="text-[color:var(--primary)]">{item.percent}% of languages</p>
                    </div>
                  );
                }}
              />
              <Pie
                data={languages}
                dataKey="percent"
                nameKey="name"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={2}
                strokeWidth={4}
                stroke="rgba(255,255,255,0.82)"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {languages.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.fill}
                    opacity={index === activeIndex ? 1 : 0.76}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--muted)]">Top</p>
              <p className="max-w-[120px] truncate text-lg font-black text-[color:var(--ink)]">{active?.name || "None"}</p>
              <p className="text-sm font-black text-[color:var(--primary)]">{active?.percent || 0}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          {languages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-black transition",
                activeIndex === index ? "bg-white shadow-sm ring-1 ring-[color:var(--border-blue)]" : "hover:bg-white/60"
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="truncate text-[color:var(--ink)]">{item.name}</span>
              </span>
              <span className="tabular-nums text-[color:var(--primary)]">{item.percent}%</span>
            </button>
          ))}
        </div>
      </div>
    </AppCard>
  );
}

function TopCollaboratorsCard({ projects }) {
  const rows = projects.slice(0, 4).map((project, index) => ({
    project,
    top: getTopCollaborator(project),
    accent: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <AppCard className="p-5">
      <SectionTitle title="Top Collaborators per Project" description="One strongest collaborator for each project." />

      <div className="space-y-3">
        {rows.map(({ project, top, accent }) => (
          <div key={project.id} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-3xl border border-[color:var(--border-blue)] bg-white/65 p-3 shadow-sm dark:bg-white/[0.03]">
            <div className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: accent }}>
              <Code2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[color:var(--ink)]">{project.title}</p>
              <p className="truncate text-xs font-bold text-[color:var(--muted)]">{project.courseName || titleCase(project.type)}</p>
            </div>
            {top ? (
              <div className="flex min-w-[136px] items-center justify-end gap-2">
                <div className="hidden text-right sm:block">
                  <p className="max-w-[90px] truncate text-xs font-black text-[color:var(--ink)]">{top.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--muted)]">top collaborator</p>
                </div>
                <Avatar className="h-9 w-9 ring-2 ring-white">
                  <AvatarImage src={top.image || top.avatar} alt={top.name} />
                  <AvatarFallback>{initials(top.name)}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <span className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-black text-[color:var(--muted)]">Solo</span>
            )}
          </div>
        ))}
      </div>
    </AppCard>
  );
}

function DeadlinesCard({ deadlines }) {
  const initialDate = deadlines[0]?.date || new Date();
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const cells = useMemo(() => getCalendarCells(viewDate, deadlines), [viewDate, deadlines]);

  function moveMonth(delta) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <AppCard className="p-5">
      <SectionTitle title="Project Deadlines" description="Working calendar from your project task deadlines." />

      <div className="rounded-[24px] border border-[color:var(--border-blue)] bg-white/70 p-4 shadow-inner dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[color:var(--accent)]/20" onClick={() => moveMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center text-base font-black text-[color:var(--ink)]">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[color:var(--accent)]/20" onClick={() => moveMonth(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black text-[color:var(--muted)]">
          {WEEK_DAYS.map((day) => <span key={day}>{day.slice(0, 2)}</span>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((cell) => (
            <button
              key={cell.date.toISOString()}
              type="button"
              className={cn(
                "relative grid h-8 place-items-center rounded-xl text-xs font-black transition",
                cell.isCurrentMonth ? "text-[color:var(--ink)] hover:bg-[color:var(--accent)]/15" : "text-[color:var(--muted)]/35",
                cell.isToday && "ring-2 ring-[color:var(--primary)]/30",
                cell.deadline && "bg-[color:var(--accent)]/20 text-[color:var(--primary)]"
              )}
              title={cell.deadline ? cell.deadline.title : cell.date.toDateString()}
            >
              {cell.date.getDate()}
              {cell.deadline ? <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[color:var(--primary)]" /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {deadlines.slice(0, 3).map((item, index) => (
          <div key={item.id} className="grid grid-cols-[10px_1fr_auto] items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[color:var(--ink)]">{item.title}</p>
              <p className="truncate text-xs font-bold text-[color:var(--muted)]">{item.subtitle}</p>
            </div>
            <span className="text-xs font-black text-[color:var(--primary)]">
              {MONTHS[item.date.getMonth()]} {item.date.getDate()}
            </span>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

function EmptyStateCard() {
  return (
    <AppCard className="p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-[color:var(--accent)]/20 text-[color:var(--primary)]">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-black text-[color:var(--ink)]">No project statistics yet</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[color:var(--muted)]">
        Create your first project and this dashboard will automatically calculate languages, collaborators, deadlines, and activity from the demo store.
      </p>
    </AppCard>
  );
}

export default function StudentDashboardAnalytics({ snapshot, notifications = [] }) {
  const projects = useMemo(() => snapshot?.projects || [], [snapshot?.projects]);
  const student = snapshot?.student || {};
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const stats = useMemo(() => {
    const publicProjects = projects.filter((project) => String(project.visibility || "").toLowerCase() === "public").length;
    return {
      total: projects.length,
      public: publicProjects,
      unread: unreadCount,
      completion: student.profileCompletion || 0,
    };
  }, [projects, student.profileCompletion, unreadCount]);

  const events = useMemo(() => getActivityEvents(projects), [projects]);
  const languages = useMemo(() => getLanguageStats(projects), [projects]);
  const deadlines = useMemo(() => getDeadlineItems(projects), [projects]);

  if (!projects.length) return <EmptyStateCard />;

  return (
    <section className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatMetricCard icon={FolderKanban} value={stats.total} label="Total Projects" detail="project portfolio" chartData={makeSparklineData(stats.total)} />
        <StatMetricCard icon={Eye} value={stats.public} label="Public Projects" detail="visible work" chartData={makeSparklineData(stats.public + 2)} />
        <StatMetricCard icon={Bell} value={stats.unread} label="Unread Alerts" detail="needs review" chartData={makeSparklineData(stats.unread + 3)} tone="gold" />
        <StatMetricCard icon={CheckCircle2} value={`${stats.completion}%`} label="Portfolio Done" detail="profile strength">
          <CompletionRing percent={stats.completion} />
        </StatMetricCard>
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(560px,1.65fr)_minmax(280px,0.92fr)_minmax(320px,1fr)_minmax(280px,0.86fr)]">
        <ContributionsCard events={events} />
        <LanguagesCard languages={languages} />
        <TopCollaboratorsCard projects={projects} />
        <DeadlinesCard deadlines={deadlines} />
      </div>
    </section>
  );
}
