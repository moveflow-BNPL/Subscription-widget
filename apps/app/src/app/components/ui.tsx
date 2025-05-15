"use client";
import {
  Box,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from "@/lib/mui";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import useSubscription from "../../hooks/useSubscription";

const UI = () => {
  const { subscription, setSubscription } = useSubscription();
  const [fontFamily, setFontFamily] = useState<string>("Noto Sans, sans-serif");
  const [containerBorderRadius, setContainerBorderRadius] =
    useState<number>(10);
  const [fieldBorderRadius, setFieldBorderRadius] = useState<number>(5);
  const [buttonBorderRadius, setButtonBorderRadius] = useState<number>(5);
  const [primaryColor, setPrimaryColor] = useState<string>("#F143E2");
  const [secondaryColor, setSecondaryColor] = useState<string>("#ffffff");

  const mappingValuesToSubscription = () => {
    const newSubscription = {
      ...subscription,
      ui: subscription.ui
        ? {
            ...subscription.ui,
            container_border_radius: containerBorderRadius,
            field_border_radius: fieldBorderRadius,
            button_border_radius: buttonBorderRadius,
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            font_family: fontFamily,
          }
        : undefined,
    };

    console.log("newQuest", newSubscription);

    setSubscription(newSubscription);
  };

  useEffect(() => {
    mappingValuesToSubscription();
  }, [
    containerBorderRadius,
    fieldBorderRadius,
    buttonBorderRadius,
    primaryColor,
    secondaryColor,
    fontFamily,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginTop: 4,
      }}
    >
      <Box>
        <FormLabel>Container border radius: {containerBorderRadius}</FormLabel>
        <Slider
          max={50}
          defaultValue={containerBorderRadius}
          onChange={(e, newValue) =>
            setContainerBorderRadius(newValue as number)
          }
        />
      </Box>
      <Box>
        <FormLabel>Field border radius: {fieldBorderRadius}</FormLabel>
        <Slider
          max={20}
          defaultValue={fieldBorderRadius}
          onChange={(e, newValue) => setFieldBorderRadius(newValue as number)}
        />
      </Box>
      <Box>
        <FormLabel>Button border radius: {buttonBorderRadius}</FormLabel>
        <Slider
          max={20}
          defaultValue={buttonBorderRadius}
          onChange={(e, newValue) => setButtonBorderRadius(newValue as number)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <InputLabel
            sx={{
              marginBottom: "10px",
            }}
          >
            Primary color
          </InputLabel>
          {/* <OutlinedInput
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          ></OutlinedInput> */}
          <ChromePicker
            color={primaryColor}
            onChange={(e: any) => {
              console.log(e);
              setPrimaryColor(e.hex);
            }}
          />
        </Box>
        <Box>
          <InputLabel
            sx={{
              marginBottom: "10px",
            }}
          >
            Secondary color
          </InputLabel>
          <ChromePicker
            color={secondaryColor}
            onChange={(e: any) => {
              console.log(e);
              setSecondaryColor(e.hex);
            }}
          />
          {/* <OutlinedInput
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
          ></OutlinedInput> */}
        </Box>
      </Box>
      <InputLabel
        sx={{
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        Font family
      </InputLabel>
      <Select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        sx={{
          width: "100%",
          backgroundColor: "#55575f",
          fontSize: "0.875rem",
          "&:hover > .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f143e2",
          },
        }}
      >
        <MenuItem value="Noto Sans, sans-serif">Noto Sans</MenuItem>
        <MenuItem value="Lora, serif">Lora</MenuItem>
        <MenuItem value="Fantasy">Fantasy</MenuItem>
      </Select>
      {/* <SaveSetting isUpdate={true} />
      <SnackBar snackBarMessage={snackBarMessage} /> */}
    </Box>
  );
};

export default UI;
