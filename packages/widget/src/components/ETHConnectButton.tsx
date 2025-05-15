// import { AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon } from "@mui/icons-material";
// import { Button, Typography } from "@mui/material";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

// interface ConnectButtonProps {
//   fontFamily: string;
//   borderRadius: number;
// }

// const ETHConnectButton = (props: ConnectButtonProps) => {
//   const { fontFamily, borderRadius } = props;
//   return (
//     <ConnectButton.Custom>
//       {({
//         account,
//         chain,
//         openAccountModal,
//         openChainModal,
//         openConnectModal,
//         authenticationStatus,
//         mounted,
//       }) => {
//         const ready = mounted && authenticationStatus !== "loading";
//         const connected =
//           ready &&
//           account &&
//           chain &&
//           (!authenticationStatus || authenticationStatus === "authenticated");

//         return (
//           <div
//             {...(!ready && {
//               "aria-hidden": true,
//               style: {
//                 opacity: 0,
//                 pointerEvents: "none",
//                 userSelect: "none",
//               },
//             })}
//           >
//             {(() => {
//               if (!connected) {
//                 return (
//                   <>
//                     <Button
//                       variant="contained"
//                       onClick={openConnectModal}
//                       type="button"
//                       sx={{
//                         width: "100%",
//                         "&.MuiButton-root": {
//                           py: 2,
//                           borderRadius: `${borderRadius}px`,
//                           background: "transparent",
//                           height: "40px",
//                           minWidth: "170px",
//                         },
//                       }}
//                     >
//                       <AccountBalanceWalletOutlinedIcon
//                         sx={{ marginRight: 1 }}
//                       />
//                       <Typography
//                         noWrap
//                         sx={{
//                           fontFamily: fontFamily,
//                         }}
//                       >
//                         Connect Wallet
//                       </Typography>
//                     </Button>
//                   </>
//                 );
//               }
//               // if (chain.unsupported) {
//               //   return (
//               //     <Button
//               //       variant="contained"
//               //       // onClick={openConnectModal}
//               //       type="button"
//               //       sx={{
//               //         width: "100%",
//               //         "&.MuiButton-root": {
//               //           py: 2,
//               //           borderRadius: `${borderRadius}px`,
//               //           background: "transparent",
//               //           height: "40px",
//               //           minWidth: "170px",
//               //         },
//               //       }}
//               //     >
//               //       <Typography
//               //         noWrap
//               //         sx={{
//               //           fontFamily: fontFamily,
//               //         }}
//               //       >
//               //         Wrong network
//               //       </Typography>
//               //     </Button>
//               //   );
//               // }

//               return (
//                 <div style={{ display: "flex", gap: 12 }}>
//                   <Button
//                     variant="contained"
//                     onClick={openAccountModal}
//                     type="button"
//                     sx={{
//                       width: "100%",
//                       "&.MuiButton-root": {
//                         py: 2,
//                         borderRadius: `${borderRadius}px`,
//                         height: "40px",
//                         minWidth: "170px",
//                         fontFamily: fontFamily,
//                       },
//                     }}
//                   >
//                     {account.displayName}
//                   </Button>
//                 </div>
//               );
//             })()}
//           </div>
//         );
//       }}
//     </ConnectButton.Custom>
//   );
// };

// export default ETHConnectButton;

"use client";

import React, { useState } from "react";
import { AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useSDK } from "@metamask/sdk-react";

interface ConnectButtonProps {
  fontFamily: string;
  borderRadius: number;
}

const ETHConnectButton = (props: ConnectButtonProps) => {
  const { sdk, connected, account, chainId } = useSDK();

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      try {
        sdk?.connect();
      } catch (err) {
        console.warn(`No accounts found`, err);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <Button
      variant="contained"
      type="button"
      onClick={handleClick}
      sx={{
        width: "100%",
        "&.MuiButton-root": {
          py: 2,
          borderRadius: `${props.borderRadius}px`,
          background: "transparent",
          height: "40px",
          minWidth: "170px",
        },
      }}
    >
      {connected ? (
        <Typography noWrap>{formatAddress(account || "")}</Typography>
      ) : (
        <>
          <AccountBalanceWalletOutlinedIcon sx={{ marginRight: 1 }} />
          <Typography
            noWrap
            sx={{
              fontFamily: `${props.fontFamily}`,
            }}
          >
            Connect Wallet
          </Typography>
        </>
      )}
    </Button>
  );
};

export default ETHConnectButton;
