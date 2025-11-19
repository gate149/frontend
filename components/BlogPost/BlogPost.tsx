import { Card, Text, Group, Avatar, Stack, Title, Badge, Skeleton } from '@mantine/core';
import { ReactNode } from 'react';
import classes from './styles.module.css';

export interface BlogPostProps {
  title: string;
  author: string;
  avatarUrl?: string;
  body: ReactNode;
  date?: string;
}

export function BlogPost({ title, author, avatarUrl, body, date }: BlogPostProps) {
  return (
    <Card shadow="sm" padding="xl" radius="lg" className={classes.card}>
      <Stack gap="md">
        <Stack gap="xs">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="xs">
              <Avatar src={avatarUrl} name={author} size={32} radius="xl" />
              <Stack gap={0}>
                <Text size="sm" fw={600} style={{ lineHeight: 1 }}>
                  {author}
                </Text>
                {date && (
                  <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>
                    {date}
                  </Text>
                )}
              </Stack>
            </Group>
          </Group>

          <Title order={3} size="h3" className={classes.title} mt={4}>
            {title}
          </Title>
        </Stack>

        <div className={classes.body}>
          {typeof body === 'string' ? (
            <Text inherit>{body}</Text>
          ) : (
            body
          )}
        </div>
      </Stack>
    </Card>
  );
}

export function BlogPostSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Stack gap="xs">
          <Group justify="space-between" align="start">
            <Skeleton height={28} width="70%" radius="sm" />
            <Skeleton height={24} width={100} radius="sm" />
          </Group>
          
          <Group gap="xs">
            <Skeleton height={26} width={26} circle />
            <Skeleton height={20} width={120} radius="sm" />
          </Group>
        </Stack>

        <Stack gap="xs">
          <Skeleton height={16} radius="sm" />
          <Skeleton height={16} radius="sm" />
          <Skeleton height={16} radius="sm" width="80%" />
        </Stack>
      </Stack>
    </Card>
  );
}

