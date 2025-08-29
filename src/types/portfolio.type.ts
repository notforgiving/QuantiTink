export type TFCurrency = 'rub' | 'usd';

export type TFInstrumentType = 'share' | 'etf' | 'bond';

export type TFOperationType = 'Выплата купонов' | 'Удержание комиссии за операцию' | 'Покупка ценных бумаг' | 'Пополнение брокерского счёта' | 'Удержание налога' | 'Вывод денежных средств' | 'Выплата дивидендов' | 'Удержание налога по дивидендам' | 'Выплата дивидендов на карту' | 'Пополнение денежных средств со счета' | 'Вывод денежных средств со счета' | 'Покупка ценных бумаг с карты' | 'Продажа ценных бумаг';

export type TFOperationOperationType = 'OPERATION_TYPE_OUT_MULTI' | 'OPERATION_TYPE_OUTPUT';

export type TFQuantity = {
    nano: number;
    units: string;
}

export type TFAmount = {
    currency: TFCurrency;
    nano: number;
    units: string;
}

export type TFPosition = {
    averagePositionPrice: TFAmount;
    averagePositionPriceFifo: TFAmount;
    currentPrice: TFAmount;
    figi: string;
    instrumentType: TFInstrumentType;
    quantity: TFQuantity;
    quantityLots: TFQuantity;
    ticker: string;
}


export type TFPortfolio = {
    accountId: string;
    positions: TFPosition[];
    totalAmountBonds: TFAmount;
    totalAmountCurrencies: TFAmount;
    totalAmountEtf: TFAmount;
    totalAmountPortfolio: TFAmount;
    totalAmountShares: TFAmount;
}

export const PORTFOLIOS = 'portfolios';
export const GET_PORTFOLIO_LIST = `${PORTFOLIOS}/getPortfoliosListAction`;
export type TFPORTFOLIOS = typeof PORTFOLIOS;

export const PORTFOLIOS_LOCALSTORAGE_NAME = 'Tbalance_portfolios';