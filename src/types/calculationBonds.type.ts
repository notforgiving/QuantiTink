import { TFQuantity } from "./portfolio.type";

export const CALC_LOCALSTORAGE_NAME = 'Tbalance_calculations';
export const ALL_BONDS = 'all';
export const GET_ALL_BONDS_LIST = `${ALL_BONDS}/getAllBondsListAction`;
export type TFGET_ALL_BONDS_LIST = typeof GET_ALL_BONDS_LIST;

export const ALL_BONDS_LOCALSTORAGE_NAME = 'Tbalance_all_bonds';

export type TOrderBook = {
    figi: string;
    lastPrice: TFQuantity;
}