// @ts-nocheck - Skip all type checking for this file
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'; // Import useRouter
import { Home, GamepadIcon, History, ShieldCheck } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast'; 
import Image from 'next/image';
import { useConnect, useDisconnect } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { ConnectButton, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { argentWallet, coinbaseWallet, imTokenWallet, injectedWallet, ledgerWallet, metaMaskWallet, omniWallet, rainbowWallet, trustWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { useNetworkInfo } from '../hooks/useNetworkInfo';
import { useVerification } from '../contexts/VerificationContext';
import SelfVerification from './SelfVerification';

import '@rainbow-me/rainbowkit/styles.css';

// import { configureChains, createConfig, WagmiConfig } from 'wagmi';
// import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';


const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    path: '/game',
    label: 'Game',
    icon: GamepadIcon,
  },
  {
    path: '/history',
    label: 'History',
    icon: History,
  },
];

// Custom ConnectButton that checks for verification first
const CustomConnectButton = () => {
  const { isVerified, setShowVerification } = useVerification();
  
  const handleConnectClick = () => {
    if (!isVerified) {
      setShowVerification(true);
      toast.error('Please verify your identity before connecting your wallet', {
        icon: '🔒',
      });
      return false; // Prevent the default connect behavior
    }
    return true; // Allow the default connect behavior
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={() => {
                      if (handleConnectClick()) {
                        openConnectModal();
                      }
                    }}
                    type="button"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {isVerified ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Connect Wallet
                      </>
                    ) : (
                      <>
                        Connect Wallet
                      </>
                    )}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const router = useRouter(); // Initialize useRouter
  const { 
    chainId, 
    isMainnet, 
    isTestnet, 
    networkName, 
    networkClass, 
    tokenSymbol, 
    isMounted 
  } = useNetworkInfo();
  const { isVerified, showVerification, setShowVerification, setVerified } = useVerification();

  // Show a toast notification when network changes
  useEffect(() => {
    // Only run in browser environment
    if (isMounted && chainId) {
      if (isMainnet || isTestnet) {
        toast.success(`Connected to ${networkName} (${tokenSymbol})`, {
          icon: '🌐',
          id: 'network-change',
        });
      } else {
        toast.error(`Connected to unsupported network. Please switch to Core Mainnet or Core Testnet.`, {
          icon: '⚠️',
          id: 'network-change',
          duration: 5000,
        });
      }
    }
  }, [chainId, networkName, isMounted, isMainnet, isTestnet, tokenSymbol]);

  const handleVerificationComplete = () => {
    setVerified(true);
    setShowVerification(false);
    toast.success('Identity verified! You can now connect your wallet.', {
      icon: '✅',
    });
  };

  const handleLinkClick = (path: string) => {
    if (!isConnected && path !== '/') {
      if (!isVerified) {
        setShowVerification(true);
        toast.error('Please verify your identity before connecting your wallet', {
          icon: '🔒',
        });
      } else {
        toast.error('Please connect your wallet to access this feature.', {
          icon: '🔑',
        });
      }
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-800'>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 h-14 bg-gray-900 shadow-lg z-50'>
        <div className='flex items-center justify-between h-full px-4'>
          <div className="flex items-center">
            <Image
              src='/rps-img.webp'
              alt='Rock Paper scissor'
              width={40}
              height={40}
              className='mr-2 animate-pulse hover:animate-spin'
            />
            <span className="text-gradient font-bold text-lg">CORE BATTLE ARENA</span>
          </div>
          <div className="flex items-center gap-3">
            {isMounted && isConnected && (
              <div className={`text-xs px-2 py-1 rounded-full ${networkClass}`}>
                {networkName} ({tokenSymbol})
              </div>
            )}
            {isVerified && (
              <div className="text-xs px-2 py-1 rounded-full bg-green-900/50 text-green-400">
                <ShieldCheck className="w-3 h-3 inline mr-1" />
                Verified
              </div>
            )}
            <CustomConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mt-14 mb-16 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800'>
        {showVerification ? (
          <div className='container mx-auto px-4 py-6 max-w-lg'>
            <SelfVerification onVerificationComplete={handleVerificationComplete} />
          </div>
        ) : (
          <div className='container mx-auto px-4 py-6 max-w-lg'>{children}</div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className='fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-700 shadow-lg'>
        <nav className='h-full'>
          <ul className='flex items-center justify-around h-full'>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive =
                pathname === path ||
                (path === '/game' && router.asPath.startsWith('/game'));
              return (
                <li key={path} className='flex-1'>
                  <Link
                    href={isConnected || path === '/' ? path : '#'}
                    onClick={() => handleLinkClick(path)}
                    className={`flex flex-col items-center justify-center h-full transition-all duration-200 ${
                      isActive
                        ? 'text-blue-400 scale-110'
                        : 'text-gray-400 hover:text-white hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className='text-xs mt-1'>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
