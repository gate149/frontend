import { DefaultLayout } from "@/components/Layout";
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBolt,
  IconCode,
  IconGitBranch,
  IconMath,
  IconPalette,
  IconShield,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import classes from "./page.module.css";

export const metadata = {
  title: "Главная",
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureProps> = ({
  icon,
  title,
  description,
  color,
}) => (
  <Card shadow="sm" padding="xl" radius="md" className={classes.featureCard}>
    <Stack align="center" gap="md">
      <ThemeIcon size={80} radius="xl" color={color} variant="light">
        {icon}
      </ThemeIcon>
      <Stack align="center" gap="xs" w="100%">
        <Title order={3} ta="center" size="h4">
          {title}
        </Title>
        <Text ta="center" c="dimmed" size="sm">
          {description}
        </Text>
      </Stack>
    </Stack>
  </Card>
);

interface StatItemProps {
  value: string;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  color = "blue",
}) => (
  <Stack align="center" gap="xs">
    <Text size="2.5rem" fw={700} c={color}>
      {value}
    </Text>
    <Text ta="center" c="dimmed" size="sm">
      {label}
    </Text>
  </Stack>
);

export default function Page() {
  const features: FeatureProps[] = [
    {
      icon: <IconCode size={40} />,
      title: "Открытый код",
      description:
        "Полностью открытый исходный код для прозрачности и развития сообщества",
      color: "blue",
    },
    {
      icon: <IconPalette size={40} />,
      title: "Современный интерфейс",
      description:
        "Интуитивный и отзывчивый дизайн для комфортной работы на любых устройствах",
      color: "purple",
    },
    {
      icon: <IconShield size={40} />,
      title: "Надежное тестирование",
      description:
        "Изолированное выполнение решений в Docker-контейнерах для безопасности",
      color: "green",
    },
    {
      icon: <IconBolt size={40} />,
      title: "Реальное время",
      description:
        "Мгновенные уведомления о результатах через WebSocket без перезагрузки",
      color: "orange",
    },
    {
      icon: <IconMath size={40} />,
      title: "LaTeX поддержка",
      description:
        "Полная поддержка LaTeX для красивого отображения математических формул",
      color: "red",
    },
    {
      icon: <IconGitBranch size={40} />,
      title: "Микросервисная архитектура",
      description:
        "Масштабируемая архитектура с разделением на независимые сервисы",
      color: "cyan",
    },
  ];

  const stats: StatItemProps[] = [
    { value: "5+", label: "Основных сервисов", color: "blue" },
    { value: "50K+", label: "Строк кода", color: "purple" },
    { value: "100%", label: "Открытый исходный код", color: "green" },
    { value: "∞", label: "Возможностей", color: "orange" },
  ];

  const techStack = [
    { name: "Go", color: "cyan" },
    { name: "Next.js", color: "blue" },
    { name: "TypeScript", color: "blue" },
    { name: "PostgreSQL", color: "blue" },
    { name: "Redis", color: "red" },
    { name: "Docker", color: "cyan" },
    { name: "WebSocket", color: "purple" },
    { name: "OpenAPI", color: "green" },
  ];

  return (
    <DefaultLayout>
      <Container size="xl" py={{ base: 80, md: 120 }}>
        {/* Hero Section */}
        <Center mb={{ base: 80, md: 120 }} style={{ flexDirection: "column" }}>
          <Stack align="center" gap="xl" maw={800}>
            <Box className={classes.glowEffect}>
              <Title
                order={1}
                size="4rem"
                fw={900}
                ta="center"
                className={classes.heroTitle}
              >
                Gate
              </Title>
            </Box>

            <Text
              size="xl"
              c="dimmed"
              ta="center"
              className={classes.heroSubtitle}
            >
              Современная платформа для проведения соревнований по
              программированию. Разработана с нуля с использованием лучших
              практик и современных технологий.
            </Text>

            <Group justify="center" gap="md" grow={false}>
              <Button
                size="lg"
                variant="filled"
                rightSection={<IconArrowRight size={18} />}
                component={Link}
                href="/workshop"
              >
                Посмотреть контесты
              </Button>
              <Button
                size="lg"
                variant="outline"
                component="a"
                href="https://github.com/Vyacheslav1557"
                target="_blank"
              >
                GitHub
              </Button>
            </Group>
          </Stack>
        </Center>

        <Divider my={80} />

        {/* Features Grid */}
        <Box mb={{ base: 80, md: 120 }}>
          <Title order={2} ta="center" mb={60} size="3rem">
            Ключевые преимущества
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: "md", lg: "lg" }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </SimpleGrid>
        </Box>

        <Divider my={80} />

        {/* Stats Section */}
        <Box mb={{ base: 80, md: 120 }}>
          <Card
            shadow="sm"
            p={{ base: "md", lg: "xl" }}
            radius="md"
            className={classes.statsCard}
          >
            <Stack gap={40}>
              <Stack align="center" gap="xs">
                <Title order={2} ta="center">
                  Платформа в цифрах
                </Title>
                <Text c="dimmed" ta="center" size="sm">
                  Результаты работы и развития проекта
                </Text>
              </Stack>

              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xl">
                {stats.map((stat, index) => (
                  <StatItem key={index} {...stat} />
                ))}
              </SimpleGrid>
            </Stack>
          </Card>
        </Box>

        <Divider my={80} />

        {/* Technology Stack */}
        <Box mb={{ base: 80, md: 120 }}>
          <Stack align="center" gap={40}>
            <Stack align="center" gap="xs">
              <Title order={2} ta="center">
                Технологический стек
              </Title>
              <Text c="dimmed" ta="center" maw={500}>
                Современные и надежные технологии для высокопроизводительной
                системы
              </Text>
            </Stack>

            <Group justify="center" gap="md" wrap="wrap">
              {techStack.map((tech, index) => (
                <Badge
                  key={index}
                  size="lg"
                  variant="light"
                  color={tech.color}
                  radius="md"
                  className={classes.techBadge}
                >
                  {tech.name}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Box>

        <Divider my={80} />

        {/* Architecture Overview */}
        <Box mb={{ base: 80, md: 120 }}>
          <Card shadow="sm" padding="xl" radius="md">
            <Stack gap="xl">
              <Stack align="center" gap="xs">
                <Title order={2} ta="center">
                  Микросервисная архитектура
                </Title>
                <Text c="dimmed" ta="center" maw={600}>
                  Система разделена на независимые сервисы, что обеспечивает
                  гибкость и масштабируемость
                </Text>
              </Stack>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        color="blue"
                        variant="light"
                      >
                        <IconCode size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="sm">
                          core Backend
                        </Text>
                        <Text c="dimmed" size="xs">
                          Go REST API
                        </Text>
                      </div>
                    </Group>
                    <Text c="dimmed" size="sm">
                      Основной сервис управления задачами, контестами и
                      проверкой решений
                    </Text>
                  </Stack>
                </Card>

                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        color="purple"
                        variant="light"
                      >
                        <IconPalette size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="sm">
                          Gate Frontend
                        </Text>
                        <Text c="dimmed" size="xs">
                          Next.js React
                        </Text>
                      </div>
                    </Group>
                    <Text c="dimmed" size="sm">
                      Пользовательский интерфейс с поддержкой SSR и кэшированием
                    </Text>
                  </Stack>
                </Card>

                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        color="orange"
                        variant="light"
                      >
                        <IconBolt size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="sm">
                          Observer Service
                        </Text>
                        <Text c="dimmed" size="xs">
                          Go WebSocket
                        </Text>
                      </div>
                    </Group>
                    <Text c="dimmed" size="sm">
                      Сервис для реальных обновлений статуса решений и
                      уведомлений
                    </Text>
                  </Stack>
                </Card>

                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        color="green"
                        variant="light"
                      >
                        <IconShield size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="sm">
                          Contracts
                        </Text>
                        <Text c="dimmed" size="xs">
                          OpenAPI v3
                        </Text>
                      </div>
                    </Group>
                    <Text c="dimmed" size="sm">
                      Единая спецификация API для взаимодействия всех сервисов
                    </Text>
                  </Stack>
                </Card>
              </SimpleGrid>
            </Stack>
          </Card>
        </Box>

        <Divider my={80} />

        {/* CTA Section */}
        <Center mb={40} style={{ flexDirection: "column" }}>
          <Stack align="center" gap="xl" maw={800}>
            <Stack align="center" gap="md">
              <Title order={2} ta="center">
                Готовы начать?
              </Title>
              <Text c="dimmed" ta="center" size="lg">
                Присоединитесь к сообществу программистов и участвуйте в
                контестах
              </Text>
            </Stack>

            <Group justify="center" gap="md">
              <Button size="lg" component={Link} href="/contests">
                Просмотреть контесты
              </Button>
              <Button
                size="lg"
                variant="outline"
                component={Link}
                href="/users"
              >
                Лидерборд
              </Button>
            </Group>
          </Stack>
        </Center>
      </Container>
    </DefaultLayout>
  );
}
