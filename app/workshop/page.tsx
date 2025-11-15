import { DefaultLayout } from "@/components/Layout";
import { WorkshopProblemsWrapper } from "@/components/WorkshopPage/WorkshopProblemsWrapper";
import { WorkshopTabs } from "@/components/WorkshopPage/WorkshopTabs";
import { WorkshopPageWrapper } from "@/components/WorkshopPage/WorkshopPageWrapper";
import { WorkshopProblemsGridSkeleton } from "@/components/WorkshopPage/WorkshopProblemsGridSkeleton";
import { WorkshopContestsContentSkeleton } from "@/components/WorkshopPage/WorkshopContestsContentSkeleton";
import { getMe, getProblems, getContests } from "@/lib/actions";
import { Alert, Center, Container, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { WorkshopContestsWrapper } from "@/components/WorkshopPage/WorkshopContestsWrapper";
import { WorkshopProblemsContentSkeleton } from "@/components/WorkshopPage/WorkshopProblemsContentSkeleton";
export const metadata: Metadata = {
  title: "Мастерская",
  description: "",
};

type Props = {
  searchParams: Promise<{ page?: string; view?: string; search?: string }>;
};

const ProblemsView = async ({
  page,
  search,
  isAuthenticated,
}: {
  page: number;
  search?: string;
  isAuthenticated: boolean;
}) => {
  const problemsData = await getProblems(page, 20, undefined, undefined, "me");

  if (!problemsData) {
    return (
      <Center py="xl">
        <Stack align="center">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Ошибка загрузки"
            color="red"
          >
            Не удалось загрузить список задач. Попробуйте обновить страницу.
          </Alert>
        </Stack>
      </Center>
    );
  }

  return (
    <WorkshopProblemsWrapper
      problems={problemsData.problems}
      pagination={problemsData.pagination}
      isAuthenticated={isAuthenticated}
      owner="me"
    />
  );
};

const ContestsView = async ({
  page,
  search,
  isAuthenticated,
}: {
  page: number;
  search?: string;
  isAuthenticated: boolean;
}) => {
  const contestsData = await getContests(page, 10, search, "me");

  if (!contestsData) {
    return (
      <Center py="xl">
        <Stack align="center">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Ошибка загрузки"
            color="red"
          >
            Не удалось загрузить список контестов. Попробуйте обновить страницу.
          </Alert>
        </Stack>
      </Center>
    );
  }

  return (
    <WorkshopContestsWrapper
      contests={contestsData.contests}
      pagination={contestsData.pagination}
    />
  );
};

const WorshopPageContent = async ({
  page,
  view,
  search,
}: {
  page: number;
  view: string;
  search?: string;
}) => {

  const userData = await getMe();
  const isAuthenticated = !!userData?.user;

  return (
    <WorkshopPageWrapper>
      <Stack gap="lg">
        <WorkshopTabs isAuthenticated={isAuthenticated} />
        {view === "problems" ? (
          <Suspense fallback={<WorkshopProblemsContentSkeleton />}>
            <ProblemsView page={page} search={search} isAuthenticated={isAuthenticated} />
          </Suspense>
        ) : (
          <Suspense fallback={<WorkshopContestsContentSkeleton />}>
            <ContestsView page={page} search={search} isAuthenticated={isAuthenticated} />
          </Suspense>
        )}
      </Stack>
    </WorkshopPageWrapper >
  );
};

const Page = async (props: Props) => {
  const resolvedSearchParams = await props.searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const view = resolvedSearchParams.view || "contests";
  const search = resolvedSearchParams.search;

  // Fetch user data on server

  return (
    <DefaultLayout>
      <Container size="xl" py="xl">
        <WorshopPageContent
          page={page}
          view={view}
          search={search}
        />
      </Container>
    </DefaultLayout>
  );
};

export default Page;
