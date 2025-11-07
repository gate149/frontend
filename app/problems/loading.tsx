import { DefaultLayout } from "@/components/Layout";
import { ProblemsGridSkeleton } from "@/components/ProblemsPage/ProblemsGridSkeleton";
import { ProblemsOwnerFilterSkeleton } from "@/components/ProblemsPage/ProblemsOwnerFilterSkeleton";
import { Container, Skeleton, Stack } from "@mantine/core";

export default function Loading() {
  return (
    <DefaultLayout>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Show SegmentedControl immediately (disabled) */}
          <ProblemsOwnerFilterSkeleton />
          {/* Search input skeleton */}
          <Skeleton height={40} radius="md" />
          {/* Grid skeleton */}
          <ProblemsGridSkeleton />
        </Stack>
      </Container>
    </DefaultLayout>
  );
}
