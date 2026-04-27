import { Bell, CheckCircle2, Eye, FolderKanban } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats({ stats }) {
  return (
    <section className="mb-6 grid gap-5 md:grid-cols-4">
      <StatCard title="Total Projects" value={stats.total} icon={FolderKanban} />
      <StatCard title="Public Projects" value={stats.public} icon={Eye} />
      <StatCard title="Unread Alerts" value={stats.unread} icon={Bell} />
      <StatCard
        title="Portfolio Done"
        value={`${stats.completion}%`}
        icon={CheckCircle2}
      />
    </section>
  );
}