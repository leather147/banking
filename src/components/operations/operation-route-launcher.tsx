"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BankPageSkeleton } from "@/components/shared/bank-page-skeleton";
import { createOperationPath, generateOperationSlug, type OperationKind } from "@/lib/operations";

export function OperationRouteLauncher({ kind }: { kind: OperationKind }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(createOperationPath(kind, generateOperationSlug(kind)));
  }, [kind, router]);

  return <BankPageSkeleton />;
}
