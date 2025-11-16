/**
 * Converts a number to alphabetic letters (1 -> A, 2 -> B, etc.)
 */
export function numberToLetters(num?: number | null): string {
  if (!num || num <= 0) return "?";
  
  let result = "";
  let n = num;
  
  while (n > 0) {
    n--;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  
  return result;
}

/**
 * Get color for submission state
 */
export function StateColor(state?: number | string): string {
  const stateNum = typeof state === "string" ? parseInt(state) : state;
  
  switch (stateNum) {
    case 0:
      return "blue"; // Pending
    case 1:
      return "yellow"; // In Progress / Testing
    case 2:
      return "red"; // Wrong Answer
    case 3:
      return "orange"; // Time Limit Exceeded
    case 4:
      return "orange"; // Memory Limit Exceeded
    case 200:
      return "green"; // Accepted (HTTP 200 OK)
    default:
      return "gray";
  }
}

/**
 * Get string representation of submission state
 */
export function StateString(state?: number | string): string {
  const stateNum = typeof state === "string" ? parseInt(state) : state;
  
  switch (stateNum) {
    case 0:
      return "Ожидание";
    case 1:
      return "Тестируется";
    case 2:
      return "Неправильный ответ";
    case 3:
      return "Превышено время";
    case 4:
      return "Превышена память";
    case 200:
      return "Принято";
    default:
      return "Неизвестно";
  }
}

export const isValidUUIDV4 = (str: string): boolean => {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(str);
}

/**
 * Format ISO timestamp to readable format
 */
export function TimeBeautify(timestamp?: string): string {
  if (!timestamp) return "—";
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timestamp;
  }
}

/**
 * Convert language code to display string
 * Language mapping: golang = 10, cpp = 20, python = 30
 */
export function LangString(language?: number): string {
  switch (language) {
    case 10:
      return "Go";
    case 20:
      return "C++";
    case 30:
      return "Python";
    default:
      return "Unknown";
  }
}

/**
 * Convert language code to syntax highlighter language name
 * Language mapping: golang = 10, cpp = 20, python = 30
 */
export function LangNameToString(language?: number): string {
  switch (language) {
    case 10:
      return "go";
    case 20:
      return "cpp";
    case 30:
      return "python";
    default:
      return "text";
  }
}

/**
 * Format problem title with position letter
 */
export function ProblemTitle(position?: number, title?: string): string {
  const letter = numberToLetters(position);
  return title ? `${letter}. ${title}` : letter;
}

/**
 * Get color for user role badge
 */
export function getRoleColor(role: string): string {
  switch (role?.toLowerCase()) {
    case "admin":
      return "red";
    case "moderator":
      return "blue";
    case "user":
      return "gray";
    default:
      return "gray";
  }
}