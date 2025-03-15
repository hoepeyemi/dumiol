// @ts-nocheck - Skip all type checking for this file
import { useEffect } from 'react';
import { Button } from '../mocks/chakra-ui-mock';
import { useVerification } from '../hooks/useVerification';

export function VerificationButton() {
  const { verify, isVerifying, isVerified, error, checkVerificationStatus } = useVerification();

  useEffect(() => {
    // Check verification status when component mounts
    checkVerificationStatus();
  }, [checkVerificationStatus]);

  if (isVerified) {
    return (
      <Button colorScheme="green" isDisabled>
        Verified ✓
      </Button>
    );
  }

  return (
    <Button
      colorScheme={error ? 'red' : 'blue'}
      onClick={verify}
      isLoading={isVerifying}
      loadingText="Verifying..."
    >
      {error ? 'Verification Failed' : 'Verify with Self Protocol'}
    </Button>
  );
} 