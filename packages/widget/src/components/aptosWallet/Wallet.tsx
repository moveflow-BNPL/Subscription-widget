"use client";

declare global {
  interface Window {
    aptos: any;
    martian: any;
  }
}

import React, { useState, useContext } from "react";
import { AptosContext } from "./AptosContext";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon } from "@mui/icons-material";

interface AptosWalletProps {
  children?: React.ReactNode;
}

export default function Wallet({ children }: AptosWalletProps) {
  const aptosContext = useContext(AptosContext);
  const { address, handleDisconnect, handleConnect, isConnectedAptos } =
    aptosContext || {};
  const [openWallet, setOpenWallet] = useState(false);

  const handleClickOpenWallet = () => setOpenWallet(true);
  const handleCloseWallet = () => setOpenWallet(false);

  const petraHandleConnect = async () => {
    handleConnect && (await handleConnect("petra"));
    handleCloseWallet();
  };

  const isHandleDisconnect = async () => {
    try {
      if (handleDisconnect) {
        await handleDisconnect();
        console.log("wallet disconnected");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  // Feature detection to check if window.aptos is present
  let isAptosAvailable = false;
  if(typeof window !== 'undefined'){
    isAptosAvailable = !!window.aptos;
  }

  return (
    <Box>
      <Dialog open={openWallet} onClose={handleCloseWallet}>
        <DialogTitle
          sx={{
            textAlign: "center",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          <span>Connect Wallet</span>
        </DialogTitle>
        <DialogContent>
          {isAptosAvailable ? (
            <Box
              onClick={petraHandleConnect}
              display="flex"
              flexDirection="row"
              alignItems="center"
              width="100%"
              sx={{
                background: "#272b2a",
                width: "370px",
                justifyContent: "space-between",
                borderRadius: "8px",
                p: "12px",
                cursor: "pointer",
              }}
            >
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  width={30}
                  height={30}
                  src="https://arthuremma2.github.io/img-hosting/petra-bg.png"
                  alt=""
                  sx={{ marginLeft: "5px", marginRight: "10px" }}
                />
                <Typography
                  variant="body1"
                  sx={{ margin: 0, fontSize: "20px" }}
                >
                  Petra
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={petraHandleConnect}
                type="button"
                sx={{
                  "&.MuiButton-root": {
                    py: 2,
                    height: "40px",
                    minWidth: "100px",
                  },
                }}
              >
                Connect
              </Button>
            </Box>
          ) : (
            <Typography variant="body1">
              Petra Wallet extension is not detected.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {isConnectedAptos ? (
        <Button
          type="button"
          variant="contained"
          sx={{
            "&.MuiButton-root": {
              py: 2,
              height: "40px",
              width: "100%",
              marginBottom: 0,
              color: "#ffff",
              boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.3)",
              fontSize: "16.5px",
            },
          }}
          onClick={isHandleDisconnect}
        >
          <Box
            sx={{
              marginTop: "7px",
              marginRight: "8px",
            }}
          >
            <img
              width={20}
              height={20}
              src="https://arthuremma2.github.io/img-hosting/petra-bg.png"
              alt=""
            />
          </Box>
          {address?.slice(0, 4) + "..." + address?.slice(-4)}
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{
            width: "100%",
            "&.MuiButton-root": {
              py: 2,
              background: "transparent",
              height: "40px",
              minWidth: "170px",
              fontSize: "16.5px",
              marginBottom: 0,
              color: "#ffff",
              boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.3)",
            },
          }}
          onClick={() => handleClickOpenWallet()}
        >
          <AccountBalanceWalletOutlinedIcon sx={{ marginRight: 1 }} /> Connect
          Wallet
        </Button>
      )}

      <Box flexGrow={1} p={2}>
        {children}
      </Box>
    </Box>
  );
}
