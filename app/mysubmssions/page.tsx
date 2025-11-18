import {Metadata} from 'next';
import {getSolutions, getMe, getContest} from '@/lib/actions';
import {Stack, Title, Container, Alert} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';
import {DefaultLayout} from '@/components/Layout';
import {NextPagination} from '@/components/Pagination';
import {SolutionsListWithWS} from '@/components/SolutionsList';
import {ContestHotbar} from '@/components/ContestHotbar';

export const metadata: Metadata = {
    title: 'Мои посылки',
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
    
    // Get user info for filtering
    const meData = await getMe();
    // Always filter by current user
    const filteredParams = { ...params, userId: meData?.user?.id };

    const solutionsData = await getSolutions(filteredParams);
    console.log(solutionsData);
    if (!solutionsData) {
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

    const token = 'access-token' in solutionsData ? solutionsData['access-token'] : undefined;
    const wsUrl = process.env.NEXT_PUBLIC_WS_core_URL! + "/solutions";

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
                        activeTab="mysubmissions" 
                        showManageButton={false}
                    />
                )}
                <Stack align="center" w="fit-content" m="auto" gap="16">
                    <Title>Мои посылки</Title>
                    <SolutionsListWithWS
                        initialSolutions={solutionsData.solutions}
                        wsUrl={wsUrl}
                        token={token || ''}
                        queryParams={queryParams}
                    />
                    <NextPagination
                        pagination={solutionsData.pagination}
                        baseUrl="/mysubmssions"
                        queryParams={queryParams}
                    />
                </Stack>
            </Container>
        </DefaultLayout>
    );
};

export default Page;

