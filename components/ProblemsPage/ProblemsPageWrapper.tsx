"use client";

import { ReactNode, createContext, useContext, useTransition } from "react";

type TransitionContextType = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isPending: false,
  startTransition: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

type Props = {
  children: ReactNode;
};

export function ProblemsPageWrapper({ children }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <TransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

