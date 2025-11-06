import { Avatar, Container, Flex, Title } from "@mantine/core";

type ProfileProps = {
  avatar?: string;
  userId: string;
  username: string;
};

const Profile = (props: ProfileProps) => {
  return (
    <Container size="md" p="md">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2} ta="center" style={{ flex: 1 }}>
          Профиль пользователя {props.username}
        </Title>
      </Flex>
      <Flex align="start" gap="md">
        <Avatar src={props.avatar} w={200} h={240} radius="md" />
      </Flex>
    </Container>
  );
};

export { Profile };
