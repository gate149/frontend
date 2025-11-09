import { DefaultLayout } from "@/components/Layout";
import { UsersContent } from "@/components/UsersContent";
import { UsersRoleFilter } from "@/components/UsersRoleFilter";
import { UsersSearchInput } from "@/components/UsersSearchInput";
import { Container, Group, Skeleton, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import { Suspense } from "react";

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
  const search = params.search;
  const role = params.role;

  return (
    <DefaultLayout>
      <Suspense
        fallback={
          <Container size="xl" py="xl">
            <Stack gap="lg">
              <Title order={1}>Пользователи</Title>

              <Group grow>
                <UsersSearchInput />
                <UsersRoleFilter />
              </Group>

              <Stack gap="sm">
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
                <Skeleton height={35} radius="sm" />
              </Stack>
            </Stack>
          </Container>
        }
      >
        <UsersContent page={page} search={search} role={role} />
      </Suspense>
    </DefaultLayout>
  );
}
