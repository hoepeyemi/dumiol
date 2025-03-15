// @ts-nocheck - Skip all type checking for this file
import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';

export function useVerification() {
  const { address } = useAccount();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // In a real implementation, this would integrate with Self Protocol
      // For now, we'll simulate a successful verification
      const response = await axios.post('/api/verify', {
        userId: address,
      });

      if (response.data.success) {
        setIsVerified(true);
      } else {
        setError('Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Error during verification process');
    } finally {
      setIsVerifying(false);
    }
  }, [address]);

  const checkVerificationStatus = useCallback(async () => {
    if (!address) return;

    try {
      const response = await axios.get(`/api/check-verification?userId=${address}`);
      setIsVerified(response.data.verified);
    } catch (err) {
      console.error('Error checking verification status:', err);
    }
  }, [address]);

  return {
    verify,
    isVerifying,
    isVerified,
    error,
    checkVerificationStatus,
  };
} 