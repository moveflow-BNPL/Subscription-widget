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

const PharosSubscription: React.FC<SubscriptionProps> = (props) => {
  const pharosContractAddress = "0x8e5249a5C8d1a7107AABF7B03Ea2419aCB4d0197";
  const pharCoinAddress = "0x8308135faA8E86B50Df94Aa54033d16784C1E98A";
  const decimal = 6;

  const { payment, primaryColor, fontFamily, borderRadius, chainName } = props;
  const { state, resetState, handleCreateSubscription } = useSubscription(
    pharosContractAddress,
    pharCoinAddress,
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
          (state.isCreatingSubscription ||
            state.tokensApproved ||
            state.subscriptionCreated) &&
          !state.networkError
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

export default PharosSubscription;
