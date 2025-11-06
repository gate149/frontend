"use client";

import { createProblem } from "@/lib/actions";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const CreateProblemForm = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (): Promise<string> => {
      const response = await createProblem("New Problem");
      return response?.id || "";
    },
    onSuccess: async (data: string) => {
      router.push(`/problems/${data}`);
    },
    onError: (error) => {
      console.error("Не удалось создать задачу. Попробуйте позже.", error);
    },
  });

  // Only show for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Button
        title="Создать задачу"
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        size="sm"
        variant="light"
        leftSection={<IconPlus size={16} />}
      >
        Задача
      </Button>
    </>
  );
};

export { CreateProblemForm };
