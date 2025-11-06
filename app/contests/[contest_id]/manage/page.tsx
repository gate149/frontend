import {ParticipantsSection} from "@/components/ContestManage/ParticipantsSection";
import {PermissionsSection} from "@/components/ContestManage/PermissionsSection";
import {ProblemsSection} from "@/components/ContestManage/ProblemsSection";
import {SettingsSection} from "@/components/ContestManage/SettingsSection";
import {DefaultLayout} from "@/components/Layout";
import {Call} from "@/lib/api";
import {Box, Button, Container, Group, Stack, Text, Title,} from "@mantine/core";
import {IconArrowLeft, IconLock, IconPuzzle, IconSettings, IconUsers,} from "@tabler/icons-react";
import Link from "next/link";
import {notFound} from "next/navigation";
import type {Contest, ContestProblemListItem,} from "../../../../../contracts/tester/v1";
import React from "react";

type Section = "settings" | "problems" | "participants" | "permissions";

type Props = {
    params: Promise<{ contest_id: string }>;
    searchParams: Promise<{ section?: string }>;
};

export default async function ContestManagePage({params, searchParams}: Props) {
    const {contest_id: contestId} = await params;
    const {section = "settings"} = await searchParams;

    // Load contest data on the server
    let contest: Contest | null = null;
    let problems: Array<ContestProblemListItem> = [];

    try {
        const response = await Call((client) =>
            client.default.getContest({contestId: contestId})
        );

        if (!response || !response.contest) {
            notFound();
        }

        contest = response.contest;
        problems = response.problems || [];
    } catch (error) {
        console.error("Failed to load contest:", error);
        notFound();
    }

    if (!contest) {
        notFound();
    }

    const activeSection = (
        ["settings", "problems", "participants", "permissions"].includes(section)
            ? section
            : "settings"
    ) as Section;

    return (
        <DefaultLayout>
            <Container size="xl" py="md">
                <Stack gap="md">
                    {/* Header */}
                    <Group justify="space-between">
                        <div>
                            <Group gap="xs" mb="xs">
                                <Button
                                    component={Link}
                                    href={`/contests/${contestId}`}
                                    variant="subtle"
                                    size="sm"
                                    leftSection={<IconArrowLeft size={16}/>}
                                >
                                    Back to Contest
                                </Button>
                            </Group>
                            <Title order={2}>Управление контестом</Title>
                            <Text size="sm" c="dimmed">
                                {contest.title}
                            </Text>
                        </div>
                    </Group>

                    {/* Main Content with Sidebar */}
                    <Group align="flex-start" gap="md" wrap="nowrap">
                        {/* Sidebar Navigation */}
                        <Box
                            style={{
                                width: 250,
                                flexShrink: 0,
                            }}
                            visibleFrom="sm"
                        >
                            <Stack gap="xs">
                                <NavLinkButton
                                    label="Настройки"
                                    icon={<IconSettings size={20}/>}
                                    href={`/contests/${contestId}/manage?section=settings`}
                                    active={activeSection === "settings"}
                                />
                                <NavLinkButton
                                    label="Задачи"
                                    icon={<IconPuzzle size={20}/>}
                                    href={`/contests/${contestId}/manage?section=problems`}
                                    active={activeSection === "problems"}
                                />
                                <NavLinkButton
                                    label="Участники"
                                    icon={<IconUsers size={20}/>}
                                    href={`/contests/${contestId}/manage?section=participants`}
                                    active={activeSection === "participants"}
                                />
                                <NavLinkButton
                                    label="Права доступа"
                                    icon={<IconLock size={20}/>}
                                    href={`/contests/${contestId}/manage?section=permissions`}
                                    active={activeSection === "permissions"}
                                />
                            </Stack>
                        </Box>

                        {/* Mobile Navigation */}
                        <Box hiddenFrom="sm" style={{width: "100%"}}>
                            <Group gap="xs" mb="md">
                                <Button
                                    component={Link}
                                    href={`/contests/${contestId}/manage?section=settings`}
                                    variant={activeSection === "settings" ? "filled" : "light"}
                                    size="xs"
                                    leftSection={<IconSettings size={16}/>}
                                >
                                    Настройки
                                </Button>
                                <Button
                                    component={Link}
                                    href={`/contests/${contestId}/manage?section=problems`}
                                    variant={activeSection === "problems" ? "filled" : "light"}
                                    size="xs"
                                    leftSection={<IconPuzzle size={16}/>}
                                >
                                    Задачи
                                </Button>
                                <Button
                                    component={Link}
                                    href={`/contests/${contestId}/manage?section=participants`}
                                    variant={
                                        activeSection === "participants" ? "filled" : "light"
                                    }
                                    size="xs"
                                    leftSection={<IconUsers size={16}/>}
                                >
                                    Участники
                                </Button>
                                <Button
                                    component={Link}
                                    href={`/contests/${contestId}/manage?section=permissions`}
                                    variant={activeSection === "permissions" ? "filled" : "light"}
                                    size="xs"
                                    leftSection={<IconLock size={16}/>}
                                >
                                    Права
                                </Button>
                            </Group>
                        </Box>

                        {/* Content Area */}
                        <Box style={{flex: 1, minWidth: 0}}>
                            {activeSection === "settings" && (
                                <SettingsSection contest={contest}/>
                            )}
                            {activeSection === "problems" && (
                                <ProblemsSection
                                    contestId={contestId}
                                    initialProblems={problems}
                                />
                            )}
                            {activeSection === "participants" && (
                                <ParticipantsSection contestId={contestId}/>
                            )}
                            {activeSection === "permissions" && (
                                <PermissionsSection contestId={contestId}/>
                            )}
                        </Box>
                    </Group>
                </Stack>
            </Container>
        </DefaultLayout>
    );
}

// Helper component for navigation links
function NavLinkButton({
                           label,
                           icon,
                           href,
                           active,
                       }: {
    label: string;
    icon: React.ReactNode;
    href: string;
    active: boolean;
}) {
    return (
        <Button
            component={Link}
            href={href}
            variant={active ? "filled" : "light"}
            size="sm"
            leftSection={icon}
            fullWidth
            justify="flex-start"
        >
            {label}
        </Button>
    );
}
