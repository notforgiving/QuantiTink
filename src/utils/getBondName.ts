import { BondCurrencyConfig, TBondCurrency } from "types/common";

export function getBondName(currency: TBondCurrency) {
  return BondCurrencyConfig[currency];
}