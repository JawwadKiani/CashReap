import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: "amber" | "green" | "blue" | "purple" | "rose" | "indigo";
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ 
    className, 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend = "neutral", 
    trendValue,
    gradient = "blue",
    ...props 
  }, ref) => {
    const gradientClasses = {
      amber: "bg-gradient-to-br from-amber-500 to-orange-600",
      green: "bg-gradient-to-br from-green-500 to-emerald-600",
      blue: "bg-gradient-to-br from-blue-500 to-cyan-600",
      purple: "bg-gradient-to-br from-purple-500 to-violet-600",
      rose: "bg-gradient-to-br from-rose-500 to-pink-600",
      indigo: "bg-gradient-to-br from-indigo-500 to-purple-600"
    };

    const trendColors = {
      up: "text-green-600 dark:text-green-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-600 dark:text-gray-400"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={cn("h-full w-full", gradientClasses[gradient])} />
        </div>
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {subtitle}
                </p>
              )}
              {trendValue && (
                <div className={cn("flex items-center mt-2 text-sm font-medium", trendColors[trend])}>
                  {trend === "up" && "↗"}
                  {trend === "down" && "↘"}
                  {trend === "neutral" && "→"}
                  <span className="ml-1">{trendValue}</span>
                </div>
              )}
            </div>
            {Icon && (
              <div className={cn("p-3 rounded-lg", gradientClasses[gradient])}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatsCard.displayName = "StatsCard";

export { StatsCard };