"use client";

import { ActionIcon, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProblemsListItem } from "../../../contracts/tester/v1";
import classes from "./ProblemCard.module.css";

type Props = {
  problem: ProblemsListItem;
  showEditButton: boolean;
};

export function ProblemCard({ problem, showEditButton }: Props) {
  const router = useRouter();

  return (
    <Link
      href={`/problems/${problem.id}`}
      style={{
        textDecoration: "none",
        display: "block",
        height: "100%",
      }}
    >
      <Card
        shadow="xs"
        p={{ base: "sm", sm: "md" }}
        radius="md"
        withBorder
        className={classes.problemCard}
      >
        <Stack gap="xs" h="100%" justify="space-between">
          {/* Problem Header */}
          <Group justify="space-between" wrap="nowrap" gap="xs">
            <Stack gap="0" style={{ flex: 1, minWidth: 0 }}>
              <Title
                order={4}
                lineClamp={1}
                style={{ wordBreak: "break-word" }}
              >
                {problem.title}
              </Title>
            </Stack>
            {/* Edit button - only in "My Problems" section */}
            {showEditButton && (
              <ActionIcon
                variant="subtle"
                size="lg"
                radius="md"
                component="div"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/problems/${problem.id}/edit`);
                }}
                style={{ flexShrink: 0 }}
              >
                <IconPencil size={20} />
              </ActionIcon>
            )}
          </Group>

          {/* Problem Stats */}
          <Group justify="space-between" gap="xs">
            <Text
              size="xs"
              c="dimmed"
              style={{ flex: 1 }}
              lineClamp={1}
            >
              ⏱️ {problem.time_limit || "—"}ms
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              💾 {problem.memory_limit || "—"}MB
            </Text>
          </Group>
        </Stack>
      </Card>
    </Link>
  );
}

