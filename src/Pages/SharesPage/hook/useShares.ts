import { useMemo } from "react";
import { TBondInstrument, TPortfolioPosition, TShareInstrument } from "api/features/accounts/accountsTypes";
import { useAccounts } from "api/features/accounts/useAccounts";

import { formatMoney } from "utils/formatMoneyAmount";

type TShareWithPercent = (TPortfolioPosition & TBondInstrument & TShareInstrument) & {
    amount: number;   // сумма по позиции (цена * количество)
    percent: string;  // доля в портфеле
};

type TSectorGroup = {
    sectorKey: string;
    sectorname: string;
    percent: number;
    positions: { figi:string; name: string; quantity: number }[];
};

type TUseShares = (accountId: string) => {
    shares: TShareWithPercent[];
    sectors: TSectorGroup[];
};

export const SECTOR_LABELS = {
    materials: "Сырьевая промышленность",
    energy: "Энергетика",
    financial: "Финансовый сектор",
    information_technology: "Информационные технологии",
    communication_services: "Коммуникационные услуги",
    consumer_discretionary: "Товары ежедневного спроса",
    consumer_staples: "Потребительские товары первой необходимости",
    health_care: "Здравоохранение",
    industrials: "Промышленность",
    utilities: "Электроэнергетика",
    real_estate: "Недвижимость",
    // Альтернативные/редкие сектора
    basic_resources: "Базовые ресурсы",
    telecom: "Телекоммуникации",
    // Если sector приходит пустым/неизвестным
    unknown: "Неизвестный сектор"
};

export const useShares: TUseShares = (accountId) => {
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data.find((el) => el.id === accountId) ?? null,
        [accounts?.data, accountId]
    );

    const shares = useMemo(() => {
        if (!account?.positions) return [];

        // только акции
        const rawShares = account.positions.filter(
            (pos) => pos.instrumentType === "share"
        );

        // посчитаем сумму всех акций
        const totalAmount = rawShares.reduce((acc, share) => {
            const amount = formatMoney(share.currentPrice).value * Number(share.quantity.units);
            return acc + amount;
        }, 0);

        // вернем массив с % и суммой, отсортированный по убыванию
        return rawShares
            .map((share) => {
                const amount = formatMoney(share.currentPrice).value * Number(share.quantity.units);
                return {
                    ...share,
                    amount,
                    percent: totalAmount ? ((amount / totalAmount) * 100).toFixed(2) : '0',
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }, [account]);

    // Группировка по секторам
    const sectors = useMemo(() => {
        if (!account?.positions) return [];
        const rawShares = account.positions.filter(
            (pos) => pos.instrumentType === "share"
        );
        const totalAmount = rawShares.reduce((acc, share) => {
            const amount = formatMoney(share.currentPrice).value * Number(share.quantity.units);
            return acc + amount;
        }, 0);

        // Группируем акции по sector
        const sectorMap: Record<string, { amount: number; positions: { figi: string; name: string; quantity: number }[] }> = {};
        rawShares.forEach((share) => {
            const sectorKey = share.sector || "unknown";
            const amount = formatMoney(share.currentPrice).value * Number(share.quantity.units);
            if (!sectorMap[sectorKey]) {
                sectorMap[sectorKey] = { amount: 0, positions: [] };
            }
            sectorMap[sectorKey].amount += amount;
            sectorMap[sectorKey].positions.push({
                figi: share.figi,
                name: share.name,
                quantity: Number(share.quantity.units),
            });
        });

        // Формируем массив для вывода
        return Object.entries(sectorMap).map(([sectorKey, { amount, positions }]) => ({
            sectorKey,
            sectorname: SECTOR_LABELS[sectorKey as keyof typeof SECTOR_LABELS] || SECTOR_LABELS.unknown,
            percent: totalAmount ? Number(((amount / totalAmount) * 100).toFixed(2)) : 0,
            positions,
        })).sort((a, b) => b.percent - a.percent);
    }, [account]);

    return { shares, sectors };
};
