"use client";

import { createContest, createProblem } from "@/lib/actions";
import { Button, Group, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { usePageTransition } from "./WorkshopPageWrapper";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";

type Props = {
  isAuthenticated: boolean;
};

export function WorkshopHeader({ isAuthenticated }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "contests";
  const { pendingView } = usePageTransition();
  const [localView, setLocalView] = useState<string>(currentView);
  
  // Sync local view with current view when URL changes
  useEffect(() => {
    setLocalView(currentView);
  }, [currentView]);
  
  // Use pendingView if transition is happening, otherwise use localView
  const view = pendingView || localView;

  const createContestMutation = useMutation({
    mutationFn: async () => {
      const response = await createContest("New Contest");
      return response?.id || "";
    },
    onSuccess: async (data: string) => {
      if (data) {
        router.push(`/contests/${data}`);
      }
    },
    onError: (error) => {
      console.error("Не удалось создать контест. Попробуйте позже.", error);
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error ? error.message : "Не удалось создать контест",
        color: "red",
      });
    },
  });

  const createProblemMutation = useMutation({
    mutationFn: async (): Promise<string> => {
      const response = await createProblem("New Problem");
      return response?.id || "";
    },
    onSuccess: async (data: string) => {
      router.push(`/problems/${data}/edit`);
    },
    onError: (error) => {
      console.error("Не удалось создать задачу. Попробуйте позже.", error);
    },
  });

  const handleCreate = () => {
    if (view === "problems") {
      createProblemMutation.mutate();
    } else {
      createContestMutation.mutate();
    }
  };

  const isLoading = createContestMutation.isPending || createProblemMutation.isPending;
  const buttonText = view === "problems" ? "Создать задачу" : "Создать контест";
  const buttonTitle = view === "problems" ? "Создать новую задачу" : "Создать новый контест";

  return (
    <Group justify="space-between" align="flex-end">
      <Title order={2}>Мастерская</Title>
      {isAuthenticated && (
        <Button
          title={buttonTitle}
          onClick={handleCreate}
          loading={isLoading}
          size="md"
          leftSection={<IconPlus size={18} />}
          radius="md"
        >
          {buttonText}
        </Button>
      )}
    </Group>
  );
}

