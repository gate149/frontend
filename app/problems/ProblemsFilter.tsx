"use client";

import { SegmentedControl } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

export function ProblemsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "me") {
      params.set("owner", "me");
    } else {
      params.delete("owner");
    }
    params.delete("page"); // Reset to page 1 when changing filter
    router.push(`/problems?${params.toString()}`);
  };

  return (
    <SegmentedControl
      value={owner}
      onChange={handleChange}
      data={[
        { label: "Все публичные", value: "all" },
        { label: "Мои задачи", value: "me" },
      ]}
    />
  );
}
