import { TFAmount, TFCurrency } from "./portfolio.type";

export const BONDS = 'bonds';
export const GET_BONDS_LIST = `${BONDS}/getBondsListAction`;
export type TFBONDS = typeof BONDS;

export type TInstrumentObject = {
    accountId: string,
    instrument: TInstrument[]
    dateApi: string;
}

export type TInstrument = {
    figi: string;
    initialNominal: TFAmount;
    isin: string;
    lot: number;
    name: string;
    nominal: TFAmount;
    ticker: string;
    currency: TFCurrency;
}