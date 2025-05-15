"use client";
import { Check as CheckIcon, FileCopy as CopyIcon } from "@mui/icons-material";
import { Box, Button, Drawer } from "@mui/material";
import React, { useState, useMemo } from "react";
import JSONInput from "react-json-editor-ajrm/index";
import { Subscription } from "../../models/subscription";
const locale = require("react-json-editor-ajrm/locale/en");

interface JsonEditorDrawerProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription;
}

const JsonEditorDrawer: React.FC<JsonEditorDrawerProps> = ({
  open,
  onClose,
  subscription,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  // Create a formatted version of the subscription with NetworkType enums and correct timestamps
  const formattedSubscription = useMemo(() => {
    if (!subscription || !subscription.payment) return subscription;

    // Create a deep copy to avoid mutating the original
    const formattedData = JSON.parse(JSON.stringify(subscription));

    // Update each payment item to display NetworkType properly and fix timestamps
    if (formattedData.payment && Array.isArray(formattedData.payment)) {
      formattedData.payment = formattedData.payment.map((item: any) => {
        // Convert network string to NetworkType enum format (without quotes)
        let formattedItem = { ...item };

        if (item.network) {
          // Extract the network name from the string if it's in 'NetworkType.X' format
          let networkName = item.network;
          if (
            typeof item.network === "string" &&
            item.network.startsWith("NetworkType.")
          ) {
            networkName = item.network.replace("NetworkType.", "");
          }

          // Set it directly as NetworkType.X without quotes
          formattedItem.network = `NetworkType.${networkName}`;
        }

        // Make sure these fields exist even if they're empty
        formattedItem.streamRate = item.streamRate || 0;
        formattedItem.depositAmount = item.depositAmount || 0;

        // Convert timestamps from milliseconds to seconds if needed
        if (formattedItem.startTime) {
          // Check if timestamp is in milliseconds (greater than 10^12, typically)
          if (formattedItem.startTime > 10000000000) {
            formattedItem.startTime = Math.floor(
              formattedItem.startTime / 1000
            );
          }
        }

        if (formattedItem.endTime) {
          // Check if timestamp is in milliseconds (greater than 10^12, typically)
          if (formattedItem.endTime > 10000000000) {
            formattedItem.endTime = Math.floor(formattedItem.endTime / 1000);
          }
        }

        return formattedItem;
      });
    }

    return formattedData;
  }, [subscription]);

  const handleCopyClick = () => {
    // Create a special formatted version for clipboard that preserves enum syntax
    const clipboardText = JSON.stringify(formattedSubscription, null, 2)
      // Replace "NetworkType.X" strings with NetworkType.X (without quotes)
      .replace(/"NetworkType\.([^"]+)"/g, "NetworkType.$1");

    navigator.clipboard.writeText(clipboardText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#fff0",
        }}
      >
        <Button
          onClick={handleCopyClick}
          startIcon={isCopied ? <CheckIcon /> : <CopyIcon />}
        >
          {isCopied ? "Copied" : "Copy JSON"}
        </Button>
        <JSONInput
          placeholder={formattedSubscription}
          id="json_editor"
          height="100%"
          locale={locale}
          colors={{
            string: "#DAA520",
          }}
        />
      </Box>
    </Drawer>
  );
};

export default JsonEditorDrawer;
