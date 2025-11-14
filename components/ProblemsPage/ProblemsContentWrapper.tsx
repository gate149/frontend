"use client";

import { useState } from "react";
import type {
  ProblemsListItem,
  Pagination as PaginationType,
} from "../../../contracts/core/v1";
import { ProblemsSearchInput } from "./ProblemsSearchInput";
import { ProblemsPageContent } from "./ProblemsPageContent";
import { ProblemsGridSkeleton } from "./ProblemsGridSkeleton";
import { usePageTransition } from "./ProblemsPageWrapper";
import { ContestsContentSkeleton } from "./ContestsContentSkeleton";
import { ContestProblemsTable } from "@/app/contests/[contest_id]/ContestProblemsTable";
import { ContestsDataWrapper } from "./ContestsDataWrapper";
import type { Contest } from "../../../contracts/core/v1";
import { ContestsSearchInput } from "../ContestsSearchInput";
import { ProblemsContentSkeleton } from "./ProblemsContentSkeleton";
type Props = {
  contests: Contest[];
  pagination: PaginationType;
};

export function ProblemsContentWrapper({
  contests,
  pagination
}: Props) {
  const [search, setSearch] = useState("");
  const { isPending, isPaginationTransition } = usePageTransition();
  console.log(isPaginationTransition);
  return (
    <>
      {isPending ? ( !isPaginationTransition ? (
        <ProblemsContentSkeleton />
      ) : (
        <ContestsContentSkeleton />
      )
      ) : (
        <>
          <ContestsSearchInput value={search} onChange={setSearch} />
          <ContestsDataWrapper
            contests={contests}
            pagination={pagination}
            search={search}
          />
        </>
      )}
    </>
  );
}