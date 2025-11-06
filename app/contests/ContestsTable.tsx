"use client";

import {
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import type { Contest } from "../../../contracts/tester/v1";

export function ContestsTable({ contests }: { contests: Contest[] }) {
  const router = useRouter();

  return (
    <Table striped highlightOnHover>
      <TableThead>
        <TableTr>
          <TableTh>Название</TableTh>
          <TableTh>Дата создания</TableTh>
          <TableTh>Дата обновления</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {contests.map((contest: Contest) => (
          <TableTr
            key={contest.id}
            onClick={() => router.push(`/contests/${contest.id}`)}
            style={{ cursor: "pointer" }}
          >
            <TableTd>{contest.title}</TableTd>
            <TableTd>
              {new Date(contest.created_at).toLocaleDateString("ru-RU")}
            </TableTd>
            <TableTd>
              {new Date(contest.updated_at).toLocaleDateString("ru-RU")}
            </TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
}
