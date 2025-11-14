import { Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ProblemsOwnerFilterSkeleton } from "./ProblemsOwnerFilterSkeleton";
import { ProblemsGridSkeleton } from "./ProblemsGridSkeleton";

export function ProblemsContentSkeleton() {
  return (
    <Stack gap="lg">
      <TextInput
        placeholder="Поиск задач..."
        leftSection={<IconSearch size={16} />}
        value=""
        disabled
        radius="md"
        size="md"
      />
      <ProblemsGridSkeleton />
    </Stack>
  );
}

