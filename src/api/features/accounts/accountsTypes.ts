import { InstrumentType, TBrand, TMoneyValue, TRiskLevel, TTrade } from "types/common";

import { IGetBondCouponsEvents } from "../favoritesBonds/favoritesBondsTypes";

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

export type TPortfolioPositionFull =
  TPortfolioPosition &
  (
    & TBondInstrument
    & TEtfInstrument
    & TShareInstrument
  ) & {
    asset?: TAsset; // добавляем позже
  } & {
    events?: IGetBondCouponsEvents[];
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
  positions: TPortfolioPositionFull[];
  virtualPositions: unknown[];
  dailyYield: TMoneyValue;
  dailyYieldRelative: {
    units: string;
    nano: number;
  };
};

export type TOperation = {
  id: string;
  parentOperationId: string;
  currency: string;
  payment: TMoneyValue;
  price: TMoneyValue;
  commission: TMoneyValue;
  state: 'OPERATION_STATE_UNSPECIFIED' | 'OPERATION_STATE_EXECUTED' | 'OPERATION_STATE_CANCELED';
  quantity: string;
  quantityRest: string;
  figi: string;
  instrumentType: InstrumentType;
  date: string; // ISO строка
  type: "OPERATION_TYPE_UNSPECIFIED"
  | "OPERATION_TYPE_INPUT"
  | "OPERATION_TYPE_BOND_TAX"
  | "OPERATION_TYPE_OUTPUT_SECURITIES"
  | "OPERATION_TYPE_OVERNIGHT"
  | "OPERATION_TYPE_TAX"
  | "OPERATION_TYPE_BOND_REPAYMENT_FULL"
  | "OPERATION_TYPE_SELL_CARD"
  | "OPERATION_TYPE_DIVIDEND_TAX"
  | "OPERATION_TYPE_OUTPUT"
  | "OPERATION_TYPE_BOND_REPAYMENT"
  | "OPERATION_TYPE_TAX_CORRECTION"
  | "OPERATION_TYPE_SERVICE_FEE"
  | "OPERATION_TYPE_BENEFIT_TAX"
  | "OPERATION_TYPE_MARGIN_FEE"
  | "OPERATION_TYPE_BUY"
  | "OPERATION_TYPE_BUY_CARD"
  | "OPERATION_TYPE_INPUT_SECURITIES"
  | "OPERATION_TYPE_SELL_MARGIN"
  | "OPERATION_TYPE_BROKER_FEE"
  | "OPERATION_TYPE_BUY_MARGIN"
  | "OPERATION_TYPE_DIVIDEND"
  | "OPERATION_TYPE_SELL"
  | "OPERATION_TYPE_COUPON"
  | "OPERATION_TYPE_SUCCESS_FEE"
  | "OPERATION_TYPE_DIV_EXT"
  | "OPERATION_TYPE_TAX_PROGRESSIVE"
  | "OPERATION_TYPE_BOND_TAX_PROGRESSIVE"
  | "OPERATION_TYPE_DIVIDEND_TAX_PROGRESSIVE"
  | "OPERATION_TYPE_BENEFIT_TAX_PROGRESSIVE"
  | "OPERATION_TYPE_TAX_CORRECTION_PROGRESSIVE"
  | "OPERATION_TYPE_TAX_REPO_PROGRESSIVE"
  | "OPERATION_TYPE_TAX_REPO"
  | "OPERATION_TYPE_TAX_REPO_HOLD"
  | "OPERATION_TYPE_TAX_REPO_REFUND"
  | "OPERATION_TYPE_TAX_REPO_HOLD_PROGRESSIVE"
  | "OPERATION_TYPE_TAX_REPO_REFUND_PROGRESSIVE"
  | "OPERATION_TYPE_DIVIDEND_TRANSFER"
  | "OPERATION_TYPE_ACCRUING_VARMARGIN"
  | "OPERATION_TYPE_WRITING_OFF_VARMARGIN"
  | "OPERATION_TYPE_DELIVERY_BUY"
  | "OPERATION_TYPE_DELIVERY_SELL"
  | "OPERATION_TYPE_TRACK_MFEE"
  | "OPERATION_TYPE_TRACK_PFEE"
  | "OPERATION_TYPE_TAX_CORRECTION_COUPON"
  | "OPERATION_TYPE_CASH_FEE"
  | "OPERATION_TYPE_OUT_FEE"
  | "OPERATION_TYPE_OUT_STAMP_DUTY"
  | "OPERATION_TYPE_OUTPUT_SWIFT"
  | "OPERATION_TYPE_INPUT_SWIFT"
  | "OPERATION_TYPE_OUTPUT_ACQUIRING"
  | "OPERATION_TYPE_INPUT_ACQUIRING"
  | "OPERATION_TYPE_OUTPUT_PENALTY"
  | "OPERATION_TYPE_ADVICE_FEE"
  | "OPERATION_TYPE_TRANS_IIS_BS"
  | "OPERATION_TYPE_TRANS_BS_BS"
  | "OPERATION_TYPE_OUT_MULTI";
  operationType: | "OPERATION_TYPE_BUY"   // покупка инструмента
  | "OPERATION_TYPE_SELL"  // продажа инструмента
  | "OPERATION_TYPE_DIVIDEND"  // получение дивидендов
  | "OPERATION_TYPE_COUPON"    // получение купона (для облигаций)
  | "OPERATION_TYPE_TAX"       // налог / удержание
  | "OPERATION_TYPE_FEE"       // комиссия
  | "OPERATION_TYPE_WITHDRAW"  // вывод средств
  | "OPERATION_TYPE_DEPOSIT"   // пополнение
  | "OPERATION_TYPE_TRANSFER"  // перевод/перемещение между счетами
  | "OPERATION_TYPE_REBALANCE" // ребалансировка
  trades: TTrade[];
  ticker: string;
  assetUid: string;
  positionUid: string;
  instrumentUid: string;
  childOperations: TOperation[];
};

