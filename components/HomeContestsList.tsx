"use client";

import { Paper, Text, Group, Stack, ThemeIcon, Badge } from "@mantine/core";
import { IconTrophy, IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { ContestModel } from "../../contracts/core/v1";
import classes from "./HomeContestsList.module.css";

type HomeContestsListProps = {
  contests: ContestModel[];
};

export function HomeContestsList({ contests }: HomeContestsListProps) {
  const router = useRouter();

  if (contests.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        У вас пока нет контестов
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      {contests.map((contest) => (
        <Paper
          key={contest.id}
          className={classes.item}
          onClick={() => router.push(`/contests/${contest.id}`)}
          withBorder
          p="md"
          radius="md"
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="md" wrap="nowrap">
              <ThemeIcon size="lg" radius="md" variant="light" color="yellow">
                <IconTrophy size={18} />
              </ThemeIcon>
              <div>
                <Text fw={600} lineClamp={1}>
                  {contest.title}
                </Text>
                <Group gap="xs" mt={4}>
                  <Text size="xs" c="dimmed">
                    {new Date(contest.created_at).toLocaleDateString("ru-RU")}
                  </Text>
                </Group>
              </div>
            </Group>
            <IconChevronRight size={16} style={{ opacity: 0.5 }} />
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

