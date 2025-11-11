"use client";

import { ReactNode, createContext, useContext, useState, useTransition } from "react";

type TransitionContextType = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
  pendingView: string | null;
  setPendingView: (view: string | null) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isPending: false,
  startTransition: () => {},
  pendingView: null,
  setPendingView: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

type Props = {
  children: ReactNode;
};

export function ProblemsPageWrapper({ children }: Props) {
  const [isPending, startTransition] = useTransition();
  const [pendingView, setPendingView] = useState<string | null>(null);

  return (
    <TransitionContext.Provider value={{ isPending, startTransition, pendingView, setPendingView }}>
      {children}
    </TransitionContext.Provider>
  );
}

