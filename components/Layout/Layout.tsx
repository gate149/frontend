"use client";

import {AppShell, AppShellFooter, AppShellHeader, AppShellMain, AppShellProps, rem,} from "@mantine/core";
import React from "react";
import {Footer} from "@/components/Footer";
import {useHeadroom} from "@mantine/hooks";
import {Header} from "../Header";

type LayoutProps = {
    children: React.ReactNode;
    headerConfig?: AppShellProps["header"];
    footerConfig?: AppShellProps["footer"];
    asideConfig?: AppShellProps["aside"];
    navbarConfig?: AppShellProps["navbar"];
    stylesConfig?: AppShellProps["styles"];
    paddingConfig?: AppShellProps["padding"];
};

const Layout = ({
                    children,
                    headerConfig = {height: 70}, // Значения по умолчанию
                    footerConfig = {height: 0},
                    navbarConfig = undefined,
                    asideConfig = undefined,
                    stylesConfig = {
                        footer: {
                            position: "static",
                            bottom: "auto",
                            width: "100%",
                            zIndex: "auto",
                        },
                        main: {
                            paddingTop: `calc(${rem(70)} + var(--mantine-spacing-md))`,
                            paddingBottom: `var(--mantine-spacing-lg)`,
                        },
                    },
                    paddingConfig = "md",
                }: LayoutProps) => {
    const pinned = useHeadroom({fixedAt: 150});

    return (
        <AppShell
            header={{
                ...headerConfig,
                height: headerConfig?.height ?? 70,
                collapsed: !pinned,
            }}
            footer={footerConfig}
            aside={asideConfig}
            navbar={navbarConfig}
            styles={stylesConfig}
            padding={paddingConfig}
        >
            {children}
        </AppShell>
    );
};

const DefaultLayout = ({children, ...props}: LayoutProps) => {
    return (
        <Layout {...props}>
            <AppShellHeader>
                <Header/>
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
            <AppShellFooter withBorder={false}>
                <Footer/>
            </AppShellFooter>
        </Layout>
    );
};

export {Layout, DefaultLayout};