"use client";

import { updateContest } from "@/lib/actions";
import {
  Button,
  Card,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type * as testerv1 from "../../../contracts/tester/v1/tester";

interface SettingsSectionProps {
  contest: testerv1.Contest;
}

export function SettingsSection({ contest }: SettingsSectionProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      title: contest.title || "",
      is_private: contest.is_private ?? true,
      monitor_enabled: contest.monitor_enabled ?? false,
    },
  });

  const handleSave = async (values: typeof form.values) => {
    try {
      setSaving(true);

      await updateContest(contest.id, {
        title: values.title,
        is_private: values.is_private,
        monitor_enabled: values.monitor_enabled,
      });

      notifications.show({
        title: "Успешно",
        message: "Настройки контеста обновлены",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to update contest:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось обновить настройки",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Stack gap="md">
          <div>
            <Title order={3} size="h4" mb="xs">
              Настройки контеста
            </Title>
            <Text size="sm" c="dimmed">
              Измените основные параметры контеста
            </Text>
          </div>

          <TextInput
            label="Название"
            placeholder="Введите название контеста"
            required
            {...form.getInputProps("title")}
          />

          <Switch
            label="Приватный контест"
            description="Только пользователи с доступом смогут видеть этот контест"
            {...form.getInputProps("is_private", { type: "checkbox" })}
          />

          <Switch
            label="Монитор включен"
            description="Все участники могут видеть таблицу результатов"
            {...form.getInputProps("monitor_enabled", { type: "checkbox" })}
          />

          <Button type="submit" loading={saving} fullWidth>
            Сохранить изменения
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
