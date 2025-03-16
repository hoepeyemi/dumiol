// In-memory store for verification sessions
// In a production app, you would use a database
interface VerificationSession {
  userId: string;
  status: 'pending' | 'verified' | 'failed';
  timestamp: number;
  userData?: any;
}

const verificationSessions: Record<string, VerificationSession> = {};

// Clean up old sessions (older than 1 hour)
const cleanupSessions = () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  Object.keys(verificationSessions).forEach(userId => {
    if (now - verificationSessions[userId].timestamp > oneHour) {
      delete verificationSessions[userId];
    }
  });
};

// Run cleanup every hour
setInterval(cleanupSessions, 60 * 60 * 1000);

export const createSession = (userId: string): VerificationSession => {
  const session: VerificationSession = {
    userId,
    status: 'pending',
    timestamp: Date.now(),
  };
  
  verificationSessions[userId] = session;
  return session;
};

export const getSession = (userId: string): VerificationSession | null => {
  return verificationSessions[userId] || null;
};

export const updateSession = (
  userId: string, 
  status: 'pending' | 'verified' | 'failed',
  userData?: any
): VerificationSession | null => {
  if (!verificationSessions[userId]) {
    return null;
  }
  
  verificationSessions[userId] = {
    ...verificationSessions[userId],
    status,
    userData,
    timestamp: Date.now(),
  };
  
  return verificationSessions[userId];
};

export const deleteSession = (userId: string): boolean => {
  if (!verificationSessions[userId]) {
    return false;
  }
  
  delete verificationSessions[userId];
  return true;
};

// Check if a user is verified
export const isUserVerified = (userId: string): boolean => {
  const session = getSession(userId);
  return session !== null && session.status === 'verified';
}; 