import { cn } from "@/lib/utils";

export function PageHeading({ eyebrow, title, description, actions, className }: { eyebrow?: string; title: string; description: string; actions?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end", className)}>
      <div>
        {eyebrow ? <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h1 className="glow-text text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
