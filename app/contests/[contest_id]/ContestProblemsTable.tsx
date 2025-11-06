"use client";

import { numberToLetters } from "@/lib/lib";
import { Badge, Box, Button, Table, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContestProblemListItem } from "../../../../contracts/tester/v1";

type ContestProblemsTableProps = {
  contestId: string | number;
  problems: Array<ContestProblemListItem>;
};

const formatTimeLimit = (timeMs: number) => {
  if (timeMs % 1000 === 0) {
    return `${timeMs / 1000}s`;
  }
  return `${timeMs}ms`;
};

const formatMemoryLimit = (memoryKb: number) => {
  return `${memoryKb}MB`;
};

export function ContestProblemsTable({
  contestId,
  problems,
}: ContestProblemsTableProps) {
  const router = useRouter();

  return (
    <Box style={{ overflowX: "auto" }}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Позиция</Table.Th>
            <Table.Th>Название</Table.Th>
            <Table.Th>ID</Table.Th>
            <Table.Th>Лимит времени</Table.Th>
            <Table.Th>Лимит памяти</Table.Th>
            <Table.Th style={{ width: "120px" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {problems.map((problem) => {
            const problemUrl = `/contests/${contestId}/problems/${
              problem.problem_id || ""
            }`;
            return (
              <Table.Tr
                key={problem.problem_id}
                style={{ cursor: "pointer" }}
                onClick={() => router.push(problemUrl)}
              >
                <Table.Td>
                  <Text fw={500}>{numberToLetters(problem.position)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{problem.title}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="light" color="grape">
                    {problem.problem_id?.toString().slice(0, 8)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed" size="sm">
                    {formatTimeLimit(problem.time_limit)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed" size="sm">
                    {formatMemoryLimit(problem.memory_limit)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    component={Link}
                    href={problemUrl}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Открыть
                  </Button>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
