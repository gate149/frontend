"use client";

import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function UsersSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const updateURL = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete("page"); // Reset to first page on search
      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      const query = params.toString();
      router.push(`/users${query ? `?${query}` : ""}`);
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
      placeholder="Поиск по имени (часть имени, например: 'john')..."
      leftSection={<IconSearch size={16} />}
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
    />
  );
}

