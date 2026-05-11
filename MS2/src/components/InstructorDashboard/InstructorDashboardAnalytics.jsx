import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  MessageSquareText,
  Star,
  UsersRound,
} from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/button";
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
const COURSE_COLORS = [CHART.blue, CHART.gold, CHART.sage, CHART.dark, CHART.accent];

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
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(safeDate(value));
}

function shortTitle(value = "Project") {
  return value.length > 24 ? `${value.slice(0, 24)}...` : value;
}

function buildSparkline(seed = 1) {
  return Array.from({ length: 8 }, (_, index) => ({
    name: index,
    value: Math.max(1, seed + Math.round(Math.sin(index * 1.1 + seed) * 2) + index + (index % 2)),
  }));
}

function getProjectDate(project) {
  return project.updatedAt || project.createdAt || new Date().toISOString();
}

function getReviewDate(item) {
  return item.due || item.project?.updatedAt || item.project?.createdAt || new Date().toISOString();
}

function buildReviewTrend(projects, queue) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 30 }, (_, index) => new Date(today.getTime() - (29 - index) * DAY_MS));
  const projectMap = new Map();
  const feedbackMap = new Map();

  projects.forEach((project) => {
    const key = dateKey(safeDate(getProjectDate(project)));
    projectMap.set(key, (projectMap.get(key) || 0) + 1);

    (project.feedback || []).forEach((feedback) => {
      const feedbackKey = dateKey(safeDate(feedback.createdAt || project.updatedAt));
      feedbackMap.set(feedbackKey, (feedbackMap.get(feedbackKey) || 0) + 1);
    });

    (project.tasks || []).forEach((task) => {
      (task.feedback || []).forEach((feedback) => {
        const feedbackKey = dateKey(safeDate(feedback.createdAt || task.updatedAt || project.updatedAt));
        feedbackMap.set(feedbackKey, (feedbackMap.get(feedbackKey) || 0) + 1);
      });
    });
  });

  queue.forEach((item) => {
    const key = dateKey(safeDate(getReviewDate(item)));
    feedbackMap.set(key, (feedbackMap.get(key) || 0) + 1);
  });

  let cumulativeProjects = 0;
  let cumulativeReviews = 0;

  return dates.map((date, index) => {
    const key = dateKey(date);
    cumulativeProjects += projectMap.get(key) || 0;
    cumulativeReviews += feedbackMap.get(key) || 0;
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      shortDate: index % 5 === 0 ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      projects: cumulativeProjects,
      reviews: cumulativeReviews,
    };
  });
}

