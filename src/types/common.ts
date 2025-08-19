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
