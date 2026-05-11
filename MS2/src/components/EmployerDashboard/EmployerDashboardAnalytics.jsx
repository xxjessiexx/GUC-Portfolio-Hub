import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CHART = {
  blue: "#7AAACE",
  blueStrong: "#355872",
  accent: "#9CD5FF",
  gold: "#E6C77B",
  sage: "#6B8F71",
  dark: "#2C3947",
};

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

function formatShortDate(value) {
  const date = safeDate(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function initials(name = "User") {
  return String(name || "User")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function shortTitle(title = "Internship") {
  return title.length > 28 ? `${title.slice(0, 28)}...` : title;
}

function parsePostedDate(internship) {
  if (internship.createdAt) return safeDate(internship.createdAt);
  if (internship.updatedAt) return safeDate(internship.updatedAt);

  const posted = String(internship.postedAt || "");
  const daysAgo = posted.match(/(\d+)\s+days?\s+ago/i);
  if (daysAgo) {
    return new Date(startOfDay(new Date()).getTime() - Number(daysAgo[1]) * DAY_MS);
  }

  if (internship.deadline) {
    return new Date(safeDate(internship.deadline).getTime() - 21 * DAY_MS);
  }

  if (internship.startDate) {
    return new Date(safeDate(internship.startDate).getTime() - 45 * DAY_MS);
  }

  return new Date();
}

function getInternshipDeadline(internship) {
  return internship.deadline || internship.startDate || internship.updatedAt || internship.createdAt;
}

function isAcceptedStatus(status) {
  return ["accepted", "hired", "completed", "interned", "offer accepted"].includes(
    String(status || "").trim().toLowerCase()
  );
}

function isFilledInternship(internship) {
  const status = String(internship.status || "").toLowerCase();
  return Boolean(internship.isFilled || status.includes("filled") || status.includes("completed") || status.includes("closed"));
}

function buildDailyTrend(internships, acceptedApplications) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 30 }, (_, index) => new Date(today.getTime() - (29 - index) * DAY_MS));
  const offeredByDate = new Map();
  const studentsByDate = new Map();

  internships.forEach((internship) => {
    const key = dateKey(parsePostedDate(internship));
    offeredByDate.set(key, (offeredByDate.get(key) || 0) + 1);

    if (isFilledInternship(internship)) {
      const filledKey = dateKey(safeDate(internship.startDate || internship.deadline || parsePostedDate(internship)));
      studentsByDate.set(filledKey, (studentsByDate.get(filledKey) || 0) + 1);
    }
  });

  acceptedApplications.forEach((application) => {
    const key = dateKey(safeDate(application.appliedAt));
    studentsByDate.set(key, (studentsByDate.get(key) || 0) + 1);
  });

  let offeredTotal = 0;
  let studentTotal = 0;

  return dates.map((date, index) => {
    const key = dateKey(date);
    offeredTotal += offeredByDate.get(key) || 0;
    studentTotal += studentsByDate.get(key) || 0;

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      shortDate: index % 5 === 0 ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      internships: offeredTotal,
      students: studentTotal,
      dailyInternships: offeredByDate.get(key) || 0,
      dailyStudents: studentsByDate.get(key) || 0,
    };
  });
}

function buildMonthBars(internships, acceptedApplications) {
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: MONTHS[date.getMonth()],
      offered: 0,
      students: 0,
    };
  });

  const byKey = new Map(months.map((month) => [month.key, month]));

  internships.forEach((internship) => {
    const date = parsePostedDate(internship);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (byKey.has(key)) byKey.get(key).offered += 1;
  });

  acceptedApplications.forEach((application) => {
    const date = safeDate(application.appliedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (byKey.has(key)) byKey.get(key).students += 1;
  });

  internships.filter(isFilledInternship).forEach((internship) => {
    const date = safeDate(internship.startDate || internship.deadline || parsePostedDate(internship));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (byKey.has(key) && byKey.get(key).students === 0) byKey.get(key).students += 1;
  });

  return months;
}

function buildSparkline(values, points = 7) {
  const safeValues = values.length ? values : [0];
  const max = Math.max(...safeValues, 1);
  return Array.from({ length: points }, (_, index) => {
    const source = safeValues[Math.min(safeValues.length - 1, Math.floor((index / (points - 1)) * (safeValues.length - 1)))] || 0;
    return {
      name: index,
      value: Math.max(0.2, Math.round((source / max) * 10) / 10),
    };
  });
}

function getAcceptedStudentForInternship(internship) {
  const accepted = (internship.applications || []).find((application) => isAcceptedStatus(application.status));
  return accepted?.student || null;
}

