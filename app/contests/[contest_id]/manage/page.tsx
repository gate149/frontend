import {ParticipantsSection} from "@/components/ContestManage/ParticipantsSection";
import {PermissionsSection} from "@/components/ContestManage/PermissionsSection";
import {ProblemsSection} from "@/components/ContestManage/ProblemsSection";
import {SettingsSection} from "@/components/ContestManage/SettingsSection";
import {DefaultLayout} from "@/components/Layout";
import {Call} from "@/lib/api";
import {Box, Button, Container, Group, Stack, Title} from "@mantine/core";
import {IconArrowLeft, IconLock, IconPuzzle, IconSettings, IconUsers} from "@tabler/icons-react";
import Link from "next/link";
import {notFound} from "next/navigation";
import type {Contest, ContestProblemListItem,} from "../../../../../contracts/core/v1";
import React from "react";

// Constants for sections
const SECTIONS = {
    SETTINGS: "settings",
    PROBLEMS: "problems",
    PARTICIPANTS: "participants",
    PERMISSIONS: "permissions",
} as const;

type Section = typeof SECTIONS[keyof typeof SECTIONS];

// Navigation configuration
const NAV_SECTIONS = [
    {
        key: SECTIONS.SETTINGS,
        label: "Настройки",
        icon: IconSettings,
    },
    {
        key: SECTIONS.PROBLEMS,
        label: "Задачи",
        icon: IconPuzzle,
    },
    {
        key: SECTIONS.PARTICIPANTS,
        label: "Участники",
        icon: IconUsers,
    },
    {
        key: SECTIONS.PERMISSIONS,
        label: "Права доступа",
        icon: IconLock,
    },
] as const;

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

    const validSections = Object.values(SECTIONS);
    const activeSection = (
        validSections.includes(section as Section)
            ? section
            : SECTIONS.SETTINGS
    ) as Section;

    return (
        <DefaultLayout>
            <Container
                size="lg"
                pt={0}
                pb={{base: "md", sm: "lg", md: "xl"}}
                px={{base: "xs", sm: "md", md: "lg"}}
            >
                {/* Header Section */}
                <Stack gap="md" mb="lg" style={{maxWidth: "740px", margin: "0 auto"}}>
                    <Title order={1} size="h3">
                        🏆 {contest.title}
                    </Title>
                    <Group gap="sm">
                        <Button
                            component={Link}
                            href={`/contests/${contestId}`}
                            variant="default"
                            size="sm"
                            leftSection={<IconArrowLeft size={16}/>}
                            visibleFrom="sm"
                        >
                            Назад к контесту
                        </Button>
                        {NAV_SECTIONS.map((section) => {
                            const Icon = section.icon;
                            return (
                                <Button
                                    key={section.key}
                                    component={Link}
                                    href={`/contests/${contestId}/manage?section=${section.key}`}
                                    variant={activeSection === section.key ? "filled" : "default"}
                                    size="sm"
                                    leftSection={<Icon size={16}/>}
                                    visibleFrom="sm"
                                >
                                    {section.label}
                                </Button>
                            );
                        })}
                    </Group>
                </Stack>

                {/* Content Area */}
                <Box style={{maxWidth: "740px", margin: "0 auto"}}>
                    {activeSection === SECTIONS.SETTINGS && (
                        <SettingsSection contest={contest}/>
                    )}
                    {activeSection === SECTIONS.PROBLEMS && (
                        <ProblemsSection
                            contestId={contestId}
                            initialProblems={problems}
                        />
                    )}
                    {activeSection === SECTIONS.PARTICIPANTS && (
                        <ParticipantsSection contestId={contestId}/>
                    )}
                    {activeSection === SECTIONS.PERMISSIONS && (
                        <PermissionsSection contestId={contestId}/>
                    )}
                </Box>
            </Container>
        </DefaultLayout>
    );
}
