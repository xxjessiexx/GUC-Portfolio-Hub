import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import DashboardFooter from "@/components/footer/DashboardFooter";

export default function DashboardLayout({ children, notifications }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const blobOneX = useSpring(0, { stiffness: 45, damping: 18 });
  const blobOneY = useSpring(0, { stiffness: 45, damping: 18 });
  const blobTwoX = useSpring(0, { stiffness: 35, damping: 20 });
  const blobTwoY = useSpring(0, { stiffness: 35, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 90;
      const y = (event.clientY / window.innerHeight - 0.5) * 90;

      blobOneX.set(x);
      blobOneY.set(y);
      blobTwoX.set(-x);
      blobTwoY.set(-y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [blobOneX, blobOneY, blobTwoX, blobTwoY]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[image:var(--page-gradient)] text-[var(--ink)]">
      <motion.div
        style={{ x: blobOneX, y: blobOneY }}
        className="pointer-events-none fixed -left-28 -top-36 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,rgba(122,170,206,0.32)_55%,transparent_72%)] blur-3xl"
      />

      <motion.div
        style={{ x: blobTwoX, y: blobTwoY }}
        className="pointer-events-none fixed -bottom-52 -right-44 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.62)_0%,rgba(230,199,123,0.16)_52%,transparent_72%)] blur-3xl"
      />

      <TopNav notifications={notifications} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="relative z-10 min-h-screen pt-20">
        <div className="ml-[92px] w-[calc(100vw-92px)] overflow-x-hidden px-6 py-8">
          <div className="w-full max-w-none space-y-6">
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
    </main>
  );
}