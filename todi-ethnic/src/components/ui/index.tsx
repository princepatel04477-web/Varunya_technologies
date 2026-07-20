"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bridal",
        {
          primary:
            "bg-bridal text-white hover:bg-bridal-dark active:bg-bridal-dark",
          secondary:
            "bg-teal text-white hover:bg-teal-light active:bg-teal-light",
          outline:
            "border border-ink/20 text-ink hover:bg-ink/5 active:bg-ink/10",
        }[variant],
        {
          sm: "text-xs px-4 py-2 gap-1.5",
          md: "text-sm px-6 py-3 gap-2",
          lg: "text-sm px-8 py-3.5 gap-2.5",
        }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block label-sm bg-bridal/8 text-bridal px-3 py-1 tracking-widest",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-border-subtle/60 transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
