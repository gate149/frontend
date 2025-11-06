"use client";

import { DefaultLayout } from "@/components/Layout";
import { getUsers } from "@/lib/actions";
import {
  Badge,
  Center,
  Container,
  Group,
  Input,
  Loader,
  Pagination,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type {
  ListUsersResponse,
  User,
} from "../../../contracts/tester/v1";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState<ListUsersResponse | null>({
    users: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
    },
  } as ListUsersResponse);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300); // Reduced from 500ms to 300ms for more responsive search

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Fetch users when debounced search or filters change
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getUsers(page, pageSize, debouncedSearch, role);
        if (result) {
          setData(result);
        } else {
          setError(new Error("Не удалось загрузить пользователей"));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers(); // FIXME
  }, [page, pageSize, debouncedSearch, role]);

  const users = data?.users || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "red";
      case "moderator":
        return "blue";
      case "user":
        return "gray";
      default:
        return "gray";
    }
  };

  if (error) {
    return (
      <DefaultLayout>
        <Container size="xl" py="xl">
          <Center>
            <Stack align="center">
              <Title order={2}>Ошибка при загрузке пользователей</Title>
              <Text c="dimmed">
                {error.message}
              </Text>
            </Stack>
          </Center>
        </Container>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Title order={1}>Пользователи</Title>

          <Group grow>
            <Input
              placeholder="Поиск по имени (часть имени, например: 'john')..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Input
              placeholder="Фильтр по роли (опционально)..."
              value={role}
              onChange={(e) => {
                setRole(e.currentTarget.value);
                setPage(1);
              }}
            />
          </Group>

          {isLoading ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : users.length === 0 ? (
            <Center py="xl">
              <Text c="dimmed">
                {search || role
                  ? "Пользователи по вашему запросу не найдены"
                  : "Пользователи не найдены"}
              </Text>
            </Center>
          ) : (
            <>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Имя пользователя</Table.Th>
                    <Table.Th>Роль</Table.Th>
                    <Table.Th>Создано</Table.Th>
                    <Table.Th>Обновлено</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {users.map((user: User) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>{user.username}</Table.Td>
                      <Table.Td>
                        <Badge color={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                      </Table.Td>
                      <Table.Td>
                        {new Date(user.updatedAt).toLocaleDateString("ru-RU")}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Stack align="center" gap="md">
                <Text size="sm" c="dimmed">
                  Показано {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, total)} из {total} пользователей
                </Text>
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={totalPages}
                  siblings={1}
                  boundaries={1}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </DefaultLayout>
  );
}
