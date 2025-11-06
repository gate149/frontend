// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import "@ory/elements-react/theme/styles.css"
import { PropsWithChildren } from "react"
import { Stack } from "@mantine/core"

export default function DefaultCardLayout({ children }: PropsWithChildren) {
  return (
    <main style={{ 
      padding: 'var(--mantine-spacing-md)', 
      paddingBottom: 'var(--mantine-spacing-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 'var(--mantine-spacing-xl)',
      minHeight: '100vh',
      backgroundColor: 'var(--mantine-color-body)'
    }}>
      <Stack gap="xl" align="center">
        {children}
      </Stack>
    </main>
  )
}
