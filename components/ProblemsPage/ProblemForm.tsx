"use client";

import {
  Anchor,
  AppShellHeader,
  AppShellMain,
  Badge,
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconUpload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as testerv1 from "../../../contracts/tester/v1/tester";

type Props = {
  problem: testerv1.Problem;
  onSubmitFn: (id: string, data: any) => Promise<any>;
  onUploadFn: (id: string, data: FormData) => Promise<any>;
};

const ProblemForm = ({ problem, onSubmitFn, onUploadFn }: Props) => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    initialValues: {
      title: problem.title || "",
      time_limit: problem.time_limit || 1000,
      memory_limit: problem.memory_limit || 256,
      legend: problem.legend || "",
      input_format: problem.input_format || "",
      output_format: problem.output_format || "",
      notes: problem.notes || "",
      scoring: problem.scoring || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => onSubmitFn(problem.id, data),
    onSuccess: async () => {
      console.log("✅ Problem updated successfully");
      form.resetDirty();
      router.refresh();
    },
    onError: (error) => {
      console.error("❌ Problem update failed:", error);
      form.clearErrors();
    },
    retry: false,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => onUploadFn(problem.id, formData),
    onSuccess: () => {
      setOpened(false);
      setFile(null);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = form.getValues();
    console.log("📝 ProblemForm - submitting values:", values);
    mutation.mutate(values);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadMutation.mutate(formData);
    }
  };

  return (
    <>
      <AppShellHeader>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Anchor component={Link} href="/problems">
              <Button
                variant="default"
                size="sm"
                leftSection={<IconArrowLeft size={16} />}
              >
                Назад
              </Button>
            </Anchor>
            <div>
              <Title order={3} size="h5">
                Редактирование задачи
              </Title>
              <Badge size="sm" variant="light" color="blue">
                {problem.id?.toString().slice(0, 8)}
              </Badge>
            </div>
          </Group>
          <Group gap="sm">
            <Button
              variant="default"
              size="sm"
              leftSection={<IconUpload size={16} />}
              onClick={() => setOpened(true)}
            >
              Загрузить файл
            </Button>
            <Button
              type="submit"
              form="problem-form"
              size="sm"
              disabled={!form.isDirty()}
              loading={mutation.isPending}
            >
              Сохранить
            </Button>
          </Group>
        </Group>
      </AppShellHeader>

      <AppShellMain>
        <Container size="md" pt={0} pb="xl">
          <form id="problem-form" onSubmit={onSubmit}>
            <Stack gap="lg">
              {/* Title Section */}
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Title order={4} mb="xs">
                      📝 Основная информация
                    </Title>
                    <Divider />
                  </div>
                  <TextInput
                    label="Название задачи"
                    placeholder="Введите название"
                    size="md"
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                  />
                </Stack>
              </Paper>

              {/* Limits Section */}
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Title order={4} mb="xs">
                      ⚙️ Ограничения
                    </Title>
                    <Divider />
                  </div>
                  <Group grow>
                    <NumberInput
                      label="Время (мс)"
                      placeholder="1000"
                      size="md"
                      key={form.key("time_limit")}
                      {...form.getInputProps("time_limit")}
                    />
                    <NumberInput
                      label="Память (МБ)"
                      placeholder="64"
                      size="md"
                      key={form.key("memory_limit")}
                      {...form.getInputProps("memory_limit")}
                    />
                  </Group>
                </Stack>
              </Paper>

              {/* Description Section */}
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Title order={4} mb="xs">
                      📄 Условие задачи
                    </Title>
                    <Divider />
                  </div>
                  <Textarea
                    label="Легенда"
                    placeholder="Опишите условие задачи..."
                    autosize
                    minRows={4}
                    maxRows={8}
                    size="md"
                    key={form.key("legend")}
                    {...form.getInputProps("legend")}
                  />
                  <Textarea
                    label="Формат входных данных"
                    placeholder="Опишите входные данные..."
                    autosize
                    minRows={3}
                    maxRows={6}
                    size="md"
                    key={form.key("input_format")}
                    {...form.getInputProps("input_format")}
                  />
                  <Textarea
                    label="Формат выходных данных"
                    placeholder="Опишите выходные данные..."
                    autosize
                    minRows={3}
                    maxRows={6}
                    size="md"
                    key={form.key("output_format")}
                    {...form.getInputProps("output_format")}
                  />
                </Stack>
              </Paper>

              {/* Scoring and Notes Section */}
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Title order={4} mb="xs">
                      📊 Дополнительные параметры
                    </Title>
                    <Divider />
                  </div>
                  <Textarea
                    label="Система оценки"
                    placeholder="Опишите систему оценки..."
                    autosize
                    minRows={3}
                    maxRows={6}
                    size="md"
                    key={form.key("scoring")}
                    {...form.getInputProps("scoring")}
                  />
                  <Textarea
                    label="Примечание"
                    placeholder="Дополнительные примечания..."
                    autosize
                    minRows={2}
                    maxRows={4}
                    size="md"
                    key={form.key("notes")}
                    {...form.getInputProps("notes")}
                  />
                </Stack>
              </Paper>

              {/* Save Button */}
              <Group justify="flex-end" gap="md">
                <Button
                  variant="default"
                  size="md"
                  onClick={() => router.back()}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  size="md"
                  loading={mutation.isPending}
                  disabled={!form.isDirty()}
                >
                  Сохранить изменения
                </Button>
              </Group>
            </Stack>
          </form>
        </Container>
      </AppShellMain>

      {/* Modal for file upload */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Загрузить файл"
        centered
      >
        <Stack>
          <FileInput
            label="Выберите файл"
            placeholder="Выберите файл"
            onChange={setFile}
            value={file}
          />
          <Button
            onClick={handleUpload}
            disabled={!file}
            loading={uploadMutation.isPending}
          >
            Загрузить
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export { ProblemForm };
