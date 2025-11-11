import { CreateContestForm } from "@/components/CreateContestForm";
import { Paper, Stack, Title } from "@mantine/core";

interface ContestManagementSidebarProps {
  isAuthenticated: boolean;
}

export const ContestManagementSidebar = ({
  isAuthenticated,
}: ContestManagementSidebarProps) => {
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      withBorder
      bg="var(--mantine-color-gray-light)"
    >
      <Stack gap="md">
        <Title order={4} size="h5">
          ⚙️ Управление
        </Title>
        <CreateContestForm isAuthenticated={isAuthenticated} />
      </Stack>
    </Paper>
  );
};

