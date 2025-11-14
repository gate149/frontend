"use client";

import type {
  Contest,
  Pagination as PaginationType,
} from "../../../contracts/core/v1";
import { ContestsTable } from "../ContestsTable";
import { Center, Text, Pagination } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  contests: Contest[];
  pagination: PaginationType;
  search: string;
};

export function ContestsDataWrapper({ contests, pagination, search }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    router.push(`/problems${query ? `?${query}` : ""}`);
  };

  const totalPages = Math.ceil((pagination?.total || 0) / (pagination?.page_size || 10));

  if (contests.length === 0) {
    return (
      <>
        <Center py="xl">
          <Text c="dimmed">
            {searchParams.get("search")
              ? "Контесты по вашему запросу не найдены"
              : "У вас пока нет контестов"}
          </Text>
        </Center>
      </>
    );
  }

  return (
    <>
      <ContestsTable contests={contests} />
      {totalPages > 1 && (
        <Center mt="xl">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
          />
        </Center>
      )}
    </>
  );
}

