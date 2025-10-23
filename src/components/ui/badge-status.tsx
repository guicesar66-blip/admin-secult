import { cn } from "@/lib/utils";

interface BadgeStatusProps {
  variant: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

export function BadgeStatus({ variant, children, className }: BadgeStatusProps) {
  const variants = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-smooth",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
