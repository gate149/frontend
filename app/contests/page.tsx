import { CreateContestForm } from "@/components/CreateContestForm";
import { Footer } from "@/components/Footer";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Layout } from "@/components/Layout";
import { getContests, getMe } from "@/lib/actions";
import {
  AppShellAside,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Box,
  Center,
  Container,
  Divider,
  Group,
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

  // Compact management controls for mobile
  const compactManagementControls = (
    <Group gap="sm" wrap="wrap" justify="flex-start">
      <CreateContestForm isAuthenticated={isAuthenticated} />
    </Group>
  );

  if (contests.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Box mb="lg" hiddenFrom="lg">
          {compactManagementControls}
        </Box>
        <Stack gap="lg">
          <Title order={1}>Контесты</Title>
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
    );
  }

  return (
    <Container size="xl" pb="xl">
      <Box mb="lg" hiddenFrom="lg">
        {compactManagementControls}
      </Box>
      <Stack gap="lg">
        <Title order={1}>Контесты</Title>

        <ContestsFilter />

        <ContestsSearchInput />

        <ContestsTable contests={contests} />

        <Stack align="center" gap="md">
          <Text size="sm" c="dimmed">
            Показано {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, total)} из {total} контестов
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
};

const ContestsPage = async ({ searchParams }: Params) => {
  // Fetch user data on server
  const userData = await getMe();
  const isAuthenticated = !!userData?.user;

  // Management controls for sidebar
  const managementControls = (
    <Stack gap="md">
      <Title order={4} size="h5">
        ⚙️ Управление
      </Title>
      <Divider />
      <Stack gap="8px">
        <CreateContestForm isAuthenticated={isAuthenticated} />
      </Stack>
    </Stack>
  );

  return (
    <Layout
      asideConfig={{
        width: 280,
        breakpoint: "lg",
        collapsed: { mobile: true, desktop: false },
      }}
    >
      <AppShellHeader>
        <HeaderWithSession drawerContent={managementControls} />
      </AppShellHeader>
      <AppShellMain>
        <Suspense
          fallback={
            <Container size="xl" py="xl">
              <Stack gap="lg">
                <Title order={1}>Контесты</Title>
                <ContestsSearchInput />
                <Center py="xl">
                  <Text>Загрузка...</Text>
                </Center>
              </Stack>
            </Container>
          }
        >
          <ContestsContent
            searchParams={searchParams}
            isAuthenticated={isAuthenticated}
          />
        </Suspense>
      </AppShellMain>
      <AppShellAside withBorder={false} visibleFrom="lg">
        <Stack px="16" py="16" gap="lg">
          {managementControls}
        </Stack>
      </AppShellAside>
      <AppShellFooter withBorder={false}>
        <Footer />
      </AppShellFooter>
    </Layout>
  );
};

export default ContestsPage;
