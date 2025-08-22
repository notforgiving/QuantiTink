import { useMemo } from "react";
import { TBondInstrument, TPortfolioPosition, TShareInstrument } from "api/features/accounts/accountsTypes";
import { useAccounts } from "api/features/accounts/useAccounts";

type TUseShares = (props: string) => {
    shares: (TPortfolioPosition & TBondInstrument & TShareInstrument)[] | null
}

export const useShares: TUseShares = (accountId) => {
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data.find((el) => el.id === accountId) ?? null,
        [accounts?.data, accountId]
    );

    const shares = useMemo(() => {
        if (!account || !account.positions) return null;
        return account?.positions.filter((pos) => pos.instrumentType === "share")
    }, [account]);

    return {
        shares,
    }
}