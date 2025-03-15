// @ts-nocheck - Skip all type checking for this file
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface VerificationContextType {
  isVerified: boolean;
  setVerified: (value: boolean) => void;
  showVerification: boolean;
  setShowVerification: (value: boolean) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // Check if the user is already verified from cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVerification = Cookies.get('selfVerified');
      if (storedVerification === 'true') {
        setIsVerified(true);
      }
    }
  }, []);

  // Store verification status in cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVerified) {
        // Set cookie with 7-day expiration
        Cookies.set('selfVerified', 'true', { expires: 7, sameSite: 'strict' });
      } else {
        Cookies.remove('selfVerified');
      }
    }
  }, [isVerified]);

  const setVerified = (value: boolean) => {
    setIsVerified(value);
  };

  return (
    <VerificationContext.Provider
      value={{
        isVerified,
        setVerified,
        showVerification,
        setShowVerification,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = (): VerificationContextType => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}; 