export type TOperationsResponse = {
  operations: TOperation[];
};

export type TBondInstrument = {
  assetUid: string;
  callDate?: string; // ISO date
  countryOfRisk: string;
  blockedTcaFlag: boolean;

  dlongClient: TMoneyValue;
  dshortClient: TMoneyValue;
  dshort: TMoneyValue;
  dshortMin: TMoneyValue;
  dlong: TMoneyValue;
  dlongMin: TMoneyValue;
  klong: TMoneyValue;
  kshort: TMoneyValue;
  riskLevel: TRiskLevel;
  maturityDate?: string;
  sellAvailableFlag: boolean;
  first1dayCandleDate?: string;
  placementPrice: TMoneyValue;
  sector: string;
  brand: TBrand;
  liquidityFlag: boolean;
  forIisFlag: boolean;
  positionUid: string;
  shortEnabledFlag: boolean;
  name: string;
  exchange: string;
  subordinatedFlag: boolean;
  floatingCouponFlag: boolean;
  figi: string;
  lot: number;
  uid: string;
  requiredTests: string[];
  nominal: TMoneyValue;
  currency: string;
  aciValue: TMoneyValue;
  buyAvailableFlag: boolean;
  weekendFlag: boolean;
  classCode: string;
  ticker: string;
  couponQuantityPerYear?: number;
  forQualInvestorFlag: boolean;
  initialNominal: TMoneyValue;
  apiTradeAvailableFlag: boolean;
  first1minCandleDate?: string;
  stateRegDate?: string;
  issueSizePlan?: string;
  minPriceIncrement: TMoneyValue;
  otcFlag: boolean;
  issueKind: string;
  placementDate?: string;
  amortizationFlag: boolean;
  perpetualFlag: boolean;
  issueSize?: string;
  countryOfRiskName: string;
  isin: string;
}

export type TBondsInstrumentResponse = {
  instrument: TBondInstrument;
}

