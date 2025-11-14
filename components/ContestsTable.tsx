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
import type { ContestModel } from "../../contracts/core/v1";

export function ContestsTable({ contests }: { contests: ContestModel[] }) {
  const router = useRouter();

  return (
    <Table striped highlightOnHover>
      <TableThead>
        <TableTr>
          <TableTh style={{ width: "50%", maxWidth: 0 }}>Название</TableTh>
          <TableTh style={{ width: "15%"}}>Участники</TableTh>
          <TableTh style={{ width: "15%"}}>Задачи</TableTh>
          <TableTh style={{ width: "20%"}}>Дата создания</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {contests.map((contest: ContestModel) => (
          <TableTr
            key={contest.id}
            onClick={() => router.push(`/contests/${contest.id}`)}
            style={{ cursor: "pointer" }}
          >
            <TableTd style={{ width: "50%", maxWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {contest.title}
            </TableTd>
            <TableTd>
              {0}
            </TableTd>
            <TableTd>
              {0}
            </TableTd>
            <TableTd>
              {new Date(contest.created_at).toLocaleDateString("ru-RU")}
            </TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
}
