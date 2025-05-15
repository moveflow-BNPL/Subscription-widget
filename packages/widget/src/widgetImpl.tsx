import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  ContentCopy,
  KeyboardArrowDown,
  KeyboardArrowUp,
  WarningAmber,
} from "@mui/icons-material";
import {
  coinConfig,
  networkIconConfig,
  NetworkType,
} from "./config/coinConfig";
import ETHConnectButton from "./components/ETHConnectButton";
import SubscriptionButton from "./components/SubscriptionButton";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { WidgetProps } from "./Widget";
import { Payment } from "./model/subscription";
import { useSDK } from "@metamask/sdk-react";

import { copyAddress, stringWithEllipsis } from "./helper/string";
import useCoinAddress from "./hooks/useCoinAddress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import Davatar from "@davatar/react";
// import AptosConnectButton from "./components/aptosconnect";
import SubscriptionButtonAptos from "./components/subscriptionButtonAptos";
import Wallet from "./components/aptosWallet/Wallet";
import { AptosContext } from "./components/aptosWallet/AptosContext";
import VictionSubscription from "./components/victionSubscription";
import LightLinkSubscriptionButton from "./components/LightLinkSubscriptionButton";
import PharosSubscription from "./components/PharosSubscription";

const WidgetImpl = (props: WidgetProps) => {
  const aptosContext = useContext(AptosContext);
  const { isConnectedAptos, address } = aptosContext || {};
  const { setCoinAddress } = useCoinAddress();
  const { connected, account, chainId } = useSDK();

  const [copyReceiverAddress, setcopyReceiverAddress] =
    useState<boolean>(false);
  const [copySenderAddress, setcopySenderAddress] = useState<boolean>(false);

  const [showStepOneDetail, setShowStepOneDetail] = useState<boolean>(
    !isConnectedAptos && !connected
  );
  const [showStepTwoDetail, setShowStepTwoDetail] = useState<boolean>(false);

  useEffect(() => {
    // Update showStepOneDetail when the wallet is connected
    setShowStepOneDetail(!isConnectedAptos && !connected);

    // Update showStepTwoDetail when the wallet is connected
    setShowStepTwoDetail(isConnectedAptos || connected);
  }, [isConnectedAptos, connected]);

  // Modify the network state initialization
  const [network, setNetwork] = useState<NetworkType>(
    props.payment && props.payment.length > 0
      ? props.payment[0].network
      : NetworkType.Goerli // Use a default value
  );

  // Similarly for paymentIndex and selectedPayment
  const [paymentIndex, setPaymentIndex] = useState<number>(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    props.payment && props.payment.length > 0 ? props.payment[0] : null
  );

  const paymentOptions = useMemo(() => {
    let option: Map<NetworkType, Map<number, string>> = new Map<
      NetworkType,
      Map<number, string>
    >();
    for (let i = 0; i < props.payment!.length; i++) {
      if (networkIconConfig.get(props.payment![i].network) === undefined) {
        continue;
      }
      if (option.get(props.payment![i].network) === undefined) {
        option.set(props.payment![i].network, new Map<number, string>());
      }
      const payment = props.payment![i];
      const val = `${payment.coinType}`;
      option.get(props.payment![i].network)!.set(i, val);
    }
    return option;
  }, [props.payment]);

  const chainOptions = useMemo(() => {
    let networkTypes = new Set<{ name: string; imgPath: string }>();
    paymentOptions.forEach((_, key) => {
      if (networkIconConfig.get(key) === undefined) {
        return;
      }
      networkTypes.add({
        name: key,
        imgPath: networkIconConfig.get(key)!,
      });
    });
    // console.log('chainOptions', networkTypes)
    return Array.from(networkTypes);
  }, [paymentOptions]);

  const coinOptions = useMemo(() => {
    let coinTypes: { name: string; idx: number }[] = [];
    if (paymentOptions.get(network) === undefined) {
      return coinTypes;
    }
    paymentOptions.get(network)!.forEach((value, key) => {
      coinTypes.push({
        name: value,
        idx: key,
      });
    });
    // console.log('coinTypes', coinTypes);
    return coinTypes;
  }, [network, paymentOptions, chainOptions]);

  useEffect(() => {
    setSelectedPayment(props.payment![paymentIndex]);
  }, [props.payment]);

  // console.log("selectedPayment:", selectedPayment);

  return (
    <Box
      sx={{
        paddingTop: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {!props.payment || props.payment.length === 0 ? (
        // No payment options case - show ONLY the warning message
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            border: "1px dashed #484a53",
            borderRadius: "5px",
            marginTop: "50px",
            maxWidth: "600px",
            width: "100%",
            background: "linear-gradient(96.29deg, #343640 0%, #343640 100%)",
          }}
        >
          <WarningAmber
            sx={{ fontSize: 60, color: "#f143e2", marginBottom: 2 }}
          />
          <Typography
            variant="h5"
            sx={{ color: "#FFFFFF", textAlign: "center", marginBottom: 2 }}
          >
            No Payment Options Available
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#8a8d93", textAlign: "center", marginBottom: 3 }}
          >
            Please add at least one payment option to continue
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              border: "1px solid #FFFFFF4D",
              borderRadius: `${props.ui!.container_border_radius}px`,
              px: 8,
              py: 4,
              background:
                "linear-gradient(96.29deg, #343640 0%, #343640 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                borderBottom: "1px solid #FFFFFF4D",
                paddingBottom: 2,
                fontFamily: props.ui!.font_family,
              }}
            >
              {props.basic_info!.name}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                marginTop: 2,
                fontFamily: props.ui!.font_family,
              }}
            >
              Pay in Stream
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                marginTop: 3,
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  height: "100%",
                  my: "auto",
                  fontFamily: props.ui?.font_family,
                }}
              >
                {selectedPayment && selectedPayment.amountType === "fixed"
                  ? selectedPayment.streamRate
                  : selectedPayment && selectedPayment.depositAmount}{" "}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: props.ui?.font_family,
                  }}
                >
                  {selectedPayment?.coinType}{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: props.ui?.font_family,
                  }}
                >
                  per {selectedPayment?.rateType}{" "}
                </Typography>
              </Box>
            </Box>
            {props.basic_info?.description && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    borderTop: "1px solid #FFFFFF4D",
                    paddingTop: 2,
                    marginBottom: 2,
                    fontFamily: props.ui!.font_family,
                  }}
                >
                  Details
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: props.ui!.font_family,
                  }}
                >
                  {props.basic_info?.description}
                </Typography>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              border: "1px solid #FFFFFF4D",
              borderRadius: `${props.ui!.container_border_radius}px`,
              px: 8,
              py: 8,
              background:
                "linear-gradient(96.29deg, #343640 0%, #343640 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottom: "1px solid #FFFFFF4D",
                paddingBottom: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: props.ui!.primary_color,
                    width: 20,
                    height: 20,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: props.ui!.secondary_color,
                      fontFamily: props.ui!.font_family,
                    }}
                  >
                    1
                  </Typography>
                </Avatar>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontFamily: props.ui!.font_family,
                  }}
                >
                  Select network and token
                </Typography>
              </Box>

              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  setShowStepOneDetail(!showStepOneDetail);
                  setShowStepTwoDetail(!showStepTwoDetail);
                }}
              >
                <KeyboardArrowDown fill="white" />
              </IconButton>
            </Box>

            {showStepOneDetail && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Select
                    labelId="chain-select-label"
                    id="chain-select"
                    value={network}
                    onChange={(e) => {
                      setNetwork(e.target.value as NetworkType);
                    }}
                    sx={{
                      width: "100%",
                      borderRadius: `${props.ui!.field_border_radius}px`,
                      fontFamily: props.ui!.font_family,
                      "& .MuiSelect-select": {
                        px: 4,
                        py: 2,
                        fontFamily: props.ui!.font_family,
                      },
                    }}
                  >
                    {chainOptions.map((val) => {
                      console.log("val:", val);
                      return (
                        <MenuItem value={val.name} key={val.name}>
                          <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <img
                              alt={`${val.name} Logo`}
                              src={val.imgPath}
                              width={25}
                              height={25}
                            />
                            <Typography
                              variant="body1"
                              style={{
                                marginLeft: "10px",
                                fontFamily: props.ui!.font_family,
                              }}
                            >
                              {val.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Select
                    labelId="chain-select-label"
                    id="chain-select"
                    value={paymentIndex}
                    onChange={(e) => {
                      setPaymentIndex(e.target.value as number);
                      setSelectedPayment(
                        props.payment![e.target.value as number]
                      );
                      setCoinAddress(
                        coinConfig[network].filter((v) => {
                          return (
                            v.coinName ===
                            props.payment![e.target.value as number].coinType
                          );
                        })[0].address as `0x${string}`
                      );
                    }}
                    sx={{
                      width: "100%",
                      borderRadius: `${props.ui!.field_border_radius}px`,
                      "& .MuiSelect-select": {
                        px: 4,
                        py: 2,
                      },
                    }}
                  >
                    {coinOptions.map((val, index) => {
                      return (
                        <MenuItem value={val.idx} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <img
                              alt="Eth Logo"
                              src={
                                coinConfig[network]!.filter((v: any) => {
                                  const coinType = val.name.split("-")[0];
                                  console.log("coinType:", coinType);
                                  console.log("v.coinName:", v.coinName);
                                  return coinType === v.coinName;
                                })[0].imagePath
                              }
                              width={25}
                              height={25}
                            />

                            <Typography
                              variant="body1"
                              style={{
                                marginLeft: "10px",
                                fontFamily: props.ui!.font_family,
                              }}
                            >
                              {val.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box>
                  {network === NetworkType.Aptos ? (
                    // Render Connect Wallet button for Aptos
                    <>
                      <div style={{ marginBottom: "-17px" }}>
                        <Wallet />
                      </div>
                    </>
                  ) : (
                    // Render the default Connect Wallet button
                    <ETHConnectButton
                      fontFamily={props.ui!.font_family}
                      borderRadius={props.ui!.button_border_radius}
                    />
                  )}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 2,
                borderBottom: "1px solid #FFFFFF4D",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: props.ui!.primary_color,
                    width: 20,
                    height: 20,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: props.ui!.secondary_color,
                      fontFamily: props.ui!.font_family,
                    }}
                  >
                    2
                  </Typography>
                </Avatar>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontFamily: props.ui!.font_family,
                  }}
                >
                  Review the transaction(s)
                </Typography>
              </Box>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  setShowStepTwoDetail(!showStepTwoDetail);
                }}
              >
                <KeyboardArrowDown fill="white" />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                bottom: 0,
              }}
            >
              {showStepTwoDetail && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1);",
                        minWidth: "180px",
                        height: "60px",
                        px: 3,
                        background:
                          "linear-gradient(0deg, rgba(217, 217, 217, 0.2), rgba(217, 217, 217, 0.2)), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: 3,
                        }}
                      >
                        <Avatar>
                          <div
                            style={{
                              overflow: "hidden",
                              width: "24px",
                              height: "24px",
                              backgroundColor: "rgb(241, 172, 2)",
                              borderRadius: "12px",
                            }}
                          >
                            <svg width="24px" height="24px">
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                                fill="#FC8400"
                                transform="translate(0.09360401697918151 -0.013747316900765494) rotate(388.7 12 12)"
                              ></rect>
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                                fill="#245AE1"
                                transform="translate(11.965214621355102 -5.722361063311171) rotate(467.2 12 12)"
                              ></rect>
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                                fill="#01808C"
                                transform="translate(5.817023438467576 22.70924894631152) rotate(249.7 12 12)"
                              ></rect>
                            </svg>
                          </div>
                        </Avatar>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: props.ui!.font_family,
                          }}
                        >
                          {stringWithEllipsis(
                            network === NetworkType.Aptos
                              ? address || ""
                              : account || "",
                            3
                          )}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          const addressToCopy =
                            network === NetworkType.Aptos
                              ? address || ""
                              : account || "";
                          copyAddress(addressToCopy);
                          setcopySenderAddress(true);
                          // Reset the "copySenderAddress" state after a 2-second delay
                          setTimeout(() => {
                            setcopySenderAddress(false);
                          }, 2000);
                        }}
                      >
                        {copySenderAddress ? (
                          <CheckCircle
                            width="2rem"
                            height="2rem"
                            fontSize="small"
                            sx={{ color: "purple.500" }} // Using MUI's purple palette
                          />
                        ) : (
                          <ContentCopy
                            width="2rem"
                            height="2rem"
                            fontSize="small"
                            sx={{ color: "purple.500" }}
                          />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      flexShrink: 1,
                    }}
                  >
                    <img
                      src="https://raw.githubusercontent.com/Move-Flow/assets/main/Streaming.gif"
                      alt="Streaming"
                      className="animated-gif"
                      style={{
                        width: "100%",
                        height: "60px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1);",
                        minWidth: "180px",
                        height: "60px",
                        paddingLeft: 3,
                        paddingRight: 3,
                        background:
                          "linear-gradient(0deg, rgba(217, 217, 217, 0.2), rgba(217, 217, 217, 0.2)), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: 3,
                        }}
                      >
                        <Avatar>
                          <Box>
                            <div
                              style={{
                                overflow: "hidden",
                                width: "24px",
                                height: "24px",
                                backgroundColor: "rgb(241, 172, 2)",
                                borderRadius: "12px",
                              }}
                            >
                              <svg width="24px" height="24px">
                                <rect
                                  x="0"
                                  y="0"
                                  width="24"
                                  height="24"
                                  fill="#1593F2"
                                  transform="translate(5.374388038297389 -5.77804521151242) rotate(416.7 12 12)"
                                ></rect>
                                <rect
                                  x="0"
                                  y="0"
                                  width="24"
                                  height="24"
                                  fill="#FC7B00"
                                  transform="translate(-7.631366435658614 6.643944436901061) rotate(156.5 12 12)"
                                ></rect>
                                <rect
                                  x="0"
                                  y="0"
                                  width="24"
                                  height="24"
                                  fill="#2461E1"
                                  transform="translate(2.5498072745695954 23.409873335660436) rotate(179.5 12 12)"
                                ></rect>
                              </svg>
                            </div>
                          </Box>
                        </Avatar>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: props.ui!.font_family,
                          }}
                        >
                          {stringWithEllipsis(
                            selectedPayment?.receiver || "",
                            3
                          )}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          copyAddress(selectedPayment?.receiver || "");
                          setcopyReceiverAddress(true);
                          setTimeout(() => {
                            setcopyReceiverAddress(false);
                          }, 2000);
                        }}
                      >
                        {copyReceiverAddress ? (
                          <CheckCircle
                            width="2rem"
                            height="2rem"
                            fontSize="small"
                            sx={{ color: "purple.500" }}
                          />
                        ) : (
                          <ContentCopy
                            width="2rem"
                            height="2rem"
                            fontSize="small"
                            sx={{ color: "purple.500" }}
                          />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: props.ui!.font_family }}
                >
                  {`${
                    selectedPayment?.amountType === "fixed"
                      ? selectedPayment?.streamRate
                      : "X"
                  } ${selectedPayment?.coinType} per ${
                    selectedPayment?.rateType
                  }`}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                marginTop: 4,
                textAlign: "center",
              }}
            >
              {network === NetworkType.Viction ? (
                // Render Viction-specific subscription logic
                <VictionSubscription
                  primaryColor={props.ui!.primary_color}
                  payment={selectedPayment!}
                  fontFamily={props.ui!.font_family}
                  borderRadius={props.ui!.button_border_radius}
                  chainName="Viction"
                />
              ) : network === NetworkType.Aptos ? (
                // Render Aptos-specific subscription logic
                <SubscriptionButtonAptos
                  primaryColor={props.ui!.primary_color}
                  payment={selectedPayment!}
                  fontFamily={props.ui!.font_family}
                  borderRadius={props.ui!.button_border_radius}
                />
              ) : network === NetworkType.Goerli ? (
                // Render default Ethereum-specific subscription logic
                <SubscriptionButton
                  primaryColor={props.ui!.primary_color}
                  payment={selectedPayment!}
                  fontFamily={props.ui!.font_family}
                  borderRadius={props.ui!.button_border_radius}
                  chainName="Goerli"
                />
              ) : network === NetworkType.LightLink ? (
                <LightLinkSubscriptionButton
                  primaryColor={props.ui!.primary_color}
                  payment={selectedPayment!}
                  fontFamily={props.ui!.font_family}
                  borderRadius={props.ui!.button_border_radius}
                  chainName="Lightlink"
                />
              ) : (
                // Default/fallback case for Pharos or any other network
                <PharosSubscription
                  primaryColor={props.ui!.primary_color}
                  payment={selectedPayment!}
                  fontFamily={props.ui!.font_family}
                  borderRadius={props.ui!.button_border_radius}
                  chainName="Pharos"
                />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              marginTop: 4,
              width: "60%",
              borderRadius: "8px",
              gap: 1,
              mx: "auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(96.29deg, #343640 0%, #343640 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
            }}
          >
            <Typography
              component="div"
              variant="h5"
              sx={{
                textAlign: "center",
                margin: 3,
                color: "#FFFFFF6D",
                padding: 1,
                display: "inline",
                fontFamily: props.ui!.font_family,
              }}
            >
              Powered by
            </Typography>
            <Box>
              <img
                src="https://raw.githubusercontent.com/Move-Flow/assets/34f95fcc68ae07c934c603826dac4d4170953908/mf_plogo.svg"
                alt="mf"
                style={{
                  width: "120px",
                  height: "50px",
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default WidgetImpl;
