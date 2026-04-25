import { useState } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import DashboardFooter from "@/components/footer/DashboardFooter";

export default function DashboardLayout({ children, notifications }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,var(--background)_0%,#EAF4FA_45%,#D8ECF8_100%)] text-[var(--ink)]">
      <div className="pointer-events-none fixed -left-52 -top-52 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,rgba(122,170,206,0.25)_55%,transparent_72%)] blur-3xl" />
      <div className="pointer-events-none fixed -bottom-56 -right-48 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.45)_0%,rgba(230,199,123,0.15)_52%,transparent_72%)] blur-3xl" />

      <TopNav notifications={notifications} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="relative z-10 min-h-screen pl-[92px] pt-20">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
          <DashboardFooter />
        </div>
      </div>
    </main>
  );
}