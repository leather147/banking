"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({ className, sideOffset = 6, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content sideOffset={sideOffset} className={cn("glass-panel z-50 rounded-lg border border-primary/10 bg-popover/82 px-3 py-1.5 text-xs text-popover-foreground shadow-lg data-[state=delayed-open]:animate-in data-[state=closed]:animate-out", className)} {...props} />
    </TooltipPrimitive.Portal>
  );
}
