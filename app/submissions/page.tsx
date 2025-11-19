import {Metadata} from 'next';
import {getSubmissions, getContest} from '@/lib/actions';
import {Stack, Title, Container, Alert} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';
import {DefaultLayout} from '@/components/Layout';
import {NextPagination} from '@/components/Pagination';
import {SubmissionsListWithWS} from '@/components/SubmissionsList';
import {ContestHotbar} from '@/components/ContestHotbar';

export const metadata: Metadata = {
    title: 'Посылки',
    description: '',
};

interface SearchParams {
    page?: string;
    contestId?: string;
    userId?: string;
    problemId?: string;
    state?: string;
    order?: string;
    language?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

const PAGE_SIZE = 15;

const isValidInteger = (value: unknown): boolean =>
    typeof value === 'string' && !isNaN(Number(value)) && Number.isInteger(Number(value));

const parseSearchParams = (searchParams: SearchParams) => {
    const params: any = {page: 1, pageSize: PAGE_SIZE};

    const integerFields: (keyof SearchParams)[] = [
        'page',
        'userId',
        'problemId',
        'state',
        'order',
        'language',
    ];

    integerFields.forEach((field) => {
        if (searchParams[field] && isValidInteger(searchParams[field])) {
            params[field] = Number(searchParams[field]);
        }
    });

    // contestId should remain a string
    if (searchParams.contestId) {
        params.contestId = searchParams.contestId;
    }

    return params;
};

const Page = async ({searchParams}: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const params = parseSearchParams(resolvedSearchParams);
    
    
    // Filter submissions by user if not admin/teacher
    const filteredParams = { ...params, /*userId: "eb450cc9-d1de-44ca-8a84-1ad8304ca34b" */ };
    const submissionsData = await getSubmissions(filteredParams);

    if (!submissionsData) {
        return (
            <DefaultLayout>
                <Container size="lg" py="xl">
                    <Alert 
                        icon={<IconAlertCircle size="1rem" />} 
                        title="Ошибка загрузки" 
                        color="red"
                    >
                        Не удалось загрузить список решений. Попробуйте обновить страницу.
                    </Alert>
                </Container>
            </DefaultLayout>
        );
    }

    const queryParams: Record<string, string | number | undefined> = {
        page: params.page,
        pageSize: params.pageSize,
        contestId: params.contestId,
        userId: params.userId,
        problemId: params.problemId,
        state: params.state,
        order: params.order,
        language: params.language,
    };

    const token = 'access-token' in submissionsData ? submissionsData['access-token'] : undefined;
    const wsUrl = process.env.NEXT_PUBLIC_WS_core_URL! + "/submissions";

    // Load contest if contestId is provided
    let contestData = null;
    if (params.contestId) {
        contestData = await getContest(String(params.contestId));
    }

    return (
        <DefaultLayout>
            <Container size="lg" pt="md" pb="xl">
                {contestData?.contest && (
                    <ContestHotbar 
                        contest={contestData.contest} 
                        activeTab="allsubmissions" 
                        showManageButton={false}
                    />
                )}
                <Stack align="center" w="fit-content" m="auto" gap="16">
                    <Title>Посылки</Title>
                    <SubmissionsListWithWS
                        initialSubmissions={submissionsData.submissions}
                        wsUrl={wsUrl}
                        token={token || ''}
                        queryParams={queryParams}
                    />
                    <NextPagination
                        pagination={submissionsData.pagination}
                        baseUrl="/submissions"
                        queryParams={queryParams}
                    />
                </Stack>
            </Container>
        </DefaultLayout>
    );
};

export default Page;
