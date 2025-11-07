"use client";

import React from 'react';
import {
    Anchor,
    AppShellAside,
    AppShellFooter,
    AppShellHeader,
    AppShellMain,
    AppShellNavbar,
    Center,
    NavLink,
    Stack,
    Table,
    Text,
    Title
} from "@mantine/core";
import {CreateSolutionForm} from "@/components/CreateSolutionForm";
import Link from "next/link";
import type {ContestProblemListItem, Contest, ContestProblem, SolutionsListItem} from "../../contracts/tester/v1";
import {Problem} from "@/components/Problem";
import {numberToLetters, StateColor, StateString} from '@/lib/lib';
import {Layout} from "@/components/Layout";
import {Footer} from "@/components/Footer";

type PageProps = {
    tasks: ContestProblemListItem[]
    contest: Contest,
    task: ContestProblem,
    solutions: SolutionsListItem[],
    onSubmit: (solution: FormData, language: string) => Promise<number | null>
    header: React.ReactNode
}

const Task = ({tasks, contest, task, onSubmit, solutions, header}: PageProps) => {
    return (
        <Layout
            navbarConfig={{
                width: 220,
                breakpoint: "sm"
            }}
            asideConfig={{
                width: 580,
                breakpoint: "sm"
            }}
        >
            <AppShellHeader>
                {header}
            </AppShellHeader>
            <AppShellNavbar
                style={{padding: "var(--mantine-spacing-xs) var(--mantine-spacing-md)"}}
                withBorder={false}
            >
                <Stack w={200}>
                    <Anchor component={Link} href={`/contests/${contest.id}`} c="var(--mantine-color-bright)">
                        <Title c="var(--mantine-color-text)" order={4} ta="center">
                            {contest.title}
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
            </AppShellNavbar>
            <AppShellMain>
                <Center>
                    <Problem problem={task} letter={numberToLetters(task.position)}/>
                </Center>
            </AppShellMain>
            <AppShellAside
                withBorder={false}
                style={{padding: "var(--mantine-spacing-xs) var(--mantine-spacing-md)", width: "fit-content"}}
            >
                <Stack>
                    <CreateSolutionForm onSubmit={onSubmit}/>
                    {solutions.length > 0 && <Text fw={500}>
                        Последние посылки {" "}
                        <Anchor
                            component={Link}
                            href={`/solutions?contestId=${contest.id}&order=-1`}
                            fs="italic"
                            c="var(--mantine-color-text)"
                            fw={500}
                        >
                            (посмотреть все)
                        </Anchor>:
                    </Text>}
                    {solutions.length > 0 && <Table verticalSpacing="xs" horizontalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th ta="center">Задача</Table.Th>
                                <Table.Th ta="center">Статус</Table.Th>
                                <Table.Th ta="center">Очки</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {solutions.slice(0, 5).map((solution) => (
                                <Table.Tr key={solution.id}>
                                    <Table.Td ta="center">
                                        <Text fw={500}>
                                            {solution.problem_title}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td ta="center">
                                        <Text c={StateColor(solution.state)} fw={500}>
                                            {StateString(solution.state)}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td ta="center">{solution.score}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>}
                </Stack>
            </AppShellAside>
            <AppShellFooter withBorder={false}>
                <Footer/>
            </AppShellFooter>
        </Layout>
    );
};

export {Task};