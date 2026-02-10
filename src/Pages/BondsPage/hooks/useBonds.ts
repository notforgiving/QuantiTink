import { useMemo } from "react";
import { TPortfolioPositionFull } from "api/features/accounts/accountsTypes";
import { useAccounts } from "api/features/accounts/useAccounts";
import { RISK_ORDER, RiskLevelMap, TBrand, TMoneyValue, TRiskLevel } from "types/common";

import { formatMoney } from "utils/formatMoneyAmount";
import { getYearsToMaturity } from "utils/getYearsToMaturity";

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

export type TDurationGroup = {
    duration: 'SHORT' | 'MEDIUM' | 'LONG';
    label: string;
    positions: {
        figi: string;
        name: string;
        quantity: number;
    }[];
    count: number;
    percent: number;
};

type TBondByRisk = {
    [riskLevel in TRiskLevel]?: {
        figi: string;
        name: string;
        quantity: number;
    }[];
};

const DURATION_GROUPS = {
    SHORT: { label: 'Короткие', min: 0, max: 2 },
    MEDIUM: { label: 'Средние', min: 2, max: 5 },
    LONG: { label: 'Длинные', min: 5, max: Infinity },
} as const;

type TUseBonds = (accountId: string, currency: string) => {
    issuer: TIssuerGroup[];
    riskStat: TRiskLevelStat[];
    bondsByRiskLevel: TBondByRisk;
    durationGroup: TDurationGroup[];
};


export const useBonds: TUseBonds = (accountId, currency) => {
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data.find((el) => el.id === accountId) ?? null,
        [accounts?.data, accountId]
    );

    const targetBonds = useMemo<TPortfolioPositionFull[]>(() => {
        if (!account?.positions?.length) return [];

        return account.positions.filter(
            (p) =>
                p.instrumentType === 'bond' &&
                p.initialNominal?.currency === currency &&
                Boolean(p.asset)
        );
    }, [account, currency]);

    /* ---------------- issuer ---------------- */

    const issuer = useMemo<TIssuerGroup[]>(() => {
        if (!targetBonds.length) return [];

        const totalAmount = targetBonds.reduce(
            (sum, b) =>
                sum +
                formatMoney(b.currentPrice).value *
                Number(b.quantity.units),
            0
        );

        const map = new Map<string, TIssuerGroup>();

        targetBonds.forEach((bond) => {
            const issuerName = bond.asset?.brand?.company ?? 'Без эмитента';
            const qty = Number(bond.quantity.units);

            if (!map.has(issuerName)) {
                map.set(issuerName, {
                    name: issuerName,
                    positions: [],
                    percent: 0,
                    brand: bond.brand,
                });
            }

            map.get(issuerName)!.positions.push({
                figi: bond.figi,
                name: bond.name,
                quantity: qty,
                currentPrice: bond.currentPrice,
            });
        });

        map.forEach((group) => {
            const issuerTotal = group.positions.reduce(
                (sum, p) =>
                    sum +
                    formatMoney(p.currentPrice).value * p.quantity,
                0
            );

            group.percent =
                totalAmount > 0
                    ? Number(((issuerTotal / totalAmount) * 100).toFixed(2))
                    : 0;
        });

        return Array.from(map.values()).sort(
            (a, b) => b.percent - a.percent
        );
    }, [targetBonds]);

    /* ---------------- risk stat ---------------- */

    const riskStat = useMemo<TRiskLevelStat[]>(() => {
        if (!targetBonds.length) return [];

        const counters: Record<TRiskLevel, number> = {
            RISK_LEVEL_LOW: 0,
            RISK_LEVEL_MODERATE: 0,
            RISK_LEVEL_HIGH: 0,
            RISK_LEVEL_UNSPECIFIED: 0,
        };

        const totalQty = targetBonds.reduce((sum, bond) => {
            const qty = Number(bond.quantity.units);
            counters[bond.riskLevel ?? 'RISK_LEVEL_UNSPECIFIED'] += qty;
            return sum + qty;
        }, 0);

        return RISK_ORDER
            .filter((level) => counters[level] > 0)
            .map((level) => ({
                riskLevel: level,
                label: RiskLevelMap[level],
                count: counters[level],
                percent:
                    totalQty > 0
                        ? Number(
                            ((counters[level] / totalQty) * 100).toFixed(2)
                        )
                        : 0,
            }));
    }, [targetBonds]);

    /* ---------------- bonds by risk ---------------- */

    const bondsByRiskLevel = useMemo<TBondByRisk>(() => {
        const result: TBondByRisk = {};

        targetBonds.forEach((bond) => {
            const level = bond.riskLevel ?? 'RISK_LEVEL_UNSPECIFIED';

            if (!result[level]) result[level] = [];

            result[level]!.push({
                figi: bond.figi,
                name: bond.name,
                quantity: Number(bond.quantity.units),
            });
        });

        return result;
    }, [targetBonds]);

    /* ---------------- duration group ---------------- */

    const durationGroup = useMemo<TDurationGroup[]>(() => {
        if (!targetBonds.length) return [];

        const groups: Record<'SHORT' | 'MEDIUM' | 'LONG', TDurationGroup> = {
            SHORT: {
                duration: 'SHORT',
                label: DURATION_GROUPS.SHORT.label,
                positions: [],
                count: 0,
                percent: 0,
            },
            MEDIUM: {
                duration: 'MEDIUM',
                label: DURATION_GROUPS.MEDIUM.label,
                positions: [],
                count: 0,
                percent: 0,
            },
            LONG: {
                duration: 'LONG',
                label: DURATION_GROUPS.LONG.label,
                positions: [],
                count: 0,
                percent: 0,
            },
        };

        let totalQty = 0;

        targetBonds.forEach((bond) => {
            const qty = Number(bond.quantity.units);
            const yearsToMaturity = getYearsToMaturity(bond.maturityDate);

            if (yearsToMaturity === null) return;

            let key: 'SHORT' | 'MEDIUM' | 'LONG';

            if (yearsToMaturity < 2) key = 'SHORT';
            else if (yearsToMaturity < 5) key = 'MEDIUM';
            else key = 'LONG';

            groups[key].positions.push({
                figi: bond.figi,
                name: bond.name,
                quantity: qty,
            });

            groups[key].count += qty;
            totalQty += qty;
        });

        return (Object.values(groups))
            .filter((group) => group.count > 0)
            .map((group) => ({
                ...group,
                percent:
                    totalQty > 0
                        ? Number(((group.count / totalQty) * 100).toFixed(2))
                        : 0,
            }));
    }, [targetBonds]);



    return {
        issuer,
        riskStat,
        bondsByRiskLevel,
        durationGroup,
    };
};
