"use client";

import { Group, SegmentedControl } from "@mantine/core";
import { IconArchive, IconUser } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePageTransition } from "./ProblemsPageWrapper";

type Props = {
  isAuthenticated: boolean;
};

export function ProblemsOwnerFilter({ isAuthenticated }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "all";
  const { isPending, startTransition } = usePageTransition();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "me") {
      params.set("owner", "me");
    } else {
      params.delete("owner");
    }
    params.delete("page"); // Reset to page 1 on filter change

    const query = params.toString();
    startTransition(() => {
      router.push(`/problems${query ? `?${query}` : ""}`);
    });
  };

  return (
    <SegmentedControl
      value={owner}
      onChange={handleChange}
      disabled={isPending}
      data={[
        {
          value: "all",
          label: (
            <Group gap="xs" wrap="nowrap">
              <IconArchive size={16} />
              <span>Архив задач</span>
            </Group>
          ),
        },
        {
          value: "me",
          label: (
            <Group gap="xs" wrap="nowrap">
              <IconUser size={16} />
              <span>Мои задачи</span>
            </Group>
          ),
          disabled: !isAuthenticated,
        },
      ]}
    />
  );
}
