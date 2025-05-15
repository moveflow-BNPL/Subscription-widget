import React, { useState, useEffect } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { Payment } from "../model/subscription";

interface SubscriptionProps {
  payment: Payment;
  primaryColor: string;
  fontFamily: string;
  borderRadius: number;
  chainName: string;
}

const LightLinkSubscriptionButton: React.FC<SubscriptionProps> = (props) => {
  const LightLinkContractAddress = "0x35A7B4067b2A652E19202264Cd9977451ab3a7dC";
  const coinAddress = "0x1de55504baD55557728Dc914f35792278e0d9623";
  const decimal = 18;

  const { payment, primaryColor, fontFamily, borderRadius, chainName } = props;
  const { state, resetState, handleCreateSubscription } = useSubscription(
    LightLinkContractAddress,
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
};

export default LightLinkSubscriptionButton;
