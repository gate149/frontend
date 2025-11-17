"use client";

import { updateContest } from "@/lib/actions";
import {
  Button,
  Card,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type * as corev1 from "../../../contracts/core/v1";
import { APP_COLORS } from "@/lib/theme/colors";

interface SettingsSectionProps {
  contest: corev1.ContestModel;
}

export function SettingsSection({ contest }: SettingsSectionProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      title: contest.title,
      is_private: contest.is_private,
      monitor_enabled: contest.monitor_enabled,
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

          <Button type="submit" loading={saving} fullWidth color={APP_COLORS.contests}>
            Сохранить изменения
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
