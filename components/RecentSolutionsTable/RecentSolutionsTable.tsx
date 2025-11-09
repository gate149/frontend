"use client";

import { Anchor, Table, Text } from "@mantine/core";
import Link from "next/link";
import type { SolutionsListItem } from "../../../contracts/core/v1";
import { StateColor, StateString } from "@/lib/lib";

type RecentSolutionsTableProps = {
  solutions: SolutionsListItem[];
  contestId: string;
};

export function RecentSolutionsTable({
  solutions,
  contestId,
}: RecentSolutionsTableProps) {
  if (solutions.length === 0) {
    return null;
  }

  return (
    <>
      <Text fw={500}>
        Последние посылки{" "}
        <Anchor
          component={Link}
          href={`/solutions?contestId=${contestId}&order=-1`}
          fs="italic"
          c="var(--mantine-color-text)"
          fw={500}
        >
          (посмотреть все)
        </Anchor>
        :
      </Text>
      <Table verticalSpacing="xs" horizontalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta="center">Задача</Table.Th>
            <Table.Th ta="center">Статус</Table.Th>
            <Table.Th ta="center">Очки</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {solutions.slice(0, 5).map((solution) => (
            <Table.Tr key={solution.id}>
              <Table.Td ta="center">
                <Text fw={500}>{solution.problem_title}</Text>
              </Table.Td>
              <Table.Td ta="center">
                <Text c={StateColor(solution.state)} fw={500}>
                  {StateString(solution.state)}
                </Text>
              </Table.Td>
              <Table.Td ta="center">{solution.score}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}

