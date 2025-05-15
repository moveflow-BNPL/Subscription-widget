"use client";
import { Payment } from "@/models/subscription";
import { Button } from "@mui/material";
import {
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import SubscriptionAbi from "@/app/abi/subscription.json";
import useCoinAddress from "@/hooks/useCoinAddress";
import {useState} from "react";

const convertRateTypeToSeconds = (
  rateType: "month" | "day" | "year" | undefined
) => {
  const intervals = [
    {
      value: 1000 * 60 * 60 * 24,
      label: "day",
    },
    {
      value: 1000 * 60 * 60 * 24 * 30,
      label: "month",
    },
    {
      value: 1000 * 60 * 60 * 24 * 365,
      label: "year",
    },
  ];

  const selectedInterval = intervals.find(
    (interval) => interval.label === rateType
  );

  if (selectedInterval) {
    return selectedInterval.value / 1000; // Convert milliseconds to seconds
  }
  return 0;
};

interface SubscriptionProps {
  payment: Payment;
  primaryColor: string;
  fontFamily: string;
}

function SubscriptionButton(props: SubscriptionProps) {
  const {coinAddress} = useCoinAddress();
  let decimal = 0;

  const { payment, primaryColor, fontFamily } = props;
  const deposit = '1' // '10000000000000000000'; //  > 0

  const {data: coinData} = useBalance({
    address: coinAddress
  });
  if (coinData) {
    console.log('coinData', coinData!.decimals)
    decimal = coinData!.decimals;
  }
  // appove start
  const approveAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  const { config: approveConfig   } = usePrepareContractWrite({
    address: coinAddress,
    abi: approveAbi,
    functionName: 'approve',
    args: [
      process.env.ETHEREUM_CONTRACT!,
      deposit
    ],
  })
  const { data: erc20Data, write: erc20ApproveFunc } = useContractWrite(approveConfig)
  const { isLoading: erc20IsLoading, isSuccess: erc20IsSuccess } = useWaitForTransaction({
    hash: erc20Data?.hash,
  })

  // appove end
  const CreateButton = () => {
    const { config } = usePrepareContractWrite({
      address: process.env.ETHEREUM_CONTRACT! as `0x${string}`,
      abi: SubscriptionAbi.abi,
      functionName: 'createSubscription',
      args: [
        payment.receiver,
        payment.amountType === "fixed" || payment.depositAmount === undefined ? 1 : payment.depositAmount! * 10 ** Number(decimal),
        coinAddress,
        payment.startTime,
        payment.endTime,
        convertRateTypeToSeconds(payment.rateType),
        payment.amountType === "fixed" ? 1 : 0,
      ],
    });

    const { data, write: createSubscriptionFunc } = useContractWrite(config)
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    })

    return (
      <Button
        disabled={isLoading || !createSubscriptionFunc}
        variant="contained"
        sx={{
          "&.MuiButton-root": {
            width: "100%",
            borderRadius: "8px",
            background: primaryColor,
            fontFamily: fontFamily,
          },
        }}
        onClick={() => {
          console.log("aaa");
          erc20ApproveFunc?.();
          createSubscriptionFunc?.();
        }}
      >
        {isSuccess ? "Subscription Confirmed" : "Confirm Subscription"}
      </Button>
    )
  }

  const DepositButton = () => {
    const { config } = usePrepareContractWrite({
      address: process.env.ETHEREUM_CONTRACT! as `0x${string}`,
      abi: SubscriptionAbi.abi,
      functionName: 'depositeFromSender',
      args: [
        payment.id!,
        payment.amountType === "fixed" && payment.depositAmount ? 1 : payment.depositAmount! * 10 ** Number(coinData!.decimals),
      ],
    });

    const { data, write: depositFunc } = useContractWrite(config)
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    })

    return (
      <Button
        disabled={isLoading || !depositFunc}
        variant="contained"
        sx={{
          "&.MuiButton-root": {
            width: "100%",
            borderRadius: "8px",
            background: "#f143e2 !important",
          },
        }}
        onClick={() => {
          console.log("aaa");
          erc20ApproveFunc?.();
          depositFunc?.();
        }}
      >
        {isLoading ? "Pending..." : "Deposit to Subscription"}
      </Button>
    )
  }

  return (
    <>
      {payment.id === undefined ? <CreateButton /> : <DepositButton />}
    </>
  );
}

export default SubscriptionButton;