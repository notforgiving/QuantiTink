import { TBrand } from "./common";
import { TFAmount, TFCurrency } from "./portfolio.type";

export const BONDS = 'bonds';
export const GET_BONDS_LIST = `${BONDS}/getBondsListAction`;
export type TFBONDS = typeof BONDS;

export type TInstrumentObject = {
    accountId: string,
    instrument: TInstrument[]
    dateApi: string;
}

export type TFloatingCouponFlagText = "Плавающий" | "Фиксированный";

export type TInstrument = {
    figi: string;
    initialNominal: TFAmount;
    isin: string;
    lot: number;
    name: string;
    nominal: TFAmount;
    ticker: string;
    currency: TFCurrency;
    brand: TBrand;
    aciValue: TFAmount;
    maturityDate: string;
    floatingCouponFlag: boolean;
    riskLevel: 'RISK_LEVEL_LOW' | 'RISK_LEVEL_MODERATE' | 'RISK_LEVEL_HIGH';
}

export const BONDS_LOCALSTORAGE_NAME = 'Tbalance_bonds';