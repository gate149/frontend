"use client";

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
  Skeleton,
  Stack,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Configuration, FrontendApi } from "@ory/client-fetch";
import { useSession } from "@ory/elements-react/client";
import { IconMoon, IconSun, IconUser } from "@tabler/icons-react";
import cx from "clsx";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import classes from "./styles.module.css";

const kratos = new FrontendApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
    credentials: "include",
  })
);

const Profile = () => {
  const { session, isLoading: isPending } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    if (!session) {
        return;
    }

    try {
      const logoutFlow = await kratos.createBrowserLogoutFlow();

      router.push(logoutFlow.logout_url);
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };

  if (isPending) {
    return (
      <Group justify="flex-end">
        <Button component={Link} href="/auth/login" variant="default">
          Войти
        </Button>
        <Skeleton height="60" circle />
      </Group>
    );
  }

  if (session) {
    return (
      <Group justify="flex-end">
        <Button variant="default" visibleFrom="sm" onClick={handleLogout}>
          Выйти
        </Button>
        <Avatar
          component={Link}
          href={`/users/${session.identity.id}`} // FIXME
          color="gray"
          size="60"
        >
          <IconUser size="32" />
        </Avatar>
      </Group>
    );
  }

  // Fallback for no session or error
  return (
    <Group justify="flex-end">
      <Button component={Link} href="/auth/login" variant="default">
        Войти
      </Button>
    </Group>
  );
};

const Header = ({
  drawerContent,
}: {
  drawerContent?: React.ReactNode;
} = {}) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <>
          <div className={classes.header}>
        <Group justify="space-between" h="100%" maw="1920px" mx="auto">
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
          <Group h="100%" gap={0}>
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
              href="/users"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Пользователи
            </Anchor>
            <Anchor
              component={Link}
              href="/problems"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Мастерская
            </Anchor>
          </Group>
          <Group>
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
            <Profile />
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
              href="/users"
              className={classes.link}
              underline="never"
            >
              Пользователи
            </Anchor>
            <Anchor
              component={Link}
              href="/workshop"
              className={classes.link}
              underline="never"
            >
              Мастерская
            </Anchor>
          </Stack>

          <Divider my="sm" />

          {/* Custom drawer content */}
          {drawerContent && <>{drawerContent}</>}
        </ScrollArea>
      </Drawer>
    </>
  );
};

export { Header };
