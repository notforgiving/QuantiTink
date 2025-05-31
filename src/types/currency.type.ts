
export const CURRENCY = 'accounts';
export const GET_CURRENCY_LIST = `${CURRENCY}/getCurrencyListAction`;
export type TFGET_CURRENCY_LIST = typeof GET_CURRENCY_LIST;

export type TCurrencyResponse = {
    category: string,
    fromCurrency: {
        code: number;
        name: string;
        strCode: string;
    },
    toCurrency: {
        code: number,
        name: string,
        strCode: number
    },
    buy: number,
    sell: number
}

export type TCurrency = number;