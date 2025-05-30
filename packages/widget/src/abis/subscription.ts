export const contractAddress = "0x8e5249a5C8d1a7107AABF7B03Ea2419aCB4d0197";

export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "senderBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "recipientBalance",
        type: "uint256",
      },
    ],
    name: "CancelSubscription",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stopTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "interval",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fixedRate",
        type: "uint256",
      },
    ],
    name: "CreateSubscription",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositeFromSender",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawFromRecipient",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawFromSender",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
    ],
    name: "cancelSubscription",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
    ],
    name: "checkWithdrawFromRecipient",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
    ],
    name: "checkWithdrawFromSender",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "deposit", type: "uint256" },
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "stopTime", type: "uint256" },
      { internalType: "uint256", name: "interval", type: "uint256" },
      { internalType: "uint256", name: "fixedRate", type: "uint256" },
    ],
    name: "createSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
    ],
    name: "deltaOf",
    outputs: [{ internalType: "uint256", name: "delta", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "depositeFromSender",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
    ],
    name: "getSubscription",
    outputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "deposit", type: "uint256" },
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "stopTime", type: "uint256" },
      { internalType: "uint256", name: "interval", type: "uint256" },
      { internalType: "uint256", name: "remainingBalance", type: "uint256" },
      { internalType: "uint256", name: "lastWithdrawTime", type: "uint256" },
      { internalType: "uint256", name: "withdrawCount", type: "uint256" },
      { internalType: "uint256", name: "fixedRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextSubscriptionId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawFromRecipient",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "subscriptionId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawFromSender",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
