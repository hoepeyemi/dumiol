import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
  Avatar,
  Button,
} from '@chakra-ui/react';
import { ProfileVerification } from '../components/ProfileVerification';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Profile() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // If not connected, redirect to home after a short delay
    if (!isConnected) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Heading>Profile</Heading>
          <Text>Please connect your wallet to view your profile</Text>
          <ConnectButton />
          <Text>Redirecting to home page...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading>Your Profile</Heading>
        
        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Flex direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
            <Avatar size="xl" name={address} mb={{ base: 4, md: 0 }} />
            <Box ml={{ md: 6 }}>
              <Heading size="md">Wallet Address</Heading>
              <Text mt={2} fontSize="sm" fontFamily="monospace">
                {address}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Add the verification component */}
        {address && <ProfileVerification userId={address} />}
        
        <Box mt={4}>
          <Button colorScheme="blue" onClick={() => router.push('/battles')}>
            View My Battles
          </Button>
        </Box>
      </VStack>
    </Container>
  );
} 