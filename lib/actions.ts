"use server";

import {Call} from './api';

export async function getContests(page: number = 1, pageSize: number = 10, search?: string, owner?: boolean) {
    try {
        const response = await Call((client) => client.default.listContests({page, pageSize, search, owner}));
        return response;
    } catch (error) {
        console.error('Failed to fetch contests:', error);
        return null;
    }
}

export async function getProblems(page: number = 1, pageSize: number = 10, search?: string, order?: number, owner?: boolean) {
    try {
        const params: {
            page: number;
            pageSize: number;
            search?: string;
            order?: number;
            owner?: boolean;
        } = {
            page,
            pageSize,
            search,
            order,
            owner,
        };

        const response = await Call((client) => client.default.listProblems(params));
        return response;
    } catch (error) {
        console.error('Failed to fetch problems:', error);
        return null;
    }
}

export async function getSolutions(params: {
    page?: number;
    pageSize?: number;
    contestId?: string;
    userId?: string;
    problemId?: string;
    state?: number;
    order?: number;
    language?: number;
} = {}) {
    try {
        const response = await Call((client) => client.default.listSubmissions({
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 10,
            contestId: params.contestId,
            userId: params.userId,
            problemId: params.problemId,
            state: params.state,
            order: params.order,
            language: params.language,
        }));
        return response;
    } catch (error: any) {
        const status = error?.status || error?.response?.status;
        if (status === 404) {
            return {solutions: [], pagination: {page: 1, pageSize: params.pageSize ?? 10, total: 0}};
        }
        console.error('Failed to fetch solutions:', error);
        return {solutions: [], pagination: {page: 1, pageSize: params.pageSize ?? 10, total: 0}};
    }
}

export async function listUsers(page: number = 1, pageSize: number = 10, search?: string, role?: string) {
    try {
        const response = await Call((client) => client.default.listUsers({page, pageSize, search, role}));
        return response;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return null;
    }
}

