"use server";

import { Call } from "@/lib/api";

type CreateTaskParams = {
  contest_id: string;
  problem_id: string;
};

export const CreateTask = async ({
  contest_id,
  problem_id,
}: CreateTaskParams): Promise<string | null> => {
  if (!contest_id || !problem_id) {
    console.error("Missing contest_id or problem_id", { contest_id, problem_id });
    return null;
  }

  console.log("🚀 Creating task with:", { contest_id, problem_id });

  try {
    const response = await Call((client) =>
      client.default.createContestProblem({ contestId: contest_id, problemId: problem_id })
    );
    console.log("✅ Task created:", response);
    return response?.id || null;
  } catch (error) {
    console.error("❌ Failed to create task:", error);
    throw error;
  }
};

export const fetchProblems = async (title: string) => {
  try {
    const response = await Call((client) =>
      client.default.listProblems({ page: 1, pageSize: 20, search: title })
    );
    return response?.problems || [];
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return [];
  }
};