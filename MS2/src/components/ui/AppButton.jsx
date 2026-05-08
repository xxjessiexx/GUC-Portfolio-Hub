import { forwardRef } from "react";
import { appButtonVariants } from "@/lib/uiVariants";
import { cn } from "@/lib/utils";

export const AppButton = forwardRef(
  (
    {
      children,
      className,
      variant = "brand",
      size = "md",
      fullWidth = false,
      as: Component = "button",
      type,
      ...props
    },
    ref
  ) => {
    const resolvedType = Component === "button" ? type || "button" : undefined;

    return (
      <Component
        ref={ref}
        type={resolvedType}
        className={cn(appButtonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

AppButton.displayName = "AppButton";
