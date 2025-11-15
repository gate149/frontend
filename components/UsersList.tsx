"use client";

import {
  ActionIcon,
  Pagination,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import type { UserModel, PaginationModel } from "../../contracts/core/v1";

type UsersListProps = {
  users: UserModel[];
  pagination: PaginationModel;
};

const roles = ["Студент", "Преподаватель", "Администратор"];

const UsersList = ({ users, pagination }: UsersListProps) => {
  const getControlProps = (control: "first" | "previous" | "last" | "next") => {
    if (control === "next") {
      if (pagination.page === pagination.total) {
        return { component: Link, href: `/users?page=${pagination.page}` };
      }

      return { component: Link, href: `/users?page=${+pagination.page + 1}` };
    }

    if (control === "previous") {
      if (pagination.page === 1) {
        return { component: Link, href: `/users?page=${pagination.page}` };
      }
      return { component: Link, href: `/users?page=${+pagination.page - 1}` };
    }

    return {};
  };

  const getItemProps = (page: number) => {
    return {
      component: Link,
      href: `/users?page=${page}`,
    };
  };

  const rows = users.map((user) => (
    <TableTr key={user.id}>
      <TableTd>{user.username}</TableTd>
      {/*<TableTd>{user.email}</TableTd>*/}
      <TableTd>{roles[user.role]}</TableTd>
      <TableTd>
        {
          <ActionIcon size="xs" component={Link} href={`/users/${user.id}`}>
            <IconPencil />
          </ActionIcon>
        }
      </TableTd>
    </TableTr>
  ));

  return (
    <Stack px="16">
      <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
        <Title>Пользователи</Title>
        <Table horizontalSpacing="xl">
          <TableThead>
            <TableTr>
              <TableTh>Никнейм</TableTh>
              {/*<TableTh>Почта</TableTh>*/}
              <TableTh>Роль</TableTh>
              <TableTh></TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{rows}</TableTbody>
        </Table>
        <Pagination
          total={pagination.total}
          value={pagination.page}
          getItemProps={getItemProps}
          getControlProps={getControlProps}
        />
      </Stack>
    </Stack>
  );
};

export { UsersList };
