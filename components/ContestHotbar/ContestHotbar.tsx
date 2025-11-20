"use client";

import { Button, Group, Stack, Title } from "@mantine/core";
import {
  IconDeviceDesktop,
  IconMail,
  IconPuzzle,
  IconSend,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ContestModel } from "../../../contracts/core/v1";
import { CONTEST_CONTENT_MAX_WIDTH } from "@/lib/constants";

type ContestHotbarProps = {
  contest: ContestModel;
  activeTab?: "tasks" | "submit" | "submissions" | "monitor" | "manage" | "mysubmissions" | "allsubmissions";
  showManageButton?: boolean;
};

export function ContestHotbar({ contest, activeTab, showManageButton = true }: ContestHotbarProps) {
  return (
    <Stack gap="md" mb="lg" style={{ maxWidth: CONTEST_CONTENT_MAX_WIDTH, margin: "0 auto" }}>
      {/* Заголовок с кнопкой управления */}
      <Group justify="space-between" align="center" wrap="nowrap">
        <Title order={1} size="h3">
          🏆 {contest.title}
        </Title>
        {showManageButton && (
          <Button
            component={Link}
            href={`/contests/${contest.id}/manage`}
            variant="filled"
            color="violet"
            size="sm"
            leftSection={<IconSettings size={16} />}
            visibleFrom="sm"
            style={{ flexShrink: 0 }}
          >
            Управление
          </Button>
        )}
      </Group>
      
      {/* Основные кнопки навигации */}
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
          href={`/mysubmissions?contestId=${contest.id}&order=-1&owner=me`}
          variant={activeTab === "mysubmissions" ? "filled" : "default"}
          size="sm"
          leftSection={<IconUser size={16} />}
          visibleFrom="sm"
        >
          Мои посылки
        </Button>
        <Button
          component={Link}
          href={`/submissions?contestId=${contest.id}&order=-1`}
          variant={activeTab === "allsubmissions" ? "filled" : "default"}
          size="sm"
          leftSection={<IconMail size={16} />}
          visibleFrom="sm"
        >
          Все посылки
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
      </Group>
    </Stack>
  );
}
