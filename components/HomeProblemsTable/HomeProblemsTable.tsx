"use client";

import { numberToLetters } from "@/lib/lib";
import { Box, Flex, Table, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

type HomeProblemItem = {
  id: string;
  contest_id: string;
  problem_id: string;
  position: number;
  title: string;
  time_limit: number;
  memory_limit: number;
};

type HomeProblemsTableProps = {
  problems: Array<HomeProblemItem>;
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

export function HomeProblemsTable({ problems }: HomeProblemsTableProps) {
  const router = useRouter();

  return (
    <Box style={{ overflowX: "auto" }}>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "50px", textAlign: "center" }}>#</Table.Th>
            <Table.Th>Название</Table.Th>
            <Table.Th style={{ width: "80px", textAlign: "center" }}>Баллы</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {problems.map((problem) => {
            const problemUrl = `/contests/${problem.contest_id}/problems/${problem.problem_id}`;
            return (
              <Table.Tr
                key={problem.id}
                style={{ cursor: "pointer" }}
                onClick={() => router.push(problemUrl)}
              >
                <Table.Td style={{ textAlign: "center" }}>
                  <Text fw={500}>{numberToLetters(problem.position)}</Text>
                </Table.Td>
                <Table.Td>
                  <Flex justify="space-between" align="center" gap="md">
                    <Text fw={500}>{problem.title}</Text>
                    <Text c="dimmed" size="sm" style={{ whiteSpace: "nowrap" }}>
                      {formatTimeLimit(problem.time_limit)}, {formatMemoryLimit(problem.memory_limit)}
                    </Text>
                  </Flex>
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {/* Баллы - will be populated when backend integration is ready */}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
}

