"use client";

import { CreateProblemForm } from "@/components/CreateProblemForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Layout } from "@/components/Layout";
import {
  ActionIcon,
  AppShellAside,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowRight, IconPencil, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  Pagination as PaginationType,
  ProblemsListItem,
} from "../../contracts/tester/v1";

type Props = {
  problems: ProblemsListItem[];
  pagination: PaginationType;
  isAuthenticated: boolean;
};

const ProblemsList = ({ problems, pagination, isAuthenticated }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Add global styles for hover effect
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .problem-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filteredProblems = problems.filter((problem) =>
    problem.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getItemProps = (page: number) => ({
    component: Link,
    href: `/problems?page=${page}`,
  });

  const getControlProps = (control: "first" | "previous" | "last" | "next") => {
    if (control === "next") {
      if (pagination.page === pagination.total) {
        return { component: Link, href: `/problems?page=${pagination.page}` };
      }

      return {
        component: Link,
        href: `/problems?page=${+pagination.page + 1}`,
      };
    }

    if (control === "previous") {
      if (pagination.page === 1) {
        return { component: Link, href: `/problems?page=${pagination.page}` };
      }
      return {
        component: Link,
        href: `/problems?page=${+pagination.page - 1}`,
      };
    }

    return {};
  };

  // Management controls for sidebar and mobile drawer
  const managementControls = (
    <Stack gap="md">
      <Title order={4} size="h5">
        ⚙️ Управление
      </Title>
      <Divider />
      <Stack gap="8px">
        <CreateProblemForm isAuthenticated={isAuthenticated} />
      </Stack>
    </Stack>
  );

  // Compact management controls for split screen / mobile
  const compactManagementControls = (
    <Group gap="sm" wrap="wrap" justify="flex-start">
      <CreateProblemForm isAuthenticated={isAuthenticated} />
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
        <Header drawerContent={managementControls} />
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
                  📚 Архив Задач
                </Title>
              </div>
            </Flex>

            {/* Search Bar */}
            <TextInput
              placeholder="Поиск задач..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              radius="md"
              size="md"
            />
          </Stack>

          {/* Problems Grid */}
          {filteredProblems.length === 0 ? (
            <Center py={{ base: "xl", md: "3xl" }}>
              <Stack gap="md" align="center">
                <Box component="div" style={{ fontSize: "2.5rem" }}>
                  🔍
                </Box>
                <Text c="dimmed" size="md" fw={500}>
                  {searchQuery ? "Задачи не найдены" : "Загружаем задачи..."}
                </Text>
              </Stack>
            </Center>
          ) : (
            <>
              <SimpleGrid
                cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4, xl: 4 }}
                spacing={{ base: "xs", sm: "sm", md: "md" }}
                mb="xl"
              >
                {filteredProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      height: "100%",
                    }}
                  >
                    <Card
                      shadow="xs"
                      p={{ base: "sm", sm: "md" }}
                      radius="md"
                      withBorder
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        height: "100%",
                      }}
                      className="problem-card"
                    >
                      <Stack gap="xs" h="100%" justify="space-between">
                        {/* Problem Header */}
                        <Group justify="space-between" wrap="nowrap" gap="xs">
                          <Stack gap="0" style={{ flex: 1, minWidth: 0 }}>
                            <Title
                              order={4}
                              lineClamp={1}
                              style={{ wordBreak: "break-word" }}
                            >
                              {problem.title}
                            </Title>
                            <Badge size="xs" variant="light" color="blue">
                              {problem.id?.toString().slice(0, 8)}
                            </Badge>
                          </Stack>
                          {/* Show edit button - backend will check actual permissions */}
                          {isAuthenticated && (
                            <ActionIcon
                              variant="subtle"
                              size="sm"
                              radius="md"
                              component="div"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/problems/${problem.id}/edit`);
                              }}
                              style={{ flexShrink: 0 }}
                            >
                              <IconPencil size={14} />
                            </ActionIcon>
                          )}
                        </Group>

                        {/* Problem Stats */}
                        <Group justify="space-between" gap="xs">
                          <Text
                            size="xs"
                            c="dimmed"
                            style={{ flex: 1 }}
                            lineClamp={1}
                          >
                            ⏱️ {problem.time_limit || "—"}ms
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            💾 {problem.memory_limit || "—"}MB
                          </Text>
                        </Group>

                        {/* View Button */}
                        <Button
                          fullWidth
                          variant="light"
                          size="xs"
                          rightSection={<IconArrowRight size={12} />}
                          component="div"
                        >
                          Открыть
                        </Button>
                      </Stack>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>

              {/* Pagination */}
              {pagination.total > 1 && (
                <Flex justify="center" mt="lg" mb="lg">
                  <Pagination
                    total={pagination.total}
                    value={pagination.page}
                    getItemProps={getItemProps}
                    getControlProps={getControlProps}
                  />
                </Flex>
              )}
            </>
          )}
        </Container>
      </AppShellMain>

      {/* Sidebar - only visible on large desktop */}
      <AppShellAside withBorder={false} visibleFrom="md">
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

export { ProblemsList };
