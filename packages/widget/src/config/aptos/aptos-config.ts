import { NetworkConfiguration } from "./index";

const TESTNET_CONFIG = new NetworkConfiguration(
  "testnet",
  "https://fullnode.testnet.aptoslabs.com/v1",
  "0xd71e041f0d9c871e68604699aa109ead5643ced548f9d216ddb89702968e5458",
  "apt_testnet"
);

// const MAINNET_CONFIG = new NetworkConfiguration(
// );

const getNetworkConfiguration = (env: string): NetworkConfiguration => {
  switch (env) {
    case "Testnet":
      return TESTNET_CONFIG;
    // case "Mainnet":
    //   return MAINNET_CONFIG;
    default:
      return TESTNET_CONFIG;
  }
};

const netConfApt = getNetworkConfiguration(
  process.env.REACT_APP_CURRENT_NETWORK as string
);

export default netConfApt;
