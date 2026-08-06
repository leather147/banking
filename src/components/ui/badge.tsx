import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "border-primary/30 bg-primary/12 text-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "bg-background/40",
      success: "border-emerald-500/25 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
      destructive: "border-destructive/30 bg-destructive/12 text-destructive",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
