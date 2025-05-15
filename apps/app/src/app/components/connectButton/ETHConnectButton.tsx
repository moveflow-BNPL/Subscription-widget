"use client";

import { Button, Typography } from "@/lib/mui";
import { AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon } from "@mui/icons-material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ETHConnectButton = () => {
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
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="contained"
                    onClick={openConnectModal}
                    type="button"
                    sx={{
                      width: "100%",
                      "&.MuiButton-root": {
                        py: 2,
                        borderRadius: 2,
                        background: "transparent",
                        height: "40px",
                        minWidth: "170px",
                      },
                    }}
                  >
                    <AccountBalanceWalletOutlinedIcon sx={{ marginRight: 1 }} />
                    <Typography noWrap>Connect Wallet</Typography>
                  </Button>
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
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    variant="contained"
                    onClick={openAccountModal}
                    type="button"
                    sx={{
                      width: "100%",
                      "&.MuiButton-root": {
                        py: 2,
                        borderRadius: 2,
                        height: "40px",
                        minWidth: "170px",
                      },
                    }}
                  >
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ETHConnectButton;
