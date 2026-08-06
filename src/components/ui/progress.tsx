import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value = 0, className, indicatorClassName, ...props }: React.ComponentProps<"div"> & { value?: number; indicatorClassName?: string }) {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
      <div className={cn("h-full rounded-full bg-primary transition-[width]", indicatorClassName)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
