import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthBottomLink({ text, linkText, to }) {
  return (
    <>
      <p className="text-center text-lg font-semibold text-[color:var(--ink)]">
        {text}

        <Link
          to={to}
          className="ml-4 font-extrabold text-[color:var(--secondary)] hover:text-[color:var(--primary)]"
        >
          {linkText}
        </Link>
      </p>

      <Link
        to="/"
        className="mx-auto mt-7 flex w-fit items-center gap-2 font-bold text-[color:var(--muted)] hover:text-[color:var(--primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </>
  );
}