function buildMonthlyBars(projects, queue) {
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: MONTHS[date.getMonth()],
      projects: 0,
      reviews: 0,
    };
  });

  const byKey = new Map(months.map((month) => [month.key, month]));

  projects.forEach((project) => {
    const date = safeDate(project.createdAt || project.updatedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (byKey.has(key)) byKey.get(key).projects += 1;
  });

  queue.forEach((item) => {
    const date = safeDate(getReviewDate(item));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (byKey.has(key)) byKey.get(key).reviews += 1;
  });

  return months;
}
function isRealCourseProject(project) {
  if (!project) return false;

  const typeText = [
    project.type,
    project.category,
    project.kind,
    project.source,
    project.recordType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const titleText = [project.title, project.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const courseText = [
    project.course,
    project.courseName,
    project.courseCode,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const looksLikePortfolio =
    typeText.includes("portfolio") ||
    typeText.includes("profile") ||
    titleText.includes("portfolio") ||
    titleText.includes("profile") ||
    courseText === "portfolio";

  return !looksLikePortfolio;
}

function getCourseIdentity(course) {
  return [
    course?.id,
    course?.code,
    course?.courseCode,
    course?.name,
    course?.title,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase());
}

function findLinkedCourse(project, courses = []) {
  return courses.find((course) => {
    const courseValues = getCourseIdentity(course);

    const projectValues = [
      project?.courseId,
      project?.courseCode,
      project?.courseName,
      project?.course,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());

    return projectValues.some((value) => courseValues.includes(value));
  });
}

function getCourseLabel(project, courses = []) {
  const matchedCourse = findLinkedCourse(project, courses);

  return (
    matchedCourse?.code ||
    matchedCourse?.courseCode ||
    project?.courseCode ||
    matchedCourse?.name ||
    matchedCourse?.title ||
    project?.courseName ||
    project?.course ||
    "Unlinked course"
  );
}

function getCourseRows(courses, projects) {
  const realProjects = projects.filter(isRealCourseProject);

  return courses
    .map((course, index) => {
      const courseProjects = realProjects.filter((project) => {
        const matchedCourse = findLinkedCourse(project, [course]);
        return Boolean(matchedCourse);
      });

      const pending = courseProjects.filter(
        (project) => !(project.feedback || []).length
      ).length;

      return {
        ...course,
        color: COURSE_COLORS[index % COURSE_COLORS.length],
        projectCount: courseProjects.length,
        pending,
      };
    })
    .filter((course) => course.projectCount > 0 || course.pending > 0)
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 5);
}

function getProjectCourseStats(projects, courses = []) {
  const realProjects = projects.filter(isRealCourseProject);

  const counts = realProjects.reduce((acc, project) => {
    const label = getCourseLabel(project, courses);

    if (String(label).trim().toLowerCase() === "portfolio") {
      return acc;
    }

    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const total =
    Object.values(counts).reduce((sum, count) => sum + count, 0) || 1;

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], index) => ({
      name,
      count,
      fill: COURSE_COLORS[index % COURSE_COLORS.length],
      percent: Math.round((count / total) * 100),
    }));
}
function getCalendarCells(viewDate, queue) {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = new Date(first.getTime() - first.getDay() * DAY_MS);
  const deadlineMap = new Map();

  queue.forEach((item) => {
    const key = dateKey(safeDate(getReviewDate(item)));
    deadlineMap.set(key, [...(deadlineMap.get(key) || []), item]);
  });

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getTime() + index * DAY_MS);
    return {
      date,
      isCurrentMonth: date.getMonth() === viewDate.getMonth(),
      isToday: dateKey(date) === dateKey(new Date()),
      items: deadlineMap.get(dateKey(date)) || [],
    };
  });
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-black tracking-tight text-[color:var(--ink)]">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-[48ch] text-sm font-semibold leading-6 text-[color:var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <span className="shrink-0 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-xs font-black text-[color:var(--accent)] shadow-[0_10px_25px_rgba(53,88,114,0.08)]">
          {action}
        </span>
      ) : null}
    </div>
  );
}

function TinyArea({ data, color = CHART.blue }) {
  return (
    <ResponsiveContainer width="100%" height={56}>
      <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.36} />
            <stop offset="95%" stopColor={color} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill={`url(#spark-${color.replace("#", "")})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatCard({ title, value, helper, icon: Icon, sparkSeed, tone = "blue" }) {
  const color = tone === "gold" ? CHART.gold : tone === "green" ? CHART.sage : tone === "dark" ? CHART.dark : CHART.blue;
  return (
    <AppCard className="min-h-[132px] overflow-hidden p-5">
      <div className="flex h-full items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(53,88,114,0.09)] bg-white/55 text-[var(--primary)] shadow-[0_10px_28px_rgba(53,88,114,0.08)]">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-3xl font-black leading-none text-[color:var(--ink)]">{value}</p>
          <p className="mt-2 text-sm font-black text-[color:var(--muted)]">{title}</p>
          <p className="mt-3 text-xs font-black text-[color:var(--accent)]">↗ {helper}</p>
        </div>
        <div className="mt-9 h-16 w-36 opacity-95">
          <TinyArea data={buildSparkline(sparkSeed)} color={color} />
        </div>
      </div>
    </AppCard>
  );
}

function CalendarCard({ queue }) {
  const firstDate = queue.map(getReviewDate).filter(Boolean).sort()[0];
  const [visibleMonth, setVisibleMonth] = useState(() => (firstDate ? safeDate(firstDate) : new Date()));
  const cells = getCalendarCells(visibleMonth, queue);
  const upcoming = queue
    .map((item) => ({ ...item, dueDate: getReviewDate(item) }))
    .sort((a, b) => safeDate(a.dueDate) - safeDate(b.dueDate))
    .slice(0, 3);

  const moveMonth = (amount) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <AppCard className="p-5 xl:col-span-3">
      <SectionTitle
        title="Review deadlines"
        description="Calendar from project tasks and thesis feedback due dates."
      />

      <div className="mt-4 rounded-[24px] border border-[rgba(53,88,114,0.12)] bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
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
          {cells.map((cell) => {
            const key = dateKey(cell.date);
            const hasDeadline = cell.items.length > 0;
            return (
              <span
                key={key}
                className={cn(
                  "relative grid h-8 place-items-center rounded-xl text-xs font-black transition",
                  cell.isCurrentMonth ? "text-[var(--ink)]" : "text-[var(--muted)]/40",
                  cell.isToday && "bg-white text-[var(--primary)] shadow-[0_10px_25px_rgba(53,88,114,0.12)]",
                  hasDeadline && "bg-[rgba(156,213,255,0.26)] text-[var(--primary)] ring-1 ring-[rgba(122,170,206,0.35)]"
                )}
              >
                {cell.date.getDate()}
                {hasDeadline ? <i className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--gold)]" /> : null}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {upcoming.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/45 px-3 py-2 text-xs font-bold text-[var(--muted)]">
            <span className="truncate text-[var(--ink)]">{shortTitle(item.title)}</span>
            <span>{formatShortDate(item.dueDate)}</span>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

function CourseDistribution({ data }) {
  const top = data[0];
  return (
    <AppCard className="p-5 xl:col-span-3">
      <SectionTitle title="Projects by course" description="Distribution across supervised and linked-course projects." />
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1 2xl:grid-cols-[0.9fr_1.1fr]">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius="58%" outerRadius="86%" paddingAngle={4} dataKey="count">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} projects`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div className="rounded-[24px] bg-white/45 p-4 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[var(--muted)]">Top</p>
            <p className="mt-2 text-lg font-black text-[var(--ink)]">{top?.name || "No courses"}</p>
            <p className="text-sm font-black text-[var(--primary)]">{top?.percent || 0}%</p>
          </div>
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-3 text-sm font-black text-[var(--muted)]">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: entry.fill }} />
                <span className="truncate">{entry.name}</span>
              </span>
              <span className="text-[var(--ink)]">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </AppCard>
  );
}

