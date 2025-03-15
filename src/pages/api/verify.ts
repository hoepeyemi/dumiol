import type { NextApiRequest, NextApiResponse } from 'next';
import { verifiedSessions } from '../../utils/verification-store';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract the sessionId from the request body
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    // Mark the session as verified
    verifiedSessions[userId] = true;
    
    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
} 