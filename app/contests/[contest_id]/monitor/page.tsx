import {
    Container,
    Text,
    Title
} from '@mantine/core';
import {Metadata} from "next";
import {DefaultLayout} from "@/components/Layout";

const metadata: Metadata = {
    title: "Положение"
}

type PageProps = {
    params: Promise<{ contest_id: string }>
}

const Page = async ({params}: PageProps) => {
    // FIXME: Monitor functionality is not yet implemented in the backend
    // const contestId = (await params).contest_id;
    // const monitor = await getMonitor(contestId);

    return (
        <DefaultLayout>
            <Container size="xl" py="md">
                <Title order={2}>Положение</Title>
                <Text c="dimmed" mt="md">
                    Функция мониторинга находится в разработке.
                </Text>
            </Container>
        </DefaultLayout>
    );
};

export {Page as default, metadata};
