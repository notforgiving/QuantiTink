import { TBondsItem } from "api/features/bonds/bondsTypes";
import { TFavoriteBond } from "api/features/favoritesBonds/favoritesBondsTypes";

import { formatMoney } from "./formatMoneyAmount";

export interface TBondCalculationResult {
    nominal: number;                   // Номинал облигации, руб
    pricePercent: number;              // Цена облигации, % от номинала
    couponPerBond: number;             // Купонный доход на одну облигацию, руб
    couponYieldPercent: number;        // Купонная доходность, %
    couponPaymentsLeft: number;        // Кол-во купонных выплат до погашения
    accruedInterest: number;           // НКД, руб
    maturityDate: string;              // Дата погашения
    daysToMaturity: number;            // Дней до погашения
    yearsToMaturity: number;           // Лет до погашения
    purchaseCommission: number;        // Комиссия за покупку, руб
    bondPrice: number;                 // Цена самих облигаций (руб)
    totalPurchasePrice: number;        // Полная цена покупки
    aboveNominal: boolean;             // Цена покупки выше номинала
    totalCouponIncome: number;         // Суммарно получим купонами
    redemptionMargin: number;          // Маржа от погашения
    couponTax: number;                 // Налог на купоны
    redemptionTax: number;             // Налог на погашение
    redemption: number;                // Погашение
    netTotal: number;                  // Чистая сумма в итоге
    netProfit: number;                 // Чистая прибыль
    annualYieldPercent: number;        // Годовая доходность, %
}

export interface TBondCalculationInput {
    bond: TFavoriteBond;          // Данные облигации
    taxPercentRedemption?: number;// Налог на погашение в %
}

export function calculateBond(
    bond: TFavoriteBond,
    commissionPercent: number,
): TBondCalculationResult {
    const quantity = 1;
    const taxPercentCoupon = 13;
    const taxPercentRedemption = 13;
    // Номинал одной облигации
    const nominal = Number(bond.nominal.units) + bond.nominal.nano / 1_000_000_000;

    // Цена облигации в % от номинала
    const pricePercent = (formatMoney(bond.lastPrice).value / nominal) * 100;

    // Купон на одну облигацию
    const couponPerBond = bond.couponQuantityPerYear > 0
        ? nominal * bond.couponQuantityPerYear / 100 // можно поменять по точной формуле
        : 0;

    // Купонная доходность %
    const couponYieldPercent = (couponPerBond / formatMoney(bond.lastPrice).value) * 100;

    // Кол-во купонных выплат до погашения
    const today = new Date();
    const maturityDate = new Date(bond.maturityDate);
    const yearsToMaturity = Math.max((maturityDate.getTime() - today.getTime()) / (1000 * 3600 * 24 * 365), 0);
    const couponPaymentsLeft = Math.ceil(yearsToMaturity * bond.couponQuantityPerYear);

    // Накопленный купонный доход (НКД) — грубо
    const accruedInterest = couponPerBond * (1 - yearsToMaturity / couponPaymentsLeft);

    // Комиссия за покупку
    const purchaseCommission = (formatMoney(bond.lastPrice).value * quantity * commissionPercent) / 100;

    // Цена самих облигаций
    const bondPrice = formatMoney(bond.lastPrice).value * quantity;

    // Полная цена покупки
    const totalPurchasePrice = bondPrice + purchaseCommission + accruedInterest * quantity;

    // Цена покупки выше номинала
    const aboveNominal = formatMoney(bond.lastPrice).value > nominal;

    // Суммарно получим купонами
    const totalCouponIncome = couponPerBond * quantity * couponPaymentsLeft;

    // Маржа от погашения
    const redemptionMargin = (nominal - formatMoney(bond.lastPrice).value) * quantity;

    // Налоги
    const couponTax = (totalCouponIncome * taxPercentCoupon) / 100;
    const redemptionTax = (redemptionMargin * taxPercentRedemption) / 100;

    // Погашение
    const redemption = nominal * quantity;

    // Чистая сумма
    const netTotal = totalCouponIncome - couponTax + redemption - redemptionTax - purchaseCommission;

    // Чистая прибыль
    const netProfit = netTotal - bondPrice;

    // Годовая доходность %
    const annualYieldPercent = (netProfit / totalPurchasePrice) / yearsToMaturity * 100;

    return {
        nominal,
        pricePercent,
        couponPerBond,
        couponYieldPercent,
        couponPaymentsLeft,
        accruedInterest,
        maturityDate: bond.maturityDate,
        daysToMaturity: Math.ceil((maturityDate.getTime() - today.getTime()) / (1000 * 3600 * 24)),
        yearsToMaturity,
        purchaseCommission,
        bondPrice,
        totalPurchasePrice,
        aboveNominal,
        totalCouponIncome,
        redemptionMargin,
        couponTax,
        redemptionTax,
        redemption,
        netTotal,
        netProfit,
        annualYieldPercent,
    };
}