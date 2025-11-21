"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { core } from "../../contracts/core/v1";

/**
 * Get Ory Kratos session for the current user
 * Wrapped in React cache() to avoid duplicate requests during SSR
 * Multiple calls within the same render will return the cached result
 */
export const getOrySession = cache(async () => {
  try {
    const { FrontendApi, Configuration } = await import("@ory/client");
    const cookieStore = await cookies();
    
    const ory = new FrontendApi(
      new Configuration({
        basePath: process.env.ORY_SDK_URL,
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
});

const oryKratosCookieName = "ory_kratos_session";

const getKratosCookie = async (): Promise<string | undefined> => {
    const requestCookies = await cookies();

    if (!requestCookies.has(oryKratosCookieName)) {
        return;
    }

    const cookie = requestCookies.get(oryKratosCookieName);

    if (!cookie || !cookie.name || !cookie.value) {
        return;
    }

    return `${oryKratosCookieName}=${cookie.value}`;
}

export const Call = async <T>(
  method: (client: core) => Promise<T>,
): Promise<T> => {
  const headers: Record<string, string> = {};

  const kratosCookie = await getKratosCookie();

  headers["Cookie"] = kratosCookie || "";

  const client = new core({
    BASE: process.env.BACKEND_API_URL,
    HEADERS: headers,
    CREDENTIALS: "include",
  });

  try {
    return await method(client);
  } catch (error) {
    throw error;
  }
};
