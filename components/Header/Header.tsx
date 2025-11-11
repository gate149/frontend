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
import { useSession } from "@ory/elements-react/client";
import { IconMoon, IconSun, IconUser } from "@tabler/icons-react";
import cx from "clsx";
import NextImage from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { LogoutLink } from "../LogoutLink";
import classes from "./styles.module.css";

const Profile = ({ initialSession }: { initialSession: any }) => {
  const { session: clientSession, isLoading: isPending } = useSession();
  const [session, setSession] = useState(initialSession);
  const hasUpdated = useRef(false);
  
  // Update session only once after useSession completes first load
  // This prevents multiple re-renders and flashing
  useEffect(() => {
    if (!isPending && !hasUpdated.current) {
      hasUpdated.current = true;
      
      // Check if session state actually changed
      const wasAuth = !!initialSession;
      const isAuth = !!clientSession;
      const sameUser = initialSession?.identity?.id === clientSession?.identity?.id;
      
      // IMPORTANT: Only update in these specific safe cases:
      
      // Case 1: Both authenticated with same user → no update needed (prevents flashing)
      if (wasAuth && isAuth && sameUser) {
        return;
      }
      
      // Case 2: Both NOT authenticated → no update needed
      if (!wasAuth && !isAuth) {
        return;
      }
      
      // Case 3: Was NOT auth, now IS auth → update to show user info
      if (!wasAuth && isAuth) {
        setSession(clientSession);
        return;
      }
      
      // Case 4: Was auth, now NOT auth (logged out) → ONLY update if we're certain
      // Don't switch to "not authenticated" if we started as authenticated
      // This prevents false logouts due to slow API or timing issues
      // User should explicitly log out, not be logged out by client state mismatch
      if (wasAuth && !isAuth) {
        // Keep showing authenticated state - server said we're authenticated
        // If user really logged out, they'll see it on next page load
        return;
      }
    }
  }, [isPending, clientSession, initialSession]);

  // Show authenticated UI if we have session data (from SSR or client)
  if (session) {
    return (
      <Group justify="flex-end">
        <LogoutLink variant="default" visibleFrom="sm">
          Выйти
        </LogoutLink>
        {session.identity ? (
          <Avatar
            component={Link}
            href={`/users/${session.identity.id}`}
            color="gray"
            size="60"
          >
            <IconUser size="32" />
          </Avatar>
        ) : (
          <Avatar color="gray" size="60">
            <IconUser size="32" />
          </Avatar>
        )}
      </Group>
    );
  }

  // Show "Войти" when not authenticated
  if (!session) {
    // During initial load, show optimistic UI only if initialSession suggested authenticated user
    if (!hasUpdated.current && initialSession) {
      return (
        <Group justify="flex-end">
          <LogoutLink variant="default" visibleFrom="sm">
            Выйти
          </LogoutLink>
          <Avatar color="gray" size="60">
            <IconUser size="32" />
          </Avatar>
        </Group>
      );
    }
    
    // Otherwise show login button
    return (
      <Group justify="flex-end">
        <Button component={Link} href="/auth/login" variant="default">
          Войти
        </Button>
      </Group>
    );
  }

  // This should never be reached, but adding for completeness
  return null;
};

const Header = ({
  drawerContent,
  initialSession,
}: {
  drawerContent?: React.ReactNode;
  initialSession?: any;
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
              href="/problems"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Мастерская
            </Anchor>
            <Anchor
              component={Link}
              href="/users"
              className={classes.link}
              underline="never"
              visibleFrom="sm"
            >
              Администрирование
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
            <Profile initialSession={initialSession || null} />
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

          {/* Custom drawer content */}
          {drawerContent && <>{drawerContent}</>}
        </ScrollArea>
      </Drawer>
    </>
  );
};

export { Header };
