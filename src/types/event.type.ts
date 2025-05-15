import { TFAmount } from "./portfolio.type";

export const EVENTS = 'events';
export const GET_EVENTS_LIST = `${EVENTS}/getEventsListAction`;
export type TFPORTFOLIOS = typeof EVENTS;

export type TEventType = 'Фиксированный' | 'Плавающий'

export type TEventsResponse = {
    events: TEvents[]
}

export type TEvents = {
    operationType: TEventType,
    payDate: string;
    payOneBond: TFAmount,
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