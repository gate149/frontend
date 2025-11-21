"use server";

/**
 * Contest role types
 * Hierarchy: owner > moderator > participant
 */
export type ContestRole = "owner" | "moderator" | "participant";

export type ContestRoleResponse = {
  role: ContestRole;
} | null;

/**
 * Get the current user's role in a specific contest
 * 
 * TODO: Implement real API call when backend is ready
 * 
 * @param contestId - The UUID of the contest
 * @returns The user's role in the contest, or null if not a participant
 */
export async function getMyContestRole(contestId: string): Promise<ContestRoleResponse> {
  // TODO: Replace with actual API call to backend
  // Example: const response = await Call((client) => client.getMyContestRole({ contestId }));
  
  // Temporary: All authenticated users are considered participants
  // This allows the UI to work while the backend endpoint is being developed
  return { role: "participant" };
}

