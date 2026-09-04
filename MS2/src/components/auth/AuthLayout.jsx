import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useSpring,
} from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function AuthLayout({
  children,
  visual = null,
  maxWidth = "max-w-[610px]",
  contentClassName = "px-16 py-12 max-sm:px-7 max-sm:py-9",
}) {
  const blobOneX = useSpring(0, {
    stiffness: 45,
    damping: 18,
  });

  const blobOneY = useSpring(0, {
    stiffness: 45,
    damping: 18,
  });

  const blobTwoX = useSpring(0, {
    stiffness: 35,
    damping: 20,
  });

  const blobTwoY = useSpring(0, {
    stiffness: 35,
    damping: 20,
  });

  /*
   * The login card is the source of truth
   * for the right-side visual height.
   */
  const cardRef = useRef(null);

  const [cardHeight, setCardHeight] =
    useState(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX /
          window.innerWidth -
          0.5) *
        90;

      const y =
        (event.clientY /
          window.innerHeight -
          0.5) *
        90;

      blobOneX.set(x);
      blobOneY.set(y);

      blobTwoX.set(-x);
      blobTwoY.set(-y);
    };

    globalThis.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () =>
      globalThis.removeEventListener(
        "mousemove",
        handleMouseMove
      );
  }, [
    blobOneX,
    blobOneY,
    blobTwoX,
    blobTwoY,
  ]);

  /*
   * Measure the actual natural height
   * of the login card.
   */
  useLayoutEffect(() => {
    if (!visual || !cardRef.current) {
      return;
    }

    const updateHeight = () => {
      if (!cardRef.current) return;

      const height =
        cardRef.current.getBoundingClientRect()
          .height;

      setCardHeight(height);
    };

    updateHeight();

    const observer =
      new ResizeObserver(updateHeight);

    observer.observe(cardRef.current);

    globalThis.addEventListener(
      "resize",
      updateHeight
    );

    return () => {
      observer.disconnect();

      globalThis.removeEventListener(
        "resize",
        updateHeight
      );
    };
  }, [visual]);

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[image:var(--page-gradient)]
        p-4
        text-[color:var(--ink)]

        max-sm:p-3
      "
    >
      {/* background atmosphere */}
      <motion.div
        style={{
          x: blobOneX,
          y: blobOneY,
        }}
        className="
          pointer-events-none
          fixed
          -left-28
          -top-36
          h-[540px]
          w-[540px]
          rounded-full
          bg-[radial-gradient(circle,var(--accent)_0%,rgba(122,170,206,0.32)_55%,transparent_72%)]
          blur-3xl
        "
      />

      <motion.div
        style={{
          x: blobTwoX,
          y: blobTwoY,
        }}
        className="
          pointer-events-none
          fixed
          -bottom-52
          -right-44
          h-[640px]
          w-[640px]
          rounded-full
          bg-[radial-gradient(circle,rgba(122,170,206,0.62)_0%,rgba(230,199,123,0.16)_52%,transparent_72%)]
          blur-3xl
        "
      />

      <div
        className={`
          relative
          z-10
          grid
          w-full

          ${
            visual
              ? `
                max-w-[1280px]
                grid-cols-1
                items-center
                gap-8

                lg:grid-cols-[minmax(470px,610px)_minmax(480px,1fr)]

                xl:gap-12
              `
              : maxWidth
          }
        `}
      >
        {/* ==========================
            LOGIN CARD

            VISUALLY UNCHANGED.
        =========================== */}

        <motion.div
          ref={cardRef}
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          className={`
            relative
            w-full

            ${
              visual
                ? "lg:justify-self-start"
                : ""
            }
          `}
        >
          <Card
            className="
              relative
              overflow-hidden
              rounded-[34px]
              border
              border-[color:var(--auth-card-border)]
              bg-[color:var(--auth-card-bg)]
              shadow-[var(--auth-card-shadow)]
              backdrop-blur-2xl
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[image:var(--auth-card-sheen)]
              "
            />

            <CardContent
              className={`
                relative
                z-10
                ${contentClassName}
              `}
            >
              {children}
            </CardContent>
          </Card>
        </motion.div>

        {/* ==========================
            RIGHT VISUAL

            Forced to the login
            card's measured height.
        =========================== */}

        {visual && (
          <motion.div
            initial={{
              opacity: 0,
              x: 26,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            style={
              cardHeight
                ? {
                    height: `${cardHeight}px`,
                  }
                : undefined
            }
            className="
              relative
              hidden
              min-h-0
              lg:block
              lg:self-center
            "
          >
            {visual}
          </motion.div>
        )}
      </div>
    </main>
  );
}