"use client";
import React from "react";

import AppProvider from "./provider.js";
import { Subscription } from "./model/subscription";
import WidgetImpl from "./widgetImpl";

import "@rainbow-me/rainbowkit/styles.css";
export type WidgetProps = Subscription;

export function Widget(props: WidgetProps) {
  return (
    <AppProvider>
      <WidgetImpl
        basic_info={props.basic_info}
        payment={props.payment}
        ui={props.ui}
        // chainName={props.chainName}
      />
    </AppProvider>
  );
}
