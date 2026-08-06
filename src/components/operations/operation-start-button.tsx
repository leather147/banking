"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { createOperationPath, generateOperationSlug, type OperationKind } from "@/lib/operations";

export function OperationStartButton({ kind, className, children, title }: { kind: OperationKind; className?: string; children: React.ReactNode; title?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function startOperation() {
    setPending(true);
    startTransition(() => router.push(createOperationPath(kind, generateOperationSlug(kind))));
  }

  return <button type="button" title={title} className={className} onClick={startOperation} disabled={pending} aria-busy={pending}>{children}</button>;
}
