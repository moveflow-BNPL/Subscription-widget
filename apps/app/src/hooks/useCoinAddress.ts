import {create} from "zustand";

interface CoinAddressStore {
  coinAddress: `0x${string}`;
  setCoinAddress: (m: `0x${string}`) => void;
}

const useCoinAddress = create<CoinAddressStore>((set) => ({
  coinAddress: "0xEAB439707cA5F8e4e47c697629E77aE26842cbba",
  setCoinAddress: (c: `0x${string}`) => set({coinAddress: c})
}));

export default useCoinAddress;