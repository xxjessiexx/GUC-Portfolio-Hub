import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthSubmitButton({ children }) {
  return (
    <Button
      type="submit"
      className="h-16 w-full rounded-2xl bg-[image:var(--auth-button-gradient)] text-xl font-extrabold text-white shadow-[var(--auth-button-shadow)] transition hover:-translate-y-1 hover:opacity-95 hover:shadow-[0_28px_48px_rgba(53,88,114,0.36),0_10px_32px_rgba(230,199,123,0.24)] dark:hover:shadow-[0_28px_58px_rgba(0,0,0,0.42),0_10px_32px_rgba(122,170,206,0.18)]"
    >
      {children}
      <ArrowRight className="ml-3 h-6 w-6" />
    </Button>
  );
}