import { cva } from "class-variance-authority";

export const appButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--accent)]/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        brand:
          "border border-transparent bg-[var(--gradient-brand)] text-white shadow-[var(--shadow-brand)] hover:-translate-y-0.5 hover:shadow-[0_28px_48px_rgba(53,88,114,0.34)]",
        dark: "border border-transparent bg-[color:var(--ink)] text-[color:var(--background)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:opacity-90",
        glass:
          "border border-[color:var(--border-soft)] bg-[var(--surface)] text-[color:var(--primary)] shadow-[var(--shadow-soft)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]",
        outline:
          "border border-[color:var(--border-blue)] bg-[var(--surface-soft)] text-[color:var(--primary)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]",
        ghost:
          "border border-transparent bg-transparent text-[color:var(--primary)] hover:bg-[color:var(--accent)]/20",
        light:
          "border border-[color:var(--border-soft)] bg-[var(--surface-strong)] text-[color:var(--primary)] shadow-sm hover:-translate-y-0.5 hover:brightness-105",
        navDark:
          "border border-white/10 bg-white/10 text-white shadow-sm hover:-translate-y-0.5 hover:bg-white/15",
        danger:
          "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-base",
        xl: "h-16 px-8 text-lg",
        icon: "h-11 w-11 p-0",
        iconSm: "h-9 w-9 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
      fullWidth: false,
    },
  }
);

export const appCardVariants = cva(
  "relative overflow-hidden border backdrop-blur-2xl transition-all duration-300",
  {
    variants: {
      variant: {
        glass: "border-[color:var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
        strong: "border-[color:var(--border-soft)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)]",
        soft: "border-[color:var(--border-blue)] bg-[var(--surface-soft)] shadow-[var(--shadow-soft)]",
        dark: "border-white/10 bg-[var(--gradient-brand)] text-white shadow-[var(--shadow-brand)]",
        flat: "border-[color:var(--border-blue)] bg-[var(--surface-elevated)]",
      },
      radius: {
        md: "rounded-[var(--radius-md)]",
        lg: "rounded-[var(--radius-lg)]",
        xl: "rounded-[var(--radius-xl)]",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
      hover: {
        true: "hover:-translate-y-0.5 hover:shadow-[var(--shadow-lifted)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "glass",
      radius: "lg",
      padding: "none",
      hover: false,
    },
  }
);
