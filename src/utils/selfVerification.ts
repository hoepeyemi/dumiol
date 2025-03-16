// In-memory store for verification sessions
// In a production app, you would use a database
interface VerificationSession {
  sessionId: string;
  status: 'pending' | 'verified' | 'failed';
  timestamp: number;
  userData?: any;
}

const verificationSessions: Record<string, VerificationSession> = {};

// Clean up old sessions (older than 1 hour)
const cleanupSessions = () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  Object.keys(verificationSessions).forEach(sessionId => {
    if (now - verificationSessions[sessionId].timestamp > oneHour) {
      delete verificationSessions[sessionId];
    }
  });
};

// Run cleanup every hour
setInterval(cleanupSessions, 60 * 60 * 1000);

export const createSession = (sessionId: string): VerificationSession => {
  const session: VerificationSession = {
    sessionId,
    status: 'pending',
    timestamp: Date.now(),
  };
  
  verificationSessions[sessionId] = session;
  return session;
};

export const getSession = (sessionId: string): VerificationSession | null => {
  return verificationSessions[sessionId] || null;
};

export const updateSession = (
  sessionId: string, 
  status: 'pending' | 'verified' | 'failed',
  userData?: any
): VerificationSession | null => {
  if (!verificationSessions[sessionId]) {
    return null;
  }
  
  verificationSessions[sessionId] = {
    ...verificationSessions[sessionId],
    status,
    userData,
    timestamp: Date.now(),
  };
  
  return verificationSessions[sessionId];
};

export const deleteSession = (sessionId: string): boolean => {
  if (!verificationSessions[sessionId]) {
    return false;
  }
  
  delete verificationSessions[sessionId];
  return true;
}; 