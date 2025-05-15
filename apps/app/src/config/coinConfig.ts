export enum NetworkType {
  // Mainnet
  // Ethereum = "Ethereum",
  // Polygon = "Polygon",
  // Testnet
  Goerli = "Goerli",
  Aptos = "Aptos",
  Viction = "Viction",
  LightLink = "LightLink",
  Pharos = "Pharos",
  // Mumbai = "Mumbai",
  // Scroll = "Scroll",
  // zkEVM = "zkEVM",
}

export const coinConfig = {
  [NetworkType.Goerli]: [
    {
      imagePath: "https://move-flow.github.io/assets/usd-coin-usdc-logo.svg",
      coinName: "USDC",
      address: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    },
    {
      imagePath: "https://move-flow.github.io/assets/tether-usdt-logo.svg",
      coinName: "USDT",
      address: "0x56705db9f87c8a930ec87da0d458e00a657fccb0",
    },
    // {
    //   imagePath: "https://move-flow.github.io/assets/tether-usdt-logo.svg",
    //   coinName: "MockCoin",
    //   address: "0xEAB439707cA5F8e4e47c697629E77aE26842cbba",
    // },
  ],

  [NetworkType.Aptos]: [
    {
      imagePath: "/image/apt.svg",
      coinName: "APT",
      address: "",
    },
  ],
  [NetworkType.Viction]: [
    {
      imagePath: "https://arthuremma2.github.io/img-hosting/VIC.png",
      coinName: "VIC",
      address: "0xa02f6adc7926efebbd59fd43a84f4e0c0c91e832",
    },
  ],
  [NetworkType.LightLink]: [
    {
      imagePath: "https://move-flow.github.io/assets/usd-coin-usdc-logo.svg",
      coinName: "USDC",
      address: "0x35A7B4067b2A652E19202264Cd9977451ab3a7dC",
    },
  ],
  [NetworkType.Pharos]: [
    {
      imagePath: "https://move-flow.github.io/assets/usd-coin-usdc-logo.svg",
      coinName: "USDC",
      address: "0x35A7B4067b2A652E19202264Cd9977451ab3a7dC",
    },
  ],
  // [NetworkType.Ethereum]: [],
};

const testnetContractConfig: Map<NetworkType, string> = new Map<
  NetworkType,
  string
>([
  [NetworkType.Goerli, process.env.ETHEREUM_CONTRACT!],
  // [NetworkType.Mumbai, process.env.MUMBAI_TESTNET_CONTRACT!],
]);

const mainnetContractConfig: Map<NetworkType, string> = new Map<
  NetworkType,
  string
>([
  [NetworkType.Goerli, process.env.ETHEREUM_CONTRACT!],
  // [NetworkType.Mumbai, process.env.MUMBAI_TESTNET_CONTRACT!]
]);

export const contractConfig = {
  Testnet: testnetContractConfig,
  Mainnet: mainnetContractConfig,
};

export const networkIconConfig: Map<NetworkType, string> = new Map<
  NetworkType,
  string
>([
  [NetworkType.Goerli, "/image/eth.svg"],
  [NetworkType.Pharos, "https://move-flow.github.io/assets/pharos-1.svg"],
  // [NetworkType.Mumbai, "https://cryptologos.cc/logos/polygon-matic-logo.svg"],
  // [NetworkType.Scroll, "/image/scroll1.png"],
  // [NetworkType.zkEVM, "/image/polygon.webp"],
  [NetworkType.Aptos, "/image/apt.svg"],
  [NetworkType.Viction, "https://arthuremma2.github.io/img-hosting/VIC.png"],
  [
    NetworkType.LightLink,
    "https://raw.githubusercontent.com/Move-Flow/assets/main/Yg2XgSeH_400x400.jpeg",
  ],
]);
