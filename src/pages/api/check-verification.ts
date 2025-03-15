// @ts-nocheck - Skip all type checking for this file
import type { NextApiRequest, NextApiResponse } from 'next';
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
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ error: 'Invalid userId parameter' });
    }

    // Check if the user is verified
    const isVerified = !!verifiedSessions[userId];
    
    return res.status(200).json({ verified: isVerified });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return res.status(500).json({ error: 'Server error' });
  }
} 