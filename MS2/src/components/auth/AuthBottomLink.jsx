import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthBottomLink({ text, linkText, to, backTo = "/",backLabel = "Back to home" }) {
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

      
    </>
  );
}