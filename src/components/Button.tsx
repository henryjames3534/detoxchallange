import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "pill" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-900/20 hover:from-cyan-700 hover:to-teal-700",
  secondary:
    "border-2 border-sky-300/80 bg-white text-[#1e3a5f] hover:bg-sky-50 shadow-md",
  outline:
    "border-2 border-white/70 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25",
  pill: "rounded-full border-2 border-teal-500 bg-white text-teal-700 uppercase tracking-wider hover:bg-teal-50 shadow-md",
  ghost: "text-teal-800 hover:bg-teal-50/80",
};

const sizeStyles = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-base",
  lg: "px-9 py-4 text-lg font-semibold",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
