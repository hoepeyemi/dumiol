// @ts-ignore - Skip type checking for Chakra UI imports
import { Box, Flex, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

export function Navigation() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box as="nav" bg={bgColor} boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto" px={4}>
        <NextLink href="/" passHref>
          <Button as="a" variant="ghost" fontWeight="bold" fontSize="lg">
            Core Battle Arena
          </Button>
        </NextLink>

        <HStack spacing={4}>
          <NextLink href="/battles" passHref>
            <Button as="a" variant="ghost" colorScheme={router.pathname === '/battles' ? 'blue' : undefined}>
              Battles
            </Button>
          </NextLink>
          
          {isConnected && (
            <NextLink href="/profile" passHref>
              <Button as="a" variant="ghost" colorScheme={router.pathname === '/profile' ? 'blue' : undefined}>
                Profile
              </Button>
            </NextLink>
          )}
          
          <ConnectButton />
        </HStack>
      </Flex>
    </Box>
  );
} 