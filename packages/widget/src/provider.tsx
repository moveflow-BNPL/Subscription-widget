"use client";

import { ThemeProvider } from "@mui/material";
import darkTheme from "./config/theme.js";

import { goerli, sepolia } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosContextProvider } from "./components/aptosWallet/AptosContext.js";
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";

const host =
  typeof window !== "undefined" ? window.location.host : "defaultHost";

const sdkOptions = {
  logging: { developerMode: false },
  checkInstallationImmediately: false,
  dappMetadata: {
    name: "Next-Metamask-Boilerplate",
    url: host, // using the host constant defined above
  },
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
        <AptosContextProvider>{children}</AptosContextProvider>
      </MetaMaskProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
