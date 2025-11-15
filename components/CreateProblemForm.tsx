"use client";

import { createProblem } from "@/lib/actions";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const CreateProblemForm = () => {
  const router = useRouter();

  const mutation = useMutation({
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
  return (
    <Button
      title="Создать новую задачу"
      onClick={() => mutation.mutate()}
      loading={mutation.isPending}
      size="md"
      variant="light"
      leftSection={<IconPlus size={18} />}
      fullWidth
    >
      Создать задачу
    </Button>
  );
};

export { CreateProblemForm };
