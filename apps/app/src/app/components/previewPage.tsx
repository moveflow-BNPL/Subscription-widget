"use client";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@/lib/mui";
import useSubscription from "../../hooks/useSubscription";

import Widget, { WidgetProps, NetworkType } from "@moveflow/widget";
import { useEffect } from "react";

const PreviewPage = () => {
  const { subscription } = useSubscription();

  useEffect(() => {
    console.log("subscription", subscription.payment);
  }, [subscription.payment]);

  return (
    <Box
      sx={{
        paddingTop: 3,
        px: "18vw",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        background: "linear-gradient(152.1deg, #262832 0.96%, #262832 98.92%)",
        width: "70%",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h2"
        component="div"
        sx={{
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        Widget Preview
      </Typography>

      <Widget {...(subscription as any)} />
    </Box>
  );
};

export default PreviewPage;
