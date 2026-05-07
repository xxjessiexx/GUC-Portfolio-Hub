import PrimaryActionButton from "@/components/ui/PrimaryActionButton";
import { AppCard } from "./AppCard";

export default function DiscoverCard({
  icon: Icon,
  title,
  description,
  buttonText,
  image,
}) {
  return (
    <AppCard
      className="
        p-5 sm:p-6
        rounded-[28px]
        bg-white
        border border-gray-100
        shadow-sm
        hover:shadow-md
        transition
        min-h-[220px]
        flex flex-col justify-between
      "
    >
      <div>
        {/* TOP ICON */}
        <div
          className="
            w-12 h-12 sm:w-14 sm:h-14
            rounded-2xl
            bg-[#EEF5FF]
            flex items-center justify-center
            text-[#5E8DDA]
            mb-4
          "
        >
          <Icon size={22} />
        </div>

        {/* TITLE */}
        <h3
          className="
            text-xl sm:text-2xl
            font-black
            text-[#16253A]
            leading-tight
          "
        >
          {title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="
            mt-4
            text-[15px]
            text-gray-500
            leading-7
            font-medium
            min-h-[120px]
            "
        >
          {description}
        </p>
      </div>

      {/* BOTTOM */}
      <div
        className="
          mt-6
          flex-row
          items-start sm:items-end
          justify-between
          gap-5
        "
      >
        <PrimaryActionButton text={buttonText} />

        {/* IMAGE */}
        <img
          src={image}
          alt={title}
          className="
            w-40
            object-contain
            opacity-90
            self-end
          "
        />
      </div>
    </AppCard>
  );
}