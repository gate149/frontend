"use client";

import {
  addContestProblem,
  removeContestProblem,
  searchProblems,
} from "@/lib/actions";
import { numberToLetters } from "@/lib/lib";
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as corev1 from "../../../contracts/core/v1";
import { StatusMessage } from "@/components/StatusMessage";

interface ProblemsSectionProps {
  contestId: string;
  initialProblems: Array<corev1.ContestProblemListItemModel>;
}

export function ProblemsSection({
  contestId,
  initialProblems,
}: ProblemsSectionProps) {
  const router = useRouter();
  const [problems, setProblems] = useState(initialProblems);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<corev1.ProblemsListItemModel[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null
  );
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Синхронизация списка задач с initialProblems
  useEffect(() => {
    setProblems(initialProblems);
  }, [initialProblems]);

  // Search for problems
  useEffect(() => {
    const searchProblemsAsync = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const response = await searchProblems(debouncedQuery, true);

        setSearchResults(response?.problems || []);
      } catch (error) {
        console.error("Failed to search problems:", error);
      } finally {
        setSearching(false);
      }
    };

    searchProblemsAsync();
  }, [debouncedQuery]);

  const handleAddProblem = async () => {
    if (!selectedProblemId) return;

    try {
      setAdding(true);

      await addContestProblem(contestId, selectedProblemId);

      setStatusMessage({
        type: "success",
        message: "Задача добавлена в контест",
      });

      setSearchQuery("");
      setSelectedProblemId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to add problem:", error);
      setStatusMessage({
        type: "error",
        message: "Не удалось добавить задачу",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      setDeletingId(problemId);

      await removeContestProblem(contestId, problemId);

      setStatusMessage({
        type: "success",
        message: "Задача удалена из контеста",
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to delete problem:", error);
      setStatusMessage({
        type: "error",
        message: "Не удалось удалить задачу",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const autocompleteData = searchResults.map((p) => ({
    value: p.id,
    label: p.title,
  }));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Add Problem Form */}
        <Card withBorder padding="md">
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              Добавить задачу
            </Text>
            <Group gap="sm">
              <Autocomplete
                placeholder="Поиск среди ваших задач..."
                value={searchQuery}
                onChange={setSearchQuery}
                onOptionSubmit={(value) => {
                  setSelectedProblemId(value);
                  const selected = searchResults.find((p) => p.id === value);
                  if (selected) {
                    setSearchQuery(selected.title);
                  }
                }}
                data={autocompleteData}
                rightSection={searching && <Loader size="xs" />}
                style={{ flex: 1 }}
              />
              <Button
                onClick={handleAddProblem}
                disabled={!selectedProblemId || adding}
                loading={adding}
                leftSection={<IconPlus size={16} />}
              >
                Добавить
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Problems List */}
        {problems.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Text size="lg" c="dimmed">
                Нет задач в контесте
              </Text>
              <Text size="sm" c="dimmed">
                Добавьте задачи из вашего списка
              </Text>
            </Stack>
          </Center>
        ) : (
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 60 }}>№</Table.Th>
                <Table.Th>Название</Table.Th>
                <Table.Th style={{ width: 120 }}>Время</Table.Th>
                <Table.Th style={{ width: 120 }}>Память</Table.Th>
                <Table.Th style={{ width: 80 }}>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {problems.map((problem) => (
                <Table.Tr key={problem.problem_id}>
                  <Table.Td>
                    <Badge variant="light" color="blue">
                      {numberToLetters(problem.position)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {problem.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {problem.problem_id?.toString().slice(0, 8)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{problem.time_limit}ms</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{problem.memory_limit}MB</Text>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDeleteProblem(problem.problem_id)}
                      loading={deletingId === problem.problem_id}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>

      <StatusMessage
        type={statusMessage?.type || "success"}
        message={statusMessage?.message || ""}
        opened={!!statusMessage}
        onClose={() => setStatusMessage(null)}
      />
    </Card>
  );
}
