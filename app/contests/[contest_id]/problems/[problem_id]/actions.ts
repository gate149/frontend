"use server";

import { createSolution } from "@/lib/actions";

// Language mapping: golang = 10, cpp = 20, python = 30
const LANGUAGE_MAP: Record<string, number> = {
  golang: 10,
  cpp: 20,
  python: 30,
};

export async function submitSolution(
  problemId: string,
  contestId: string,
  solution: FormData,
  language: string
): Promise<number | null> {
  const languageCode = LANGUAGE_MAP[language];
  if (!languageCode) {
    console.error("Invalid language:", language);
    return null;
  }

  try {
    const response = await createSolution(
      problemId,
      contestId,
      languageCode,
      solution
    );
    // Return 1 on success (component uses this only to check success, not the actual ID)
    return response?.id ? 1 : null;
  } catch (error) {
    console.error("Failed to create solution:", error);
    return null;
  }
}

