import { Footer } from "@/components/Footer";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Layout } from "@/components/Layout";
import { Call } from "@/lib/api";
import {
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Container,
} from "@mantine/core";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContestHotbar } from "@/components/ContestHotbar";
import { SubmitSolutionClient } from "./SubmitSolutionClient";

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
      title: response?.contest?.title || "Контест",
      description: response?.contest?.title || "",
    };
  } catch (error) {
    return {
      title: "Контест не найден",
    };
  }
};

const Page = async ({ params }: Props) => {
  const { contest_id } = await params;

  console.log("🔍 Loading contest for submit:", contest_id);

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
            <ContestHotbar 
              contest={response.contest} 
              activeTab="submit"
            />
            <SubmitSolutionClient 
              contest={response.contest}
              problems={response.problems || []}
            />
          </Container>
        </AppShellMain>
        <AppShellFooter withBorder={false}>
          <Footer />
        </AppShellFooter>
      </Layout>
    );
  } catch (error) {
    console.error("❌ Failed to load contest:", error);
    notFound();
  }
};

export default Page;

