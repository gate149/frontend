"use client";

import { Stack } from "@mantine/core";
import type {
  Pagination as PaginationType,
  ProblemsListItem,
} from "../../../contracts/tester/v1";
import { NextPagination } from "../Pagination";
import { ProblemsGrid } from "./ProblemsGrid";

type Props = {
  problems: ProblemsListItem[];
  pagination: PaginationType;
  isAuthenticated: boolean;
  owner?: string;
  search: string;
};

export function ProblemsPageContent({
  problems,
  pagination,
  isAuthenticated,
  owner,
  search,
}: Props) {
  // Local search filtering (client-side)
  const filteredProblems = problems.filter((problem) =>
    problem.title?.toLowerCase().includes(search.toLowerCase())
  );

  const queryParams: Record<string, string | undefined> = {};
  if (owner) queryParams.owner = owner;

  return (
    <>
      <ProblemsGrid 
        problems={filteredProblems} 
        isAuthenticated={isAuthenticated}
        owner={owner}
      />
      {pagination.total > 1 && (
        <Stack align="center">
          <NextPagination
            pagination={pagination}
            baseUrl="/problems"
            queryParams={queryParams}
          />
        </Stack>
      )}
    </>
  );
}
