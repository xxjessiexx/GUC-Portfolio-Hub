import { Link } from "react-router-dom";

export default function AuthBottomLink({
  text,
  linkText,
  to,
  compact = false,
}) {
  return (
    <p
      className={`
        text-center
        font-semibold
        text-[color:var(--ink)]

        ${compact ? "text-sm" : "text-lg"}
      `}
    >
      {text}

      <Link
        to={to}
        className={`
          font-extrabold
          text-[color:var(--secondary)]
          hover:text-[color:var(--primary)]

          ${compact ? "ml-2" : "ml-4"}
        `}
      >
        {linkText}
      </Link>
    </p>
  );
}