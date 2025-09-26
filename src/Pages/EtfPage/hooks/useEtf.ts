import { useCallback, useMemo, useState } from "react";
import { useAccounts } from "api/features/accounts/useAccounts";
import moment from "moment";
import { IProfitabilityLineProps } from "UI/components/ProfitabilityLine";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

type TUseEtf = (accountId: string, ticker: string) => {
    name: string;
    currentPrice: TFormatMoney | null;
    expectedYield: TFormatMoney | null;
    firstPurchaseAge: moment.Duration | null;
    currentPercentageYield: number;
    annualPercentageYield: number;
    recommendBuyToReduceAvg: (reduceBy?: number) => {
        additionalQty: number;
        price: number;
        totalCost: number;
        message: string;
    } | null;
    operations: IProfitabilityLineProps[];
    incomeTax: boolean;
    setIncomeTax: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useEtf: TUseEtf = (accountId, ticker) => {
    const [incomeTax, setIncomeTax] = useState<boolean>(false);
    const accounts = useAccounts();
    // находим аккаунт (тут обычно 2–5 штук, useMemo не нужен)
    const account = accounts?.data?.find((el) => el.id === accountId) ?? null;
    
    // находим сам ETF (может быть 10–20 позиций, лучше мемоизировать)
    const etf = useMemo(
        () =>
            account?.positions.find(
                (el) => el.instrumentType === "etf" && el.ticker === ticker
            ) ?? null,
        [account?.positions, ticker]
    );

    // текущая стоимость позиции
    const currentPrice = useMemo(() => {
        if (!etf?.currentPrice || !etf?.quantity?.units) return null;
        const priceNum = formatMoney(etf.currentPrice).value;
        const qty = Number(etf.quantity.units);
        return formatMoney(priceNum * qty);
    }, [etf?.currentPrice, etf?.quantity?.units]);

    // ожидаемая доходность (легкая операция — мемо не нужен)
    const expectedYield = etf?.expectedYield
        ? formatMoney(etf.expectedYield, "rub")
        : null;

    // операции по этому фонду (500+ => обязательно мемоизируем)
    const etfOperations = useMemo(() => {
        if (!etf?.assetUid) return [];
        return account?.operations?.filter(
            (op) => op.assetUid === etf.assetUid
        ) ?? [];
    }, [account?.operations, etf?.assetUid]);

    const firstPurchaseAge = useMemo(() => {
        if (etfOperations.length === 0) return null;

        const now = moment();
        return moment.duration(now.diff(etfOperations[etfOperations.length - 1].date));
    }, [etfOperations]);

    // сколько всего денег вложено (reduce по операциям => мемо обязателен)
    const amountOfPurchases = useMemo(() => {
        if (!etfOperations.length) return formatMoney(0);

        const total = etfOperations.reduce((acc, op) => {
            return acc + Math.abs(formatMoney(op.payment).value);
        }, 0);

        return formatMoney(total);
    }, [etfOperations]);

    // текущая доходность % (легкая арифметика — без мемо)
    const currentPercentageYield = expectedYield
        ? Number(((expectedYield.value / amountOfPurchases.value) * 100).toFixed(2))
        : 0;

    // годовая доходность (тяжелый расчет => мемоизируем)
    const annualPercentageYield = useMemo(() => {
        if (!expectedYield || !amountOfPurchases.value || !firstPurchaseAge) return 0;
        const days = firstPurchaseAge.asDays();
        if (days <= 0) return 0;

        const R = expectedYield.value / amountOfPurchases.value;
        const annualized = Math.pow(1 + R, 365 / days) - 1;
        return Number((annualized * 100).toFixed(2));
    }, [expectedYield, amountOfPurchases, firstPurchaseAge]);

    const recommendBuyToReduceAvg = useCallback(
        (reduceBy: number = 1) => {
            const avgPrice = formatMoney(etf?.averagePositionPrice).value;
            const qty = Number(etf?.quantity.units) || 0;
            if (!etf?.currentPrice || avgPrice === 0) return null;
            const price = formatMoney(etf.currentPrice).value;
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
        [etf]
    );

    const operations = useMemo(() => {
        const now = moment();

        return etfOperations.map(item => {
            const quantity = Number(item.quantity) || 0;

            const monthsPassed = moment(now).diff(item.date, "months");
            const over3Years = monthsPassed >= 36;

            const pricePerPurchaseLot = formatMoney(item.price);
            const pricePerLotNow = etf?.currentPrice
                ? formatMoney(etf.currentPrice)
                : formatMoney(0);

            const totalPurchasePrice = formatMoney(
                Math.abs(formatMoney(item.payment).value)
            );
            const totalPriceNow = formatMoney(pricePerLotNow.value * quantity);

            const rawDiff = totalPriceNow.value - totalPurchasePrice.value;

            // налог только если есть прибыль, прошло < 3 лет и incomeTax включён
            const taxMultiplier =
                incomeTax && !over3Years && rawDiff > 0 ? 0.87 : 1;

            const profitabilityAmount = formatMoney(rawDiff * taxMultiplier);

            const profitabilityPercent =
                totalPurchasePrice.value > 0
                    ? ((profitabilityAmount.value / totalPurchasePrice.value) * 100).toFixed(2)
                    : "0";

            return {
                dateFormatted: moment(item.date).format("DD.MM.YYYY"),
                quantity,
                time: monthsPassed,
                over3Years,
                pricePerPurchaseLot,
                pricePerLotNow,
                totalPurchasePrice,
                totalPriceNow,
                profitability: {
                    amount: profitabilityAmount,
                    percent: profitabilityPercent,
                },
            };
        });
    }, [etf?.currentPrice, etfOperations, incomeTax]);

    return {
        name: etf?.name || etf?.ticker || "Фонд",
        currentPrice,
        expectedYield,
        firstPurchaseAge,
        currentPercentageYield,
        annualPercentageYield,
        recommendBuyToReduceAvg,
        operations,
        incomeTax,
        setIncomeTax,
    };
};