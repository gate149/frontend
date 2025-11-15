import { Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { WorkshopProblemsGridSkeleton } from "./WorkshopProblemsGridSkeleton";
import { CreateProblemForm } from "../CreateProblemForm";

export function WorkshopProblemsContentSkeleton() {
  return (
    <Stack gap="lg">
      <CreateProblemForm />
      <TextInput
        placeholder="Поиск задач..."
        leftSection={<IconSearch size={16} />}
        value=""
        disabled
        radius="md"
        size="md"
      />
      <WorkshopProblemsGridSkeleton />
    </Stack>
  );
}

