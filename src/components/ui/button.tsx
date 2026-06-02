import * as React from "react";
import { cn } from "@/lib/utils"; // Assumes shadcn/ui setup

export interface AnimatedLayerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AnimatedLayerButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedLayerButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        // Base styles for the button
        "group relative flex h-[50px] w-[180px] items-center justify-center overflow-hidden rounded-[25px] border-none",
        "cursor-pointer bg-bg-dark text-white shadow-[6px_6px_0px_var(--foreground)] transition-all duration-300 ease-in-out",
        "hover:translate-y-[4px] hover:shadow-[2px_2px_0px_var(--foreground)]",
        // Accessibility focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    >
      {/* Inline Spinner - 20px x 20px circle with split red and white border */}
      <div className="w-5 h-5 mr-3 rounded-full border-2 border-red-500 border-t-white animate-spin shrink-0" />
      
      {/* Text layer */}
      <span className="z-10 font-semibold tracking-widest text-[1.1em] text-white">
        {children}
      </span>
    </button>
  );
});
AnimatedLayerButton.displayName = "AnimatedLayerButton";

export { AnimatedLayerButton };

