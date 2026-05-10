
import { useNavigate } from "react-router-dom";

export default function PrimaryActionButton({
  text,
  onClick,
  className = "",
  children,
}) {
  const navigate = useNavigate();

  const handleClick = () => {

    if (onClick) {
      onClick();
      return;
    }

    if (text === "Find Instructors") {
      navigate("/explore-instructors");
    }
  };

  return (
    <button
      onClick={handleClick}
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

      {children}
    </button>
  );
}