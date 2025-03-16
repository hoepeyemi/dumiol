import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/selfVerification';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session ID from the query parameters
    const { sessionId } = req.query;

    if (!sessionId || Array.isArray(sessionId)) {
      return res.status(400).json({ error: 'Invalid sessionId' });
    }

    // Get the session
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Return the session status
    return res.status(200).json({
      status: session.status,
      timestamp: session.timestamp,
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 