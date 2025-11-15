"use server";

import { DefaultLayout } from "@/components/Layout";
import { Problem } from "@/components/Problem";
import { getProblem } from "@/lib/actions";
import { Button, Center, Container, Stack, Text, Title } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ problem_id: string }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { problem_id } = await props.params;
  const response = await getProblem(problem_id);

  if (!response) {
    return {
      title: "Задача не найдена",
    };
  }

  return {
    title: `${response.problem.title}`,
    description: "",
  };
};

const Page = async (props: Props) => {
  const { problem_id } = await props.params;
  const response = await getProblem(problem_id);

  console.log(response);

  if (!response) {
    return (
      <DefaultLayout>
        <Container size="xl" py="xl">
          <Center>
            <Stack align="center">
              <Title order={2}>Задача не найдена</Title>
              <Text c="dimmed">Не удалось загрузить задачу</Text>
              <Button component={Link} href="/workshop?view=problems">
                Вернуться к задачам
              </Button>
            </Stack>
          </Center>
        </Container>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Stack px="16" pb="16" maw="1920px" m="0 auto">
        <Stack align="center" w="fit-content" gap="16" m="0 auto">
          <Problem problem={response.problem} letter="A" />
        </Stack>
      </Stack>
    </DefaultLayout>
  );
};

export default Page;
