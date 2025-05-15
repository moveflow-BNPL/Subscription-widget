"use client";
import React, { useState, useEffect, useContext } from "react";
import { Button, Typography } from "@mui/material";
import { Payment } from "../model/subscription";
import { AptosContext } from "./aptosWallet/AptosContext"; // Update the path to match your actual file structure

interface SubscriptionProps {
  payment: Payment;
  primaryColor: string;
  fontFamily: string;
  borderRadius: number;
}

const SubscriptionButtonAptos: React.FC<SubscriptionProps> = (props) => {
  const { primaryColor, fontFamily, borderRadius } = props;
  const aptosContext = useContext(AptosContext);
  const { createSubscription, isConnectedAptos } = aptosContext || {};

  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const isButtonDisabled =
    subscriptionStatus === "success" || !isConnectedAptos;

  let buttonText;

  if (!isConnectedAptos) {
    buttonText = "Insufficient Balance";
  } else {
    switch (subscriptionStatus) {
      case "loading":
        buttonText = "Loading...";
        break;
      case "success":
        buttonText = "Subscription Successfully Created";
        break;
      case "error":
        buttonText = "Create Subscription";
        break;
      default:
        buttonText = "Create Subscription";
        break;
    }
  }

  const handleButtonClick = async () => {
    // Check if createSubscription is available in the context and wallet is connected
    if (aptosContext?.createSubscription && isConnectedAptos) {
      setSubscriptionStatus("loading");
      try {
        // Wait for the subscription creation to complete
        await createSubscription!(props.payment);
        setSubscriptionStatus("success");
      } catch (error) {
        console.error("Error creating subscription:", error);
        setSubscriptionStatus("error");
      }
    }
  };

  useEffect(() => {
    // Reset subscription status when payment props change
    setSubscriptionStatus("idle");
  }, [props.payment]);

  return (
    <Button
      variant="contained"
      sx={{
        "&.MuiButton-root": {
          width: "100%",
          borderRadius: `${borderRadius}px`,
          background: primaryColor,
          color: "white",
          fontFamily: fontFamily,
          pointerEvents: isButtonDisabled ? "none" : "auto",
        },
      }}
      onClick={handleButtonClick}
    >
      <Typography
        sx={{
          fontFamily: fontFamily,
          color: !isConnectedAptos ? "rgb(245,124,235)" : "white",
        }}
      >
        {buttonText}
      </Typography>
    </Button>
  );
};

export default SubscriptionButtonAptos;

// "use client";
// import React, { useState, useEffect } from "react";
// import { Button, Typography } from "@mui/material";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { AptosClient, CoinClient, Types } from "aptos";
// import netConfApt from "../config/aptos/aptos-config";
// import { Payment } from "../model/subscription";

// const INTERVALS = {
//   day: 1000 * 60 * 60 * 24,
//   month: 1000 * 60 * 60 * 24 * 30,
//   year: 1000 * 60 * 60 * 24 * 365,
// };

// const convertRateTypeToSeconds = (
//   rateType: "month" | "day" | "year" | undefined
// ) => {
//   const selectedInterval = INTERVALS[rateType || "day"];

//   return selectedInterval ? selectedInterval / 1000 : 0;
// };

// interface SubscriptionProps {
//   payment: Payment;
//   primaryColor: string;
//   fontFamily: string;
//   borderRadius: number;
// }

// const SubscriptionButtonAptos: React.FC<SubscriptionProps> = (props) => {
//   const { payment, primaryColor, fontFamily, borderRadius } = props;
//   const { signAndSubmitTransaction, account } = useWallet();

//   const aptosClient = new AptosClient(netConfApt.fullNodeUrl);

//   const [subscriptionStatus, setSubscriptionStatus] = useState<
//     "idle" | "loading" | "success" | "error"
//   >("idle");
//   const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
//   const [deposit, setDeposit] = useState<bigint>(BigInt(0));

//   useEffect(() => {
//     const fetchUserBalance = async () => {
//       const coinType = "0x1::aptos_coin::AptosCoin";
//       const userAccount = account?.address;
//       const coinClient = new CoinClient(aptosClient);

//       try {
//         const balance = await coinClient.checkBalance(userAccount!, {
//           coinType,
//         });
//         setUserBalance(balance);

//         const decimal = 6;
//         const depositAmount =
//           payment.amountType === "fixed"
//             ? BigInt(payment.streamRate! * 10 ** Number(decimal))
//             : BigInt(payment.depositAmount! * 10 ** Number(decimal));

//         setDeposit(depositAmount);
//       } catch (error) {
//         console.error("Error fetching user balance:", error);
//       }
//     };

//     fetchUserBalance();
//   }, [account, payment]);

//   useEffect(() => {
//     setSubscriptionStatus("idle");
//   }, [payment]);

//   const createSubscription = async () => {
//     try {
//       setSubscriptionStatus("loading");

//       const startTimeStr = BigInt(payment.startTime).toString();
//       const stopTimeStr = BigInt(payment.endTime).toString();

//       if (payment.endTime <= payment.startTime) {
//         throw new Error("Stop time must be greater than start time");
//       }

//       if (userBalance < deposit) {
//         setSubscriptionStatus("error");
//         return;
//       }

//       const transaction: Types.TransactionPayload_EntryFunctionPayload = {
//         type: "entry_function_payload",
//         function: `${netConfApt.contract}::subscription::create`,
//         arguments: [
//           payment.receiver,
//           deposit.toString(),
//           startTimeStr,
//           stopTimeStr,
//           convertRateTypeToSeconds(payment.rateType),
//           payment.amountType === "fixed" ? "10000000" : "0",
//         ],
//         type_arguments: ["0x1::aptos_coin::AptosCoin"],
//       };

//       const res = await signAndSubmitTransaction(transaction);
//       aptosClient.waitForTransaction(res.hash);
//       console.log(res.hash);
//       setSubscriptionStatus("success");
//     } catch (error) {
//       console.error("Error creating subscription:", error);
//       setSubscriptionStatus("error");
//     }
//   };

//   const isButtonDisabled =
//     subscriptionStatus === "success" || userBalance < deposit;

//   let buttonText;

//   switch (subscriptionStatus) {
//     case "loading":
//       buttonText = "Loading...";
//       break;
//     case "success":
//       buttonText = "Subscription Created Successfully!";
//       break;
//     default:
//       buttonText =
//         userBalance < deposit ? (
//           <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
//             Insufficient Balance
//           </span>
//         ) : (
//           "Create Subscription"
//         );
//       break;
//   }

//   useEffect(() => {
//     if (subscriptionStatus === "success") {
//       console.log("Subscription is successful!");
//     }
//   }, [subscriptionStatus]);

//   return (
//     <Button
//       variant="contained"
//       sx={{
//         "&.MuiButton-root": {
//           width: "100%",
//           borderRadius: `${borderRadius}px`,
//           background: primaryColor,
//           color: isButtonDisabled ? "red" : "white",
//           fontFamily: fontFamily,
//         },
//       }}
//       onClick={() => !isButtonDisabled && createSubscription()}
//       disabled={isButtonDisabled}
//     >
//       <Typography sx={{ fontFamily: fontFamily }}>{buttonText}</Typography>
//     </Button>
//   );
// };

// export default SubscriptionButtonAptos;
