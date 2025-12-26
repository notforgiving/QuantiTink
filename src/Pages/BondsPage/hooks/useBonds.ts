import { useEffect, useMemo, useState } from "react";
import { TPortfolioPositionFull } from "api/features/accounts/accountsTypes";
import { useAccounts } from "api/features/accounts/useAccounts";
import { RISK_ORDER, RiskLevelMap, TBrand, TMoneyValue, TRiskLevel } from "types/common";

import { formatMoney } from "utils/formatMoneyAmount";

export type TIssuerGroup = {
    name: string; // имя эмитента
    positions: {
        figi: string;
        name: string; // название облигации
        quantity: number; // количество бумаг
        currentPrice: TMoneyValue;
    }[];
    percent: number; // доля в %
    brand: TBrand;
};

export type TRiskLevelStat = {
    riskLevel: TRiskLevel;
    label: string;
    count: number;
    percent: number;
}

type TUseBonds = (accountId: string, currency: string) => {
    issuer: TIssuerGroup[];
    riskStat: TRiskLevelStat[];
};

export const useBonds: TUseBonds = (accountId, currency) => {
    const [issuer, setIssuer] = useState<TIssuerGroup[]>([]);
    const [riskStat, setRiskStat] = useState<TRiskLevelStat[]>([]);
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data.find((el) => el.id === accountId) ?? null,
        [accounts?.data, accountId]
    );

    const calculationByRisk = (targetBonds: TPortfolioPositionFull[]) => {
        if (!targetBonds.length) return [];
        const counters: Record<TRiskLevel, number> = {
            RISK_LEVEL_LOW: 0,
            RISK_LEVEL_MODERATE: 0,
            RISK_LEVEL_HIGH: 0,
            RISK_LEVEL_UNSPECIFIED: 0,
        };
        // Сяитаем количество облигаций
        const totalQty = targetBonds.reduce((acc, bond) => {
            const quantity = Number(bond.quantity.units);
            const riskLevel = bond.riskLevel ?? 'RISK_LEVEL_UNSPECIFIED';
            counters[riskLevel] += quantity;
            return acc + quantity;
        }, 0);

        const result = RISK_ORDER
            .filter((level) => counters[level] > 0)
            .map((level) => ({
                riskLevel: level,
                label: RiskLevelMap[level],
                count: counters[level],
                percent: totalQty > 0 ? Number(((counters[level] / totalQty) * 100).toFixed(2)) : 0,
            }));

        setRiskStat(result)
    }

    const calculationsBondsForIssuer = (targetBonds: TPortfolioPositionFull[]) => {
        if (!targetBonds.length) return [];
        // считаем общий объём всех облигаций
        const totalQty = targetBonds.reduce((acc, bond) => {
            const amountMoney = formatMoney(bond.currentPrice).value * Number(bond.quantity.units)
            return acc + amountMoney;
        }, 0);

        const issuerMap = new Map<string, TIssuerGroup>();

        for (const bond of targetBonds) {
            const issuerName = bond.asset?.brand?.company ?? "Без эмитента";
            const qty = Number(bond.quantity.units);

            if (!issuerMap.has(issuerName)) {
                issuerMap.set(issuerName, {
                    name: issuerName,
                    positions: [],
                    percent: 0,
                    brand: bond.brand,
                });
            }

            const group = issuerMap.get(issuerName)!;
            group.positions.push({
                figi: bond.figi,
                name: bond.name,
                quantity: qty,
                currentPrice: bond.currentPrice,

            });
        }
        issuerMap.forEach((group) => {
            const issuerTotal = group.positions.reduce((acc, bond) => {
                const amountMoney =
                    formatMoney(bond.currentPrice).value * Number(bond.quantity);
                return acc + amountMoney;
            }, 0);

            group.percent =
                totalQty > 0
                    ? Number(((issuerTotal / totalQty) * 100).toFixed(2))
                    : 0;
        });

        const sortedIssuers = Array.from(issuerMap.values()).sort(
            (a, b) => b.percent - a.percent
        );
        setIssuer(sortedIssuers);

    }

    useEffect(() => {
        if (!accounts.loading && account?.positions?.length) {
            const targetBonds = account?.positions?.filter(el => el.initialNominal && el.initialNominal.currency === currency && el.instrumentType === 'bond') || []
            const allAssetsLoaded = targetBonds.every((p) => !!p.asset);
            if (allAssetsLoaded) {
                calculationsBondsForIssuer(targetBonds)
                calculationByRisk(targetBonds)
            }
        }
    }, [accounts.loading, account, currency]);

    return {
        issuer,
        riskStat,
    }
}