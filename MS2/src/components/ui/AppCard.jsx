import { appCardVariants } from "@/lib/uiVariants";
import { cn } from "@/lib/utils";

export function AppCard({
  children,
  className,
  variant = "glass",
  radius = "lg",
  padding = "none",
  hover = false,
  ...props
}) {
  return (
    <div
      className={cn(appCardVariants({ variant, radius, padding, hover }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
