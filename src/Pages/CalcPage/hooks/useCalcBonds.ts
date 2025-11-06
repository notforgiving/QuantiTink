import { useMemo } from "react";
import { TFavoriteBond } from "api/features/favoritesBonds/favoritesBondsTypes";
import moment from "moment";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";


// Тип результата
export interface TCalculatedBond extends TFavoriteBond {
    /** Комиссия */
    comission: number;
    /* НКД */
    nkd: TFormatMoney;
    /** Текущая цена в процентах */
    currentPercentPrice: number;
    /* Текущая цена в валюте*/
    nominalValue: TFormatMoney;
    /* Цена облигаций в валюте */
    currentFormatPrice: TFormatMoney;
    /* Комиссия при покупке */
    comissionFullPrice: TFormatMoney;
    /* Полная цена покупки с учетом комиссии */
    currentPriceWithComission: TFormatMoney;
    /* Размер одного купона */
    payOneBond: TFormatMoney;
    /* Купонная доходность */
    couponeYeild: string;
    /* Колиечство выплат до погашения */
    couponesFromMaturityDate: number;
    /* Отформатированая дата погашения */
    formatMaturityDate: string;
    /* Дней до погашения */
    daysToMaturity: number;
    /* Лет до погашения */
    yearsToMaturity: string;
    /* Цена покупки выше номинала */
    aboveNominal: boolean;
    /* Получим купонами */
    totalCouponesValue: TFormatMoney;
    /* Маржа от погашения */
    marginFromRepayment: TFormatMoney;
    /* Налог на купоны */
    couponTax: TFormatMoney;
    /* Налог на погашение */
    repaymentTax: TFormatMoney;
    /* Чистая сумма в итоге */
    netMarginRrepayment: TFormatMoney;
    /* Чистая прибыль */
    netProfit: TFormatMoney;
    /* Годовая доходность */
    annualProfitability: string;
}

interface UseCalcBondsProps {
    favoritesBonds: TFavoriteBond[];
    comission: number;
}

type TUseCalcBonds = (props: UseCalcBondsProps) => {
    result: TCalculatedBond[]
}

export const useCalcBonds: TUseCalcBonds = ({ favoritesBonds, comission }) => {
    const INCOME_TAX = 0; // по умолчанию без налога
    const result = useMemo(() => {
        if (!favoritesBonds?.length) return [];
        return favoritesBonds.map((bond) => {
            const {
                couponQuantityPerYear,
                maturityDate,
                lastPrice,
                initialNominal,
                events,
                aciValue,
            } = bond;

            // НКД
            const nkd = formatMoney(aciValue);
            const nominalValue = formatMoney(initialNominal);
            // Текущая цена
            const currentPercentPrice = lastPrice ? lastPrice : 100;
            // Цена облигаций в рублях
            const currentFormatPrice = formatMoney(currentPercentPrice * 10)
            // Комиссия при покупке
            const comissionFullPrice = formatMoney(currentFormatPrice.value * comission / 100)
            // Полная цена покупки с учетом комиссии
            const currentPriceWithComission = formatMoney(comissionFullPrice.value + currentFormatPrice.value + nkd.value);
            // Размер одного купона
            const payOneBond = events ? formatMoney(events[0].payOneBond) : formatMoney(0);
            // Купонная доходность
            const couponeYeild = ((payOneBond.value * couponQuantityPerYear) / currentPriceWithComission.value * 100).toFixed(1)
            // Колиечство выплат до погашения
            const couponesFromMaturityDate = events?.length || 0;
            // Отформатированая дата погашения
            const formatMaturityDate = moment(maturityDate).format('DD.MM.YYYY')
            // Дней до погашения
            const daysToMaturity = maturityDate
                ? moment(maturityDate).diff(moment(), "days")
                : 0;
            // Лет до погашения
            const yearsToMaturity = (daysToMaturity > 0 ? daysToMaturity / 365 : 0).toFixed(1);
            // Цена покупки выше номинала
            const aboveNominal = currentFormatPrice.value > nominalValue.value ? true : false
            // Получим купонами
            const totalCouponesValue = formatMoney(couponesFromMaturityDate * payOneBond.value);
            // Маржа от погашения
            const marginFromRepayment = aboveNominal ? formatMoney(0) : formatMoney(nominalValue.value - currentPriceWithComission.value)
            // Налог на купоны
            const couponTax = formatMoney(INCOME_TAX * totalCouponesValue.value / 100)
            // Налог на погашение
            const repaymentTax = aboveNominal ? formatMoney(0) : formatMoney(marginFromRepayment.value * INCOME_TAX / 100)
            // Погашение - тоже самое что номинал
            // Чистая сумма в итоге
            const netMarginRrepayment = formatMoney(nominalValue.value + totalCouponesValue.value - couponTax.value - repaymentTax.value)
            // Чистая прибыль
            const netProfit = formatMoney(netMarginRrepayment.value - currentPriceWithComission.value)
            // Годовая доходность
            const annualProfitability = ((netProfit.value / currentPriceWithComission.value) * (365 / daysToMaturity) * 100).toFixed(1);

            return {
                ...bond,
                comission,
                currentPercentPrice,
                nkd,
                nominalValue,
                currentFormatPrice,
                comissionFullPrice,
                currentPriceWithComission,
                payOneBond,
                couponeYeild,
                couponesFromMaturityDate,
                formatMaturityDate,
                daysToMaturity,
                yearsToMaturity,
                aboveNominal,
                totalCouponesValue,
                marginFromRepayment,
                couponTax,
                repaymentTax,
                netMarginRrepayment,
                netProfit,
                annualProfitability,
            };
        });
    }, [favoritesBonds, comission]);

    return { result };
};
