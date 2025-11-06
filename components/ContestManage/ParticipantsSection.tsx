"use client";

import {
  addContestParticipant,
  getParticipants,
  removeContestParticipant,
  searchUsers,
} from "@/lib/actions";
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as testerv1 from "../../../contracts/tester/v1";

interface ParticipantsSectionProps {
  contestId: string;
}

export function ParticipantsSection({ contestId }: ParticipantsSectionProps) {
  const router = useRouter();
  const [participants, setParticipants] = useState<testerv1.User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<testerv1.User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pageSize = 10;

  // Load participants on mount
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true);
        const response = await getParticipants(contestId, page, pageSize);

        setParticipants(response?.users || []);
        const total = response?.pagination?.total || 0;
        setTotalPages(Math.ceil(total / pageSize));
      } catch (error) {
        console.error("Failed to load participants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [contestId, page]);

  // Search for users
  useEffect(() => {
    const searchUsersAsync = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const response = await searchUsers(debouncedQuery);

        setSearchResults(response?.users || []);
      } catch (error) {
        console.error("Failed to search users:", error);
      } finally {
        setSearching(false);
      }
    };

    searchUsersAsync();
  }, [debouncedQuery]);

  const handleAddParticipant = async () => {
    if (!selectedUserId) return;

    try {
      setAdding(true);

      await addContestParticipant(contestId, selectedUserId);

      notifications.show({
        title: "Успешно",
        message: "Участник добавлен",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      setSearchQuery("");
      setSelectedUserId(null);
      setPage(1);
      router.refresh();
    } catch (error) {
      console.error("Failed to add participant:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось добавить участника",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteParticipant = async (userId: string) => {
    try {
      setDeletingId(userId);

      await removeContestParticipant(contestId, userId);

      notifications.show({
        title: "Успешно",
        message: "Участник удален",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to delete participant:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось удалить участника",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const autocompleteData = searchResults.map((u) => ({
    value: u.id,
    label: `${u.username} (${u.role})`,
  }));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <div>
          <Title order={3} size="h4" mb="xs">
            Участники контеста
          </Title>
          <Text size="sm" c="dimmed">
            Добавьте или удалите участников контеста
          </Text>
        </div>

        {/* Add Participant Form */}
        <Card withBorder padding="md">
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              Добавить участника
            </Text>
            <Group gap="sm">
              <Autocomplete
                placeholder="Поиск по имени пользователя или email..."
                value={searchQuery}
                onChange={setSearchQuery}
                onOptionSubmit={(value) => {
                  setSelectedUserId(value);
                  const selected = searchResults.find((u) => u.id === value);
                  if (selected) {
                    setSearchQuery(selected.username);
                  }
                }}
                data={autocompleteData}
                rightSection={searching && <Loader size="xs" />}
                style={{ flex: 1 }}
              />
              <Button
                onClick={handleAddParticipant}
                disabled={!selectedUserId || adding}
                loading={adding}
                leftSection={<IconPlus size={16} />}
              >
                Добавить
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Participants List */}
        {loading ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : participants.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Text size="lg" c="dimmed">
                Нет участников
              </Text>
              <Text size="sm" c="dimmed">
                Добавьте участников для контеста
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap="md">
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Пользователь</Table.Th>
                  <Table.Th>Роль</Table.Th>
                  <Table.Th style={{ width: 80 }}>Действия</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {participants.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {user.username}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.id.toString().slice(0, 8)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={
                          user.role === "admin"
                            ? "red"
                            : user.role === "teacher"
                            ? "blue"
                            : "gray"
                        }
                      >
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => handleDeleteParticipant(user.id)}
                        loading={deletingId === user.id}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {totalPages > 1 && (
              <Center>
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={totalPages}
                />
              </Center>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
