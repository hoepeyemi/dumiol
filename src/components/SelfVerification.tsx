// @ts-nocheck - Skip all type checking for this file
'use client';
import React, { useEffect, useState } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SelfVerificationProps {
  onVerificationComplete: () => void;
}

const SelfVerification: React.FC<SelfVerificationProps> = ({ onVerificationComplete }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a unique session ID when the component mounts
  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  // Poll the server to check if the verification is complete
  useEffect(() => {
    if (!sessionId || isVerified) return;

    const checkVerificationStatus = async () => {
      try {
        const response = await fetch(`/api/verify-status?sessionId=${sessionId}`);
        const data = await response.json();

        if (data.verified) {
          setIsVerified(true);
          toast.success('Identity verified successfully!');
          onVerificationComplete();
        }
      } catch (err) {
        console.error('Error checking verification status:', err);
      }
    };

    const interval = setInterval(checkVerificationStatus, 3000);
    return () => clearInterval(interval);
  }, [sessionId, isVerified, onVerificationComplete]);

  // Handle manual verification check
  const handleVerifyClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/verify-status?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.verified) {
        setIsVerified(true);
        toast.success('Identity verified successfully!');
        onVerificationComplete();
      } else {
        toast.error('Verification not complete. Please scan the QR code with the Self app.');
      }
    } catch (err) {
      console.error('Error checking verification status:', err);
      setError('Failed to check verification status. Please try again.');
      toast.error('Verification check failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a SelfApp instance using SelfAppBuilder
  const selfApp = sessionId ? new SelfAppBuilder({
    appName: "Core Battle Arena",
    scope: "core-battle-arena",
    endpoint: typeof window !== 'undefined' ? `${window.location.origin}/api/verify` : '',
    userId: sessionId,
    // Optional disclosure requirements
    disclosures: {
      name: true,
      date_of_birth: true,
      minimumAge: 18,
    },
  }).build() : null;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
      <h2 className="text-xl font-bold text-white">Verify Your Identity</h2>
      <p className="text-gray-300 text-center">
        Scan the QR code with the Self app to verify your identity before connecting your wallet.
      </p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white p-4 rounded-lg">
        {sessionId && selfApp ? (
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
              setIsVerified(true);
              onVerificationComplete();
            }}
            size={250}
          />
        ) : (
          <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      <div className="text-sm text-gray-400 text-center">
        <p>1. Download the Self app from the App Store or Google Play</p>
        <p>2. Scan the QR code with the Self app</p>
        <p>3. Complete the verification process</p>
      </div>

      <button
        onClick={handleVerifyClick}
        disabled={isLoading || !sessionId}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2
          ${
            isLoading || !sessionId
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all duration-300'
          }
        `}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span>Check Verification Status</span>
        )}
      </button>

      <a
        href="https://docs.self.xyz/use-self/quickstart"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 text-sm underline"
      >
        Learn more about Self Protocol
      </a>
    </div>
  );
};

export default SelfVerification; 