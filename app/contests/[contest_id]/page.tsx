import { Footer } from "@/components/Footer";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Layout } from "@/components/Layout";
import { Call } from "@/lib/api";
import {
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Box,
  Button,
  Center,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconDeviceDesktop, IconMail, IconPuzzle, IconSend, IconSettings, IconUsers } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type {
  Contest,
  ContestProblemListItem,
} from "../../../../contracts/tester/v1";
import { ContestProblemsTable } from "./ContestProblemsTable";

type Props = {
  params: Promise<{ contest_id: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { contest_id } = await params;

  try {
    const response = await Call((client) =>
      client.default.getContest({ contestId: contest_id })
    );
    return {
      title: response?.contest?.title || "Контест не найден",
      description: response?.contest?.title || "",
    };
  } catch (error) {
    return {
      title: "Контест не найден",
    };
  }
};

type ContestProps = {
  contest: Contest;
  problems: Array<ContestProblemListItem>;
};

const Contest = ({ contest, problems }: ContestProps) => {
  return (
    <Layout>
      <AppShellHeader>
        <HeaderWithSession />
      </AppShellHeader>
      <AppShellMain>
        <Container
          size="lg"
          pt={0}
          pb={{ base: "md", sm: "lg", md: "xl" }}
          px={{ base: "xs", sm: "md", md: "lg" }}
        >
          {/* Header Section */}
          <Stack gap="md" mb="lg" style={{ maxWidth: "740px", margin: "0 auto" }}>
            <Title order={1} size="h3">
              🏆 {contest.title}
            </Title>
            <Group gap="sm">
              <Button
                component={Link}
                href={`/contests/${contest.id}`}
                variant="filled"
                size="sm"
                leftSection={<IconPuzzle size={16} />}
                visibleFrom="sm"
              >
                Задачи
              </Button>
              <Button
                component={Link}
                href={`/contests/${contest.id}/submit`}
                variant="default"
                size="sm"
                leftSection={<IconSend size={16} />}
                visibleFrom="sm"
              >
                Послать решение
              </Button>
              <Button
                component={Link}
                href={`/solutions?contestId=${contest.id}&order=-1`}
                variant="default"
                size="sm"
                leftSection={<IconMail size={16} />}
                visibleFrom="sm"
              >
                Посылки
              </Button>
              <Button
                component={Link}
                href={`/contests/${contest.id}/monitor`}
                variant="default"
                size="sm"
                leftSection={<IconDeviceDesktop size={16} />}
                visibleFrom="sm"
              >
                Монитор
              </Button>
              <Button
                component={Link}
                href={`/contests/${contest.id}/manage`}
                variant="filled"
                color="violet"
                size="sm"
                leftSection={<IconSettings size={16} />}
                visibleFrom="sm"
              >
                Управление
              </Button>
            </Group>
          </Stack>

          {/* Tasks Section */}
          {problems.length === 0 ? (
            <Center py={{ base: "xl", md: "3xl" }}>
              <Stack gap="md" align="center">
                <Box component="div" style={{ fontSize: "2.5rem" }}>
                  📝
                </Box>
                <Text c="dimmed" size="md" fw={500}>
                  Нет задач в контесте
                </Text>
              </Stack>
            </Center>
          ) : (
            <ContestProblemsTable contestId={contest.id} problems={problems} />
          )}
        </Container>
      </AppShellMain>

      <AppShellFooter withBorder={false}>
        <Footer />
      </AppShellFooter>
    </Layout>
  );
};

const Page = async ({ params }: Props) => {
  const { contest_id } = await params;

  console.log("🔍 Loading contest:", contest_id);

  try {
    const response = await Call((client) =>
      client.default.getContest({ contestId: contest_id })
    );

    console.log("✅ Contest response:", response);

    if (!response || !response.contest) {
      console.error("❌ No contest in response");
      notFound();
    }

    return (
      <Contest 
        contest={response.contest} 
        problems={response.problems || []} 
      />
    );
  } catch (error) {
    console.error("❌ Failed to load contest:", error);
    notFound();
  }
};

export default Page;
