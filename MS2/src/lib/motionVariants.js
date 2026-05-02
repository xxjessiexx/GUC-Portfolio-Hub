export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeInOut = [0.4, 0, 0.2, 1];
export const springSoft = { type: "spring", stiffness: 140, damping: 22 };

export const pageReveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: easeOutExpo } },
};
export const revealUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: easeOutExpo } },
};
export const revealDown = {
  hidden: { opacity: 0, y: -18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: easeOutExpo } },
};
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: easeOutExpo } },
};
export const fadeInUp = revealUp;
export const pageFade = pageReveal;
export const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } };
export const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } } };
export const cardLift = { rest: { y: 0, scale: 1 }, hover: { y: -8, scale: 1.012, transition: { duration: 0.28, ease: easeOutExpo } } };
export const softScale = { rest: { scale: 1 }, hover: { scale: 1.025, transition: { duration: 0.22, ease: easeOutExpo } } };
export const tapScale = { scale: 0.98 };
