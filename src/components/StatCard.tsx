import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({ icon: Icon, label, value, change, className }: StatCardProps) {
  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = change ? trendIcons[change.trend] : null;

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 shadow-card transition-smooth hover:shadow-elevated", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {TrendIcon && <TrendIcon className={cn("h-4 w-4", trendColors[change.trend])} />}
              <span className={cn("text-sm font-medium", trendColors[change.trend])}>
                {change.value}
              </span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
