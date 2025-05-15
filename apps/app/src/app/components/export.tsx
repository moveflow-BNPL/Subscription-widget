"use client";

import { Button, Snackbar, SnackbarContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSnackBar from "../../hooks/useSnackBar";
import useSubscription from "../../hooks/useSubscription";
import JsonEditorDrawer from "./jsonEditorDrawer";

const Export = () => {
  const { subscription } = useSubscription();
  const [open, setOpen] = React.useState(false);
  const { snackBarMessage, setSnackBarMessage } = useSnackBar();
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(subscription, null, 2));
    setIsCopied(true);
    setSnackBarMessage("JSON Copied");
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    setSnackBarMessage("");
  }, []);

  return (
    <section>
      <p className="text-center my-8 text-xl text-white">How does it work?</p>
      <p className="text-gray-300 my-8 mx-auto text-base w-[370px] font-semibold text-center">
        Use this JSON configuration when embedding react or web component
        directly into your code.
      </p>

      <div className="flex gap-10 justify-between">
        <Button
          variant="contained"
          sx={{
            width: 200,
            py: 3,
            px: 4,
            "&.MuiButton-root": {
              background: "#F143E2",
            },
          }}
          onClick={toggleDrawer}
        >
          View JSON
        </Button>

        <Button
          variant="outlined"
          onClick={handleCopyClick}
          // color="inherit"
          // className="border border-[#F143E2] btn-background2"
          sx={{
            border: "1px solid #FFFFFF4D",
            width: 200,
            py: 2,
            px: 4,
          }}
        >
          Copy JSON
        </Button>
        <JsonEditorDrawer
          open={open}
          onClose={toggleDrawer}
          subscription={subscription}
        />
      </div>
      <Snackbar
        open={snackBarMessage !== ""}
        autoHideDuration={6000}
        onClose={() => {
          setSnackBarMessage("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: "#F143E2",
            color: "#FFFFFF",
            justifyContent: "center",
            fontSize: "17px",
          }}
          message={snackBarMessage}
        />
      </Snackbar>
    </section>
  );
};

export default Export;
