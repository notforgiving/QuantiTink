import { TFFormattPrice } from "types/common";

export type TActiveProfitability = {
  number: number;
  name: string;
  date: string;
  quantity: string;
  currentPrice: TFFormattPrice;
  priceTotal: TFFormattPrice;
  priceActiality: TFFormattPrice;
  ownershipPeriod: number;
  profitabilityNow: {
    percent: number;
    money: TFFormattPrice;
  };
};

export type TFSortKey = "DEFAULT" | "PROFITABILITY" | "NUMBER" | "DATE";
export type TFSortDir = "ASC" | "DESC" | null;
