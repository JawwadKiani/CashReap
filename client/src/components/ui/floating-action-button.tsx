import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  gradient?: "amber" | "green" | "blue" | "purple" | "rose" | "indigo";
  size?: "sm" | "md" | "lg";
}

const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, icon: Icon, label, gradient = "blue", size = "md", ...props }, ref) => {
    const gradientClasses = {
      amber: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
      green: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
      blue: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
      purple: "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600",
      rose: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
      indigo: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
    };

    const sizeClasses = {
      sm: "w-12 h-12",
      md: "w-14 h-14", 
      lg: "w-16 h-16"
    };

    const iconSizes = {
      sm: "h-5 w-5",
      md: "h-6 w-6",
      lg: "h-7 w-7"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "fixed bottom-6 right-6 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50",
          gradientClasses[gradient],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <Icon className={iconSizes[size]} />
        {label && (
          <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {label}
          </span>
        )}
      </button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton };