import { DefaultLayout } from "@/components/Layout";
import { UsersRoleFilter } from "@/components/UsersRoleFilter";
import { UsersSearchInput } from "@/components/UsersSearchInput";
import { UsersTable } from "@/components/UsersTable";
import { getUsers } from "@/lib/actions";
import { Center, Container, Group, Stack, Text, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользователи",
  description: "Список всех пользователей системы",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  role?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function UsersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 10;
  const search = params.search;
  const role = params.role;

  // Fetch users on server
  const data = await getUsers(page, pageSize, search, role);

  if (!data) {
    return (
      <DefaultLayout>
        <Container size="xl" py="xl">
          <Center>
            <Stack align="center">
              <Title order={2}>Ошибка при загрузке пользователей</Title>
              <Text c="dimmed">Не удалось загрузить пользователей</Text>
            </Stack>
          </Center>
        </Container>
      </DefaultLayout>
    );
  }

  const users = data.users || [];
  const pagination = data.pagination || {
    total: 0,
    page: 1,
    pageSize: 10,
  };

  return (
    <DefaultLayout>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Title order={1}>Пользователи</Title>

          <Group grow>
            <UsersSearchInput />
            <UsersRoleFilter />
          </Group>

          <UsersTable
            users={users}
            pagination={pagination}
            search={search}
            role={role}
          />
        </Stack>
      </Container>
    </DefaultLayout>
  );
}
