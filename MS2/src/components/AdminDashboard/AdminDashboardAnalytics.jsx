import { motion } from "framer-motion";
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
  BookOpen,
  BriefcaseBusiness,
  Building2,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";

const chartColors = {
  blue: "#7AAACE",
  darkBlue: "#355872",
  navy: "#2C3947",
  gold: "#E6C77B",
  sage: "#6F946F",
  paleBlue: "#9CD5FF",
};

const roleColors = [
  chartColors.blue,
  chartColors.gold,
  chartColors.sage,
  chartColors.darkBlue,
];

const cardMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en").format(safeNumber(value));
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function AdminStatCard({ icon: Icon, label, value, detail, data, color }) {
  const sparkline = safeArray(data);
  const gradientId = `adminSpark-${label.replace(/\s+/g, "")}`;

  return (
    <motion.div variants={cardMotion}>
      <AppCard className="overflow-hidden p-5">
        <div className="flex min-h-[120px] items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7AAACE]/25 bg-[#9CD5FF]/20 text-[var(--primary)] dark:border-white/10 dark:bg-white/10 dark:text-[var(--accent)]">
              <Icon className="h-5 w-5" />
            </div>

            <p className="text-3xl font-black text-[var(--ink)]">
              {formatNumber(value)}
            </p>

            <p className="mt-1 text-sm font-bold text-[var(--muted)]">
              {label}
            </p>

            <p className="mt-3 text-xs font-black text-[var(--primary)]">
              ↗ {detail}
            </p>
          </div>

          <div className="h-14 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sparkline}
                margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.48} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={3}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AppCard>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, description, chip }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex min-w-0 gap-3">
        {Icon && (
          <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#9CD5FF]/20 text-[var(--primary)] dark:bg-white/10 dark:text-[var(--accent)]">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="text-xl font-black text-[var(--ink)]">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      {chip && (
        <span className="shrink-0 rounded-2xl border border-[var(--border-soft)] bg-white/70 px-4 py-2 text-xs font-black text-[var(--primary)] shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-[var(--accent)]">
          {chip}
        </span>
      )}
    </div>
  );
}

function InternshipsOverTime({ data }) {
  const chartData = safeArray(data);

  return (
    <motion.div variants={cardMotion}>
      <AppCard className="h-full p-6">
        <SectionHeader
          icon={TrendingUp}
          title="Internships offered over time"
          description="Roles posted across all companies and students who completed or accepted internships."
          chip="All companies"
        />

        <div className="h-[235px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 18, left: -12, bottom: 4 }}
            >
              <defs>
                <linearGradient id="adminOffered" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.blue}
                    stopOpacity={0.42}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.blue}
                    stopOpacity={0.03}
                  />
                </linearGradient>

                <linearGradient id="adminInterned" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.gold}
                    stopOpacity={0.42}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.gold}
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="currentColor"
                strokeOpacity={0.08}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "var(--muted)",
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "var(--muted)",
                }}
              />

              <Tooltip
                cursor={{ stroke: chartColors.blue, strokeOpacity: 0.18 }}
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(122,170,206,0.25)",
                  boxShadow: "0 20px 45px rgba(44,57,71,0.18)",
                  fontWeight: 800,
                }}
              />

              <Area
                type="monotone"
                dataKey="cumulativeOffered"
                name="Internships offered"
                stroke={chartColors.blue}
                strokeWidth={3}
                fill="url(#adminOffered)"
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />

              <Area
                type="monotone"
                dataKey="cumulativeInterned"
                name="Students interned"
                stroke={chartColors.gold}
                strokeWidth={3}
                fill="url(#adminInterned)"
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-xs font-black text-[var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#7AAACE]" />
            Offered
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#E6C77B]" />
            Students interned
          </span>
        </div>
      </AppCard>
    </motion.div>
  );
}

