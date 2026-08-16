import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

import { useEffect } from "react";

const toastStyles = {
  success: {
    container: "border-[#CDEED8] bg-[#F1FBF4]",
    accent: "bg-[#16A34A]",
    iconBg: "bg-[#16A34A]",
    Icon: Check,
  },

  info: {
    container: "border-[#CFE3F5] bg-[#F4F9FD]",
    accent: "bg-[#2563A6]",
    iconBg: "bg-[#2563A6]",
    Icon: Info,
  },

  warning: {
    container: "border-[#F4DC9A] bg-[#FFF9EA]",
    accent: "bg-[#D28B00]",
    iconBg: "bg-[#D28B00]",
    Icon: AlertTriangle,
  },

  error: {
    container: "border-[#F4CACA] bg-[#FFF4F4]",
    accent: "bg-[#DC2626]",
    iconBg: "bg-[#DC2626]",
    Icon: X,
  },
};

export default function SideToast({
  open,
  title,
  description,
  type = "success",
  onClose,
}) {
  const style = toastStyles[type] || toastStyles.success;
  const Icon = style.Icon;

  useEffect(() => {
  if (!open || !onClose) return;

  const timer = setTimeout(() => {
    onClose();
  }, 5000);

  return () => clearTimeout(timer);
}, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            x: 100,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: 100,
            scale: 0.97,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="
            fixed
            right-6
            top-24
            z-[99999]
          "
        >
          <div
            className={`
              relative
              flex
              items-center
              w-[390px]
              min-h-[76px]
              rounded-xl
              border
              px-5
              py-4
              shadow-[0_10px_30px_rgba(16,24,40,0.10)]
              overflow-hidden
              ${style.container}
            `}
          >
            {/* Accent strip */}
            <div
              className={`
                absolute
                left-0
                top-0
                h-full
                w-[4px]
                ${style.accent}
              `}
            />

            {/* Solid circle icon */}
            <div
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                ${style.iconBg}
              `}
            >
              <Icon
                size={16}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>

            {/* Text */}
            <div className="ml-4 flex-1 pr-7">
              <h3
                className="
                  text-[14px]
                  font-bold
                  leading-5
                  text-[#16253A]
                "
              >
                {title}
              </h3>

              {description && (
                <p
                  className="
                    mt-0.5
                    text-[13px]
                    font-medium
                    leading-5
                    text-[#66788A]
                  "
                >
                  {description}
                </p>
              )}
            </div>

            {/* Close */}
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close notification"
                className="
                  absolute
                  right-3
                  top-3
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  text-[#516172]
                  transition
                  hover:bg-black/5
                "
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}