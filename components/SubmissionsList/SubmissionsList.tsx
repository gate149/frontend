"use client";

import {Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text} from "@mantine/core";
import {LangString, ProblemTitle, StateColor, StateString, TimeBeautify} from "@/lib/lib";
import Link from "next/link";
import React from "react";
import type {SubmissionsListItemModel} from "../../../contracts/core/v1";
import styles from "./styles.module.css";

interface SubmissionsListProps {
    submissions: SubmissionsListItemModel[];
}


const SubmissionsList = ({submissions}: SubmissionsListProps) => {
    const rows = submissions.map((submission) => (
        <TableTr key={submission.id}>
            <TableTd ta="center">
                <Text>{TimeBeautify(submission.created_at)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text
                    component={Link}
                    href={`/users/${submission.user_id}`}
                    td="underline"
                >
                    {submission.username}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text
                    component={Link}
                    href={`/contests/${submission.contest_id}/problems/${submission.problem_id}`}
                    td="underline"
                >
                    {ProblemTitle(submission.position, submission.problem_title)}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{LangString(submission.language)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text c={StateColor(submission.state)} fw={500}>
                    {StateString(submission.state) == "UK" ? submission.state : StateString(submission.state)}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{submission.time_stat} ms</Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{submission.memory_stat} КБ</Text>
            </TableTd>
            <TableTd ta="center">
                <Text component={Link} href={`/submissions/${submission.id}`} td="underline">
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

export {SubmissionsList};
