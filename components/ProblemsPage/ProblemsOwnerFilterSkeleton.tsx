import { Group, SegmentedControl } from "@mantine/core";
import { IconArchive, IconUser } from "@tabler/icons-react";

export function ProblemsOwnerFilterSkeleton() {
  return (
    <SegmentedControl
      value="all"
      disabled
      data={[
        {
          value: "all",
          label: (
            <Group gap="xs" wrap="nowrap">
              <IconArchive size={16} />
              <span>Архив задач</span>
            </Group>
          ),
        },
        {
          value: "me",
          label: (
            <Group gap="xs" wrap="nowrap">
              <IconUser size={16} />
              <span>Мои задачи</span>
            </Group>
          ),
        },
      ]}
    />
  );
}

