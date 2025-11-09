"use client";

import { Button, Group, Stack, Title } from "@mantine/core";
import {
  IconDeviceDesktop,
  IconMail,
  IconPuzzle,
  IconSend,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import type { Contest } from "../../../contracts/core/v1";

type ContestHotbarProps = {
  contest: Contest;
  activeTab?: "tasks" | "submit" | "solutions" | "monitor" | "manage";
  showManageButton?: boolean;
};

export function ContestHotbar({ contest, activeTab, showManageButton = false }: ContestHotbarProps) {
  return (
    <Stack gap="md" mb="lg" style={{ maxWidth: "740px", margin: "0 auto" }}>
      <Title order={1} size="h3">
        🏆 {contest.title}
      </Title>
      <Group gap="sm">
        <Button
          component={Link}
          href={`/contests/${contest.id}`}
          variant={activeTab === "tasks" ? "filled" : "default"}
          size="sm"
          leftSection={<IconPuzzle size={16} />}
          visibleFrom="sm"
        >
          Задачи
        </Button>
        <Button
          component={Link}
          href={`/contests/${contest.id}/submit`}
          variant={activeTab === "submit" ? "filled" : "default"}
          size="sm"
          leftSection={<IconSend size={16} />}
          visibleFrom="sm"
        >
          Послать решение
        </Button>
        <Button
          component={Link}
          href={`/solutions?contestId=${contest.id}&order=-1`}
          variant={activeTab === "solutions" ? "filled" : "default"}
          size="sm"
          leftSection={<IconMail size={16} />}
          visibleFrom="sm"
        >
          Посылки
        </Button>
        <Button
          component={Link}
          href={`/contests/${contest.id}/monitor`}
          variant={activeTab === "monitor" ? "filled" : "default"}
          size="sm"
          leftSection={<IconDeviceDesktop size={16} />}
          visibleFrom="sm"
        >
          Монитор
        </Button>
        {showManageButton && (
          <Button
            component={Link}
            href={`/contests/${contest.id}/manage`}
            variant="filled"
            color="violet"
            size="sm"
            leftSection={<IconSettings size={16} />}
            visibleFrom="sm"
            opacity={activeTab === "manage" ? 1 : 0.85}
          >
            Управление
          </Button>
        )}
      </Group>
    </Stack>
  );
}

