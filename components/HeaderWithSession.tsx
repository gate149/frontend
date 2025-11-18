import { getOrySession } from "@/lib/api";
import { Header } from "./Header";

export async function HeaderWithSession() {
  const session = await getOrySession();
  console.log(session);
  
  return <Header session={session} />;
}