export async function getUser(userId: string) {
    try {
        const response = await Call((client) => client.default.getUser({id: userId}));
        return response;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}

export async function getContest(contestId: string) {
    try {
        const response = await Call((client) => client.default.getContest({contestId}));
        return response;
    } catch (error) {
        console.error('Failed to fetch contest:', error);
        return null;
    }
}

export async function getContestProblem(problemId: string, contestId: string) {
    try {
        const response = await Call((client) => client.default.getContestProblem({problemId, contestId}));
        return response;
    } catch (error) {
        console.error('Failed to fetch contest problem:', error);
        return null;
    }
}

export async function getParticipants(contestId: string, page: number = 1, pageSize: number = 10) {
    try {
        const response = await Call((client) => client.default.listParticipants({contestId, page, pageSize}));
        return response;
    } catch (error) {
        console.error('Failed to fetch participants:', error);
        return null;
    }
}

export async function getProblem(problemId: string) {
    try {
        const response = await Call((client) => client.default.getProblem({id: problemId}));
        return response;
    } catch (error) {
        console.error('Failed to fetch problem:', error);
        return null;
    }
}

export async function getSubmission(submissionId: string) {
    try {
        const response = await Call((client) => client.default.getSubmission({submissionId}));
        return response;
    } catch (error) {
        console.error('Failed to fetch solution:', error);
        return null;
    }
}

export async function createContest(title: string) {
    try {
        const response = await Call((client) =>
            client.default.createContest({title})
        );
        return response;
    } catch (error) {
        console.error('Failed to create contest:', error);
        throw error;
    }
}

export async function createProblem(title: string) {
    try {
        const response = await Call((client) =>
            client.default.createProblem({title})
        );
        return response;
    } catch (error) {
        console.error('Failed to create problem:', error);
        throw error;
    }
}

export async function updateProblem(
    problemId: string,
    data: {
        title?: string;
        legend?: string;
        input_format?: string;
        output_format?: string;
        notes?: string;
        scoring?: string;
        memory_limit?: number;
        time_limit?: number;
        is_private?: boolean;
    }
) {
    try {
        console.log('📤 Updating problem:', problemId, 'with data:', JSON.stringify(data, null, 2));
        const response = await Call((client) =>
            client.default.updateProblem({id: problemId, requestBody: data})
        );
        return response;
    } catch (error) {
        console.error('Failed to update problem:', error);
        throw error;
    }
}

export async function uploadProblem(problemId: string, file: File) {
    throw "unimplemented";
}

export async function updateContest(
    contestId: string,
    data: {
        title?: string;
        is_private?: boolean;
        monitor_enabled?: boolean;
    }
) {
    try {
        console.log('📤 Updating contest:', contestId, 'with data:', JSON.stringify(data, null, 2));
        const response = await Call((client) =>
            client.default.updateContest({contestId, requestBody: data})
        );
        return response;
    } catch (error) {
        console.error('Failed to update contest:', error);
        throw error;
    }
}

export async function addContestProblem(
    contestId: string,
    problemId: string
) {
    try {
        console.log('📤 Adding problem to contest:', {contestId, problemId});
        const response = await Call((client) =>
            client.default.createContestProblem({contestId, problemId})
        );
        return response;
    } catch (error) {
        console.error('Failed to add problem to contest:', error);
        throw error;
    }
}

export async function removeContestProblem(
    contestId: string,
    problemId: string
) {
    try {
        console.log('📤 Removing problem from contest:', {contestId, problemId});
        const response = await Call((client) =>
            client.default.deleteContestProblem({problemId, contestId})
        );
        return response;
    } catch (error) {
        console.error('Failed to remove problem from contest:', error);
        throw error;
    }
}

export async function addContestParticipant(
    contestId: string,
    userId: string
) {
    try {
        console.log('📤 Adding participant to contest:', {contestId, userId});
        const response = await Call((client) =>
            client.default.createParticipant({contestId, userId})
        );
        return response;
    } catch (error) {
        console.error('Failed to add participant to contest:', error);
        throw error;
    }
}

export async function removeContestParticipant(
    contestId: string,
    userId: string
) {
    try {
        console.log('📤 Removing participant from contest:', {contestId, userId});
        const response = await Call((client) =>
            client.default.deleteParticipant({userId, contestId})
        );
        return response;
    } catch (error) {
        console.error('Failed to remove participant from contest:', error);
        throw error;
    }
}

export async function searchProblems(title: string, owner?: boolean) {
    try {
        const params: {
            page: number;
            pageSize: number;
            title?: string;
            owner?: boolean;
        } = {
            page: 1,
            pageSize: 10,
            owner: owner
        };

        if (title && title.trim() !== "") {
            params.title = title.trim();
        }

        const response = await Call((client) => client.default.listProblems(params));
        return response;
    } catch (error) {
        console.error('Failed to search problems:', error);
        return null;
    }
}

// NOTE: duplicate of listUsers
export async function searchUsers(search: string) {
    try {
        const response = await Call((client) =>
            client.default.listUsers({
                page: 1,
                pageSize: 10,
                search: search,
            })
        );
        return response;
    } catch (error) {
        console.error('Failed to search users:', error);
        return null;
    }
}

export async function createSolution(
    problemId: string,
    contestId: string,
    language: number,
    formData: FormData
) {
    try {
        const solutionData = formData.get("solution");
        let solutionBlob: Blob;

        if (solutionData instanceof File) {
            solutionBlob = solutionData;
        } else if (typeof solutionData === "string") {
            solutionBlob = new Blob([solutionData], {type: "text/plain"});
        } else {
            throw new Error("Invalid solution data type");
        }

        const response = await Call((client) =>
            client.default.createSubmission({
                problemId,
                contestId,
                language,
                formData: {
                    solution: solutionBlob,
                },
            })
        );
        return response;
    } catch (error) {
        console.error('Failed to create solution:', error);
        throw error;
    }
}
