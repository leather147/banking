"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return <SelectPrimitive.Trigger className={cn("flex h-10 w-full items-center justify-between rounded-xl border bg-background/60 px-3 text-sm outline-none transition-[border-color,background-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", className)} {...props}>{children}<SelectPrimitive.Icon><ChevronDown className="size-4 text-muted-foreground" /></SelectPrimitive.Icon></SelectPrimitive.Trigger>;
}

export function SelectContent({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content className={cn("glass-panel z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border bg-popover/88 p-1 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out", className)} position="popper" sideOffset={6} {...props}><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>;
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return <SelectPrimitive.Item className={cn("relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-secondary data-[disabled]:opacity-50", className)} {...props}><span className="absolute left-2.5 grid size-4 place-items-center"><SelectPrimitive.ItemIndicator><Check className="size-3.5 text-primary" /></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>;
}
