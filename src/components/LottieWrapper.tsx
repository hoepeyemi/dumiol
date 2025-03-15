// @ts-nocheck - Skip all type checking for this file
'use client';

import React, { useEffect, useRef } from 'react';
import ClientOnly from './ClientOnly';

// This component safely loads lottie-web only on the client side
export default function LottieWrapper({ animationData, loop = true, autoplay = true, ...props }) {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Only import lottie-web on the client side
    const loadLottie = async () => {
      try {
        // Dynamic import to ensure it only runs on the client
        const lottie = (await import('lottie-web')).default;
        
        if (containerRef.current) {
          // Destroy any existing animation
          if (animationRef.current) {
            animationRef.current.destroy();
          }
          
          // Create new animation
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop,
            autoplay,
            animationData,
          });
        }
      } catch (error) {
        console.error('Failed to load lottie animation:', error);
      }
    };

    loadLottie();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay]);

  return (
    <ClientOnly>
      <div ref={containerRef} {...props} />
    </ClientOnly>
  );
} 