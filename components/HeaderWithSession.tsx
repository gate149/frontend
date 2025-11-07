import { getOrySession } from "@/lib/api";
import { Header } from "./Header";

type HeaderWithSessionProps = {
  drawerContent?: React.ReactNode;
};

export async function HeaderWithSession({ drawerContent }: HeaderWithSessionProps = {}) {
  const session = await getOrySession();
  
  return <Header drawerContent={drawerContent} initialSession={session} />;
}

