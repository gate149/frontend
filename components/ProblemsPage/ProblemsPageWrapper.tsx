"use client";

import { createContext, useContext, useState, useTransition } from "react";

type TransitionContextType = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
  pendingView: string;
  setPendingView: (view: string) => void;
};

const TransitionContext = createContext<TransitionContextType>(null!);

export const usePageTransition = () => useContext(TransitionContext);

export const ProblemsPageWrapper = ({ children }: React.PropsWithChildren) => {
  const [isPending, startTransition] = useTransition();
  const [pendingView, setPendingView] = useState("");

  return (
    <TransitionContext.Provider value={{ isPending, startTransition, pendingView, setPendingView }}>
      {children}
    </TransitionContext.Provider>
  );
}
