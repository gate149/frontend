import { CreateContestForm } from "@/components/CreateContestForm";
import { Footer } from "@/components/Footer";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Layout } from "@/components/Layout";
import { getContests, getMe } from "@/lib/actions";
import {
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Box,
  Center,
  Container,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Suspense } from "react";
import { ContestsFilter } from "@/components/ContestsFilter";
import { ContestsSearchInput } from "@/components/ContestsSearchInput";
import { ContestsTable } from "@/components/ContestsTable";

export const metadata = {
  title: "Контесты",
  description: "Список всех доступных контестов",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  owner?: string;
}>;

type Params = {
  searchParams: SearchParams;
};

type ContestsContentProps = {
  searchParams: Params["searchParams"];
  isAuthenticated: boolean;
};

const ContestsContent = async ({
  searchParams,
  isAuthenticated,
}: ContestsContentProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search;
  const owner = params.owner;
  const pageSize = 10;

  // Fetch contests on server
  const data = await getContests(page, pageSize, search, owner);

  if (!data) {
    return (
      <Container size="xl" py="xl">
        <Center>
          <Stack align="center">
            <Title order={2}>Ошибка при загрузке контестов</Title>
            <Text c="dimmed">Не удалось загрузить контесты</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  const contests = data.contests || [];
  const total = data.pagination?.total || 0;

  if (contests.length === 0) {
    return (
      <Box style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <Box style={{ flex: 1, marginLeft: "344px" }}>
          <Container size="md" pb="xl" mx="auto">
            <Stack gap="lg">
              <ContestsFilter />
              <ContestsSearchInput />
              <Center py="xl">
                <Text c="dimmed">
                  {search && search.trim()
                    ? "Контесты по вашему запросу не найдены"
                    : "Контесты не найдены"}
                </Text>
              </Center>
            </Stack>
          </Container>
        </Box>
        <Box style={{ width: "280px", marginRight: "32px" }}>
          <Paper
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            bg="var(--mantine-color-gray-light)"
          >
            <Stack gap="md">
              <Title order={4} size="h5">
                ⚙️ Управление
              </Title>
              <CreateContestForm isAuthenticated={isAuthenticated} />
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
      <Box style={{ flex: 1, marginLeft: "344px" }}>
        <Container size="md" pb="xl" mx="auto">
          <Stack gap="lg">
            <ContestsFilter />

            <ContestsSearchInput />

            <ContestsTable contests={contests} />
          </Stack>
        </Container>
      </Box>
      <Box style={{ width: "280px", marginRight: "32px" }}>
        <Paper
          shadow="sm"
          radius="md"
          p="md"
          withBorder
          bg="var(--mantine-color-gray-light)"
        >
          <Stack gap="md">
            <Title order={4} size="h5">
              ⚙️ Управление
            </Title>
            <CreateContestForm isAuthenticated={isAuthenticated} />
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

const ContestsPage = async ({ searchParams }: Params) => {
  // Fetch user data on server
  const userData = await getMe();
  const isAuthenticated = !!userData?.user;

  return (
    <Layout>
      <AppShellHeader>
        <HeaderWithSession />
      </AppShellHeader>
      <AppShellMain>
        <Suspense
          fallback={
            <Box style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
              <Box style={{ flex: 1, marginLeft: "344px" }}>
                <Container size="md" pb="xl" mx="auto">
                  <Stack gap="lg">
                    <ContestsFilter />
                    <ContestsSearchInput />
                    <Skeleton height={200} radius="sm" />
                  </Stack>
                </Container>
              </Box>
              <Box style={{ width: "280px", marginRight: "32px" }}>
                <Paper
                  shadow="sm"
                  radius="md"
                  p="md"
                  withBorder
                  bg="var(--mantine-color-gray-light)"
                >
                  <Stack gap="md">
                    <Title order={4} size="h5">
                      ⚙️ Управление
                    </Title>
                    <CreateContestForm isAuthenticated={isAuthenticated} />
                  </Stack>
                </Paper>
              </Box>
            </Box>
          }
        >
          <ContestsContent
            searchParams={searchParams}
            isAuthenticated={isAuthenticated}
          />
        </Suspense>
      </AppShellMain>
      <AppShellFooter withBorder={false}>
        <Footer />
      </AppShellFooter>
    </Layout>
  );
};

export default ContestsPage;
