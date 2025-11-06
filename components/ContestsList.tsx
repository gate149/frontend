"use client";

import React from 'react';
import {
    Button,
    Group,
    Pagination,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Title
} from "@mantine/core";
import Link from "next/link";
import * as testerv1 from "../../contracts/tester/v1";
import {DefaultLayout} from "@/components/Layout";

type Props = {
    contests: testerv1.Contest[],
    pagination: testerv1.Pagination,
}

const ContestsList = ({contests, pagination}: Props) => {
    const getItemProps = (page: number) => ({
        component: Link,
        href: `/contests?page=${page}`,
    });

    const getControlProps = (control: 'first' | 'previous' | 'last' | 'next') => {
        if (control === 'next') {
            if (pagination.page === pagination.total) {
                return {component: Link, href: `/contests?page=${pagination.page}`};
            }

            return {component: Link, href: `/contests?page=${+pagination.page + 1}`};
        }

        if (control === 'previous') {
            if (pagination.page === 1) {
                return {component: Link, href: `/contests?page=${pagination.page}`};
            }
            return {component: Link, href: `/contests?page=${+pagination.page - 1}`};
        }

        return {};
    };


    const rows = contests.map((contest) => (
        <TableTr key={contest.id}>
            <TableTd>{contest.title}</TableTd>
            <TableTd>
                <Button size="xs"
                        component={Link}
                        href={`/contests/${contest.id}`}
                >
                    {"Войти в контест"}
                </Button>
            </TableTd>
            {/*<TableTd>{contest.startsAt}</TableTd>*/}
            {/*<TableTd>{contest.duration}</TableTd>*/}
            {/*<TableTd>{<Button size="xs"*/}
            {/*                  disabled={!contest.started}*/}
            {/*                  component={Link}*/}
            {/*                  href={`/contests/${contest.id}`}*/}
            {/*>*/}
            {/*    {contest.started ? "Войти в контест" : "Не началось"}*/}
            {/*</Button>}*/}
            {/*</TableTd>*/}
        </TableTr>
    ));

    return (
        <DefaultLayout>
            <Group px="16">
                <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                    <Title>Контесты</Title>
                    <Table horizontalSpacing="xl">
                        <TableThead>
                            <TableTr>
                                <TableTh>Название</TableTh>
                                {/*<TableTh>Начало</TableTh>*/}
                                {/*<TableTh>Длительность</TableTh>*/}
                                <TableTh></TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>{rows}</TableTbody>
                    </Table>
                    <Pagination total={pagination.total}
                                value={pagination.page}
                                getItemProps={getItemProps}
                                getControlProps={getControlProps}
                    />
                </Stack>
            </Group>
            {/*<AppShellAside withBorder={false} px="16">*/}
            {/*    <Stack pt="16">*/}
            {/*        <TextInput placeholder="Поиск"/>*/}
            {/*        <Checkbox label="Завершенные"/>*/}
            {/*    </Stack>*/}
            {/*</AppShellAside>*/}
        </DefaultLayout>
    );
};

export {ContestsList};
