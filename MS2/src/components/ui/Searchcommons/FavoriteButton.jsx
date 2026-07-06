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
        bg-white/90
        backdrop-blur-md
        border border-gray-100
        flex items-center justify-center
        shadow-sm
        hover:scale-105
        transition
      "
    >
      <Heart
        size={18}
        className={
          favorite
            ? "fill-red-500 text-red-500"
            : "text-gray-400"
        }
      />
    </button>
  );
}