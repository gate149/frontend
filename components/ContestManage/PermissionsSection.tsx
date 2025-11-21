"use client";

import { searchUsers } from "@/lib/actions";
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as corev1 from "../../../contracts/core/v1";

interface PermissionsSectionProps {
  contestId: string;
}

interface Permission {
  userId: string;
  username: string;
  relation: string;
}

export function PermissionsSection({ contestId }: PermissionsSectionProps) {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<corev1.UserModel[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<string>("moderator");
  const [adding, setAdding] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  // Load permissions (placeholder - needs actual API endpoint)
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        // TODO: Implement actual permissions listing API
        // For now, showing empty state
        setPermissions([]);
      } catch (error) {
        console.error("Failed to load permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [contestId]);

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

  const handleAddPermission = async () => {
    if (!selectedUserId || !selectedRelation) return;

    try {
      setAdding(true);

      // This would need to be implemented in the backend
      // For now, showing a placeholder notification
      notifications.show({
        title: "В разработке",
        message: "Функция управления правами доступа находится в разработке",
        color: "blue",
      });

      // TODO: Implement actual permission creation API
      // await searchUsers(contestId, {
      //   user_id: selectedUserId,
      //   relation: selectedRelation,
      // });

      setSearchQuery("");
      setSelectedUserId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to add permission:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось добавить права",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeletePermission = async (userId: string, relation: string) => {
    const key = `${userId}-${relation}`;
    try {
      setDeletingKey(key);

      // This would need to be implemented in the backend
      notifications.show({
        title: "В разработке",
        message: "Функция управления правами доступа находится в разработке",
        color: "blue",
      });

      // TODO: Implement actual permission deletion API
      // await searchUsers(contestId, userId, relation);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete permission:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось удалить права",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setDeletingKey(null);
    }
  };

  const autocompleteData = searchResults.map((u) => ({
    value: u.id,
    label: `${u.username} (${u.role})`,
  }));

  const relationOptions = [
    { value: "owner", label: "Владелец (Owner)" },
    { value: "moderator", label: "Модератор (Moderator)" },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Add Permission Form */}
        <Card withBorder padding="md">
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              Добавить права
            </Text>
            <Group gap="sm" align="flex-end">
              <Autocomplete
                placeholder="Поиск пользователя..."
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
              <Select
                placeholder="Роль"
                value={selectedRelation}
                onChange={(value) => setSelectedRelation(value || "moderator")}
                data={relationOptions}
                style={{ width: 200 }}
              />
              <Button
                onClick={handleAddPermission}
                disabled={!selectedUserId || adding}
                loading={adding}
                leftSection={<IconPlus size={16} />}
              >
                Добавить
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Info Card */}
        <Card withBorder padding="md">
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Типы прав доступа:
            </Text>
            <Text size="xs">
              • <strong>Владелец (Owner)</strong> - Полный доступ к контесту,
              включая удаление
            </Text>
            <Text size="xs">
              • <strong>Модератор (Moderator)</strong> - Может редактировать
              контест и управлять участниками
            </Text>
            <Text size="xs">
              • <strong>Участник (Participant)</strong> - Может участвовать в
              контесте (добавляется через вкладку "Участники")
            </Text>
          </Stack>
        </Card>

        {/* Permissions List */}
        {loading ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : permissions.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Text size="lg" c="dimmed">
                Нет дополнительных прав
              </Text>
              <Text size="sm" c="dimmed">
                Добавьте модераторов или владельцев для контеста
              </Text>
            </Stack>
          </Center>
        ) : (
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Пользователь</Table.Th>
                <Table.Th>Роль</Table.Th>
                <Table.Th style={{ width: 80 }}>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {permissions.map((perm) => {
                const key = `${perm.userId}-${perm.relation}`;
                return (
                  <Table.Tr key={key}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {perm.username}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {perm.userId.toString().slice(0, 8)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={
                          perm.relation === "owner"
                            ? "red"
                            : perm.relation === "moderator"
                            ? "blue"
                            : "gray"
                        }
                      >
                        {perm.relation}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() =>
                          handleDeletePermission(perm.userId, perm.relation)
                        }
                        loading={deletingKey === key}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Card>
  );
}
