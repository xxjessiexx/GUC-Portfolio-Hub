import PrimaryActionButton from "@/components/ui/Searchcommons/PrimaryActionButton";
import { AppCard } from "../AppCard";

export default function DiscoverCard({
  icon: Icon,
  title,
  description,
  buttonText,
  image,
  onClick,
}) {
  return (
    <AppCard
      onClick={onClick}
      className="
        cursor-pointer
        p-5 sm:p-6
        rounded-[28px]
        bg-[color:var(--card-bg-strong)]
        border border-[color:var(--card-border)]
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-lifted)]
        transition
        min-h-[180px]
        flex flex-col justify-between
        text-[color:var(--ink)]

        hover:-translate-y-1
  hover:border-[var(--primary)]

      "
    >
      <div
        className="
          grid
          grid-cols-[1fr_auto]
          items-center
          gap-6
          h-full
        "
      >
        {/* LEFT */}
        <div>
          {/* TOP ICON */}
          <div
            className="
              w-12 h-12 sm:w-14 sm:h-14
              rounded-2xl
              bg-[var(--surface-elevated)]
border border-[var(--border-blue)]
              flex items-center justify-center
              text-[color:var(--secondary)]
              mb-4
            "
          >
            <Icon size={31} />
          </div>

          {/* TITLE */}
          <h3
            className="
              text-xl sm:text-2xl
              font-black
              text-[color:var(--ink)]
              leading-tight
            "
          >
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p
            className="
              mt-3
              text-[15px]
              text-[color:var(--muted)]
              leading-6
              font-medium
              max-w-[280px]
            "
          >
            {description}
          </p>

          {/* BUTTON */}
          <div className="mt-8 whitespace-nowrap ">
            <PrimaryActionButton text={buttonText} />
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div
  className="
    hidden md:flex
    items-center
    justify-center
    self-center

    rounded-3xl
    p-5

    bg-[var(--surface-soft)]
    border border-[var(--card-border)]
  "
>
          <img
  src={image}
  alt={title}
  className="
    w-36
    xl:w-40
    object-contain
    opacity-90
  "
/>
        </div>
      </div>
    </AppCard>
  );
}