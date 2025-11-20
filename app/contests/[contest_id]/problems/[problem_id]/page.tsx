import { cache } from "react";
import { numberToLetters } from "@/lib/lib";
import {
  getContest,
  getContestProblem,
  getSolutions as getSubmissions,
} from "@/lib/actions";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Task } from "@/components/Task";

type Props = {
  params: Promise<{ contest_id: string; problem_id: string }>;
};

// Cache getContestProblem to avoid duplicate calls in generateMetadata and Page
const getCachedContestProblem = cache(
  (problemId: string, contestId: string) =>
    getContestProblem(problemId, contestId)
);

const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const problem = await getCachedContestProblem(
    params.problem_id,
    params.contest_id
  );

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

  const [problemResponse, contestResponse, submissionsResponse] =
    await Promise.all([
      getCachedContestProblem(params.problem_id, params.contest_id),
      getContest(params.contest_id),
      getSubmissions({
        page: 1,
        pageSize: 20,
        contestId: params.contest_id,
        order: -1,
      }),
    ]);

  if (!problemResponse?.problem || !contestResponse?.contest) {
    notFound();
  }

  // Handle submissions - if null or error, use empty array
  // This can happen if user is not synced in backend DB yet
  const submissions = submissionsResponse?.submissions || [];

  return (
    <Task
      task={problemResponse.problem}
      contest={contestResponse.contest}
      tasks={contestResponse.problems || []}
      submissions={submissions}
      problemId={params.problem_id}
      contestId={params.contest_id}
      header={<HeaderWithSession />}
    />
  );
};

export { Page as default, generateMetadata };
