import { InstrumentType, TMoneyValue } from "types/common";

export type TPortfolioPosition = {
  figi: string;
  instrumentType: InstrumentType;
  quantity: TMoneyValue;
  averagePositionPrice: TMoneyValue;
  expectedYield: TMoneyValue;
  currentNkd?: TMoneyValue;
  averagePositionPricePt: TMoneyValue;
  currentPrice: TMoneyValue;
  averagePositionPriceFifo: TMoneyValue;
  quantityLots: TMoneyValue;
  blocked: boolean;
  blockedLots: TMoneyValue;
  positionUid: string;
  instrumentUid: string;
  varMargin: TMoneyValue;
  expectedYieldFifo: TMoneyValue;
  dailyYield: TMoneyValue;
  ticker: string;
};

export type TPortfolioResponse = {
  accountId: string;
  totalAmountShares: TMoneyValue;
  totalAmountBonds: TMoneyValue;
  totalAmountEtf: TMoneyValue;
  totalAmountCurrencies: TMoneyValue;
  totalAmountFutures: TMoneyValue;
  totalAmountOptions: TMoneyValue;
  totalAmountSp: TMoneyValue;
  totalAmountPortfolio: TMoneyValue;
  expectedYield: TMoneyValue;
  positions: TPortfolioPosition[];
  virtualPositions: unknown[];
  dailyYield: TMoneyValue;
  dailyYieldRelative: {
    units: string;
    nano: number;
  };
};