import { DefaultLayout } from "@/components/Layout";
import { ProblemsDataWrapper } from "@/components/ProblemsPage/ProblemsDataWrapper";
import { ContestsDataWrapper } from "@/components/ProblemsPage/ContestsDataWrapper";
import { ProblemsOwnerFilter } from "@/components/ProblemsPage/ProblemsOwnerFilter";
import { ProblemsPageWrapper } from "@/components/ProblemsPage/ProblemsPageWrapper";
import { ProblemsGridSkeleton } from "@/components/ProblemsPage/ProblemsGridSkeleton";
import { ContestsContentSkeleton } from "@/components/ProblemsPage/ContestsContentSkeleton";
import { getMe, getProblems, getContests } from "@/lib/actions";
import { Alert, Center, Container, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { ProblemsContentWrapper } from "@/components/ProblemsPage/ProblemsContentWrapper";

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
    <ProblemsDataWrapper
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
    <ProblemsContentWrapper
      contests={contestsData.contests}
      pagination={contestsData.pagination}
    />
  );
};

const ProblemsContent = async ({
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
    <ProblemsPageWrapper>
      <Stack gap="lg">
        <ProblemsOwnerFilter isAuthenticated={isAuthenticated} />
        {view === "problems" ? (
          <Suspense fallback={<ProblemsGridSkeleton />}>
            <ProblemsView page={page} search={search} isAuthenticated={isAuthenticated} />
          </Suspense>
        ) : (
          <Suspense fallback={<ContestsContentSkeleton />}>
            <ContestsView page={page} search={search} isAuthenticated={isAuthenticated} />
          </Suspense>
        )}
      </Stack>
    </ProblemsPageWrapper >
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
        <ProblemsContent
          page={page}
          view={view}
          search={search}
        />
      </Container>
    </DefaultLayout>
  );
};

export default Page;
