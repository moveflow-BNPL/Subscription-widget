"use client";

import React, { ReactNode, useEffect, useState, createContext } from "react";
import { Payment } from "../../model/subscription";
import { Types, AptosClient } from "aptos";
import netConfApt from "../../config/aptos/aptos-config";

interface AppContextInterface {
  handleConnect: any;
  handleDisconnect: any;
  createSubscription: (payment: Payment) => Promise<void>; // Add createSubscription method
  address: string | null;
  isConnectedAptos: boolean;
}

interface Props {
  children?: ReactNode;
}

const INTERVALS = {
  day: 1000 * 60 * 60 * 24,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
};

const convertRateTypeToSeconds = (
  rateType: "month" | "day" | "year" | undefined
) => {
  const selectedInterval = INTERVALS[rateType || "day"];

  return selectedInterval ? selectedInterval / 1000 : 0;
};

export const AptosContext = createContext<AppContextInterface | null>(null);

export const AptosContextProvider = ({ children, ...props }: Props) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnectedAptos, setIsconnectedAptos] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string>("");
  console.log("AptosContextProvider: Rendering");

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkIsConnected(wallet);
      setIsconnectedAptos(isConnected);
    };

    checkConnection();
  }, [wallet]);

  const handleDisconnect = async () => {
    try {
      if (wallet === "petra") await window.aptos.disconnect();
      else if (wallet === "martian") await window.martian.disconnect();
      setWallet("");
      checkIsConnected(wallet);
    } catch (e) {
      console.log(e);
    }
  };

  const createSubscription = async (payment: Payment): Promise<void> => {
    try {
      const startTimeStr = BigInt(payment.startTime).toString();
      const stopTimeStr = BigInt(payment.endTime).toString();

      if (payment.endTime <= payment.startTime) {
        throw new Error("Stop time must be greater than start time");
      }

      const decimal = 8;
      const depositAmount =
        payment.amountType === "fixed"
          ? BigInt(payment.streamRate! * 10 ** Number(decimal))
          : BigInt(payment.depositAmount! * 10 ** Number(decimal));

      const transaction: Types.TransactionPayload_EntryFunctionPayload = {
        type: "entry_function_payload",
        function: `${netConfApt.contract}::subscription::create`,
        arguments: [
          payment.receiver,
          depositAmount.toString(),
          startTimeStr,
          stopTimeStr,
          convertRateTypeToSeconds(payment.rateType),
          payment.amountType === "fixed" ? "10000000" : "0",
        ],
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
      };

      const res = await window.aptos.signAndSubmitTransaction(transaction);

      console.log(res.hash);
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  };

  const handleConnect = async (wallet: string) => {
    try {
      if (wallet === "petra") {
        await window.aptos.connect();
      } else if (wallet === "martian") {
        await window.martian.connect();
      }

      setWallet(wallet);

      // Wait for the connection status to be checked
      const isConnected = await checkIsConnected(wallet);

      // Ensure that isConnected is correctly set
      console.log("isConnected after connection:", isConnected);
    } catch (e) {
      console.log(e);
    }
  };

  const checkIsConnected = async (wallet: string): Promise<boolean> => {
    try {
      let isConnectedAptos;
      if (wallet === "petra") {
        isConnectedAptos = await window.aptos.isConnected();
        setIsconnectedAptos(isConnectedAptos);
      } else if (wallet === "martian") {
        isConnectedAptos = await window.martian.isConnected();
        setIsconnectedAptos(isConnectedAptos);
      }
      return isConnectedAptos;
    } catch (error) {
      console.error("Error checking connection:", error);
      setIsconnectedAptos(false); // Set isConnectedAptos to false in case of an error
      return false;
    }
  };

  useEffect(() => {
    if (isConnectedAptos && wallet === "petra") {
      window?.aptos.account().then((data: any) => {
        setAddress(data.address);
      });
    } else if (isConnectedAptos && wallet === "martian") {
      window?.martian.account().then((data: any) => {
        setAddress(data.address);
      });
    } else {
      setAddress(null);
    }
  }, [isConnectedAptos, wallet]);

  const datacontext: AppContextInterface = {
    handleConnect: handleConnect,
    handleDisconnect: handleDisconnect,
    createSubscription: createSubscription,
    address: address,
    isConnectedAptos: isConnectedAptos,
  };

  return (
    <AptosContext.Provider value={datacontext}>
      {children}
    </AptosContext.Provider>
  );
};
