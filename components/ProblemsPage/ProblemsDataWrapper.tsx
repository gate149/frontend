"use client";

import type {
  Problem,
  Pagination as PaginationType,
} from "../../../contracts/core/v1";
import { ProblemsSearchInput } from "./ProblemsSearchInput";
import { ProblemsPageContent } from "./ProblemsPageContent";
import { ProblemsGridSkeleton } from "./ProblemsGridSkeleton";
import { usePageTransition } from "./ProblemsPageWrapper";
import { useState } from "react";

type Props = {
  problems: Problem[];
  pagination: PaginationType;
  isAuthenticated: boolean;
  owner?: string;
};

export function ProblemsDataWrapper({
  problems,
  pagination,
  isAuthenticated,
  owner,
}: Props) {
  const [search, setSearch] = useState("");
  const { isPending } = usePageTransition();

  return (
    <>
      <ProblemsSearchInput value={search} onChange={setSearch} />
      {isPending ? (
        <ProblemsGridSkeleton />
      ) : (
        <ProblemsPageContent
          problems={problems}
          pagination={pagination}
          isAuthenticated={isAuthenticated}
          owner={owner}
          search={search}
        />
      )}
    </>
  );
}
