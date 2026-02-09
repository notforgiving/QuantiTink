import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchEventsForBond } from "api/features/accounts/accountsSlice";
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
    oneLote: TFormatMoney;
    originalDate: string;
};

type TUseBond = (accountId: string, currency: string, figi: string) => {
    name: string;
    quantity: number;
    currentPrice: TFormatMoney;
    expectedYield: TFormatMoney;
    currentNkd: TFormatMoney;
    paidCommissions: TFormatMoney;
    couponsReceived: TFormatMoney;
    currentPriceOneLot: TFormatMoney;
    averagePrice: TFormatMoney;
    averagePositionPrice: TFormatMoney;
    priceIncreasePercent: string;
    currentPercentageYield: string;
    annualPercentageYield: number;
    operations: TResultOperation[];
};

export const useBondPage: TUseBond = (accountId, currency, figi) => {
    const dispatch = useDispatch();
    const accounts = useAccounts();

    const account = useMemo(() => {
        if (!accounts?.data) return null;
        return accounts.data.find(acc => acc.id === accountId) ?? null;
    }, [accounts?.data, accountId]);

    const bond = useMemo(() => {
        return (
            account?.positions?.find(
                p => p.instrumentType === "bond" && p.figi === figi
            ) ?? null
        );
    }, [account?.positions, figi]);

    const quantity = Number(bond?.quantity.units) || 0;

    const currentPriceOneLot = bond
        ? formatMoney(bond.currentPrice)
        : formatMoney(0);

    const currentPrice = formatMoney(
        bond?.currentPrice
            ? formatMoney(bond.currentPrice).value * quantity
            : 0
    );

    const expectedYield = bond?.expectedYield
        ? formatMoney(bond.expectedYield, "rub")
        : formatMoney(0);

    const currentNkd = formatMoney(
        bond?.currentNkd
            ? formatMoney(bond.currentNkd).value * quantity
            : 0
    );

    const bondOperations = useMemo(() => {
        if (!bond?.assetUid) return [];
        return account?.operations?.filter(
            op => op.assetUid === bond.assetUid
        ) ?? [];
    }, [account?.operations, bond?.assetUid]);

    const firstBuyOperation = useMemo(() => {
        return [...bondOperations]
            .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
            .find(op => op.type === "Покупка ценных бумаг");
    }, [bondOperations]);

    useEffect(() => {
        if (!bond?.figi || bond.events) return;

        dispatch(
            fetchEventsForBond({
                accountId,
                figi: bond.figi,
                startPeriod: firstBuyOperation?.date ?? "",
                finishPeriod: bond.maturityDate ?? "",
            })
        );
    }, [
        dispatch,
        accountId,
        bond?.figi,
        bond?.events,
        bond?.maturityDate,
        firstBuyOperation?.date,
    ]);

    const { paidCommissions, couponsReceived, amountPurchase } = useMemo(() => {
        let commissions = 0;
        let coupons = 0;
        let purchase = 0;

        bondOperations.forEach(op => {
            const value = formatMoney(op.payment).value;
            if (op.type === "Удержание комиссии за операцию") commissions += value;
            if (op.type === "Выплата купонов") coupons += value;
            if (op.type === "Покупка ценных бумаг") purchase += value;
        });

        return {
            paidCommissions: formatMoney(-commissions),
            couponsReceived: formatMoney(coupons),
            amountPurchase: formatMoney(-purchase),
        };
    }, [bondOperations]);

    const averagePrice = bond
        ? formatMoney(bond.averagePositionPrice, "rub")
        : formatMoney(0);

    const averagePositionPrice = formatMoney(averagePrice.value * quantity);

    const priceIncreaseAmount = formatMoney(
        currentPrice.value - averagePositionPrice.value
    );

    const priceIncreasePercent =
        averagePositionPrice.value > 0
            ? ((priceIncreaseAmount.value / averagePositionPrice.value) * 100).toFixed(2)
            : "0.00";

    const currentPercentageYield = (
        ((priceIncreaseAmount.value + couponsReceived.value) /
            (amountPurchase.value + paidCommissions.value)) *
        100
    ).toFixed(2);

    const firstPurchaseAge = useMemo(() => {
        if (!bondOperations.length) return null;
        return moment.duration(
            moment().diff(bondOperations[bondOperations.length - 1].date)
        );
    }, [bondOperations]);

    const annualPercentageYield = useMemo(() => {
        if (!firstPurchaseAge || !amountPurchase.value) return 0;
        const days = firstPurchaseAge.asDays();
        if (days <= 0) return 0;

        const R =
            couponsReceived.value /
            (amountPurchase.value + paidCommissions.value);

        return Number(((Math.pow(1 + R, 365 / days) - 1) * 100).toFixed(2));
    }, [
        couponsReceived.value,
        amountPurchase.value,
        paidCommissions.value,
        firstPurchaseAge,
    ]);

    const purchases = useMemo<TResultOperation[]>(() => {
        const result: TResultOperation[] = [];

        const sortedOps = [...bondOperations].sort(
            (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
        );

        sortedOps.forEach(op => {
            if (op.type === "Покупка ценных бумаг") {
                const qty = op.trades
                    ? op.trades.reduce((s, t) => s + Number(t.quantity), 0)
                    : Number(op.quantity);

                result.push({
                    date: moment(op.date).format("DD.MM.YYYY"),
                    time: moment.duration(moment().diff(op.date)).asMonths().toFixed(0),
                    quantity: qty,
                    coupons: formatMoney(0),
                    payment: formatMoney(-formatMoney(op.payment).value),
                    commissions: formatMoney(0),
                    yield: "0",
                    oneLote: formatMoney(op.price),
                    originalDate: op.date,
                });
            }

            if (op.type === "Удержание комиссии за операцию" && result.length) {
                const last = result[result.length - 1];
                last.commissions = formatMoney(
                    last.commissions.value + -formatMoney(op.payment).value,
                    "rub"
                );
            }
        });

        // ---- РАСПРЕДЕЛЕНИЕ КУПОНОВ ПО FIX DATE ----
        const couponOps = bondOperations.filter(
            op => op.type === "Выплата купонов"
        );

        couponOps.forEach(couponOp => {
            // Найдем fixDate, относящуюся к купонной выплате
            // Предполагаем, что fixDate — самая последняя дата фиксации, которая меньше даты выплаты купонов
            const fixDate = bond?.events
                ?.map(e => e.fixDate)
                .filter(d => moment(d).isBefore(couponOp.date))
                .sort((a, b) => moment(b).valueOf() - moment(a).valueOf())[0]; // берем максимальную fixDate, которая меньше даты выплаты

            if (!fixDate) return;

            // Выбираем все покупки с датой не позже fixDate
            const eligible = result.filter(p => !moment(p.originalDate).isAfter(fixDate));

            const totalQty = eligible.reduce((s, p) => s + p.quantity, 0);
            if (!totalQty) return;

            const perBond = formatMoney(couponOp.payment).value / totalQty;

            eligible.forEach(p => {
                p.coupons = formatMoney(p.coupons.value + perBond * p.quantity, "rub");
            });
        });

        result.forEach(p => {
            const denom = p.payment.value + p.commissions.value;
            p.yield =
                denom > 0 ? ((p.coupons.value / denom) * 100).toFixed(2) : "0.00";
        });

        return result.sort(
            (a, b) => moment(b.originalDate).valueOf() - moment(a.originalDate).valueOf()
        );
    }, [bondOperations, bond?.events]);

    return {
        name: bond?.name || "Облигация",
        quantity,
        currentPrice,
        expectedYield,
        currentNkd,
        paidCommissions,
        couponsReceived,
        currentPriceOneLot,
        averagePrice,
        averagePositionPrice,
        priceIncreasePercent,
        currentPercentageYield,
        annualPercentageYield,
        operations: purchases,
    }
}