"use client";

import { createContest } from "@/lib/actions";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const CreateContestForm = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  const router = useRouter();

  const mutation = useMutation({
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

  // Only show for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Button
        title="Создать контест"
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        size="sm"
        variant="light"
        leftSection={<IconPlus size={16} />}
      >
        Контест
      </Button>
    </>
  );
};

export { CreateContestForm };
