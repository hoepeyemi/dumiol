'use client';

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { Loader2, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

interface SelfVerificationProps {
  onVerificationComplete: () => void;
}

const SelfVerification: React.FC<SelfVerificationProps> = ({ 
  onVerificationComplete 
}) => {
  const [userId, setUserId] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate a unique user ID
    setUserId(uuidv4());
    setIsLoading(false);
  }, []);

  // Poll for verification status
  useEffect(() => {
    if (!userId) return;

    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/self/status?userId=${userId}`);
        const data = await response.json();
        
        if (data.status === 'verified') {
          clearInterval(checkInterval);
          setVerificationStatus('success');
          toast.success('Identity verified successfully!');
          onVerificationComplete();
        } else if (data.status === 'failed') {
          clearInterval(checkInterval);
          setVerificationStatus('failed');
          toast.error('Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 3000); // Check every 3 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(checkInterval);
  }, [userId, onVerificationComplete]);

  // Create a SelfApp instance using SelfAppBuilder
  const getSelfApp = () => {
    if (!userId) return null;
    
    return new SelfAppBuilder({
      appName: "Core Battle Arena",
      scope: "core-battle-arena",
      endpoint: `${window.location.origin}/api/self/callback`,
      userId,
      // Optional disclosure requirements
      disclosures: {
        // Request basic identity verification
        name: true,
        date_of_birth: true,
        // Set verification rules
        minimumAge: 18,
      },
    }).build();
  };

  const handleSuccess = () => {
    // The status polling will handle the success state
    console.log('QR code scanned successfully');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-300">Initializing verification...</p>
      </div>
    );
  }

  const selfApp = getSelfApp();
  if (!selfApp) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-300">Failed to initialize verification. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Verify Your Identity</h2>
      <p className="text-gray-300 mb-6 text-center">
        Scan the QR code with the Self app to verify your identity before connecting your wallet.
      </p>
      
      {verificationStatus === 'pending' ? (
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg mb-4">
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={handleSuccess}
              size={250}
              darkMode={false}
            />
          </div>
          <div className="flex items-center text-yellow-400 mt-2">
            <Smartphone className="w-5 h-5 mr-2" />
            <p>Waiting for verification...</p>
          </div>
        </div>
      ) : verificationStatus === 'success' ? (
        <div className="flex flex-col items-center justify-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-green-400 font-semibold">Identity verified successfully!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-red-400 font-semibold">Verification failed. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-400">
        <p>Don't have the Self app?</p>
        <a 
          href="https://self.xyz/download" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Download it here
        </a>
      </div>
    </div>
  );
};

export default SelfVerification; 