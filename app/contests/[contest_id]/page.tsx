import { Footer } from "@/components/Footer";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Layout } from "@/components/Layout";
import { Call } from "@/lib/api";
import {
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Box,
  Center,
  Container,
  Stack,
  Text,
} from "@mantine/core";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type {
  Contest,
  ContestProblemListItem,
} from "../../../../contracts/core/v1";
import { ContestProblemsTable } from "./ContestProblemsTable";
import { ContestHotbar } from "@/components/ContestHotbar";

type Props = {
  params: Promise<{ contest_id: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { contest_id } = await params;

  try {
    const response = await Call((client) =>
      client.default.getContest({ contestId: contest_id })
    );
    return {
      title: response?.contest?.title || "Контест не найден",
      description: response?.contest?.title || "",
    };
  } catch (error) {
    return {
      title: "Контест не найден",
    };
  }
};

type ContestProps = {
  contest: Contest;
  problems: Array<ContestProblemListItem>;
};

const Contest = ({ contest, problems }: ContestProps) => {
  return (
    <Layout>
      <AppShellHeader>
        <HeaderWithSession />
      </AppShellHeader>
      <AppShellMain>
        <Container
          size="lg"
          pt={0}
          pb={{ base: "md", sm: "lg", md: "xl" }}
          px={{ base: "xs", sm: "md", md: "lg" }}
        >
          {/* Header Section */}
          <ContestHotbar contest={contest} activeTab="tasks" showManageButton={true} />

          {/* Tasks Section */}
          {problems.length === 0 ? (
            <Center py={{ base: "xl", md: "3xl" }}>
              <Stack gap="md" align="center">
                <Box component="div" style={{ fontSize: "2.5rem" }}>
                  📝
                </Box>
                <Text c="dimmed" size="md" fw={500}>
                  Нет задач в контесте
                </Text>
              </Stack>
            </Center>
          ) : (
            <ContestProblemsTable contestId={contest.id} problems={problems} />
          )}
        </Container>
      </AppShellMain>

      <AppShellFooter withBorder={false}>
        <Footer />
      </AppShellFooter>
    </Layout>
  );
};

const Page = async ({ params }: Props) => {
  const { contest_id } = await params;

  console.log("🔍 Loading contest:", contest_id);

  try {
    const response = await Call((client) =>
      client.default.getContest({ contestId: contest_id })
    );

    console.log("✅ Contest response:", response);

    if (!response || !response.contest) {
      console.error("❌ No contest in response");
      notFound();
    }

    return (
      <Contest 
        contest={response.contest} 
        problems={response.problems || []} 
      />
    );
  } catch (error) {
    console.error("❌ Failed to load contest:", error);
    notFound();
  }
};

export default Page;
