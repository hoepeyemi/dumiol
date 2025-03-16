import { NextApiRequest, NextApiResponse } from 'next';
import { SelfBackendVerifier } from '@selfxyz/core';
import { updateSession, getSession } from '../../../utils/selfVerification';

// Initialize Self with your app ID
const selfBackendVerifier = new SelfBackendVerifier(
  'https://forno.celo.org', // Celo RPC url
  'app_id_from_self_dashboard' // Replace with your actual app ID from Self dashboard
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session ID and attestation from the request body
    const { sessionId, attestation } = req.body;

    if (!sessionId || !attestation) {
      return res.status(400).json({ error: 'Missing sessionId or attestation' });
    }

    // Check if the session exists
    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify the attestation
    const verificationResult = await selfBackendVerifier.verify(attestation.proof, attestation.publicSignals);

    if (verificationResult.isValid) {
      // Update the session status to verified
      updateSession(sessionId, 'verified', verificationResult.credentialSubject);
      return res.status(200).json({ status: 'success' });
    } else {
      // Update the session status to failed
      updateSession(sessionId, 'failed');
      return res.status(400).json({ error: 'Verification failed' });
    }
  } catch (error) {
    console.error('Error verifying attestation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 