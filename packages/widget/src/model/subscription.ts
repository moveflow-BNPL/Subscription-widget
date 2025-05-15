import { NetworkType } from "../config/coinConfig";

export interface BasicInfo {
  name: string;
  description: string;
}

export interface Payment {
  id?: number;
  network: NetworkType;
  coinType: string;
  startTime: number;
  endTime: number;
  amountType: "fixed" | "custom";
  streamRate?: number; // it is used when amountType == "fixed"
  rateType?: "month" | "day" | "year"; // it is used when amountType == "fixed"
  depositAmount?: number; // it is used when amountType == "custom"
  receiver: string;
  fixedRate: number;
}

export interface UI {
  container_border_radius: number;
  field_border_radius: number;
  button_border_radius: number;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

export interface Subscription {
  ui: UI;
  basic_info: BasicInfo;
  payment: Payment[];
  // chainName: string
}
