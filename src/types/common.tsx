import { ReactComponent as RubbondsSvg } from "assets/rubbonds.svg";
import { ReactComponent as UsdbondsSvg } from "assets/usdbonds.svg";

export type TTariff = 'investor' | 'trader'; // и т.д.
export type TRiskLevel = 'STANDARD' | 'LOW' | 'HIGH'; // если знаешь другие
export type TWorkInstrument =
  | 'bond'
  | 'leverage'
  | 'russian_shares'
  | 'structured_income_bonds';

export type TMoneyValue = {
  currency: string;
  units: string;
  nano: number;
};

export type TQuotation = {
  units: string | number;
  nano: number;
}

export enum InstrumentType {
  Bond = "bond",
  Share = "share",
  Currency = "currency",
  Etf = "etf",
  Futures = "futures",
  Sp = "sp",
  Option = "option",
  StructuredProduct = "structured_product",
  ForeignShare = "foreign_share",
}

export type TTrade = {
  tradeId: string;
  dateTime: string; // ISO строка
  quantity: string;
  price: TMoneyValue;
};

export type TBrand = {
  logoName: string;
  logoBaseColor: string;
  textColor: string;
}

export const BondCurrencyConfig = {
  rub: {
    name: "Рублевые облигации",
    icon: <RubbondsSvg />,
  },
  usd: {
    name: "Долларовые облигации",
    icon: <UsdbondsSvg />,
  },
  cny: {
    name: "Облигации в юанях",
    icon: <UsdbondsSvg />,
  },
} as const;

export type TBondCurrency = keyof typeof BondCurrencyConfig;
