import { Heart } from "lucide-react";

export default function FavoriteButton({
  favorite,
  onClick,
}) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="
  absolute top-7 right-4
  w-10 h-10
  rounded-full

  bg-[var(--surface)]
  border border-[var(--border-soft)]

  backdrop-blur-md

  flex items-center justify-center

  shadow-[var(--shadow-soft)]

  transition-all duration-300

  hover:scale-105
  hover:bg-[var(--surface-elevated)]
  hover:border-[var(--primary)]
"
    >
      <Heart
        size={18}
        className={
          favorite
  ? "fill-red-500 text-red-500 dark:fill-[var(--gold)] dark:text-[var(--gold)]"
  : "text-gray-400 dark:text-[var(--muted)]"
        }
      />
    </button>
  );
}