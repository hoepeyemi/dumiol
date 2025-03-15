import type { NextApiRequest, NextApiResponse } from 'next';

// Import the shared verifiedSessions object
// In a production app, you would use a database
import { verifiedSessions } from '../../utils/verification-store';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid sessionId' });
    }

    // Check if the session has been verified
    const isVerified = verifiedSessions[sessionId] || false;

    return res.status(200).json({ verified: isVerified });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ error: 'Status check failed' });
  }
} 