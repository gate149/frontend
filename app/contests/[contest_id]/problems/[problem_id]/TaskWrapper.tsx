"use client";

import { Task } from "@/components/Task";
import type * as testerv1 from "../../../../../../contracts/tester/v1";
import { submitSolution } from "./actions";
import React from "react";

type TaskWrapperProps = {
  task: testerv1.ContestProblem;
  contest: testerv1.Contest;
  tasks: testerv1.ContestProblemListItem[];
  solutions: testerv1.SolutionsListItem[];
  problemId: string;
  contestId: string;
  header: React.ReactNode;
};

export function TaskWrapper({
  task,
  contest,
  tasks,
  solutions,
  problemId,
  contestId,
  header,
}: TaskWrapperProps) {
  const onSubmit = async (
    solution: FormData,
    language: string
  ): Promise<number | null> => {
    return submitSolution(problemId, contestId, solution, language);
  };

  return (
    <Task
      task={task}
      contest={contest}
      tasks={tasks}
      onSubmit={onSubmit}
      solutions={solutions}
      header={header}
    />
  );
}
