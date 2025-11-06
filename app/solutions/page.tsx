import {Metadata} from 'next';
import {getSolutions, getMe} from '@/lib/actions';
import {Stack, Title, Container, Alert} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';
import {DefaultLayout} from '@/components/Layout';
import {NextPagination} from '@/components/Pagination';
import {SolutionsListWithWS} from '@/components/SolutionsList';

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

    const fields: (keyof SearchParams)[] = [
        'page',
        'contestId',
        'userId',
        'problemId',
        'state',
        'order',
        'language',
    ];

    fields.forEach((field) => {
        if (searchParams[field] && isValidInteger(searchParams[field])) {
            params[field] = Number(searchParams[field]);
        }
    });

    return params;
};

const Page = async ({searchParams}: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const params = parseSearchParams(resolvedSearchParams);
    
    // Get user info for filtering
    const meData = await getMe();
    
    // Filter solutions by user if not admin/teacher
    const filteredParams = meData?.user?.role !== 'admin' && meData?.user?.role !== 'teacher' 
        ? { ...params, userId: meData?.user?.id }
        : params;

    const solutionsData = await getSolutions(filteredParams);

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
    const wsUrl = process.env.NEXT_PUBLIC_WS_TESTER_URL! + "/solutions";

    return (
        <DefaultLayout>
            <Stack px="16">
                <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                    <Title>Посылки</Title>
                    <SolutionsListWithWS
                        initialSolutions={solutionsData.solutions}
                        wsUrl={wsUrl}
                        token={token || ''}
                        queryParams={queryParams}
                    />
                    <NextPagination
                        pagination={solutionsData.pagination}
                        baseUrl="/solutions"
                        queryParams={queryParams}
                    />
                </Stack>
            </Stack>
        </DefaultLayout>
    );
};

export default Page;