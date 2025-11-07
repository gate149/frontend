"use client";

import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function ContestsSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const updateURL = useCallback(
    (newSearch: string) => {
      const urlParams = new URLSearchParams();
      if (newSearch) urlParams.set("search", newSearch);

      const query = urlParams.toString();
      router.push(`/contests${query ? `?${query}` : ""}`);
    },
    [router]
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
      placeholder="Поиск по названию контеста..."
      leftSection={<IconSearch size={16} />}
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
    />
  );
}
