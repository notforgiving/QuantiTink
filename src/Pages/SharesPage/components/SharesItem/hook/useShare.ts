import { useCallback, useMemo } from "react";
import { TBondInstrument, TPortfolioPosition, TShareInstrument } from "api/features/accounts/accountsTypes";
import { useAccounts } from "api/features/accounts/useAccounts";
import moment from "moment";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

type TUseShareProps = {
    id: string;
    figi: string;
}

type TUseShare = (props: TUseShareProps) => {
    share: (TPortfolioPosition & TBondInstrument & TShareInstrument) | null;
    quantity: number;
    expectedYield: TFormatMoney;
    currentPrice: TFormatMoney;
    paidCommissions: TFormatMoney;
    dividendsReceived: TFormatMoney;
    pnl: {
        realized: number;
        unrealized: number;
        total: TFormatMoney;
    }
    totalYield: number;
    totalYearlyYield: number;
    recommendBuyToReduceAvg: (reduceBy?: number) => {
        additionalQty: number;
        price: number;
        totalCost: number;
        message: string;
    } | null;
    lastBuyOperationsUI: {
        profitability: {
            amount: TFormatMoney;
            percent: string;
        };
        totalPriceNow: TFormatMoney;
        pricePerLotNow: TFormatMoney;
        totalPurchasePrice: TFormatMoney;
        pricePerPurchaseLot: TFormatMoney;
        quantity: number;
        dateFormatted: string;
        time: number;
    }[]
}

