import { Group, SegmentedControl } from "@mantine/core";
import { IconTrophy, IconUser } from "@tabler/icons-react";

type Props = {
  value?: "contests" | "problems";
};

export function ProblemsOwnerFilterSkeleton({ value = "contests" }: Props) {
  return (
    <SegmentedControl
      value={value}
      disabled
      data={[
        {
          value: "contests",
          label: (
            <Group gap="xs" wrap="nowrap">
              <IconTrophy size={16} />
              <span>Мои контесты</span>
            </Group>
          ),
        },
        {
          value: "problems",
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

