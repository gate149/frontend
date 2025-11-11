"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePageTransition } from "./ProblemsPageWrapper";
import { ProblemsContentSkeleton } from "./ProblemsContentSkeleton";
import { ContestsContentSkeleton } from "./ContestsContentSkeleton";

type Props = {
  children: ReactNode;
};

export function ProblemsContentWrapper({ children }: Props) {
  const { pendingView, setPendingView } = usePageTransition();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "contests";
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Mark as mounted after first render to avoid hydration issues
  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // Reset pending view when URL catches up
  useEffect(() => {
    if (pendingView && currentView === pendingView) {
      setPendingView(null);
    }
  }, [pendingView, currentView, setPendingView]);

  // Don't show skeleton on initial mount (SSR/hydration)
  // Only show skeleton when pendingView is set during client-side navigation
  if (!isInitialMount && pendingView) {
    return pendingView === "contests" ? (
      <ContestsContentSkeleton />
    ) : (
      <ProblemsContentSkeleton />
    );
  }

  return <>{children}</>;
}

