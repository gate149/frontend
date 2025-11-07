"use server";

import { numberToLetters } from "@/lib/lib";
import {
  getContest,
  getContestProblem,
  getSolutions,
} from "@/lib/actions";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskWrapper } from "./TaskWrapper";

type Props = {
  params: Promise<{ contest_id: string; problem_id: string }>;
};

const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const problem = await getContestProblem(params.problem_id, params.contest_id);

  if (!problem?.problem) {
    return {
      title: "Что-то пошло не так!",
    };
  }

  return {
    title: `${numberToLetters(problem.problem.position)}. ${
      problem.problem.title
    }`,
    description: problem.problem.legend_html,
  };
};

const Page = async (props: Props) => {
  const params = await props.params;

  const [problemResponse, contestResponse, solutionsResponse] =
    await Promise.all([
      getContestProblem(params.problem_id, params.contest_id),
      getContest(params.contest_id),
      getSolutions({
        page: 1,
        pageSize: 20,
        contestId: params.contest_id,
        order: -1,
      }),
    ]);

  if (!problemResponse?.problem || !contestResponse?.contest) {
    notFound();
  }

  // Handle solutions - if null or error, use empty array
  // This can happen if user is not synced in backend DB yet
  const solutions = solutionsResponse?.solutions || [];

  return (
    <TaskWrapper
      task={problemResponse.problem}
      contest={contestResponse.contest}
      tasks={contestResponse.problems || []}
      solutions={solutions}
      problemId={params.problem_id}
      contestId={params.contest_id}
      header={<HeaderWithSession />}
    />
  );
};

export { Page as default, generateMetadata };
