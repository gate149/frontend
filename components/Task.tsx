"use client";

import React from 'react';
import {
    Anchor,
    AppShellFooter,
    AppShellHeader,
    AppShellMain,
    Box,
    Container,
    NavLink,
    Paper,
    Stack,
    Title
} from "@mantine/core";
import {CreateSolutionForm} from "@/components/CreateSolutionForm";
import Link from "next/link";
import type {ContestProblemListItemModel, ContestModel, ContestProblemModel, SolutionsListItemModel} from "../../contracts/core/v1";
import {Problem} from "@/components/Problem";
import {numberToLetters} from '@/lib/lib';
import {Layout} from "@/components/Layout";
import {Footer} from "@/components/Footer";
import {RecentSolutionsTable} from "@/components/RecentSolutionsTable";
import {submitSolution} from "@/app/contests/[contest_id]/problems/[problem_id]/actions";
import {ContestHotbar} from "@/components/ContestHotbar";

type PageProps = {
    tasks: ContestProblemListItemModel[]
    contest: ContestModel,
    task: ContestProblemModel,
    solutions: SolutionsListItemModel[],
    problemId: string,
    contestId: string,
    header: React.ReactNode
}

const Task = ({tasks, contest, task, solutions, problemId, contestId, header}: PageProps) => {
    const onSubmit = async (
        solution: FormData,
        language: string
    ): Promise<number | null> => {
        return submitSolution(problemId, contestId, solution, language);
    };

    return (
        <Layout>
            <AppShellHeader>
                {header}
            </AppShellHeader>
            <AppShellMain>
                <Box style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                    {/* Left Sidebar */}
                    <Box style={{ width: '240px', marginLeft: '32px' }}>
                        <Paper 
                            shadow="sm" 
                            radius="md" 
                            p="md" 
                            withBorder 
                            bg="var(--mantine-color-gray-light)"
                        >
                            <Stack w={200}>
                                <Anchor component={Link} href={`/contests/${contest.id}`} c="var(--mantine-color-bright)">
                                    <Title c="var(--mantine-color-text)" order={4} ta="center">
                                        Задачи
                                    </Title>
                                </Anchor>
                                <Stack gap={0}>
                                    {tasks.map((item) => (
                                        <NavLink
                                            key={item.problem_id}
                                            component={Link}
                                            href={`/contests/${contest.id}/problems/${item.problem_id}`}
                                            label={`${numberToLetters(item.position)}. ${item.title}`}
                                            active={item.problem_id === task.problem_id}
                                            c="var(--mantine-color-text)"
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Main Content */}
                    <Box style={{ flex: 1 }}>
                        <Container size="lg">
                            <ContestHotbar contest={contest} showManageButton={false} />
                            <Problem problem={task} letter={numberToLetters(task.position)}/>
                        </Container>
                    </Box>

                    {/* Right Sidebar */}
                    <Box style={{ width: '520px', marginRight: '32px' }}>
                        <Paper 
                            shadow="sm" 
                            radius="md" 
                            p="md" 
                            withBorder 
                            bg="var(--mantine-color-gray-light)"
                        >
                            <Stack>
                                <CreateSolutionForm onSubmit={onSubmit}/>
                                <RecentSolutionsTable solutions={solutions} contestId={contest.id} />
                            </Stack>
                        </Paper>
                    </Box>
                </Box>
            </AppShellMain>
            <AppShellFooter withBorder={false}>
                <Footer/>
            </AppShellFooter>
        </Layout>
    );
};

export {Task};