function CourseCoverage({ rows }) {
  return (
    <AppCard className="p-5 xl:col-span-4">
      <SectionTitle title="Linked courses" description="Courses automatically linked to your instructor workspace." />
      <div className="space-y-3">
        {rows.map((course) => (
          <div key={course.id || course.code} className="flex items-center justify-between gap-4 rounded-[22px] border border-[rgba(53,88,114,0.08)] bg-white/55 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-[0_14px_32px_rgba(53,88,114,0.12)]" style={{ background: course.color }}>
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-black text-[var(--ink)]">{course.name}</h4>
                <p className="text-xs font-bold text-[var(--muted)]">{course.code || "Course"} · {course.projectCount} projects</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-[var(--primary)]">{course.pending}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--muted)]">Pending</p>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

function ReviewQueue({ items }) {
  return (
    <AppCard className="p-5 xl:col-span-5">
      <SectionTitle
        title="Review queue"
        description="Projects, task updates, and thesis drafts waiting for instructor feedback."
        action="Feedback workspace"
      />
      <div className="space-y-3">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-[24px] border border-[rgba(53,88,114,0.08)] bg-white/55 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-black text-[var(--ink)]">{item.title}</h4>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-black",
                    item.priority === "High" ? "bg-red-50 text-red-600" : "bg-[rgba(230,199,123,0.22)] text-[var(--primary)]"
                  )}>
                    {item.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-[var(--muted)]">
                  {item.student} · {item.course} · {item.type}
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" className="rounded-2xl bg-white/70 px-4 text-xs font-black text-[var(--primary)]">
                  <MessageSquareText className="mr-2 h-4 w-4" />
                  Comment
                </Button>
                <Button type="button" variant="ghost" className="rounded-2xl bg-white/70 px-4 text-xs font-black text-[var(--primary)]">
                  <Star className="mr-2 h-4 w-4" />
                  Rate
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs font-black text-[var(--primary)]">{item.action}</p>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

export default function InstructorDashboardAnalytics({ snapshot, notifications = [] }) {
  const projects = snapshot.supervisedProjects || [];
  const queue = snapshot.reviewQueue || [];
  const courseRows = useMemo(() => getCourseRows(snapshot.linkedCourses || [], projects), [snapshot.linkedCourses, projects]);
 const courseStats = useMemo(
  () => getProjectCourseStats(projects, snapshot.linkedCourses || []),
  [projects, snapshot.linkedCourses]
);
  const reviewTrend = useMemo(() => buildReviewTrend(projects, queue), [projects, queue]);
  const monthlyBars = useMemo(() => buildMonthlyBars(projects, queue), [projects, queue]);

  const stats = [
    {
      title: "Linked Courses",
      value: snapshot.stats.linkedCourses,
      helper: `${snapshot.stats.activeCourses} active this semester`,
      icon: BookOpenCheck,
      tone: "blue",
      sparkSeed: snapshot.stats.linkedCourses + 2,
    },
    {
      title: "Projects to Review",
      value: snapshot.stats.projectsToReview,
      helper: `${snapshot.stats.projectsNeedingFeedbackToday} need feedback today`,
      icon: ClipboardCheck,
      tone: "green",
      sparkSeed: snapshot.stats.projectsToReview + 1,
    },
    {
      title: "Pending Invites",
      value: snapshot.stats.pendingInvites,
      helper: `${snapshot.stats.bachelorProjects} bachelor projects`,
      icon: UsersRound,
      tone: "gold",
      sparkSeed: snapshot.stats.pendingInvites + 3,
    },
    {
      title: "Average Rating",
      value: snapshot.stats.averageRating,
      helper: "supervised projects",
      icon: Star,
      tone: "dark",
      sparkSeed: Math.round(Number(snapshot.stats.averageRating || 0) * 2),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <AppCard className="p-5 xl:col-span-6">
          <SectionTitle
            title="Review activity over time"
            description="Cumulative projects under supervision and review actions created in the last 30 days."
            action="Last 30 days"
          />
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewTrend} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reviewsBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART.blue} stopOpacity={0.36} />
                    <stop offset="95%" stopColor={CHART.blue} stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="reviewsGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART.gold} stopOpacity={0.34} />
                    <stop offset="95%" stopColor={CHART.gold} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(53,88,114,0.08)" vertical={false} />
                <XAxis dataKey="shortDate" tickLine={false} axisLine={false} tick={{ fill: "#77879b", fontSize: 12, fontWeight: 800 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#77879b", fontSize: 12, fontWeight: 800 }} />
                <Tooltip contentStyle={{ borderRadius: 18, border: "1px solid rgba(53,88,114,0.12)", boxShadow: "0 18px 45px rgba(53,88,114,0.12)" }} />
                <Area type="monotone" dataKey="projects" name="Projects supervised" stroke={CHART.blue} strokeWidth={3} fill="url(#reviewsBlue)" />
                <Area type="monotone" dataKey="reviews" name="Review actions" stroke={CHART.gold} strokeWidth={3} fill="url(#reviewsGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-black text-[var(--muted)]">
            <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full" style={{ background: CHART.blue }} /> Projects</span>
            <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full" style={{ background: CHART.gold }} /> Reviews</span>
          </div>
        </AppCard>

        <CourseDistribution data={courseStats} />
        <CalendarCard queue={queue} />
      </section>

      <section className="grid gap-5 xl:grid-cols-9">
        <AppCard className="p-5 xl:col-span-4">
          <SectionTitle
            title="Monthly review shape"
            description="Supervised projects vs review actions by month."
          />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBars} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="rgba(53,88,114,0.08)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#77879b", fontSize: 12, fontWeight: 800 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#77879b", fontSize: 12, fontWeight: 800 }} />
                <Tooltip contentStyle={{ borderRadius: 18, border: "1px solid rgba(53,88,114,0.12)", boxShadow: "0 18px 45px rgba(53,88,114,0.12)" }} />
                <Bar dataKey="projects" name="Projects" fill={CHART.blue} radius={[10, 10, 0, 0]} />
                <Bar dataKey="reviews" name="Reviews" fill={CHART.gold} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppCard>

        <CourseCoverage rows={courseRows} />
        <ReviewQueue items={queue} />
      </section>

      {notifications.length > 0 ? (
        <section className="grid gap-5 xl:grid-cols-12">
          <AppCard className="p-5 xl:col-span-12">
            <SectionTitle title="Recent instructor alerts" description="Latest course, message, invitation, and feedback notifications." />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {notifications.slice(0, 6).map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 rounded-[22px] border border-[rgba(53,88,114,0.08)] bg-white/55 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[rgba(156,213,255,0.25)] text-[var(--primary)]">
                    {notification.unread ? <Bell className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[var(--ink)]">{notification.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[var(--muted)]">{notification.text || notification.message || notification.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        </section>
      ) : null}
    </div>
  );
}
