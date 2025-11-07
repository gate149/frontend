"use server";

import { cookies } from "next/headers";
import { tester } from "../../contracts/tester/v1/tester";

async function getOrySession() {
  try {
    const { FrontendApi, Configuration } = await import("@ory/client");
    const cookieStore = await cookies();
    
    const ory = new FrontendApi(
      new Configuration({
        basePath: process.env.ORY_SDK_URL || "http://steins.ru/kratos/public",
        baseOptions: {
          withCredentials: true,
        },
      })
    );

    // Build cookie header for Kratos
    const cookiePairs: string[] = [];
    cookieStore.getAll().forEach((cookie) => {
      cookiePairs.push(`${cookie.name}=${cookie.value}`);
    });

    if (cookiePairs.length > 0) {
      const sessionResponse = await ory.toSession(
        {},
        {
          headers: {
            Cookie: cookiePairs.join("; "),
          },
        }
      );
      
      return sessionResponse.data;
    }
  } catch (error) {
    // User is not authenticated
    return null;
  }
  return null;
}

export const Call = async <T>(
  method: (client: tester) => Promise<T>,
): Promise<T> => {
  const headers: Record<string, string> = {};
  
  // Get user session from Ory Kratos
  const session = await getOrySession();
  
  if (session?.identity?.id) {
    headers["X-User-ID"] = session.identity.id;
  }
  if (session?.id) {
    headers["X-Session-ID"] = session.id;
  }

  // Call backend API directly (bypass Oathkeeper for server-side calls)
  const baseUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:13000";

  console.log("📡 Call function invoked", {
    baseUrl,
    headers: Object.keys(headers),
  });

  const client = new tester({
    BASE: baseUrl,
    HEADERS: headers,
    CREDENTIALS: "include",
  });

  try {
    const result = await method(client);
    console.log("✅ Call succeeded");
    return result;
  } catch (error) {
    console.error("❌ Call failed:", error);
    throw error;
  }
};
