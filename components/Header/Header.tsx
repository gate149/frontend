"use client";

import { APP_COLORS } from "@/lib/theme/colors";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
  Stack,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSun, IconUser } from "@tabler/icons-react";
import cx from "clsx";
import NextImage from "next/image";
import Link from "next/link";
import { LogoutLink } from "../LogoutLink";
import classes from "./styles.module.css";

const Profile = ({ session }: { session?: any }) => {
  if (session) {
    return (
      <Group justify="flex-end">
        <LogoutLink variant="default" visibleFrom="sm">
          Выйти
        </LogoutLink>
        {session.identity ? (
          <Avatar
            component={Link}
            href={`/users/${session.identity.metadata_public.user_id}`}
            color={APP_COLORS.users}
            size="60"
          >
            <IconUser size="32" />
          </Avatar>
        ) : (
          <Avatar color={APP_COLORS.users} size="60">
            <IconUser size="32" />
          </Avatar>
        )}
      </Group>
    );
  }
  return (
    <Group justify="flex-end">
      <Button
        component={Link}
        href="/auth/login"
        variant="filled"
        color={APP_COLORS.actions.primary}
      >
        Войти
      </Button>
    </Group>
  );
};

const Header = ({ session }: { session?: any }) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <>
      <div className={classes.header}>
        <Group h="100%" maw="1920px" mx="auto">
          <Group justify="flex-start" h="100%" style={{ flex: 1 }}>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
            <Link href="/" className={classes.link}>
              <Group gap="xs" wrap="nowrap" visibleFrom="sm">
                <Image
                  component={NextImage}
                  src="/gate_logo.svg"
                  alt="Gate logo"
                  width={40}
                  height={40}
                />
                <Title order={1} visibleFrom="md">
                  Gate
                </Title>
              </Group>
            </Link>
          </Group>
          <Group justify="center" h="100%" gap={0} style={{ flex: 1 }}>
            <Anchor
              component={Link}
              href="/"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Главная
            </Anchor>
            <Anchor
              component={Link}
              href="/contests"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Контесты
            </Anchor>
            <Anchor
              component={Link}
              href="/workshop"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Мастерская
            </Anchor>
            <Anchor
              component={Link}
              href="/about"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              О нас
            </Anchor>
          </Group>
          <Group justify="flex-end" style={{ flex: 1 }}>
            <Button
              component={Link}
              href="/users"
              variant="filled"
              visibleFrom="sm"
              color={APP_COLORS.admin}
            >
              ADMIN
            </Button>
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
              variant="default"
              size="input-sm"
              aria-label="Toggle color scheme"
            >
              <IconSun
                className={cx(classes.icon, classes.light)}
                stroke={1.5}
              />
              <IconMoon
                className={cx(classes.icon, classes.dark)}
                stroke={1.5}
              />
            </ActionIcon>
            <Profile session={session} />
          </Group>
        </Group>
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Stack>
            <Anchor
              component={Link}
              href="/"
              className={classes.link}
              underline="never"
            >
              Главная
            </Anchor>
            <Anchor
              component={Link}
              href="/contests"
              className={classes.link}
              underline="never"
            >
              Контесты
            </Anchor>
            <Anchor
              component={Link}
              href="/workshop"
              className={classes.link}
              underline="never"
            >
              Мастерская
            </Anchor>
            <Anchor
              component={Link}
              href="/users"
              className={classes.link}
              underline="never"
            >
              Администрирование
            </Anchor>
          </Stack>

          <Divider my="sm" />
        </ScrollArea>
      </Drawer>
    </>
  );
};

export { Header };
