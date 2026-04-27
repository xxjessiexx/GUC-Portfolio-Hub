import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
  maxWidth = "max-w-[610px]",
  contentClassName = "px-16 py-12 max-sm:px-7 max-sm:py-9",
}) {
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

    globalThis.addEventListener("mousemove", handleMouseMove);
    return () => globalThis.removeEventListener("mousemove", handleMouseMove);
  }, [blobOneX, blobOneY, blobTwoX, blobTwoY]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--background)_0%,#EAF4FA_45%,#D8ECF8_100%)] p-6 text-[color:var(--ink)]">
      <motion.div
        style={{ x: blobOneX, y: blobOneY }}
        className="pointer-events-none fixed -left-28 -top-36 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,rgba(122,170,206,0.32)_55%,transparent_72%)] blur-3xl"
      />

      <motion.div
        style={{ x: blobTwoX, y: blobTwoY }}
        className="pointer-events-none fixed -bottom-52 -right-44 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.62)_0%,rgba(230,199,123,0.16)_52%,transparent_72%)] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`relative z-10 w-full ${maxWidth}`}
      >
        <Card className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[var(--card-bg)] shadow-[var(--shadow-card)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.75),transparent_36%),radial-gradient(circle_at_top_right,rgba(230,199,123,0.13),transparent_34%)]" />

          <CardContent className={`relative z-10 ${contentClassName}`}>
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}