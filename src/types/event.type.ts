import { TBrand, TFFormattPrice } from "./common";
import { TFAmount, TFQuantity } from "./portfolio.type";

export const EVENTS = 'events';
export const GET_EVENTS_LIST = `${EVENTS}/getEventsListAction`;
export type TFPORTFOLIOS = typeof EVENTS;

/** OA - амортизация */
/** OA - полное погашение */
export type TEventType = 'Фиксированный' | 'Плавающий' | 'OM' | 'OA'

export type TEventsResponse = {
    events: TEvents[]
}

export type TEvents = {
    operationType: TEventType,
    payDate: string;
    paymentDate: string;
    lastBuyDate: string;
    payOneBond: TFAmount,
    dividendNet: TFAmount,
    dividendType: string;
    eventType: string;
    createdAt: string;
}

export type TEventFigi = {
    figi: string;
}

export type TPortfolioEvents = TEventFigi & TEvents;

export type TEventsState = {
    accountId: string;
    portfolioEvents: TPortfolioEvents[];
    dateApi: string;
}


export type TOperationTypeEvent = 'Дивиденды' | 'Купоны' | 'Погашение' | 'Амортизация'

export type TPayOutsEvent = {
    figi: string;
    paymentDate: string;
    name: string;
    operationType: TOperationTypeEvent;
    payOneLot: TFAmount,
    quantity: TFQuantity;
    oneLot: number;
    brand: TBrand;
    totalAmount: TFFormattPrice;
}