function CalendarMini({ internships }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const first = internships.map(getInternshipDeadline).filter(Boolean).sort()[0];
    return first ? safeDate(first) : new Date();
  });

  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const gridStart = new Date(monthStart.getTime() - monthStart.getDay() * DAY_MS);
  const deadlineMap = new Map();

  internships.forEach((internship) => {
    const deadline = getInternshipDeadline(internship);
    if (!deadline) return;
    const key = dateKey(safeDate(deadline));
    deadlineMap.set(key, [...(deadlineMap.get(key) || []), internship]);
  });

  const days = Array.from({ length: 42 }, (_, index) => new Date(gridStart.getTime() + index * DAY_MS));
  const upcoming = internships
    .map((internship) => ({ ...internship, deadlineDate: getInternshipDeadline(internship) }))
    .filter((internship) => internship.deadlineDate)
    .sort((a, b) => safeDate(a.deadlineDate) - safeDate(b.deadlineDate))
    .slice(0, 3);

  const moveMonth = (amount) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <div className="mt-4 rounded-[24px] border border-[rgba(53,88,114,0.12)] bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/10 dark:bg-white/[0.035]">
      <div className="mb-4 flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => moveMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm font-black text-[var(--ink)]">
          {MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </p>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => moveMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black text-[var(--muted)]">
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day.slice(0, 2)}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {days.map((day) => {
          const key = dateKey(day);
          const hasDeadline = deadlineMap.has(key);
          const muted = day.getMonth() !== visibleMonth.getMonth();
          return (
            <span
              key={key}
              className={cn(
                "relative grid h-8 place-items-center rounded-xl text-xs font-black transition",
                muted ? "text-[var(--muted)]/45" : "text-[var(--ink)]",
                hasDeadline && "bg-[rgba(156,213,255,0.28)] text-[var(--primary)] ring-1 ring-[rgba(122,170,206,0.35)] dark:bg-white/10 dark:text-[var(--accent)]"
              )}
            >
              {day.getDate()}
              {hasDeadline && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--gold)]" />}
            </span>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {upcoming.map((internship, index) => (
          <div key={internship.id} className="flex items-center gap-3 rounded-2xl bg-white/50 p-2.5 dark:bg-white/[0.04]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: [CHART.gold, CHART.blue, CHART.sage][index % 3] }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-[var(--ink)]">{shortTitle(internship.title)}</p>
              <p className="truncate text-[11px] font-semibold text-[var(--muted)]">{internship.department || "Internship"}</p>
            </div>
            <p className="text-xs font-black text-[var(--primary)]">{formatShortDate(internship.deadlineDate)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, caption, icon: Icon, data, color = CHART.blue }) {
  return (
    <AppCard className="overflow-hidden p-5">
      <div className="flex h-full min-h-[116px] items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(156,213,255,0.28)] dark:bg-white/[0.06]">
            <Icon className="h-5 w-5 text-[var(--primary)] dark:text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--ink)]">{value}</p>
            <p className="text-sm font-bold text-[var(--muted)]">{title}</p>
            <p className="mt-2 text-xs font-black text-[var(--primary)] dark:text-[var(--accent)]">↗ {caption}</p>
          </div>
        </div>

        <div className="h-16 w-36 shrink-0 opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`stat-${title.replace(/\s+/g, "-")}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill={`url(#stat-${title.replace(/\s+/g, "-")})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppCard>
  );
}

function AnalyticsCard({ title, subtitle, icon: Icon, action, children, className }) {
  return (
    <AppCard className={cn("p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon && (
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[rgba(156,213,255,0.22)] dark:bg-white/[0.06]">
                <Icon className="h-4 w-4 text-[var(--primary)] dark:text-[var(--accent)]" />
              </span>
            )}
            <h3 className="text-xl font-black tracking-tight text-[var(--ink)]">{title}</h3>
          </div>
          {subtitle && <p className="mt-1 text-sm font-semibold leading-6 text-[var(--muted)]">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </AppCard>
  );
}

export default function EmployerDashboardAnalytics({ snapshot, notifications = [] }) {
  const internships = snapshot?.internships || [];
  const applications = snapshot?.applications || [];
  const acceptedApplications = snapshot?.acceptedApplications || applications.filter((app) => isAcceptedStatus(app.status));
  const unreadAlerts = notifications.filter((note) => note.unread).length || (snapshot?.notifications || []).filter((note) => note.unread).length;

  const trendData = useMemo(() => buildDailyTrend(internships, acceptedApplications), [internships, acceptedApplications]);
  const monthBars = useMemo(() => buildMonthBars(internships, acceptedApplications), [internships, acceptedApplications]);

  const statCards = [
    {
      title: "Internships Offered",
      value: snapshot?.stats?.internshipsOffered || internships.length,
      caption: "offered roles",
      icon: BriefcaseBusiness,
      color: CHART.blue,
      data: buildSparkline(trendData.map((item) => item.internships)),
    },
    {
      title: "Students Interned",
      value: snapshot?.stats?.studentsInterned || 0,
      caption: "company interns",
      icon: GraduationCap,
      color: CHART.sage,
      data: buildSparkline(trendData.map((item) => item.students)),
    },
    {
      title: "Total Applicants",
      value: snapshot?.stats?.totalApplicants || applications.length || internships.reduce((sum, internship) => sum + Number(internship.applicants || 0), 0),
      caption: "candidate pool",
      icon: UsersRound,
      color: CHART.gold,
      data: buildSparkline(internships.map((internship) => Number(internship.applicants || (internship.applications || []).length || 0))),
    },
    {
      title: "Unread Alerts",
      value: unreadAlerts,
      caption: "needs review",
      icon: Bell,
      color: CHART.accent,
      data: buildSparkline([0, 1, unreadAlerts, Math.max(unreadAlerts - 1, 0), unreadAlerts + 1]),
    },
  ];

  const internedRows = internships
    .filter((internship) => isFilledInternship(internship) || (internship.applications || []).some((app) => isAcceptedStatus(app.status)))
    .slice(0, 4);

  return (
    <div className="space-y-5">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr_0.95fr_0.85fr]">
        <AnalyticsCard
          title="Internships Offered Over Time"
          subtitle="Cumulative roles posted by your company and students who completed/accepted internships."
          icon={TrendingUp}
          action={
            <Button type="button" variant="outline" size="sm" className="rounded-full bg-white/70 font-black text-[var(--primary)] dark:bg-white/[0.04] dark:text-[var(--accent)]">
              Last 30 days
            </Button>
          }
          className="xl:min-h-[430px]"
        >
          <div className="h-[245px] rounded-[24px] border border-[rgba(53,88,114,0.12)] bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="employer-offered" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={CHART.blue} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={CHART.blue} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="employer-students" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={CHART.sage} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART.sage} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(53,88,114,0.11)" vertical={false} />
                <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7B8794", fontWeight: 700 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7B8794", fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 18, border: "1px solid rgba(53,88,114,0.14)", boxShadow: "0 18px 45px rgba(44,57,71,0.14)" }}
                  labelStyle={{ fontWeight: 900, color: CHART.dark }}
                />
                <Area type="monotone" dataKey="internships" name="Internships offered" stroke={CHART.blueStrong} strokeWidth={3} fill="url(#employer-offered)" dot={false} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="students" name="Students interned" stroke={CHART.sage} strokeWidth={3} fill="url(#employer-students)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-[rgba(53,88,114,0.1)] bg-white/50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <p className="text-2xl font-black text-[var(--ink)]">{snapshot?.stats?.internshipsOffered || internships.length}</p>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">Total offered internships</p>
            </div>
            <div className="rounded-[22px] border border-[rgba(53,88,114,0.1)] bg-white/50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <p className="text-2xl font-black text-[var(--ink)]">{snapshot?.stats?.studentsInterned || 0}</p>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">Students interned here</p>
            </div>
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Monthly Hiring Shape"
          subtitle="Offered internships vs. students who made it into internships."
          icon={CheckCircle2}
          className="xl:min-h-[430px]"
        >
          <div className="h-[245px] rounded-[24px] border border-[rgba(53,88,114,0.12)] bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthBars} margin={{ top: 12, right: 4, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid stroke="rgba(53,88,114,0.1)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7B8794", fontWeight: 800 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7B8794", fontWeight: 800 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 18, border: "1px solid rgba(53,88,114,0.14)", boxShadow: "0 18px 45px rgba(44,57,71,0.14)" }}
                  labelStyle={{ fontWeight: 900, color: CHART.dark }}
                />
                <Bar dataKey="offered" name="Offered" fill={CHART.blue} radius={[10, 10, 4, 4]} />
                <Bar dataKey="students" name="Interned" fill={CHART.gold} radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black text-[var(--muted)]">
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART.blue }} /> Offered</span>
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART.gold }} /> Interned</span>
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Students per Internship"
          subtitle="Students who did internships with your company, grouped by role."
          icon={GraduationCap}
          className="xl:min-h-[430px]"
        >
          <div className="space-y-3">
            {(internedRows.length ? internedRows : internships.slice(0, 4)).map((internship) => {
              const student = getAcceptedStudentForInternship(internship);
              const filledCount = isFilledInternship(internship) ? 1 : 0;
              const acceptedCount = (internship.applications || []).filter((app) => isAcceptedStatus(app.status)).length;
              const count = Math.max(filledCount, acceptedCount);

              return (
                <div key={internship.id} className="flex items-center gap-3 rounded-[22px] border border-[rgba(53,88,114,0.1)] bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--primary)] text-white dark:bg-[var(--secondary)]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[var(--ink)]">{shortTitle(internship.title)}</p>
                    <p className="truncate text-xs font-bold text-[var(--muted)]">{internship.department || internship.duration || "Internship"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {student && (
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.image || student.avatar} alt={student.name} />
                        <AvatarFallback>{initials(student.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className="rounded-full bg-[rgba(156,213,255,0.26)] px-3 py-1 text-xs font-black text-[var(--primary)] dark:bg-white/10 dark:text-[var(--accent)]">
                      {count || 0} intern{count === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Internship Deadlines"
          subtitle="Calendar from offered internship deadlines."
          icon={CalendarDays}
          className="xl:min-h-[430px]"
        >
          <CalendarMini internships={internships} />
        </AnalyticsCard>
      </section>
    </div>
  );
}
