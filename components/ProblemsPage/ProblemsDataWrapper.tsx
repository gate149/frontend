"use client";

import { useState } from "react";
import type {
  Pagination as PaginationType,
  ProblemsListItem,
} from "../../../contracts/core/v1";
import { ProblemsGridSkeleton } from "./ProblemsGridSkeleton";
import { ProblemsPageContent } from "./ProblemsPageContent";
import { usePageTransition } from "./ProblemsPageWrapper";
import { ProblemsSearchInput } from "./ProblemsSearchInput";

type Props = {
  problems: ProblemsListItem[];
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