// Основной тип инструмента
export type TEtfInstrument = {
  releasedDate: string; // ISO-строка
  fixedCommission: TMoneyValue;
  assetUid: string;
  figi: string;
  dshortMin: TMoneyValue;
  countryOfRisk: string;
  lot: number;
  uid: string;
  requiredTests: string[];
  blockedTcaFlag: boolean;
  dlong: TMoneyValue;
  dlongClient: TMoneyValue;
  sellAvailableFlag: boolean;
  currency: string;
  first1dayCandleDate: string; // ISO-строка
  sector: string;
  brand: TBrand;
  buyAvailableFlag: boolean;
  weekendFlag: boolean;
  classCode: string;
  focusType: string;
  ticker: string;
  forQualInvestorFlag: boolean;
  liquidityFlag: boolean;
  forIisFlag: boolean;
  positionUid: string;
  apiTradeAvailableFlag: boolean;
  dlongMin: TMoneyValue;
  shortEnabledFlag: boolean;
  kshort: TMoneyValue;
  first1minCandleDate: string; // ISO-строка
  minPriceIncrement: TMoneyValue;
  otcFlag: boolean;
  dshortClient: TMoneyValue;
  klong: TMoneyValue;
  dshort: TMoneyValue;
  rebalancingFreq: string;
  name: string;
  numShares: TMoneyValue;
  exchange: string;
  countryOfRiskName: string;
  isin: string;
};

export type TEtfsInstrumentResponse = {
  instrument: TEtfInstrument;
};

export interface TShareInstrument {
  assetUid: string;
  figi: string;
  uid: string;
  positionUid: string;
  ticker: string;
  classCode: string;
  name: string;
  isin: string;
  currency: string;
  exchange: string;
  sector: string;
  countryOfRisk: string;
  countryOfRiskName: string;

  lot: number;
  issueSize: string;
  issueSizePlan: string;

  forQualInvestorFlag: boolean;
  forIisFlag: boolean;
  shortEnabledFlag: boolean;
  apiTradeAvailableFlag: boolean;
  buyAvailableFlag: boolean;
  sellAvailableFlag: boolean;
  weekendFlag: boolean;
  otcFlag: boolean;
  blockedTcaFlag: boolean;
  liquidityFlag: boolean;
  divYieldFlag: boolean;

  first1dayCandleDate: string;   // ISO date string
  first1minCandleDate: string;   // ISO date string
  ipoDate: string;               // ISO date string

  requiredTests: string[];

  nominal: TMoneyValue;
  minPriceIncrement: TMoneyValue;

  dlong: TMoneyValue;
  dlongMin: TMoneyValue;
  dlongClient: TMoneyValue;
  dshort: TMoneyValue;
  dshortMin: TMoneyValue;
  dshortClient: TMoneyValue;
  klong: TMoneyValue;
  kshort: TMoneyValue;

  brand: TBrand;
}

export interface TSharesInstrumentResponse {
  instrument: TShareInstrument;
}

export type TAsset = {
  uid: string;
  type: string; // "ASSET_TYPE_SECURITY"
  name: string;
  nameBrief: string;
  description: string;
  requiredTests: string[];
  security: {
    isin: string;
    type: string; // "bond"
    instrumentKind: string; // "INSTRUMENT_TYPE_BOND"
    bond: {
      currentNominal: {
        units: string;
        nano: number;
      };
      borrowName: string; // Эмитент
      issueSize: {
        units: string;
        nano: number;
      };
      nominal: {
        units: string;
        nano: number;
      };
      nominalCurrency: string;
      issueKind: string;
      interestKind: string;
      couponQuantityPerYear: number;
      indexedNominalFlag: boolean;
      subordinatedFlag: boolean;
      collateralFlag: boolean;
      taxFreeFlag: boolean;
      amortizationFlag: boolean;
      floatingCouponFlag: boolean;
      perpetualFlag: boolean;
      maturityDate: string; // ISO
      returnCondition: string;
      stateRegDate: string; // ISO
      placementDate: string; // ISO
      placementPrice: {
        units: string;
        nano: number;
      };
      issueSizePlan: {
        units: string;
        nano: number;
      };
    };
  };
  gosRegCode: string;
  cfi: string;
  codeNsd: string;
  status: string; // "ready"
  brand: {
    uid: string;
    name: string; // "Селигдар"
    description: string;
    info: string;
    company: string;
    sector: string; // "materials"
    countryOfRisk: string; // "RU"
    countryOfRiskName: string; // "Россия"
  };

  updatedAt: string; // ISO
  brCode: string;
  brCodeName: string;

  instruments: {
    uid: string;
    figi: string;
    instrumentType: string; // "bond"
    ticker: string;
    classCode: string;
    links: string[];
    instrumentKind: string; // "INSTRUMENT_TYPE_BOND"
    positionUid: string;
  }[];
};
export interface TAssetResponse {
  asset: TAsset;
}
