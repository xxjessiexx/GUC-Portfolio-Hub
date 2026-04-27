import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthBottomLink({ text, linkText, to }) {
  return (
    <>
      <p className="text-center text-lg font-semibold text-[#102630]">
        {text}

        <Link
          to={to}
          className="ml-4 font-extrabold text-[#7AAACE] hover:text-[#355872]"
        >
          {linkText}
        </Link>
      </p>

      <Link
        to="/"
        className="mx-auto mt-7 flex w-fit items-center gap-2 font-bold text-[#7B8794] hover:text-[#355872]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </>
  );
}