"use client";
import useSubscription from "@/hooks/useSubscription";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
} from "@/lib/mui";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import ETH from "../../../public/image/eth.svg";
// import zkEVM from "../../../public/image/polygon.png";
// import SCROLL from "../../../public/image/scroll1.png";
import {
  NetworkType,
  coinConfig,
  contractConfig,
  networkIconConfig,
} from "../../config/coinConfig";
import { stringWithEllipsis } from "../helper/string";
import { relative } from "path";
import { Payment } from "@/models/subscription";

const { RangePicker } = DatePicker;

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

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "650px",
  bgcolor: "#313740",
  border: "2px solid #5a5f66",
  boxShadow: 24,
  px: 10,
  py: 5,
  borderRadius: "20px",
};

const Product = () => {
  const intervalsMap = new Map<number, string>();
  const reverseIntervalMap = new Map<string, number>();
  intervals.forEach((interval) => {
    intervalsMap.set(interval.value, interval.label);
  });
  intervals.forEach((interval) => {
    reverseIntervalMap.set(interval.label, interval.value);
  });
  const { subscription, setSubscription } = useSubscription();

  const [productName, setProductName] = useState(
    subscription.basic_info?.name || ""
  );
  const [productDescription, setProductDescription] = useState(
    subscription.basic_info?.description || ""
  );

  const [payments, setPayments] = useState(subscription.payment || []);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"Add" | "Edit">("Add");
  const [editIndex, setEditIndex] = useState<number>(0);
  const [editPayment, setEditPayment] = useState<any>({});

  const mappingValuesToSubscription = () => {
    const newSubscription = {
      ...subscription,
      basic_info: subscription.basic_info
        ? {
            ...subscription.basic_info,
            name: productName,
            description: productDescription,
          }
        : undefined,
      payment: payments,
    };

    // console.log("newSubscription", newSubscription);

    setSubscription(newSubscription);
  };

  useEffect(() => {
    mappingValuesToSubscription();
  }, [productName, productDescription, payments]);

  const PaymentModal = (props: any) => {
    const [isNetworkNameTouched, setIsNetworkNameTouched] = useState(false);
    const [isCoinTypeTouched, setIsCoinTypeTouched] = useState(false);

    const [networkName, setNetworkName] = useState<NetworkType | undefined>(
      props.editPayment.network
    );
    const [coinType, setCoinType] = useState<string | undefined>(
      props.editPayment.coinType
    );

    const [amountType, setAmountType] = useState(props.editPayment.amountType);
    const [receiver, setReceiver] = useState(props.editPayment.receiver);
    const [streamRate, setStreamRate] = useState(
      props.editPayment.streamRate ? props.editPayment.streamRate : 0
    );
    const [rateType, setRateType] = useState<string | undefined>(
      props.editPayment.rateType ? props.editPayment.rateType : "day"
    );

    const [depositAmount, setDepositAmount] = useState(
      props.editPayment.depositAmount ? props.editPayment.depositAmount : 0.0
    );
    const [selectedDate, setSelectedDate] = useState(() => {
      // Validate timestamp values or set default values
      let startTimestamp, endTimestamp;

      // Check if we have valid timestamps
      if (
        props.editPayment?.startTime &&
        typeof props.editPayment.startTime === "number" &&
        !isNaN(props.editPayment.startTime)
      ) {
        // Determine if timestamp is in seconds or milliseconds
        const isMilliseconds = props.editPayment.startTime > 9999999999;

        // Convert appropriately
        startTimestamp = isMilliseconds
          ? dayjs(props.editPayment.startTime)
          : dayjs(props.editPayment.startTime * 1000); // Convert seconds to milliseconds

        // Verify this is a valid date
        if (!startTimestamp.isValid()) {
          console.warn("Invalid start timestamp, using current date");
          startTimestamp = dayjs();
        }
      } else {
        // Default to current time plus 30 minutes as initial start time
        startTimestamp = dayjs().add(30, "minute");
      }

      if (
        props.editPayment?.endTime &&
        typeof props.editPayment.endTime === "number" &&
        !isNaN(props.editPayment.endTime)
      ) {
        // Determine if timestamp is in seconds or milliseconds
        const isMilliseconds = props.editPayment.endTime > 9999999999;

        // console.log("Timestamp format detection - endTime:", {
        //   value: props.editPayment.endTime,
        //   isMilliseconds: isMilliseconds,
        // });

        // Convert appropriately
        endTimestamp = isMilliseconds
          ? dayjs(props.editPayment.endTime) // Already in milliseconds
          : dayjs(props.editPayment.endTime * 1000); // Convert seconds to milliseconds

        // Verify this is a valid date and within reasonable bounds
        if (
          !endTimestamp.isValid() ||
          endTimestamp.year() > dayjs().year() + 100
        ) {
          console.warn(
            "Invalid or extreme end timestamp, using start time + 1 week"
          );
          endTimestamp = startTimestamp.add(1, "week");
        }
      } else {
        // Default to 1 week from start time for end date
        endTimestamp = startTimestamp.add(1, "week");
      }

      return [startTimestamp.toISOString(), endTimestamp.toISOString()];
    });

    const handleDateChange = (
      value:any,
      dateString: SetStateAction<string[]>
    ) => {
      if (value && value.length === 2 && value[0] && value[1]) {
        setSelectedDate(dateString);
      } else {
        console.warn("Invalid date selection, keeping previous values");
      }
    };

    const [inputValidity, setInputValidity] = useState({
      networkName: networkName !== undefined,
      coinType: coinType !== undefined,
      streamRate: true,
      receiver: true,
      depositAmount: true,
    });

    const validateInputs = () => {
      let newValidity;

      if (mode === "Edit") {
        // In Edit mode, validate fields based on their values
        newValidity = {
          networkName: !!networkName,
          coinType: !!coinType,
          receiver: receiver !== "",
          streamRate: amountType === "fixed" ? streamRate > 0 : true,
          depositAmount: amountType === "custom" ? depositAmount > 0 : true,
        };
      } else {
        // In Add mode, consider if the fields were touched
        newValidity = {
          networkName: isNetworkNameTouched ? !!networkName : false,
          coinType: isCoinTypeTouched ? !!coinType : false,
          receiver: receiver !== "",
          streamRate: amountType === "fixed" ? streamRate > 0 : true,
          depositAmount: amountType === "custom" ? depositAmount > 0 : true,
        };
      }

      setInputValidity(newValidity);
      return Object.values(newValidity).every(Boolean);
    };

    const intervalMenuItems = () =>
      intervals.map((interval) => {
        return (
          <MenuItem
            value={interval.label}
            key={interval.value}
          >{`/${interval.label}`}</MenuItem>
        );
      });

    useEffect(() => {
      if (mode === "Edit") {
        setCoinType(editPayment.coinType);
      }
    }, [mode]);

    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              color: "#FFFFFF",
            }}
          >
            {mode === "Add" ? "Add Payment Option" : "Edit Payment Option"}
          </Typography>

          <InputLabel
            sx={{
              marginTop: "10px",
              color: inputValidity.networkName ? "defaultColor" : "red", // Change color based on validity
            }}
          >
            Network
          </InputLabel>
          <Select
            value={networkName}
            sx={{
              width: "100%",
              height: "40px",
              marginTop: "5px",
              backgroundColor: "#55575f",
              border: inputValidity.networkName
                ? "default style"
                : "1px solid red", // updated line
              fontSize: "0.875rem",
              "&:hover > .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f143e2",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "grey",
                  },
                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "grey",
                  },
                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    backgroundColor: "grey",
                  },
                },
              },
            }}
            inputProps={{ "aria-label": "Without label" }}
            displayEmpty
            onChange={(event: SelectChangeEvent) => {
              const newValue = event.target.value as NetworkType;
              setNetworkName(newValue);
              setIsNetworkNameTouched(true); // Update here
              setInputValidity({
                ...inputValidity,
                networkName: newValue ? true : false,
              });
            }}
          >
            {Array.from(networkIconConfig, ([networkType, imgPath]) => {
              return (
                <MenuItem value={networkType} key={networkType}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      src={imgPath}
                      alt={`${networkType} logo`}
                      width={20}
                      height={18}
                      style={{ marginRight: "5px" }}
                    />
                    {networkType}
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
          <InputLabel
            sx={{
              marginTop: "10px",
              color: inputValidity.coinType ? "defaultColor" : "red", // Change color based on validity
            }}
          >
            CoinType
          </InputLabel>
          <Select
            value={coinType}
            sx={{
              width: "100%",
              height: "40px",
              marginTop: "5px",
              backgroundColor: "#55575f",
              border: inputValidity.coinType
                ? "default style"
                : "1px solid red", // updated line
              fontSize: "0.875rem",
              "&:hover > .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f143e2",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "grey",
                  },
                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "grey",
                  },
                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    backgroundColor: "grey",
                  },
                },
              },
            }}
            inputProps={{ "aria-label": "Without label" }}
            displayEmpty
            onChange={(event: SelectChangeEvent) => {
              setCoinType(event.target.value);
              setIsCoinTypeTouched(true);
              setInputValidity({
                ...inputValidity,
                coinType: event.target.value ? true : false,
              });
            }}
          >
            {networkName &&
              coinConfig[networkName] &&
              coinConfig[networkName].map((val) => (
                <MenuItem value={val.coinName} key={val.coinName}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      src={val.imagePath}
                      alt={`${val.coinName} logo`}
                      width={18}
                      height={18}
                      style={{ marginRight: "5px" }}
                    />
                    {val.coinName}
                  </Box>
                </MenuItem>
              ))}
          </Select>
          <InputLabel
            sx={{
              marginTop: "10px",
              color: inputValidity.receiver ? "defaultColor" : "red",
            }}
          >
            Receiver Address
          </InputLabel>
          <OutlinedInput
            sx={{
              height: "40px",
              marginTop: "10px",
              borderRadius: "5px",
              borderRight: "none",
              color: "white !important",
              border: inputValidity.receiver
                ? "default style"
                : "1px solid red",
            }}
            placeholder="Input receiver wallet address"
            className="setup-input"
            value={receiver}
            onChange={(e) => {
              setReceiver(e.target.value);
              setInputValidity({
                ...inputValidity,
                receiver: e.target.value !== "",
              });
            }}
          />
          <InputLabel
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Time
          </InputLabel>
          <RangePicker
            showTime
            style={{
              width: "100%",
              backgroundColor: "#55575f",
              color: "#bbbcbf",
            }}
            value={[dayjs(selectedDate[0]), dayjs(selectedDate[1])]}
            onChange={handleDateChange}
            disabled={false}
            allowClear={false}
            popupClassName={"createDateRangePicker"}
          />

          <Box
            sx={{
              display: "flex",
              marginTop: "25px",
              height: "40px",
            }}
          >
            <Box
              sx={{
                width: "50%",
                border:
                  amountType === "fixed"
                    ? "1px solid #f143e2"
                    : "1px solid #484a53",
                textAlign: "center",
                py: "5px",
                borderRadius: "5px 0 0 5px",
              }}
            >
              <Button
                sx={{
                  ":hover": {
                    backgroundColor: "#313740",
                  },
                  "&.MuiButton-root": {
                    py: 0,
                    height: "100%",
                  },
                  color:
                    amountType === "fixed"
                      ? "#f143e2 !important"
                      : "white !important",
                }}
                onClick={() => setAmountType("fixed")}
              >
                Fixed Amount
              </Button>
            </Box>
            <Box
              sx={{
                width: "50%",
                border:
                  amountType === "custom"
                    ? "1px solid #f143e2"
                    : "1px solid #484a53",
                textAlign: "center",
                py: "5px",
                borderRadius: "0 5px 5px 0",
              }}
            >
              <Button
                sx={{
                  ":hover": {
                    backgroundColor: "#313740",
                  },
                  "&.MuiButton-root": {
                    py: 0,
                    height: "100%",
                  },
                  color:
                    amountType === "custom"
                      ? "#f143e2 !important"
                      : "white !important",
                }}
                onClick={() => setAmountType("custom")}
              >
                Custom Amount
              </Button>
            </Box>
          </Box>
          <Typography
            sx={{
              marginTop: "10px",
            }}
            variant="body2"
          >
            {amountType === "fixed"
              ? "Fixed rate is a payment type suited for regular subscriptions where users pay a predetermined amount over a given period of time"
              : "Custom amount is a payment type suitable for usage-based subscriptions, where users pay for a service based on their usage during recurring time intervals."}
          </Typography>
          {amountType === "fixed" ? (
            <Box>
              <InputLabel
                sx={{
                  marginTop: "10px",
                  color: inputValidity.streamRate ? "defaultColor" : "red", // Change color based on validity
                }}
              >
                Stream Rate
              </InputLabel>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <OutlinedInput
                  sx={{
                    height: "40px",
                    marginTop: "10px",
                    borderRadius: "5px 0 0 5px",
                    borderRight: "none",
                    width: "70%",
                    border: inputValidity.streamRate
                      ? "default style"
                      : "1px solid red",
                  }}
                  placeholder="0"
                  className="setup-input"
                  value={streamRate}
                  onChange={(e) => {
                    setStreamRate(e.target.value);
                    setInputValidity({
                      ...inputValidity,
                      streamRate: e.target.value !== "",
                    });
                  }}
                />
                <Select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value as string)}
                  sx={{
                    width: "30%",
                    height: "40px",
                    marginTop: "10px",
                    backgroundColor: "#55575f",
                    fontSize: "0.875rem",
                    borderRadius: "0 5px 5px 0",
                    borderLeft: "none",
                    "&:hover > .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f143e2",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        "& .MuiMenuItem-root.Mui-selected": {
                          backgroundColor: "grey",
                        },
                        "& .MuiMenuItem-root:hover": {
                          backgroundColor: "grey",
                        },
                        "& .MuiMenuItem-root.Mui-selected:hover": {
                          backgroundColor: "grey",
                        },
                      },
                    },
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                  displayEmpty
                >
                  {intervalMenuItems()}
                </Select>
              </Box>
            </Box>
          ) : (
            <Box>
              <InputLabel
                sx={{
                  marginTop: "10px",
                  color: inputValidity.depositAmount ? "defaultColor" : "red", // Change color based on validity
                }}
              >
                Deposit Amount
              </InputLabel>
              <OutlinedInput
                sx={{
                  height: "40px",
                  marginTop: "10px",
                  borderRadius: "5px",
                  border: inputValidity.depositAmount
                    ? "default style"
                    : "1px solid red",
                  width: "100%",
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
                placeholder="0"
                className="setup-input"
                value={depositAmount}
                type="number"
                onChange={(e) => {
                  setDepositAmount(e.target.value);
                  setInputValidity({
                    ...inputValidity,
                    depositAmount: e.target.value !== "",
                  });
                }}
              />
            </Box>
          )}
          <hr
            style={{
              marginTop: "15px",
              marginBottom: "15px",
              borderColor: "#464b53",
            }}
          ></hr>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              sx={{
                border: "1px solid #484a53",
                height: "40px",
                width: "200px",
                color: "#ee42e1",
              }}
              onClick={() => {
                setOpen(false);
              }}
            >
              Discard
            </Button>

            <Button
              sx={{
                border: "1px solid #f143e2",
                height: "40px",
                width: "200px",
                marginLeft: "50px",
                backgroundColor: "#f143e2 !important",
                color: "white",
              }}
              onClick={() => {
                if (validateInputs()) {
                  if (networkName === undefined) {
                    console.error("Network name is undefined. Cannot proceed.");
                    return; // or show an error message to the user
                  }
                  console.log("amountType", amountType);
                  const paymentInfo: Payment = {
                    network: networkName,
                    coinType: coinType,
                    amountType: amountType,
                    streamRate: streamRate,
                    rateType: rateType as "day" | "month" | "year",
                    receiver: receiver,
                    startTime: selectedDate[0]
                      ? new Date(selectedDate[0]).getTime()
                      : new Date().getTime(),
                    endTime: selectedDate[1]
                      ? new Date(selectedDate[1]).getTime()
                      : new Date().getTime(),
                    depositAmount:
                      amountType === "fixed" ? undefined : depositAmount,
                  };

                  if (mode === "Add") {
                    setPayments((prevPayments) => [
                      ...prevPayments,
                      paymentInfo,
                    ]);
                  } else {
                    // mode is "Edit"
                    setPayments((prevPayments) => [
                      ...prevPayments.slice(0, editIndex),
                      paymentInfo,
                      ...prevPayments.slice(editIndex + 1),
                    ]);
                  }
                  setOpen(false);
                }
              }}
            >
              {mode} payment option
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  const PaymentOptions = () => {
    return payments.map((payment, index) => {
      return (
        <Box
          sx={{
            border: "1px solid #484a53",
            backgroundColor: "#55575f",
            marginTop: "20px",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
          key={index}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#bbbcbf",
              }}
            >
              Network
            </Typography>
            <Typography
              sx={{
                color: "#bbbcbf",
              }}
            >
              {payment.network}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#bbbcbf",
              }}
            >
              Token
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Image
                src={
                  coinConfig[payment.network]!.filter((val) => {
                    return val.coinName === payment.coinType;
                  })[0].imagePath
                }
                alt="ETH"
                width={24}
                height={24}
                style={{ marginRight: "5px" }}
              />
              <Typography
                sx={{
                  color: "#bbbcbf",
                }}
              >
                {payment.coinType}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#bbbcbf",
              }}
            >
              Stream Rate
            </Typography>
            {payment.amountType === "custom" ? (
              <Typography
                sx={{
                  color: "#bbbcbf",
                }}
              >
                {" "}
                {`
                ${payment.depositAmount} ${payment.coinType}/day`}
              </Typography>
            ) : (
              <Typography
                sx={{
                  color: "#bbbcbf",
                }}
              >{`${payment.streamRate} ${payment.coinType}/${payment.rateType}`}</Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#bbbcbf",
              }}
            >
              Receiver
            </Typography>
            <Typography
              sx={{
                color: "#bbbcbf",
              }}
            >
              {stringWithEllipsis(payment.receiver, 5)}
            </Typography>
          </Box>
          <hr
            style={{
              marginTop: 3,
              width: "104%",
              marginLeft: "-2%",
              borderColor: "#66686f",
            }}
          ></hr>
          <Box
            sx={{
              display: "flex",
              paddingTop: 3,
              paddingBottom: 1,
            }}
          >
            <ModeEditOutlineOutlinedIcon
              sx={{
                marginLeft: "auto",
                marginRight: "40px",
                cursor: "pointer",
                color: "#FFFFFF",
              }}
              onClick={() => {
                setMode("Edit");
                setEditPayment(payment);
                setEditIndex(index);
                setOpen(true);
              }}
            />
            <ContentCopyOutlinedIcon
              sx={{
                marginRight: "40px",
                cursor: "pointer",
                fontSize: "19px",
                color: "#FFFFFF",
              }}
              onClick={() => {
                setMode("Add");
                setEditIndex(-1);
                setEditPayment({
                  network: payment.network,
                  coinType: payment.coinType,
                  amountType: payment.amountType,
                  streamRate: payment.streamRate,
                  rateType: payment.rateType,
                  receiver: payment.receiver,
                  startTime: payment.startTime,
                  endTime: payment.endTime,
                });
                setOpen(true);
              }}
            />
            <DeleteForeverOutlinedIcon
              sx={{
                marginRight: "10px",
                cursor: "pointer",
                color: "#FFFFFF",
              }}
              onClick={() => {
                setPayments([
                  ...payments.slice(0, index),
                  ...payments.slice(index + 1),
                ]);
              }}
            />
          </Box>
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        px: 0,
      }}
    >
      <PaymentModal editPayment={editPayment} />
      <Box>
        <Typography
          variant="h5"
          sx={{
            my: 3,
          }}
        >
          Payment Configuration
        </Typography>
        <InputLabel
          sx={{
            marginBottom: "10px",
          }}
        >
          Product Name
        </InputLabel>
        <OutlinedInput
          placeholder="Your Product Name"
          value={productName}
          className="setup-input"
          onChange={(e) => {
            setProductName(e.target.value);
          }}
        />
        <InputLabel
          sx={{
            marginBottom: "10px",
            marginTop: "20px",
          }}
        >
          Product Description
        </InputLabel>
        <OutlinedInput
          sx={{
            paddingTop: "0",
          }}
          placeholder="Your Product Description"
          className="setup-input"
          value={productDescription}
          onChange={(e) => {
            setProductDescription(e.target.value);
          }}
        />
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              margin: "20px 0",
            }}
          >
            Add Payment Options {payments?.length > 0 && `(${payments.length})`}
          </Typography>
          <Button
            sx={{
              backgroundColor: "#f143e2 !important",
              color: "white !important",
              width: "100px",
              height: "40px",
              marginLeft: "auto",
              marginTop: "20px",
            }}
            onClick={() => {
              setMode("Add");
              setEditIndex(-1);
              setEditPayment({
                network: NetworkType.Goerli,
                coinType: "",
                amountType: "fixed" as const,
                streamRate: 0,
                rateType: "day" as "day" | "month" | "year",
                receiver: "",
                startTime: new Date().getTime(),
                endTime: new Date().getTime(),
              });
              setOpen(true);
            }}
          >
            Add+
          </Button>
        </Box>
      </Box>
      {payments?.length > 0 ? (
        <PaymentOptions />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            border: "1px dashed #484a53",
            borderRadius: "5px",
            marginTop: "20px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "#8a8d93", textAlign: "center" }}
          >
            You haven't added any payment options yet. Add your first one
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Product;
