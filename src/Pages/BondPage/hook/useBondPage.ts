import { useMemo } from "react";
import { useAccounts } from "api/features/accounts/useAccounts";
import moment from "moment";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

type TResultOperation = {
    commissions: TFormatMoney;
    coupons: TFormatMoney;
    date: string;
    payment: TFormatMoney;
    quantity: number;
    time: string;
    yield: string;
};

type TUseBond = (accountId: string, currency: string, figi: string) => {
    name: string;
    quantity: number;
    currentPrice: TFormatMoney;
    expectedYield: TFormatMoney;
    currentNkd: TFormatMoney;
    paidCommissions: TFormatMoney;
    couponsReceived: TFormatMoney;
    averagePositionPrice: TFormatMoney;
    priceIncreasePercent: string;
    currentPercentageYield: string;
    annualPercentageYield: number;
    operations: TResultOperation[];
};

export const useBondPage: TUseBond = (accountId, currency, figi) => {
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data?.find((el) => el.id === accountId) ?? null,
        [accounts?.data, accountId]
    );

    const bond = useMemo(
        () =>
            account?.positions.find(
                (el) => el.instrumentType === "bond" && el.figi === figi
            ) ?? null,
        [account?.positions, figi]
    );
    const quantity = Number(bond?.quantity.units) || 0;

    const currentPriceValue = bond?.currentPrice ? formatMoney(bond.currentPrice).value * quantity : 0;
    const currentPrice = formatMoney(currentPriceValue);

    const expectedYield = bond?.expectedYield
        ? formatMoney(bond.expectedYield, "rub")
        : formatMoney(0);

    const currentNkd = bond?.currentNkd ? formatMoney(formatMoney(bond.currentNkd).value * quantity) : formatMoney(0);

    const bondOperations = useMemo(() => {
        if (!bond?.assetUid) return [];
        return account?.operations?.filter(
            (op) => op.assetUid === bond.assetUid
        ) ?? [];
    }, [account?.operations, bond?.assetUid]);

    const { paidCommissions, couponsReceived, amountPurchase } = useMemo(() => {
        let commissions = 0;
        let coupons = 0;
        let purchase = 0;

        for (const op of bondOperations) {
            const value = formatMoney(op.payment).value;
            switch (op.type) {
                case "Удержание комиссии за операцию":
                    commissions += value;
                    break;
                case "Выплата купонов":
                    coupons += value;
                    break;
                case 'Покупка ценных бумаг':
                    purchase += value;
                    break;
            }
        }

        return {
            paidCommissions: formatMoney(-commissions),
            couponsReceived: formatMoney(coupons),
            amountPurchase: formatMoney(-purchase),
        };
    }, [bondOperations]);

    const averagePositionPrice = bond?.averagePositionPrice
        ? formatMoney(formatMoney(bond.averagePositionPrice, "rub").value * quantity)
        : formatMoney(0);

    const priceIncreaseAmount = formatMoney(currentPrice.value - averagePositionPrice.value);

    const priceIncreasePercent = ((priceIncreaseAmount.value / averagePositionPrice.value) * 100).toFixed(2);

    const currentPercentageYield = ((((priceIncreaseAmount.value + couponsReceived.value) / (amountPurchase.value + paidCommissions.value))) * 100).toFixed(2)

    const firstPurchaseAge = useMemo(() => {
        if (bondOperations.length === 0) return null;

        const now = moment();
        return moment.duration(now.diff(bondOperations[bondOperations.length - 1].date));
    }, [bondOperations]);

    const annualPercentageYield = useMemo(() => {
        if (!expectedYield || !amountPurchase.value || !firstPurchaseAge) return 0;
        const days = firstPurchaseAge.asDays();
        if (days <= 0) return 0;

        const R = (couponsReceived.value) / (amountPurchase.value + paidCommissions.value);
        const annualized = Math.pow(1 + R, 365 / days) - 1;
        return Number((annualized * 100).toFixed(2));
    }, [amountPurchase.value, couponsReceived.value, expectedYield, firstPurchaseAge, paidCommissions.value]);


    const temp = [...bondOperations].reverse();
    const purchases: TResultOperation[] = [];

    temp.forEach(op => {
        if (op.type === "Покупка ценных бумаг") {
            const executedQty = op.trades
                ? op.trades.reduce((sum, t) => sum + Number(t.quantity), 0)
                : Number(op.quantity);
            purchases.push({
                date: moment(op.date).format("DD.MM.YYYY"),
                time: moment.duration(moment().diff(op.date)).asMonths().toFixed(0),
                quantity: Number(executedQty),
                coupons: formatMoney(0),
                payment: formatMoney(-formatMoney(op.payment).value),
                commissions: formatMoney(0),
                yield: '0',
            });
        }

        if (op.type === "Удержание комиссии за операцию" && purchases.length) {
            const last = purchases[purchases.length - 1];
            last.commissions = formatMoney(last.commissions.value + -formatMoney(op.payment).value, 'rub');
        }

        if (op.type === "Выплата купонов" && purchases.length) {
            const totalQty = purchases.reduce((acc, p) => acc + p.quantity, 0);
            if (totalQty === 0) return;

            const couponValue = formatMoney(op.payment).value;
            const perBond = couponValue / totalQty;

            purchases.forEach(p => {
                p.coupons = formatMoney(p.coupons.value + perBond * p.quantity, 'rub');
            });
        }
    });

    // финальный расчёт доходности
    purchases.forEach(p => {
        const denom = p.payment.value + p.commissions.value;
        p.yield = denom > 0
            ? ((p.coupons.value / denom) * 100).toFixed(2)
            : '0.00';
    });

    // разворачиваем, чтобы порядок был как в твоём примере
    const result = [...purchases].reverse();

    return {
        name: bond?.name || 'Облигация',
        quantity,
        currentPrice,
        expectedYield,
        currentNkd,
        paidCommissions,
        couponsReceived,
        averagePositionPrice,
        priceIncreasePercent,
        currentPercentageYield,
        annualPercentageYield,
        operations: result,
    }
}