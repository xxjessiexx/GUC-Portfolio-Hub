
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrimaryActionButton({
  text,
  onClick,
  className = "",
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        if (text === "Find Instructors") {
          navigate("/explore-instructors");
        }
      }}
      className={`
        flex items-center gap-2
        px-5 py-3
        rounded-2xl
        bg-[#284C7A]
        text-white
        font-semibold
        shadow-sm
        hover:bg-[#1F3D63]
        transition
        ${className}
      `}
    >
      {text}
      <ArrowRight size={16} />
    </button>
  );
}