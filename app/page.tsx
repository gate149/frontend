import { DefaultLayout } from "@/components/Layout";
import { getOrySession } from "@/lib/api";
import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPuzzle, IconTrophy } from "@tabler/icons-react";
import Link from "next/link";
import { ContestsTable } from "@/components/ContestsTable";
import { HomeProblemsTable } from "@/components/HomeProblemsTable";
import { APP_COLORS } from "@/lib/theme/colors";
import type { ContestModel } from "../../contracts/core/v1";

export const metadata = {
  title: "Главная",
};

// Mock data for problems
const mockProblems = [
  {
    id: "1",
    contest_id: "mock-contest-1",
    problem_id: "mock-prob-1",
    position: 1,
    title: "Сумма чисел",
    time_limit: 1000,
    memory_limit: 256,
  },
  {
    id: "2",
    contest_id: "mock-contest-1",
    problem_id: "mock-prob-2",
    position: 2,
    title: "Поиск в глубину",
    time_limit: 2000,
    memory_limit: 512,
  },
  {
    id: "3",
    contest_id: "mock-contest-2",
    problem_id: "mock-prob-3",
    position: 3,
    title: "Динамическое программирование",
    time_limit: 3000,
    memory_limit: 256,
  },
  {
    id: "4",
    contest_id: "mock-contest-2",
    problem_id: "mock-prob-4",
    position: 4,
    title: "Сортировка подсчетом",
    time_limit: 1500,
    memory_limit: 128,
  },
  {
    id: "5",
    contest_id: "mock-contest-3",
    problem_id: "mock-prob-5",
    position: 5,
    title: "Кратчайший путь",
    time_limit: 2500,
    memory_limit: 512,
  },
];

// Mock data for contests
const mockContests: ContestModel[] = [
  {
    id: "mock-contest-1",
    title: "Тренировочный раунд #1",
    created_at: new Date("2024-11-01").toISOString(),
    updated_at: new Date("2024-11-01").toISOString(),
  },
  {
    id: "mock-contest-2",
    title: "Олимпиада по алгоритмам",
    created_at: new Date("2024-11-05").toISOString(),
    updated_at: new Date("2024-11-05").toISOString(),
  },
  {
    id: "mock-contest-3",
    title: "Еженедельный контест",
    created_at: new Date("2024-11-10").toISOString(),
    updated_at: new Date("2024-11-10").toISOString(),
  },
  {
    id: "mock-contest-4",
    title: "Динамическое программирование",
    created_at: new Date("2024-11-12").toISOString(),
    updated_at: new Date("2024-11-12").toISOString(),
  },
  {
    id: "mock-contest-5",
    title: "Графы и деревья",
    created_at: new Date("2024-11-14").toISOString(),
    updated_at: new Date("2024-11-14").toISOString(),
  },
];

export default async function Page() {
  const session = await getOrySession();
  const isAuthenticated = !!session;

  return (
    <DefaultLayout>
      <Container size="lg" py="xl">
        {isAuthenticated ? (
          <Stack gap="md">
            {/* Two columns for Problems and Contests */}
            <SimpleGrid cols={2} spacing="md">
              {/* Problems Section */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Group gap="xs">
                    <IconPuzzle size={28} color={`var(--mantine-color-${APP_COLORS.problems}-6)`} />
                    <Title order={2}>Продолжить решение</Title>
                  </Group>
                  <HomeProblemsTable problems={mockProblems} />
                  <Button
                    component={Link}
                    href="/workshop?view=problems"
                    variant="light"
                    color={APP_COLORS.problems}
                    fullWidth
                  >
                    Смотреть все
                  </Button>
                </Stack>
              </Card>

              {/* Contests Section */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Group gap="xs">
                    <IconTrophy size={28} color={`var(--mantine-color-${APP_COLORS.contests}-6)`} />
                    <Title order={2}>Мои контесты</Title>
                  </Group>
                  <ContestsTable contests={mockContests} showCreatedAt={false} />
                  <Button
                    component={Link}
                    href="/workshop?view=contests"
                    variant="light"
                    color={APP_COLORS.contests}
                    fullWidth
                  >
                    Смотреть все
                  </Button>
                </Stack>
              </Card>
            </SimpleGrid>

            {/* Blog Section - Full width below */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={2}>Блог</Title>
                <Text size="md">
                  Добро пожаловать на Gate149 — современную платформу для
                  соревновательного программирования! Красивый интерфейс, быстрое тестирование и многое другое. Created by @brawler2011 and @dragon286!
                </Text>
                <Text size="md">GitHub: <Link href="https://github.com/gate149" target="_blank">Gate149</Link></Text>
              </Stack>
            </Card>
          </Stack>
        ) : (
          /* For non-authenticated users - only show Blog */
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={2}>Блог</Title>
              <Text size="md">
                Добро пожаловать на Gate149 — современную платформу для
                соревновательного программирования! Красивый интерфейс, быстрое тестирование и многое другое. Created by @brawler2011 and @dragon286!
              </Text>
              <Text size="md">GitHub: <Link href="https://github.com/gate149" target="_blank">Gate149</Link></Text>
            </Stack>
          </Card>
        )}
      </Container>
    </DefaultLayout>
  );
}

