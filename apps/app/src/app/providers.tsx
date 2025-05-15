"use client";

import { ThemeProvider } from "@mui/material";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import {baseGoerli, goerli, sepolia} from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import darkTheme from "../styles/theme";

if (!process.env.INFURA_ID) {
  throw new Error("You need to provide WALLET_CONNECT_PROJECT_ID env variable");
}

// Ethereum Provider Setup
const { chains, publicClient } = configureChains(
  [goerli],
  [infuraProvider({ apiKey: process.env.INFURA_ID! })]
);

const { connectors } = getDefaultWallets({
  appName: "MoveFlow Subscription",
  projectId: process.env.WALLET_CONNECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={rainbowDarkTheme()}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
};

export default AppProvider;
