import { InstrumentType, TMoneyValue, TQuotation } from "types/common";

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
    figi: string;
    couponNumber: string;
    couponDate: string;      // дата выплаты
    couponStartDate: string; // начало купонного периода
    couponEndDate: string;   // конец купонного периода
    fixDate: string;         // дата фиксации реестра
    couponPeriod: number;    // длительность периода (дни)
    payOneBond: TMoneyValue; // выплата на одну облигацию
};

// Ответ API
export type TBondCouponsResponse = {
    events: TBondCoupon[];
};