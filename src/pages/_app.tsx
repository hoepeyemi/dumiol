// @ts-nocheck - Skip all type checking for this file
'use client';

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import dynamic from 'next/dynamic';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { VerificationProvider } from "../contexts/VerificationContext";

// Dynamically import Layout with no SSR to avoid lottie-web issues
const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider modalSize="wide">
          <VerificationProvider>
            <Toaster position='top-right' reverseOrder={false} />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </VerificationProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
