// @ts-nocheck - Skip all type checking for this file
import { useEffect } from 'react';
import { Box, Text, Flex, Badge } from '@chakra-ui/react';
import { useVerification } from '../hooks/useVerification';
import { VerificationButton } from './VerificationButton';

interface ProfileVerificationProps {
  userId: string;
}

export function ProfileVerification({ userId }: ProfileVerificationProps) {
  const { isVerified, checkVerificationStatus } = useVerification();

  useEffect(() => {
    checkVerificationStatus();
  }, [checkVerificationStatus, userId]);

  return (
    <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text fontWeight="bold">Verification Status</Text>
          <Flex alignItems="center" mt={1}>
            <Text>Self Protocol:</Text>
            {isVerified ? (
              <Badge ml={2} colorScheme="green">Verified</Badge>
            ) : (
              <Badge ml={2} colorScheme="red">Not Verified</Badge>
            )}
          </Flex>
        </Box>
        {!isVerified && <VerificationButton />}
      </Flex>
    </Box>
  );
} 