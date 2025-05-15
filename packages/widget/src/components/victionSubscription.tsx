import React, { useState, useEffect } from "react";
import { Payment } from "../model/subscription";
import { useSubscription } from "../hooks/useSubscription";

interface SubscriptionProps {
  payment: Payment;
  primaryColor: string;
  fontFamily: string;
  borderRadius: number;
  chainName: string;
}

const VictionSubscription: React.FC<SubscriptionProps> = (props) => {
  const VictionContractAddress = "0xF6F48D9F9220C2a30d070e5011817Cc87Ca33f87";
  const VictionCoinAddress = "0xA841ac49D7387Fc56F6582B66E8A59FdadBf910a";
  const decimal = 18;

  const { payment, primaryColor, fontFamily, borderRadius, chainName } = props;
  const { state, resetState, handleCreateSubscription } = useSubscription(
    VictionContractAddress,
    VictionCoinAddress,
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
};

export default VictionSubscription;
