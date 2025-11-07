import { CreateProblemForm } from "@/components/CreateProblemForm";
import { DefaultLayout } from "@/components/Layout";
import { ProblemsDataWrapper } from "@/components/ProblemsPage/ProblemsDataWrapper";
import { ProblemsOwnerFilter } from "@/components/ProblemsPage/ProblemsOwnerFilter";
import { ProblemsPageWrapper } from "@/components/ProblemsPage/ProblemsPageWrapper";
import { getMe, getProblems } from "@/lib/actions";
import { Alert, Center, Container, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мастерская",
  description: "",
};

type Props = {
  searchParams: Promise<{ page?: string; owner?: string }>;
};

const ProblemsContent = async ({
  page,
  owner,
}: {
  page: number;
  owner?: string;
}) => {
  // Fetch problems and user data on server
  const [problemsData, userData] = await Promise.all([
    getProblems(page, 20, undefined, undefined, owner),
    getMe(),
  ]);

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

  const isAuthenticated = !!userData?.user;

  return (
    <Stack gap="lg">
      <ProblemsOwnerFilter isAuthenticated={isAuthenticated} />
      {owner === "me" && <CreateProblemForm isAuthenticated={isAuthenticated} />}
      <ProblemsDataWrapper
        problems={problemsData.problems}
        pagination={problemsData.pagination}
        isAuthenticated={isAuthenticated}
        owner={owner}
      />
    </Stack>
  );
};

const Page = async (props: Props) => {
  const resolvedSearchParams = await props.searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const owner = resolvedSearchParams.owner;

  return (
    <DefaultLayout>
      <Container size="xl" py="xl">
        <ProblemsPageWrapper>
          <ProblemsContent page={page} owner={owner} />
        </ProblemsPageWrapper>
      </Container>
    </DefaultLayout>
  );
};

export default Page;
