// Programming languages configuration
export const LANGUAGES = {
  golang: { id: 10, name: 'Go', extension: '.go' },
  cpp: { id: 20, name: 'C++', extension: '.cpp' },
  python: { id: 30, name: 'Python', extension: '.py' },
} as const;

// Language name to ID mapping for API calls
export const LANGUAGE_MAP: Record<string, number> = {
  golang: LANGUAGES.golang.id,
  cpp: LANGUAGES.cpp.id,
  python: LANGUAGES.python.id,
};

