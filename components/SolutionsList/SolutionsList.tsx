"use client";

import {Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text} from "@mantine/core";
import {LangString, ProblemTitle, StateColor, StateString, TimeBeautify} from "@/lib/lib";
import Link from "next/link";
import React from "react";
import type {SolutionsListItem} from "../../../contracts/core/v1";
import styles from "./styles.module.css";

interface SolutionsListProps {
    solutions: SolutionsListItem[];
}


const SolutionsList = ({solutions}: SolutionsListProps) => {
    const rows = solutions.map((solution) => (
        <TableTr key={solution.id}>
            <TableTd ta="center">
                <Text>{TimeBeautify(solution.created_at)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text
                    component={Link}
                    href={`/users/${solution.user_id}`}
                    td="underline"
                >
                    {solution.username}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text
                    component={Link}
                    href={`/contests/${solution.contest_id}/problems/${solution.problem_id}`}
                    td="underline"
                >
                    {ProblemTitle(solution.position, solution.problem_title)}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{LangString(solution.language)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text c={StateColor(solution.state)} fw={500}>
                    {StateString(solution.state) == "UK" ? solution.state : StateString(solution.state)}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{solution.time_stat} ms</Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{solution.memory_stat} КБ</Text>
            </TableTd>
            <TableTd ta="center">
                <Text component={Link} href={`/solutions/${solution.id}`} td="underline">
                    Посмотреть
                </Text>
            </TableTd>
        </TableTr>
    ));

    return (
        <Table className={styles.table}>
            <TableThead>
                <TableTr>
                    <TableTh ta="center">Когда</TableTh>
                    <TableTh ta="center">Кто</TableTh>
                    <TableTh ta="center">Задача</TableTh>
                    <TableTh ta="center">Язык</TableTh>
                    <TableTh ta="center">Вердикт</TableTh>
                    <TableTh ta="center">Время</TableTh>
                    <TableTh ta="center">Память</TableTh>
                    <TableTh ta="center">Просмотр</TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>{rows}</TableTbody>
        </Table>
    );
};

export {SolutionsList};