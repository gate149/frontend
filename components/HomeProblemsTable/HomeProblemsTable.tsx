"use client";

import { numberToLetters } from "@/lib/lib";
import { Paper, Text, Group, Stack, ThemeIcon, Tooltip } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./styles.module.css";

type HomeProblemItem = {
  id: string;
  contest_id: string;
  problem_id: string;
  position: number;
  title: string;
  time_limit: number;
  memory_limit: number;
};

type HomeProblemsTableProps = {
  problems: Array<HomeProblemItem>;
};

const formatTimeLimit = (timeMs: number) => {
  if (timeMs % 1000 === 0) {
    return `${timeMs / 1000}s`;
  }
  return `${timeMs}ms`;
};

const formatMemoryLimit = (memoryKb: number) => {
  return `${memoryKb}MB`;
};

export function HomeProblemsTable({ problems }: HomeProblemsTableProps) {
  const router = useRouter();

  if (problems.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Нет доступных задач
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      {problems.map((problem) => {
        const problemUrl = `/contests/${problem.contest_id}/problems/${problem.problem_id}`;
        return (
          <Paper
            key={problem.id}
            className={classes.item}
            onClick={() => router.push(problemUrl)}
            withBorder
            p="md"
            radius="md"
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="md" wrap="nowrap">
                <div className={classes.badge}>{numberToLetters(problem.position)}</div>
                <div>
                  <Text fw={600} lineClamp={1}>
                    {problem.title}
                  </Text>
                  <Group gap="xs" mt={4}>
                    <Tooltip label="Ограничение времени">
                      <Text size="xs" c="dimmed">
                        {formatTimeLimit(problem.time_limit)}
                      </Text>
                    </Tooltip>
                    <Text size="xs" c="dimmed">
                      •
                    </Text>
                    <Tooltip label="Ограничение памяти">
                      <Text size="xs" c="dimmed">
                        {formatMemoryLimit(problem.memory_limit)}
                      </Text>
                    </Tooltip>
                  </Group>
                </div>
              </Group>
              <IconChevronRight size={16} style={{ opacity: 0.5 }} />
            </Group>
          </Paper>
        );
      })}
    </Stack>
  );
}
