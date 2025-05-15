// subscriptionUtils.ts
import { ethers, parseUnits } from "ethers";
import { abi as SubscriptionAbi } from "../abis/subscription";
import erc20 from "../abis/erc20.json";
import { Payment } from "../model/subscription";
import { useState } from "react";
import { convertRateTypeToSeconds } from "../helper/rateInSeconds";

interface SubscriptionState {
  isCreatingSubscription: boolean;
  tokensApproved: boolean;
  subscriptionCreated: boolean;
  networkError: string;
}

export const useSubscription = (
  contractAddress: string,
  coinAddress: string,
  decimal: number
) => {
  const [state, setState] = useState<SubscriptionState>({
    isCreatingSubscription: false,
    tokensApproved: false,
    subscriptionCreated: false,
    networkError: "",
  });

  const resetState = () => {
    setState({
      isCreatingSubscription: false,
      tokensApproved: false,
      subscriptionCreated: false,
      networkError: "",
    });
  };

  const handleCreateSubscription = async (
    payment: Payment,
    chainName: string
  ) => {
    setState((prev) => ({ ...prev, isCreatingSubscription: true }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const networkId = await provider.getNetwork();
      const currentBlock = await provider.getBlock("latest");
      const currentTime = currentBlock!.timestamp;

      // Network validation
      const expectedChainId = getChainId(chainName);
      if (networkId.chainId !== expectedChainId) {
        throw new Error(`Please switch to ${chainName} network`);
      }

      // Convert times to seconds and validate
      const startTimeSeconds = Math.floor(payment.startTime);
      const endTimeSeconds = Math.floor(payment.endTime);
      validateTimestamps(startTimeSeconds, endTimeSeconds, currentTime);

      // Approve tokens (without allowance check)
      await approveTokens(
        signer,
        contractAddress,
        coinAddress,
        payment,
        decimal
      );

      // Create subscription
      await createSubscription(
        signer,
        contractAddress,
        coinAddress,
        payment,
        decimal,
        startTimeSeconds,
        endTimeSeconds
      );
    } catch (error) {
      handleSubscriptionError(error);
    } finally {
      setState((prev) => ({ ...prev, isCreatingSubscription: false }));
    }
  };

  const getChainId = (chainName: string): bigint => {
    switch (chainName) {
      case "Viction":
        return BigInt(89);
      case "Lightlink":
        return BigInt(1891);
      case "Pharos":
        return BigInt(50002);
      case "Goerli":
        return BigInt(5);
      default:
        throw new Error(`Unsupported chain: ${chainName}`);
    }
  };

  const validateTimestamps = (start: number, end: number, current: number) => {
    if (start <= current) {
      throw new Error("Start time must be in the future");
    }
    if (end <= start) {
      throw new Error("End time must be after start time");
    }
    if (end - start < 86400) {
      throw new Error("Subscription duration must be at least 1 day");
    }
  };

  const approveTokens = async (
    signer: ethers.Signer,
    contractAddress: string,
    coinAddress: string,
    payment: Payment,
    decimal: number
  ) => {
    const tokenContract = new ethers.Contract(coinAddress, erc20, signer);
    try {
      const approvalTx = await tokenContract.approve(
        contractAddress,
        ethers.parseUnits("99", 6),
        { gasLimit: 100000 } // Fixed gas limit for approval
      );

      setState((prev) => ({ ...prev, txHash: approvalTx.hash }));
      const receipt = await approvalTx.wait();

      if (receipt.status !== 1) {
        throw new Error("Token approval failed");
      }
    } catch (error: any) {
      console.error("Approval error:", error);
      throw new Error(`Token approval failed: ${error.message}`);
    }
  };

  const createSubscription = async (
    signer: ethers.Signer,
    contractAddress: string,
    coinAddress: string,
    payment: Payment,
    decimal: number,
    startTimeSeconds: number,
    endTimeSeconds: number
  ) => {
    const contract = new ethers.Contract(
      contractAddress,
      SubscriptionAbi,
      signer
    );

    const deposit = BigInt(
      parseUnits(
        payment.amountType === "fixed"
          ? payment.streamRate!.toString()
          : payment.depositAmount!.toString(),
        decimal
      ).toString()
    );
    try {
      const args = [
        payment.receiver,
        deposit,
        coinAddress,
        startTimeSeconds,
        endTimeSeconds,
        convertRateTypeToSeconds(payment.rateType),
        payment.amountType === "fixed" ? 0 : 0,
      ];

      console.log("args", args);
      console.log("args", args);
      // Get gas estimate first
      const estimatedGas = await contract
        .getFunction("createSubscription")
        .estimateGas(...args);
      // Add 20% buffer
      const gasLimit = (estimatedGas * 12n) / 10n;
      // Then execute with the calculated limit
      const tx = await contract.createSubscription(...args, { gasLimit });

      setState((prev) => ({ ...prev, txHash: tx.hash }));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error("Transaction failed on-chain");
      }

      setState((prev) => ({ ...prev, subscriptionCreated: true }));
      return receipt;
    } catch (error) {
      console.error("Create subscription error:", error);
      throw error;
    }
  };

  const handleSubscriptionError = (error: any) => {
    console.error("Subscription error:", error);

    let errorMessage = "Failed to create subscription";
    if (error.info?.error?.message) {
      errorMessage += `: ${error.info.error.message}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    setState((prev) => ({ ...prev, networkError: errorMessage }));
    setTimeout(() => setState((prev) => ({ ...prev, networkError: "" })), 5000);

    throw error;
  };

  return {
    state,
    resetState,
    handleCreateSubscription,
  };
};
