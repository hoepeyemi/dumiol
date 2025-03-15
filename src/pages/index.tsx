// @ts-nocheck - Skip all type checking for this file
'use client';

import type { NextPage } from "next";
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useNetworkInfo } from '../hooks/useNetworkInfo';
import { useVerification } from '../contexts/VerificationContext';
import SelfVerification from '../components/SelfVerification';

import Link from "next/link";
import { Gamepad2, Wallet, Sword, ScrollText, Shield, Coins, Trophy, Users } from 'lucide-react';
import Head from "next/head";

const Home: NextPage = () => {
    const { isConnected } = useAccount();
    const { connect } = useConnect();
    const { tokenSymbol } = useNetworkInfo();
    const { isVerified, setVerified, showVerification, setShowVerification } = useVerification();

    const handleVerificationComplete = () => {
      setVerified(true);
      setShowVerification(false);
    };

    const handleConnectWallet = () => {
      if (isVerified) {
        connect({ connector: injected() });
      } else {
        setShowVerification(true);
      }
    };

  return (
    <>
      <Head>
        <title>Blockchain Rock Paper Scissors</title>
        <meta
          name='description'
          content='Challenge players worldwide in the ultimate game of strategy'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-col items-center space-y-8 text-white'>
        <div className='space-y-8'>
          {/* Hero Section */}
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold text-white'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                BATTLE OF ELEMENTS
              </span>
            </h1>
            <p className='text-gray-300 text-lg'>
              Challenge opponents in the ultimate Rock-Paper-Scissors arena on Core Network!
            </p>
          </div>

          {/* Features */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1'>
              <div className='flex items-center space-x-3 mb-2'>
                <Coins className='w-6 h-6 text-yellow-400 animate-pulse' />
                <h2 className='text-xl font-semibold text-white'>Stake {tokenSymbol}</h2>
              </div>
              <p className='text-gray-400'>Bet your {tokenSymbol} tokens and win big in thrilling battles!</p>
            </div>

            <div className='bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1'>
              <div className='flex items-center space-x-3 mb-2'>
                <Trophy className='w-6 h-6 text-purple-400 animate-pulse' />
                <h2 className='text-xl font-semibold text-white'>Win Rewards</h2>
              </div>
              <p className='text-gray-400'>Dominate your opponents and claim victory rewards!</p>
            </div>
          </div>

          {/* Self Verification Component */}
          {showVerification && (
            <div className="mt-4">
              <SelfVerification onVerificationComplete={handleVerificationComplete} />
            </div>
          )}

          {/* CTA Button */}
          <div className='pt-4'>
            {!isConnected ? (
              <button
                onClick={handleConnectWallet}
                className='bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg w-full flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1'
              >
                <Users className='w-5 h-5' />
                <span>{isVerified ? 'CONNECT WALLET TO BATTLE' : 'VERIFY IDENTITY TO BATTLE'}</span>
              </button>
            ) : (
              <Link
                href='/game'
                className='bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg w-full flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1'
              >
                <Gamepad2 className='w-5 h-5' />
                <span>ENTER THE ARENA</span>
              </Link>
            )}
          </div>

          {/* Additional Info */}
          <div className='text-center text-gray-400 text-sm'>
            <p>Powered by Core Network | Battle with ⚔️ on the blockchain</p>
            <p className="mt-2">
              <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs">
                Protected by Self Protocol ZK Verification
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
