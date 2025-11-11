import { DefaultLayout } from "@/components/Layout";
import { ProblemsDataWrapper } from "@/components/ProblemsPage/ProblemsDataWrapper";
import { ContestsDataWrapper } from "@/components/ProblemsPage/ContestsDataWrapper";
import { ProblemsOwnerFilter } from "@/components/ProblemsPage/ProblemsOwnerFilter";
import { ProblemsPageWrapper } from "@/components/ProblemsPage/ProblemsPageWrapper";
import { ProblemsContentWrapper } from "@/components/ProblemsPage/ProblemsContentWrapper";
import { getMe, getProblems, getContests } from "@/lib/actions";
import { Alert, Center, Container, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мастерская",
  description: "",
};

type Props = {
  searchParams: Promise<{ page?: string; view?: string; search?: string }>;
};

const ProblemsContent = async ({
  page,
  view,
  search,
  isAuthenticated,
}: {
  page: number;
  view: string;
  search?: string;
  isAuthenticated: boolean;
}) => {
  // Fetch data based on view
  if (view === "problems") {
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
      <ProblemsPageWrapper>
        <ProblemsContentWrapper>
          <Stack gap="lg">
            <ProblemsOwnerFilter isAuthenticated={isAuthenticated} />
            <ProblemsDataWrapper
              problems={problemsData.problems}
              pagination={problemsData.pagination}
              isAuthenticated={isAuthenticated}
              owner="me"
            />
          </Stack>
        </ProblemsContentWrapper>
      </ProblemsPageWrapper>
    );
  } else {
    // view === "contests" (default)
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
      <ProblemsPageWrapper>
        <ProblemsContentWrapper>
          <Stack gap="lg">
            <ProblemsOwnerFilter isAuthenticated={isAuthenticated} />
            <ContestsDataWrapper
              contests={contestsData.contests || []}
              pagination={contestsData.pagination}
            />
          </Stack>
        </ProblemsContentWrapper>
      </ProblemsPageWrapper>
    );
  }
};

const Page = async (props: Props) => {
  const resolvedSearchParams = await props.searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const view = resolvedSearchParams.view || "contests";
  const search = resolvedSearchParams.search;

  // Fetch user data on server
  const userData = await getMe();
  const isAuthenticated = !!userData?.user;

  return (
    <DefaultLayout>
      <Container size="xl" py="xl">
        <ProblemsContent
          page={page}
          view={view}
          search={search}
          isAuthenticated={isAuthenticated}
        />
      </Container>
    </DefaultLayout>
  );
};

export default Page;
