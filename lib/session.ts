"use server";

import { getOrySession } from "./api";

/**
 * User data extracted from Ory Kratos session
 */
export type SessionUser = {
  id: string; // User ID from metadata_public.user_id
  username: string;
  email: string;
  role: "admin" | "user"; // Global role in the system
} | null;

/**
 * Get current authenticated user from Ory Kratos session
 * Returns null if user is not authenticated
 */
export async function getCurrentUser(): Promise<SessionUser> {
  try {
    const session = await getOrySession();
    
    if (!session || !session.identity) {
      return null;
    }

    const { identity } = session;
    const traits = identity.traits as { username?: string; email?: string };
    const metadata = identity.metadata_public as { user_id?: string; role?: string };

    // Validate required fields
    if (!metadata?.user_id || !traits?.username || !traits?.email || !metadata?.role) {
      console.warn("Session is missing required user data");
      return null;
    }

    // Ensure role is either "admin" or "user"
    const role = metadata.role === "admin" ? "admin" : "user";

    return {
      id: metadata.user_id,
      username: traits.username,
      email: traits.email,
      role,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

