"use client";

import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";
import Link from "next/link";
import type { ReactNode } from "react";

type LogoutLinkProps = ButtonProps & { children?: ReactNode };

const LogoutLink = (props: LogoutLinkProps) => {
  return (
    <Button component={Link} href="/auth/logout" prefetch={false} {...props}>
      {props.children ?? "Выйти"}
    </Button>
  );
};

export { LogoutLink };
