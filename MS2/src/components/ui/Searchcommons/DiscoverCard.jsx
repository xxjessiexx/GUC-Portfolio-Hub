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
        group
        cursor-pointer
        rounded-[28px]
        border border-[color:var(--card-border)]
        bg-[color:var(--card-bg-strong)]
        p-6
        shadow-[var(--shadow-card)]
        transition-all duration-200

        hover:-translate-y-1
        hover:border-[var(--primary)]
        hover:shadow-[var(--shadow-lifted)]

        min-h-[310px]
        text-[color:var(--ink)]
      "
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_150px] gap-5">
        {/* LEFT CONTENT */}
        <div className="flex min-w-0 flex-col">
          {/* ICON */}
          <div
            className="
              flex h-12 w-12
              items-center justify-center
              rounded-2xl
              border border-[var(--border-blue)]
              bg-[var(--surface-elevated)]
              text-[color:var(--secondary)]
            "
          >
            <Icon size={26} strokeWidth={2} />
          </div>

          {/* TEXT */}
          <div className="mt-5">
            <h3
              className="
                text-[22px]
                font-black
                leading-[1.2]
                tracking-tight
                text-[color:var(--ink)]
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-3
                max-w-[260px]
                text-[15px]
                font-medium
                leading-6
                text-[color:var(--muted)]
              "
            >
              {description}
            </p>
          </div>

          {/* BUTTON */}
          <div className="mt-auto pt-6">
            <PrimaryActionButton text={buttonText} />
          </div>
        </div>

        {/* ILLUSTRATION */}
        <div
          className="
            hidden
            h-[180px]
            self-center
            items-center
            justify-center
            rounded-[24px]
            bg-[var(--surface-soft)]
            md:flex
          "
        >
          <img
            src={image}
            alt=""
            className="
              w-[120px]
              object-contain
              opacity-90
              transition-transform duration-200
              group-hover:scale-[1.03]
            "
          />
        </div>
      </div>
    </AppCard>
  );
}