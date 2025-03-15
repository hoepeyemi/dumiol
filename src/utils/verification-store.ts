// Simple in-memory store for verified sessions
// In a production environment, this should be replaced with a database
export const verifiedSessions: Record<string, boolean> = {};

/**
 * Check if a user has been verified
 * @param userId The user ID to check
 * @returns boolean indicating if the user is verified
 */
export function isUserVerified(userId: string): boolean {
  return !!verifiedSessions[userId];
} 