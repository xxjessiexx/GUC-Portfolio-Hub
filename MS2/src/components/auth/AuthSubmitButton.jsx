import { Button } from "@/components/ui/button";

export default function AuthSubmitButton({
  children,
  disabled,
  compact = false,
}) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className={`
        relative
        w-full
        overflow-hidden
        border-0
        font-extrabold
        text-white
        transition-all
        duration-200

        hover:-translate-y-[1px]
        hover:brightness-[1.025]

        active:translate-y-0
        active:scale-[0.995]

        ${
          compact
            ? `
              h-[54px]
              rounded-[17px]
              bg-[linear-gradient(105deg,#2C3947_0%,#355872_52%,#6F9FC1_100%)]
              text-[16px]
              shadow-[0_12px_28px_rgba(44,57,71,0.18)]
            `
            : `
              h-16
              rounded-2xl
              bg-[image:var(--auth-button-gradient)]
              text-xl
              shadow-[var(--auth-button-shadow)]
            `
        }
      `}
    >
      <span
        className="
          pointer-events-none
          absolute
          left-[12%]
          right-[12%]
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/45
          to-transparent
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          w-[32%]
          bg-[linear-gradient(90deg,transparent,rgba(156,213,255,0.07))]
        "
      />

      <span className="relative z-10">
        {children}
      </span>
    </Button>
  );
}