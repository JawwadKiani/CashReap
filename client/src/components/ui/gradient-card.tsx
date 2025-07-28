import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "amber" | "green" | "blue" | "purple" | "rose" | "indigo";
  children: React.ReactNode;
}

const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "amber", children, ...props }, ref) => {
    const gradientClasses = {
      amber: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 border-amber-200 dark:border-amber-800",
      green: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border-green-200 dark:border-green-800",
      blue: "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950 dark:via-sky-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800",
      purple: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-purple-950 dark:via-violet-950 dark:to-fuchsia-950 border-purple-200 dark:border-purple-800",
      rose: "bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950 dark:via-pink-950 dark:to-red-950 border-rose-200 dark:border-rose-800",
      indigo: "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 border-indigo-200 dark:border-indigo-800"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
          gradientClasses[gradient],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GradientCard.displayName = "GradientCard";

export { GradientCard };