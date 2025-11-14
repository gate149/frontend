"use client";

import type {
  ProblemsListItem,
  Pagination as PaginationType,
} from "../../../contracts/core/v1";
import { ProblemsSearchInput } from "./ProblemsSearchInput";
import { ProblemsPageContent } from "./ProblemsPageContent";
import { usePageTransition } from "./WorkshopPageWrapper";
import { useState } from "react";
import { ContestsContentSkeleton } from "./ContestsContentSkeleton";
import { ProblemsContentSkeleton } from "./ProblemsContentSkeleton";

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
  const { isPending, isPaginationTransition } = usePageTransition();

  return (
      <>
      {isPending ? ( !isPaginationTransition ? (
        <ContestsContentSkeleton />
      ) : (
        <ProblemsContentSkeleton />
      )
      ) : (
        <>
          <ProblemsSearchInput value={search} onChange={setSearch} />
          <ProblemsPageContent
          problems={problems}
          pagination={pagination}
          isAuthenticated={isAuthenticated}
          owner={owner}
          search={search}
          />
        </>
      )}
    </>
  );
}
