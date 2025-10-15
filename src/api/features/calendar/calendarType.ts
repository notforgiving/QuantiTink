import { InstrumentType, TEventType, TMoneyValue, TQuotation } from "types/common";

export type TDividend = {
    declaredDate: string;   // дата объявления
    createdAt: string;      // дата создания записи
    recordDate: string;     // дата реестра
    yieldValue: TQuotation; // доходность (процент)
    closePrice: TQuotation; // цена закрытия
    paymentDate: string;    // дата выплаты
    regularity: string;     // регулярность ("regular" / "once")
    dividendNet: TQuotation; // дивиденд на акцию (чистыми)
    lastBuyDate: string;    // крайний срок покупки для получения
    dividendType: string;   // тип дивиденда (обычный, промежуточный и т.п.)
};

export type TDividendsResponse = {
    dividends: TDividend[];
};

export type TCalendarEvent = {
    figi: string;
    instrumentType: InstrumentType;
    eventType: "dividend" | "coupon" | "amortization" | "redemption";
    date?: string;
    formattedDate?: string;
    amount?: number;
    currency?: string;
    description?: string;
    raw?: any;
};

export type TBondCoupon = {
    instrumentId: string; // UID или ID инструмента
    eventNumber: number; // Номер события
    eventDate: string; // Дата события (ISO)
    eventType: TEventType; // Тип события (купон, амортизация и т.д.)
    eventTotalVol: TQuotation; // Общий объём события
    fixDate: string; // Дата фиксации
    payDate: string; // Дата выплаты
    payOneBond: TMoneyValue; // Выплата на одну облигацию
    moneyFlowVal: TMoneyValue; // Общий денежный поток
    execution: string; // Код исполнения ("E" = исполнено)
    operationType: string; // Тип операции ("Фиксированный" и т.д.)
    value: TQuotation; // Значение (например, ставка купона)
    note: string;
    convertToFinToolId: string;
    couponStartDate?: string;
    couponEndDate?: string;
    couponPeriod?: number; // Длительность купонного периода в днях
    couponInterestRate?: TQuotation; // Процентная ставка купона
};

// Ответ API
export type TBondCouponsResponse = {
    events: TBondCoupon[];
};