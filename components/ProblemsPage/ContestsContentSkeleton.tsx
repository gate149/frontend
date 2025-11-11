import { Input, Stack } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ProblemsOwnerFilterSkeleton } from "./ProblemsOwnerFilterSkeleton";
import { ContestsGridSkeleton } from "./ContestsGridSkeleton";

export function ContestsContentSkeleton() {
  return (
    <Stack gap="lg">
      <ProblemsOwnerFilterSkeleton value="contests" />
      <Input
        placeholder="Поиск по названию контеста..."
        leftSection={<IconSearch size={16} />}
        disabled
        radius="md"
        size="md"
      />
      <ContestsGridSkeleton />
    </Stack>
  );
}