export const useShare: TUseShare = ({ id, figi }) => {
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data.find((el) => el.id === id) ?? null,
        [accounts?.data, id]
    );

    const shareOperations = useMemo(
        () => account?.operations?.filter((el) => el.figi === figi) ?? [],
        [account?.operations, figi]
    );

    const share = useMemo(
        () => account?.positions?.find((el) => el.figi === figi) ?? null,
        [account?.positions, figi]
    );

    const quantity = Number(share?.quantity?.units ?? 0);

    const currentPrice = useMemo(() => {
        const price = formatMoney(share?.currentPrice).value;
        return formatMoney(quantity * price);
    }, [quantity, share?.currentPrice]);

    const expectedYield = useMemo(() => {
        return formatMoney(share?.expectedYield, "rub");
    }, [share?.expectedYield]);

    const firstBuyAge = useMemo(() => {
        let firstBuy: any = null;

        for (let i = shareOperations.length - 1; i >= 0; i--) {
            if (shareOperations[i].type === "Покупка ценных бумаг") {
                firstBuy = shareOperations[i];
                break;
            }
        }

        if (!firstBuy) return 0;

        const momentFirstBuy = moment(firstBuy.date);
        const now = moment();
        const duration = moment.duration(now.diff(momentFirstBuy));

        return Math.max(Math.floor(duration.asDays()), 1);
    }, [shareOperations]);

    const { paidCommissions, dividendsReceived } = useMemo(() => {
        let commissions = 0;
        let dividends = 0;

        for (const op of shareOperations) {
            const value = formatMoney(op.payment).value;
            switch (op.type) {
                case "Удержание комиссии за операцию":
                    commissions += value;
                    break;
                case "Выплата дивидендов":
                case "Выплата дивидендов на карту":
                    dividends += value;
                    break;
            }
        }

        return {
            paidCommissions: formatMoney(-commissions),
            dividendsReceived: formatMoney(dividends * 0.87), // налог 13%
        };
    }, [shareOperations]);

    const yieldAmount = useMemo(() => {
        let realized = 0;
        let unrealized = 0;
        let commissions = 0;
        let dividends = 0;
        let avgPrice = 0;
        let qty = 0;

        // для annualized yield
        let firstBuyDate: Date | null = null;

        // FIFO с конца (от старых к новым)
        const operations = [...shareOperations].reverse();

        for (const op of operations) {
            const value = formatMoney(op.payment).value;

            switch (op.type) {
                case "Удержание комиссии за операцию":
                    commissions += value;
                    break;

                case "Выплата дивидендов":
                case "Выплата дивидендов на карту":
                    dividends += value * 0.87;
                    break;

                case "Покупка ценных бумаг":
                case "Покупка ценных бумаг с карты": {
                    const q = Number(op.quantity);
                    avgPrice = (avgPrice * qty + -value) / (qty + q);
                    qty += q;

                    if (!firstBuyDate) {
                        firstBuyDate = new Date(op.date);
                    }
                    break;
                }

                case "Продажа ценных бумаг": {
                    const q = Number(op.quantity);
                    realized += value - avgPrice * q;
                    qty -= q;

                    if (qty === 0) {
                        // если всё продали — обнуляем среднюю цену
                        avgPrice = 0;
                        firstBuyDate = null;
                    }
                    break;
                }
            }
        }

        // нереализованная прибыль
        if (qty > 0 && currentPrice) {
            const price = formatMoney(share?.currentPrice).value;
            unrealized = (price - avgPrice) * qty;
        }

        const totalProfit = realized + unrealized + commissions + dividends;
        const investedMoney = avgPrice * qty;

        let totalYield = 0;
        let totalYearlyYield = 0;

        if (investedMoney > 0) {
            totalYield = (totalProfit / investedMoney) * 100;

            if (firstBuyDate) {
                totalYearlyYield = totalYield * (365 / firstBuyAge);
            }
        }

        return {
            pnl: {
                realized,
                unrealized,
                total: formatMoney(totalProfit),
            },
            totalYield: Number(totalYield.toFixed(2)),
            totalYearlyYield: Number(totalYearlyYield.toFixed(2)),
            investedMoney,
            avgPrice,
            qty,
        };
    }, [currentPrice, firstBuyAge, share?.currentPrice, shareOperations])

    const recommendBuyToReduceAvg = useCallback(
        (reduceBy: number = 1) => {
            const { avgPrice, qty } = yieldAmount;
            if (!share?.currentPrice || avgPrice === 0) return null;
            const price = formatMoney(share.currentPrice).value;
            const denominator = avgPrice - reduceBy - price;
            if (denominator <= 0) return null;
            const additionalQty = Math.ceil(qty / denominator);
            const totalCost = additionalQty * price;
            return {
                additionalQty,
                price,
                totalCost,
                message: `Чтобы снизить среднюю цену на ${reduceBy}₽, нужно купить ${additionalQty} акций по ${formatMoney(price).formatted} на сумму ${formatMoney(totalCost).formatted}`,
            };
        },
        [yieldAmount, share?.currentPrice]
    );

    const lastBuyOperations = useMemo(() => {
        if (!quantity) return [];

        const result: typeof shareOperations = [];
        let collected = 0;
        for (const op of shareOperations) {
            if (
                op.type === "Покупка ценных бумаг" ||
                op.type === "Покупка ценных бумаг с карты"
            ) {
                result.push(op);
                collected += Number(op.quantity);
                if (collected >= quantity) break;
            }
        }

        return result;
    }, [shareOperations, quantity]);

    const lastBuyOperationsUI = useMemo(() => {
        return lastBuyOperations.map((op) => {
            const buyDate = moment(op.date);
            const now = moment();

            const duration = moment.duration(now.diff(buyDate));
            const months = Math.max(Math.floor(duration.asMonths()), 0);

            const quantity = Number(op.quantity);
            const currentPrice = formatMoney(share?.currentPrice);
            const buyPrice = formatMoney(op.price);
            const totalPriceNow = formatMoney(currentPrice.value * quantity);
            const totalPurchasePrice = formatMoney(buyPrice.value * quantity);
            const profitabilityValue = formatMoney(totalPriceNow.value - totalPurchasePrice.value)
            const profitability = {
                amount: profitabilityValue,
                percent: ((profitabilityValue.value / totalPurchasePrice.value) * 100).toFixed(2),
            }
            return {
                profitability,
                totalPriceNow,
                pricePerLotNow: currentPrice,
                totalPurchasePrice,
                pricePerPurchaseLot: buyPrice,
                quantity,
                dateFormatted: buyDate.format("DD.MM.YYYY"),
                time: months, // сколько месяцев прошло
            };
        });
    }, [lastBuyOperations, share?.currentPrice]);

    return {
        share,
        quantity: yieldAmount.qty,
        expectedYield,
        currentPrice,
        paidCommissions,
        dividendsReceived,
        pnl: yieldAmount.pnl,
        totalYield: yieldAmount.totalYield,
        totalYearlyYield: yieldAmount.totalYearlyYield,
        recommendBuyToReduceAvg,
        lastBuyOperationsUI,
    };
}