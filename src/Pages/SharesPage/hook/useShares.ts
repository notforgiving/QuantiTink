import { useMemo } from "react";
import { TBondInstrument, TPortfolioPosition, TShareInstrument } from "api/features/accounts/accountsTypes";
import { useAccounts } from "api/features/accounts/useAccounts";

import { formatMoney } from "utils/formatMoneyAmount";

type TShareWithPercent = (TPortfolioPosition & TBondInstrument & TShareInstrument) & {
    amount: number;   // сумма по позиции (цена * количество)
    percent: string;  // доля в портфеле
};

type TUseShares = (accountId: string) => {
    shares: TShareWithPercent[];
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

    return { shares };
};
