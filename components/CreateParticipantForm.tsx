"use client";

import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import * as testerv1 from "../../contracts/tester/v1";

type CreateParticipantFormProps = {
  contestId: string;
};

interface FormValues {
  username: string;
}

const roles = ["Студент", "Преподаватель", "Администратор"];

const CreateParticipantForm = ({ contestId }: CreateParticipantFormProps) => {
  const [opened, setOpened] = React.useState(false);
  const [users, setUsers] = React.useState<testerv1.User[]>([]);
  const router = useRouter();

  const form = useForm<FormValues>({
    initialValues: {
      username: "",
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (username: string) => {
      // Use client-side API call or Server Action here
      const response = await fetch(
        `/api/users?search=${encodeURIComponent(username)}`
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.users || [];
    },
    onSuccess: (data) => {
      setUsers(data);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Use client-side API call or Server Action here
      const response = await fetch(
        `/api/contests/${contestId}/participants?user_id=${userId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Failed to add participant");
      return await response.json();
    },
    onSuccess: () => {
      setOpened(false);
      form.reset();
      setUsers([]);
      router.refresh();
    },
  });

  const handleSearch = (values: FormValues) => {
    searchMutation.mutate(values.username);
  };

  const handleAddUser = (userId: string) => {
    addMutation.mutate(userId);
  };

  return (
    <>
      <Button
        variant="light"
        leftSection={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
      >
        Добавить участника
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
          setUsers([]);
        }}
        title="Добавить участника"
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSearch)}>
          <Group w="100%" align="center">
            <TextInput
              placeholder="Введите имя пользователя"
              {...form.getInputProps("username")}
              flex="1"
            />
            <Button type="submit" loading={searchMutation.isPending}>
              Найти
            </Button>
          </Group>
        </form>

        {searchMutation.isPending && <Loader />}

        {users.length > 0 && (
          <Table mt="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Имя пользователя</Table.Th>
                <Table.Th>Роль</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>
                    {roles[parseInt(user.role, 10)] || user.role}
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end">
                      <ActionIcon
                        onClick={() => handleAddUser(user.id)}
                        loading={addMutation.isPending}
                        color="green"
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Modal>
    </>
  );
};

export { CreateParticipantForm };
