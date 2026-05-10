import {
  BarChart3,
  BriefcaseBusiness,
  BookOpen,
  FolderKanban,
  Users,
} from "lucide-react";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminMetricCard } from "@/components/adminModule/AdminMetricCard";

import AdminAnalyticsSection from "@/components/adminModule/AdminAnalyticsSection";
import AdminProgressBar from "@/components/adminModule/AdminProgressBar";
import AdminSnapshotCard from "@/components/adminModule/AdminSnapshotCard";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const metricIcons = [
  Users,
  FolderKanban,
  BookOpen,
  BriefcaseBusiness,
];

export default function AdminStatistics() {
  const { statistics } = useAdminModuleData();

  const instructors =
    statistics.roleDistribution.find(
      (item) => item.label === "Instructors"
    )?.value || 0;

  const metricCards = [
    {
      label: "Active users",
      value: statistics.activeUsers,
      detail: "All stakeholder roles",
    },

    {
      label: "Total projects",
      value: statistics.totalProjects,
      detail: "Visible project records",
    },

    {
      label: "Total courses",
      value: statistics.totalCourses || 0,
      detail: "Catalog records",
    },

    {
      label: "Course instructors",
      value: instructors,
      detail: "Teaching accounts",
    },
  ];

  const maxMonthly = Math.max(...statistics.monthlyProjects);

  const maxRoles = Math.max(
    ...statistics.roleDistribution.map((item) => item.value)
  );

  const maxEmployer = Math.max(
    ...(statistics.employerStatus || []).map(
      (item) => item.value
    ),
    1
  );

  const maxModeration = Math.max(
    ...(statistics.projectModeration || []).map(
      (item) => item.value
    ),
    1
  );

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Platform analytics"
        title="Usage Statistics"
        description="Track projects, users, moderation activity, courses, and employer approvals."
        icon={BarChart3}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric, index) => (
          <AdminMetricCard
            key={metric.label}
            {...metric}
            icon={metricIcons[index]}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminAnalyticsSection
          eyebrow="Projects"
          title="Project Creation Over Time"
          subtitle="Monthly project submissions."
        >
          <div className="space-y-4">
            {statistics.monthlyProjects.map((value, index) => (
              <AdminProgressBar
                key={index}
                label={`Month ${index + 1}`}
                value={value}
                max={maxMonthly}
              />
            ))}
          </div>
        </AdminAnalyticsSection>

        <AdminAnalyticsSection
          eyebrow="Requirement 73"
          title="Platform Snapshot"
          subtitle="Quick overview of the platform."
          variant="strong"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Users", statistics.activeUsers],
              ["Projects", statistics.totalProjects],
              ["Courses", statistics.totalCourses || 0],
              ["Employers", statistics.approvedEmployers],
            ].map(([label, value]) => (
              <AdminSnapshotCard
                key={label}
                label={label}
                value={value}
              />
            ))}
          </div>
        </AdminAnalyticsSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminAnalyticsSection
          eyebrow="Users"
          title="Role Distribution"
          subtitle="Accounts grouped by role."
        >
          <div className="space-y-4">
            {statistics.roleDistribution.map((item) => (
              <AdminProgressBar
                key={item.label}
                label={item.label}
                value={item.value}
                max={maxRoles}
              />
            ))}
          </div>
        </AdminAnalyticsSection>

        <AdminAnalyticsSection
          eyebrow="Employers"
          title="Approval Status"
          subtitle="Employer approval pipeline."
        >
          <div className="space-y-4">
            {(statistics.employerStatus || []).map((item) => (
              <AdminProgressBar
                key={item.label}
                label={item.label}
                value={item.value}
                max={maxEmployer}
              />
            ))}
          </div>
        </AdminAnalyticsSection>
      </div>

      <AdminAnalyticsSection
        eyebrow="Moderation"
        title="Project Safety State"
        subtitle="Flagged and moderated projects."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {(statistics.projectModeration || []).map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-[color:var(--border-blue)] bg-white/60 p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {item.label}
              </p>

              <p className="mt-2 text-3xl font-black text-[color:var(--primary)]">
                {item.value}
              </p>

              <div className="mt-4">
                <AdminProgressBar
                  label="Share"
                  value={item.value}
                  max={maxModeration}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminAnalyticsSection>
    </AdminPageShell>
  );
}