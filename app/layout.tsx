"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { optimismSepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

import React from "react";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

const zamaDevnet = defineChain({
  id: 8009,
  name: "Zama Network",
  nativeCurrency: { name: "ZAMA", symbol: "ZAMA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://devnet.zama.ai"] },
  },
  blockExplorers: {
    default: { name: "Default Explore", url: "https://main.explorer.zama.ai" },
  },
});

const config = getDefaultConfig({
  appName: "Scaffold",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [zamaDevnet],
  transports: {
    [zamaDevnet.id]: http("https://devnet.zama.ai"),
  },
  ssr: true,
});
const client = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config} reconnectOnMount={true}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>
              <Header />
              <Toaster />
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
