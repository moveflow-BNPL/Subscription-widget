"use client";
import { Payment } from "../model/subscription";
import { Button, Typography } from "@mui/material";
import { useSubscription } from "../hooks/useSubscription";
import { useEffect } from "react";

interface SubscriptionProps {
  payment: Payment;
  primaryColor: string;
  fontFamily: string;
  borderRadius: number;
  chainName: string;
}

function SubscriptionButton(props: SubscriptionProps) {
  const ETHEREUM_CONTRACT = "0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099";
  const coinAddress = "0xEAB439707cA5F8e4e47c697629E77aE26842cbba";
  const decimal = 18;

  const { payment, primaryColor, fontFamily, borderRadius, chainName } = props;
  const { state, resetState, handleCreateSubscription } = useSubscription(
    ETHEREUM_CONTRACT,
    coinAddress,
    decimal
  );
  useEffect(() => {
    resetState();
  }, [payment]);
  return (
    <div>
      {state.networkError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {state.networkError}
        </div>
      )}

      <button
        onClick={() => handleCreateSubscription(payment, chainName)}
        disabled={
          state.isCreatingSubscription ||
          state.tokensApproved ||
          state.subscriptionCreated
        }
        style={{
          width: "100%",
          borderRadius: `${borderRadius}px`,
          background: primaryColor,
          color: "white",
          fontFamily: fontFamily,
          padding: "10px",
          cursor:
            state.isCreatingSubscription ||
            state.tokensApproved ||
            state.subscriptionCreated
              ? "not-allowed"
              : "pointer",
          marginTop: "10px",
        }}
      >
        {state.isCreatingSubscription
          ? "Creating Subscription..."
          : state.subscriptionCreated
          ? "Subscription Created Successfully"
          : "Create Subscription"}
      </button>
    </div>
  );
}

export default SubscriptionButton;