function UsersByRole({ data, total }) {
  const roleData = safeArray(data).filter((item) => safeNumber(item.value) > 0);

  return (
    <motion.div variants={cardMotion}>
      <AppCard className="h-full p-6">
        <SectionHeader
          title="Users by role"
          description="Students, employers, instructors, and admins."
        />

        <div className="grid items-center gap-4 sm:grid-cols-[0.85fr_1fr] xl:grid-cols-1 2xl:grid-cols-[0.85fr_1fr]">
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="label"
                >
                  {roleData.map((entry, index) => (
                    <Cell
                      key={entry.label}
                      fill={roleColors[index % roleColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid rgba(122,170,206,0.25)",
                    boxShadow: "0 20px 45px rgba(44,57,71,0.18)",
                    fontWeight: 800,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white/70 p-3 text-center dark:border-white/10 dark:bg-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)]">
                Total
              </p>
              <p className="mt-1 text-2xl font-black text-[var(--ink)]">
                {formatNumber(total)}
              </p>
            </div>

            {roleData.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="inline-flex items-center gap-2 font-black text-[var(--muted)]">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: roleColors[index % roleColors.length],
                    }}
                  />
                  {item.label}
                </span>

                <span className="font-black text-[var(--ink)]">
                  {formatNumber(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AppCard>
    </motion.div>
  );
}

function CompanyOutcomes({ companies }) {
  const rows = safeArray(companies).slice(0, 4);

  return (
    <motion.div variants={cardMotion}>
      <AppCard className="h-full p-6">
        <SectionHeader
          icon={Building2}
          title="Company outcomes"
          description="Students who interned, grouped by company."
        />

        <div className="grid gap-3 md:grid-cols-2">
          {rows.length > 0 ? (
            rows.map((company, index) => (
              <div
                key={`${company.id || company.name}-${index}`}
                className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--border-soft)] bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{
                      backgroundColor:
                        [
                          chartColors.darkBlue,
                          chartColors.blue,
                          chartColors.gold,
                          chartColors.sage,
                        ][index % 4],
                    }}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[var(--ink)]">
                      {company.name}
                    </p>
                    <p className="text-xs font-bold text-[var(--muted)]">
                      {formatNumber(company.offered)} offered roles
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xl font-black text-[var(--primary)]">
                    {formatNumber(company.interned)}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)]">
                    Interned
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border-soft)] p-6 text-sm font-bold text-[var(--muted)] dark:border-white/10">
              No internship outcomes yet.
            </div>
          )}
        </div>
      </AppCard>
    </motion.div>
  );
}

function MonthlyHiring({ data }) {
  const chartData = safeArray(data);

  return (
    <motion.div variants={cardMotion}>
      <AppCard className="h-full p-6">
        <SectionHeader
          title="Monthly hiring shape"
          description="Offered internships vs. students who made it into internships."
        />

        <div className="h-[215px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 8, left: -18, bottom: 4 }}
            >
              <CartesianGrid
                stroke="currentColor"
                strokeOpacity={0.08}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "var(--muted)",
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "var(--muted)",
                }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(122,170,206,0.25)",
                  boxShadow: "0 20px 45px rgba(44,57,71,0.18)",
                  fontWeight: 800,
                }}
              />

              <Bar
                dataKey="offered"
                name="Offered"
                fill={chartColors.blue}
                radius={[10, 10, 0, 0]}
                maxBarSize={34}
              />

              <Bar
                dataKey="interned"
                name="Interned"
                fill={chartColors.gold}
                radius={[10, 10, 0, 0]}
                maxBarSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AppCard>
    </motion.div>
  );
}

export default function AdminDashboardAnalytics({ snapshot }) {
  const stats = snapshot?.stats || {};
  const sparklines = snapshot?.sparklines || {};

  const cards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      detail: "platform accounts",
      data: sparklines.users,
      color: chartColors.blue,
    },
    {
      icon: FolderKanban,
      label: "Total Projects",
      value: stats.projects,
      detail: "portfolio records",
      data: sparklines.projects,
      color: chartColors.sage,
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats.courses,
      detail: "course catalog",
      data: sparklines.courses,
      color: chartColors.gold,
    },
    {
      icon: BriefcaseBusiness,
      label: "Internships Offered",
      value: stats.internshipsOffered,
      detail: "all companies",
      data: sparklines.internships,
      color: chartColors.darkBlue,
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AdminStatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <InternshipsOverTime data={snapshot?.internshipTimeline} />

        <UsersByRole
          data={snapshot?.roleDistribution}
          total={stats.totalUsers}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <MonthlyHiring data={snapshot?.internshipTimeline} />

        <CompanyOutcomes companies={snapshot?.companyOutcomes} />
      </div>
    </motion.div>
  );
}