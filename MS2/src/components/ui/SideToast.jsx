import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SideToast({
  open,
  title,
  description,
}) {
  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{
            opacity: 0,
            x: 120,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: 120,
            scale: 0.92,
          }}
          transition={{
            duration: 0.28,
          }}
          className="
            fixed
            right-6
            bottom-6
            z-[99999]
          "
        >
          <div
            className="
              flex items-start gap-4
              min-w-[340px]
              max-w-[420px]
              rounded-2xl
              border border-[#FFE3D5]
              bg-[#FFF8F4]
              px-5 py-4
              shadow-[0_18px_60px_rgba(16,24,40,0.12)]
              backdrop-blur-xl
            "
          >

            <div
              className="
                mt-0.5
                flex h-10 w-10
                items-center justify-center
                rounded-full
                bg-[#FFE8DC]
              "
            >
              <CheckCircle2
                size={20}
                className="text-[#FF8A65]"
              />
            </div>

            <div className="flex-1">

              <h3
                className="
                  text-sm
                  font-black
                  text-[#16253A]
                "
              >
                {title}
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-gray-500
                  font-semibold
                "
              >
                {description}
              </p>

            </div>

          </div>
        </motion.div>

      )}

    </AnimatePresence>
  );
}