import { TBrand, TMoneyValue, TQuotation } from "types/common";

export interface TBondsItem {
  figi: string;
  ticker: string;
  classCode: string;
  isin: string;
  lot: number;
  currency: string;
  shortEnabledFlag: boolean;
  name: string; // Имя
  exchange: string;
  couponQuantityPerYear: number;
  maturityDate: string;
  nominal: TMoneyValue;
  initialNominal: TMoneyValue;
  stateRegDate: string;
  placementDate: string;
  placementPrice: TMoneyValue;
  aciValue: TMoneyValue;
  countryOfRisk: string;
  countryOfRiskName: string;
  sector: string;
  issueKind: string;
  issueSize: string;
  issueSizePlan: string;
  tradingStatus: string;
  otcFlag: boolean;
  buyAvailableFlag: boolean;
  sellAvailableFlag: boolean;
  floatingCouponFlag: boolean; // флоатер или постоянный купон
  perpetualFlag: boolean;
  amortizationFlag: boolean;
  minPriceIncrement: TQuotation;
  apiTradeAvailableFlag: boolean;
  uid: string;
  realExchange: string;
  positionUid: string;
  assetUid: string;
  requiredTests: string[];
  forIisFlag: boolean;
  forQualInvestorFlag: boolean;
  weekendFlag: boolean;
  blockedTcaFlag: boolean;
  subordinatedFlag: boolean;
  liquidityFlag: boolean;
  first1minCandleDate: string;
  first1dayCandleDate: string;
  riskLevel: string;
  brand: TBrand;
  bondType: string;
}

export interface TBondsResponse {
  instruments: TBondsItem[];
}
