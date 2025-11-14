"use client";

import { CreateSolutionForm } from "@/components/CreateSolutionForm";
import { numberToLetters } from "@/lib/lib";
import { Box, Paper, Select, Stack } from "@mantine/core";
import { useState } from "react";
import type { ContestModel, ContestProblemListItem } from "../../../../../contracts/core/v1";
import { submitSolution } from "./actions";

type Props = {
  contest: ContestModel;
  problems: ContestProblemListItem[];
};

export function SubmitSolutionClient({ contest, problems }: Props) {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    problems.length > 0 ? problems[0].problem_id : null
  );

  const problemOptions = problems.map((problem) => ({
    value: problem.problem_id,
    label: `${numberToLetters(problem.position)}. ${problem.title}`,
  }));

  const handleSubmit = async (solution: FormData, language: string) => {
    if (!selectedProblemId) {
      console.error("No problem selected");
      return null;
    }

    return await submitSolution(
      selectedProblemId,
      contest.id,
      solution,
      language
    );
  };

  if (problems.length === 0) {
    return (
      <Box style={{ maxWidth: 740, margin: "0 auto" }}>
        <Stack gap="lg">
          <p>В этом контесте пока нет задач</p>
        </Stack>
      </Box>
    );
  }

  return (
    <Box style={{ maxWidth: 740, margin: "0 auto"}}>
      <Paper 
        shadow="sm" 
        radius="md" 
        p="md" 
        withBorder 
        bg="var(--mantine-color-gray-light)"
      >
        <CreateSolutionForm 
          onSubmit={handleSubmit}
          large={true}
          problemSelect={
            <Select
              placeholder="Выберите задачу для отправки решения"
              data={problemOptions}
              value={selectedProblemId}
              onChange={setSelectedProblemId}
              allowDeselect={false}
              style={{ width: 200 }}
            />
          }
        />
      </Paper>
    </Box>
  );
}

