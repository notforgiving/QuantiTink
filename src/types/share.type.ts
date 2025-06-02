import { TBrand } from "./common";

export const SHARES = 'shares';
export const GET_SHARES_LIST = `${SHARES}/getSharesListAction`;
export type TFSHARES = typeof GET_SHARES_LIST;

export type TShareState = {
    accountId: string,
    instrument: TShareInstrument[]
    dateApi: string;
}

export type TShareInstrument = {
    figi: string;
    ticker: string;
    isin: string;
    lot: number;
    name: string;
    brand: TBrand;
}

export const SHARE_LOCALSTORAGE_NAME = 'Tbalance_share';