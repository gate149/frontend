import { getOrySession } from "@/lib/api";
import { Header } from "./Header";

export async function HeaderWithSession() {
  const session = await getOrySession();
  return <Header session={session} />;
}

