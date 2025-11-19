import {
    Container,
    Grid,
    GridCol,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    Title
} from '@mantine/core';
import {Metadata} from "next";
import {DefaultLayout} from "@/components/Layout";
import {numberToLetters} from "@/lib/lib";
import * as corev1 from "../../../../../contracts/core/v1";
import {getMonitor} from "@/lib/actions";
import styles from "./style.module.css";

const metadata: Metadata = {
    title: "Положение"
}

interface Task {
    score: string | null;
}

interface Participant {
    id: string;
    name: string;
    solved: number;
    penalty: number;
    tasks: { [key: string]: Task | null };
}

const getScore = (attempt: corev1.ProblemAttempts): string | null => {
    if (attempt.state === 200) {
        return attempt.failed_attempts > 0 ? `+${attempt.failed_attempts}` : '+';
    } else if (attempt.state === 1) {
        return '?';
    } else if (attempt.failed_attempts > 0) {
        return `-${attempt.failed_attempts}`;
    }
    return null;
};

type PageProps = {
    params: Promise<{ contest_id: string }>
}

const Page = async ({params}: PageProps) => {
    const contestId = (await params).contest_id;
    // FIXME: WTF???? Was monitor completely removed?
    const monitor = await getMonitor(contestId);

    if (!monitor) {
        return (
            <DefaultLayout>
                <Container size="xl" py="md">
                    <Title order={2}>Положение</Title>
                    <Text c="red">Данные недоступны</Text>
                </Container>
            </DefaultLayout>
        );
    }

    const participants: Participant[] = monitor.participants.map((p: corev1.ParticipantsStat) => {
        const tasks: { [key: string]: Task | null } = {};
        monitor.summary.forEach(s => {
            const attempt = p.attempts.find(a => a.problem_id === s.problem_id);
            const taskKey = numberToLetters(s.position).toLowerCase();
            tasks[taskKey] = attempt ? {score: getScore(attempt)} : null;
        });

        return {
            id: p.user_id,
            name: p.username,
            solved: p.solved,
            penalty: p.penalty,
            tasks
        };
    });

    // Подсчет статистики для сводной информации
    const taskKeys = monitor.summary.map(s => numberToLetters(s.position).toLowerCase());
    const solvedCounts = monitor.summary.map(s =>
        monitor.participants.filter(p =>
            p.attempts.some(a => a.problem_id === s.problem_id && a.state === 200)
        ).length
    );
    const attemptedCounts = monitor.summary.map(s =>
        monitor.participants.filter(p =>
            p.attempts.some(a => a.problem_id === s.problem_id && (a.state !== null || a.failed_attempts > 0))
        ).length
    );

    return (
        <DefaultLayout>
            <Container size="xl" py="md">
                <Grid align="center" mb="md">
                    <GridCol span={6}>
                        <Title order={2}>Положение</Title>
                    </GridCol>
                    <GridCol span={6}>
                        {/*<TextInput
                            placeholder="Найти участника"
                            rightSection={<IconSearch size={16}/>}
                            style={{maxWidth: 300, float: 'right'}}
                        />*/}
                    </GridCol>
                </Grid>

                <Table withRowBorders>
                    <TableThead>
                        <TableTr>
                            <TableTh>№</TableTh>
                            <TableTh className={styles.thParticipant}>Участник</TableTh>
                            <TableTh className={styles.thOther} ta="center">=</TableTh>
                            <TableTh className={styles.thOther} ta="center">Штраф</TableTh>
                            {taskKeys.map(task => (
                                <TableTh key={task} className={styles.thOther} ta="center">
                                    {task.toUpperCase()}
                                </TableTh>
                            ))}
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {participants.map((participant, index) => (
                            <TableTr key={participant.id}>
                                <TableTd>{index + 1}</TableTd>
                                <TableTd className={styles.tdParticipant}>{participant.name}</TableTd>
                                <TableTd className={styles.tdOther} ta="center">{participant.solved}</TableTd>
                                <TableTd className={styles.tdOther} ta="center">{participant.penalty}</TableTd>
                                {taskKeys.map(task => (
                                    <TableTd key={task} className={styles.tdOther} ta="center">
                                        {participant.tasks[task]?.score && (
                                            <Text
                                                c={
                                                    participant.tasks[task]?.score?.includes('+')
                                                        ? 'green'
                                                        : participant.tasks[task]?.score?.includes('-')
                                                            ? 'red'
                                                            : participant.tasks[task]?.score === '?'
                                                                ? 'yellow'
                                                                : undefined
                                                }
                                            >
                                                {participant.tasks[task]?.score}
                                            </Text>
                                        )}
                                    </TableTd>
                                ))}
                            </TableTr>
                        ))}
                        {/* Сводная информация */}
                        <TableTr style={{border: "none"}}>
                            <TableTd/>
                            <TableTd className={styles.tdParticipant} pb="0">
                                <Text c="green">Сдали</Text>
                            </TableTd>
                            <TableTd className={styles.tdOther}/>
                            <TableTd className={styles.tdOther}/>
                            {solvedCounts.map((count, index) => (
                                <TableTd key={index} className={styles.tdOther} ta="center" c="green" pb="0">
                                    {count}
                                </TableTd>
                            ))}
                        </TableTr>
                        <TableTr style={{border: "none"}}>
                            <TableTd/>
                            <TableTd className={styles.tdParticipant} pt="0">
                                <Text>Пытались</Text>
                            </TableTd>
                            <TableTd className={styles.tdOther}/>
                            <TableTd className={styles.tdOther}/>
                            {attemptedCounts.map((count, index) => (
                                <TableTd key={index} className={styles.tdOther} ta="center" pt="0">
                                    {count}
                                </TableTd>
                            ))}
                        </TableTr>
                    </TableTbody>
                </Table>
            </Container>
        </DefaultLayout>
    );
}

export {Page as default, metadata};