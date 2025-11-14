"use client";

import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";


type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function ContestsSearchInput({ value, onChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const updateURL = useCallback(
    (newSearch: string) => {
      const urlParams = new URLSearchParams(searchParams);
      urlParams.delete("page"); // Reset to page 1 when searching
      if (newSearch) {
        urlParams.set("search", newSearch);
      } else {
        urlParams.delete("search");
      }

      const query = urlParams.toString();
      router.push(`/problems${query ? `?${query}` : ""}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateURL(search);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, updateURL]);

  return (
    <Input
      placeholder="Поиск контестов..."
      leftSection={<IconSearch size={16} />}
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
      radius="md"
      size="md"
    />
  );
}
