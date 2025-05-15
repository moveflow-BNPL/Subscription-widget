import { create } from "zustand";
import { NetworkType } from "../config/coinConfig";
import { Subscription } from "../models/subscription";
import dayjs from "dayjs";

interface SubscriptionStore {
  subscription: Subscription;
  setSubscription: (m: Subscription) => void;
}

const useSubscription = create<SubscriptionStore>((set) => ({
  subscription: {
    ui: {
      container_border_radius: 10,
      field_border_radius: 5,
      button_border_radius: 5,
      primary_color: "#F143E2",
      secondary_color: "#ffffff",
      font_family: "Noto Sans, sans-serif",
    },
    basic_info: {
      name: "Subscription Sample",
      description: "This is a subscription sample",
    },
    payment: [
      {
        network: NetworkType.Aptos,
        coinType: "APT",
        amountType: "fixed",
        streamRate: 1,
        rateType: "day",
        receiver: "0xBF95dC3888dE3Bc8Ccd55465b3435f75699ee4A8",
        startTime: dayjs().add(30, "minutes").unix(),
        endTime: dayjs().add(1, "week").unix(),
      },
      {
        network: NetworkType.Goerli,
        coinType: "USDT",
        amountType: "fixed",
        streamRate: 1,
        rateType: "day",
        receiver: "0x96041C6cc8d52BF1B95A9aA3F7E1B7165D4e9Aa3",
        startTime: dayjs().add(30, "minutes").unix(),
        endTime: dayjs().add(1, "week").unix(),
      },
      {
        network: NetworkType.Pharos,
        coinType: "USDC",
        amountType: "fixed",
        streamRate: 1,
        rateType: "day",
        receiver: "0x96041C6cc8d52BF1B95A9aA3F7E1B7165D4e9Aa3",
        startTime: dayjs().add(30, "minutes").unix(),
        endTime: dayjs().add(1, "week").unix(),
      },
      {
        network: NetworkType.LightLink,
        coinType: "USDC",
        amountType: "fixed",
        streamRate: 1,
        rateType: "day",
        receiver: "0x96041C6cc8d52BF1B95A9aA3F7E1B7165D4e9Aa3",
        startTime: dayjs().add(30, "minutes").unix(),
        endTime: dayjs().add(1, "week").unix(),
      },
    ],
  },
  setSubscription: (m: Subscription) => set({ subscription: m }),
}));

export default useSubscription;
