import { TFFormattPrice } from "types/common";

export type TActiveProfitability = {
  number: number;
  name: string;
  date: string;
  quantity: string;
  currentPrice: TFFormattPrice;
  priceTotal: {
    value: TFFormattPrice,
    oneLot: TFFormattPrice,
  };
  priceActiality: {
    value: TFFormattPrice,
    oneLot: TFFormattPrice,
  };
  ownershipPeriod: number;
  profitabilityNow: {
    percent: number;
    money: TFFormattPrice;
  };
};

export type TFSortKey = "DEFAULT" | "PROFITABILITY" | "NUMBER" | "DATE";
export type TFSortDir = "ASC" | "DESC" | null;
