import { CreateParticipantForm } from "@/components/CreateParticipantForm";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { Footer } from "@/components/Footer";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Layout } from "@/components/Layout";
import { Call } from "@/lib/api";
import {
  AppShellAside,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconDeviceDesktop, IconMail, IconUsers } from "@tabler/icons-react";
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
  // Sidebar management controls
  const managementControls = (
    <Stack gap="md">
      <Title order={4} size="h5">
        ⚙️ Управление
      </Title>
      <Stack gap="8px">
        <CreateTaskForm contestId={contest.id} />
        <CreateParticipantForm contestId={contest.id} />
      </Stack>
    </Stack>
  );

  // Compact management controls for mobile
  const compactManagementControls = (
    <Group gap="sm" wrap="wrap" justify="flex-start">
      <CreateTaskForm contestId={String(contest.id)} />
      <CreateParticipantForm contestId={String(contest.id)} />
    </Group>
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
        <Container
          size="100%"
          fluid
          pt={0}
          pb={{ base: "md", sm: "lg", md: "xl" }}
          px={{ base: "xs", sm: "md", md: "lg" }}
        >
          {/* Management controls for split screen / mobile (hidden on desktop) */}
          <Box mb="lg" hiddenFrom="lg">
            {compactManagementControls}
          </Box>

          {/* Header Section */}
          <Stack gap="lg" mb="lg">
            <Flex
              justify="space-between"
              align="flex-start"
              gap="md"
              wrap="wrap"
            >
              <div>
                <Title order={1} size="h3">
                  🏆 {contest.title}
                </Title>
                <Badge size="sm" variant="light" color="blue" mt="xs">
                  {problems.length} задач
                </Badge>
              </div>
              <Group gap="sm">
                <Button
                  component={Link}
                  href={`/contests/${contest.id}/manage`}
                  variant="filled"
                  size="sm"
                  visibleFrom="sm"
                >
                  Управление
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
                  href={`/contests/${contest.id}/participants`}
                  variant="default"
                  size="sm"
                  leftSection={<IconUsers size={16} />}
                  visibleFrom="sm"
                >
                  Участники
                </Button>
              </Group>
            </Flex>
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

      {/* Sidebar */}
      <AppShellAside withBorder={false} visibleFrom="lg">
        <Stack px="16" py="16" gap="lg">
          {managementControls}
          <Divider />
          <Stack gap="md">
            <Title order={4} size="h5">
              ⚙️ Управление
            </Title>
            <Stack gap="8px">
              <Button
                component={Link}
                href={`/contests/${contest.id}/manage`}
                variant="filled"
                size="sm"
                fullWidth
              >
                Управление контестом
              </Button>
            </Stack>
          </Stack>
          <Divider />
          <Stack gap="md">
            <Title order={4} size="h5">
              📊 Просмотр
            </Title>
            <Stack gap="8px">
              <Button
                component={Link}
                href={`/solutions?contestId=${contest.id}&order=-1`}
                variant="light"
                size="sm"
                leftSection={<IconMail size={16} />}
                fullWidth
              >
                Все посылки
              </Button>
              <Button
                component={Link}
                href={`/contests/${contest.id}/monitor`}
                variant="light"
                size="sm"
                leftSection={<IconDeviceDesktop size={16} />}
                fullWidth
              >
                Монитор
              </Button>
              <Button
                component={Link}
                href={`/contests/${contest.id}/participants`}
                variant="light"
                size="sm"
                leftSection={<IconUsers size={16} />}
                fullWidth
              >
                Участники
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </AppShellAside>
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
