import { Link } from "react-router-dom";
import { AppButton } from "@/components/ui/AppButton";

const viewAllButtonClass =
  "h-14 min-w-[150px] rounded-[1.35rem] bg-gradient-to-r from-[#2E4053] to-[#77A9CC] px-8 text-base font-black text-white shadow-none hover:from-[#263849] hover:to-[#6A9DBF]";

export function ViewAllButton({
  children = "View All",
  isExpanded = false,
  useInlineExpand = false,
  onToggleExpand,
  to,
}) {
  if (useInlineExpand) {
    return (
      <AppButton onClick={onToggleExpand} className={viewAllButtonClass}>
        {isExpanded ? "Show Less" : children}
      </AppButton>
    );
  }

  return (
    <Link to={to} className={`inline-flex items-center justify-center ${viewAllButtonClass}`}>
      {children}
    </Link>
  );
}