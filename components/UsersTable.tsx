"use client";

import { Badge, Stack, Table, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import type {
  Pagination as PaginationType,
  User,
} from "../../contracts/core/v1";
import { NextPagination } from "./Pagination";

type Props = {
  users: User[];
  pagination: PaginationType;
  search?: string;
  role?: string;
};

export function UsersTable({ users, pagination, search, role }: Props) {
  const router = useRouter();

  // Ensure pagination values are numbers
  const currentPage = Number(pagination.page) || 1;
  const currentPageSize = Number(pagination.pageSize) || 10;
  const totalUsers = Number(pagination.total) || 0;

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

  if (users.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        {search || role
          ? "Пользователи по вашему запросу не найдены"
          : "Пользователи не найдены"}
      </Text>
    );
  }

  const queryParams: Record<string, string | number | undefined> = {};
  if (search) queryParams.search = search;
  if (role) queryParams.role = role;

  return (
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
            <Table.Tr
              key={user.id}
              onClick={() => router.push(`/users/${user.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Table.Td>{user.username}</Table.Td>
              <Table.Td>
                <Badge color={getRoleColor(user.role)}>{user.role}</Badge>
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
          Показано {(currentPage - 1) * currentPageSize + 1}-
          {Math.min(currentPage * currentPageSize, totalUsers)} из{" "}
          {totalUsers} пользователей
        </Text>
        <NextPagination
          pagination={{
            page: currentPage,
            pageSize: currentPageSize,
            total: Math.ceil(totalUsers / currentPageSize),
          }}
          baseUrl="/users"
          queryParams={queryParams}
        />
      </Stack>
    </>
  );
}

