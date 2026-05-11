import { useEffect, useMemo, useState } from "react";
import { ShieldPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import AdminDashboardAnalytics from "@/components/AdminDashboard/AdminDashboardAnalytics";
import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/button";
import { getAdminDashboardSnapshot } from "@/data/demoStore";

function AdminDashboardHero({ snapshot }) {
  const navigate = useNavigate();

  const adminName =
    snapshot?.admin?.name ||
    [snapshot?.admin?.firstName, snapshot?.admin?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Nadine Amin";

  return (
    <AppCard className="mb-6 overflow-hidden">
      <div className="grid gap-6 p-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[var(--primary)]">
            Platform Command Center
          </p>

          <h2 className="text-4xl font-black tracking-tight text-[var(--ink)]">
            Admin Dashboard
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Review platform usage, monitor internship outcomes across companies,
            manage courses, users, and administrator access from one workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[adminName, "Administrator", "Live demo data"].map((tag) => (
              <span
                key={tag}
                className="inline-flex h-10 items-center rounded-full border border-[#7AAACE]/60 bg-[#5F86A3] px-4 text-xs font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.16)] dark:border-white/10 dark:bg-white/10 dark:text-[var(--accent)] dark:shadow-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-6 text-white shadow-[0_24px_65px_rgba(53,88,114,0.28)] dark:[background:var(--dashboard-hero-action-gradient)] dark:shadow-[0_24px_65px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold text-white/70">Quick action</p>

          <h3 className="mt-2 text-2xl font-black">Create admin</h3>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Provision a new administrator account with access to platform
            management screens.
          </p>

          <Button
            onClick={() => navigate("/admin/users/create-admin")}
            className="mt-5 rounded-2xl bg-white px-5 font-black text-[var(--primary)] hover:bg-white/90"
          >
            <ShieldPlus className="mr-2 h-4 w-4" />
            Create Admin
          </Button>
        </div>
      </div>
    </AppCard>
  );
}

export default function AdminOverview() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((value) => value + 1);

    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, []);

  const snapshot = useMemo(() => getAdminDashboardSnapshot(), [tick]);

  return (
    <AdminPageShell sidebarProgress={{ label: "Platform health", value: 96 }}>
      <AdminDashboardHero snapshot={snapshot} />
      <AdminDashboardAnalytics snapshot={snapshot} />
    </AdminPageShell>
  );
}