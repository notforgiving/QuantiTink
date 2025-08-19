import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchBondPositionsRequest, TAccount } from "api/features/accounts/accountsSlice";
import { useAccounts } from "api/features/accounts/useAccounts";
import moment from "moment";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

type TPortfolioGrowth = {
    amount: TFormatMoney;  // сумма прироста (рубли, может быть + или -)
    percent: number; // процент прироста (может быть + или -)
};

type TUseAccount = (props: string) => {
    /** Объект портфолио */
    account: TAccount | null;
    /** Стоимость тела портфолио */
    totalAmountPortfolio: TFormatMoney;
    /** Сумма вложенных денег */
    totalDeposits: TFormatMoney
    /** Процент прироста портфкля */
    portfolioGrowth: TPortfolioGrowth
    /** Срок жизни портфкля */
    accountAge: moment.Duration | null;
    /** Уплаченного налога  */
    totalPaidTaxes: TFormatMoney
    /** Сумма уплаченных комиссий */
    totalCommissions: TFormatMoney;
    /** Сумма полученных купонов */
    totalCoupons: TFormatMoney;
    /** Сумма полученных дивидендов */
    totalDividends: TFormatMoney;
    /** Общая сумма выплат */
    totalPayouts: TFormatMoney;
    /** Текущая доходность */
    currentYield: number;
    /** Годовая доходность */
    yearlyYield: number;
}

export const useAccount: TUseAccount = (accountId) => {
    const accounts = useAccounts();
    const account = accounts?.data.find((el) => el.id === accountId) || null;
    const dispatch = useDispatch();
    useEffect(() => {
        if (!account?.id) return;
        dispatch(fetchBondPositionsRequest({ accountId: account?.id }))
    }, [account?.id, dispatch])

    // Сумма портфеля форматированная
    const totalAmountPortfolio = useMemo(
        () => formatMoney(account?.totalAmountPortfolio),
        [account?.totalAmountPortfolio]
    );

    const { totalDeposits, firstDepositDate, totalPaidTaxes, totalCommissions, totalCoupons, totalDividends, totalPayouts } = useMemo(() => {
        const operations = account?.operations ?? [];

        let deposits = 0;
        let taxes = 0;
        let commissions = 0;
        let coupons = 0;
        let dividends = 0;
        let firstDate: moment.Moment | null = null;

        for (const op of operations) {
            const value = Math.abs(formatMoney(op.payment).value);
            switch (op.type) {
                case "Пополнение брокерского счёта": {
                    deposits += value;
                    const opDate = moment(op.date);
                    if (!firstDate || opDate.isBefore(firstDate)) {
                        firstDate = opDate;
                    }
                    break;
                }
                case 'Удержание комиссии за операцию': {
                    commissions += value;
                    break;
                }
                case "Удержание налога по дивидендам":
                case "Удержание налога": {
                    taxes += value;
                    break;
                }
                case 'Выплата купонов': {
                    coupons += value;
                    break;
                }
                case 'Выплата дивидендов':
                case 'Выплата дивидендов на карту': {
                    dividends += value * 0.87;
                    break;
                }
            }
        }

        return {
            totalCommissions: formatMoney(commissions),
            totalPaidTaxes: formatMoney(taxes),
            totalDeposits: formatMoney(deposits),
            totalCoupons: formatMoney(coupons),
            totalDividends: formatMoney(dividends),
            totalPayouts: formatMoney(coupons + dividends),
            firstDepositDate: firstDate,

        };
    }, [account?.operations]);

    // Сколько времени прошло с первого пополнения
    const accountAge = useMemo(() => {
        if (!firstDepositDate) return null;

        const now = moment();
        return moment.duration(now.diff(firstDepositDate));
    }, [firstDepositDate]);

    const { currentYield, yearlyYield } = useMemo(() => {
        if (totalDeposits.value === 0) {
            return { currentYield: 0, yearlyYield: 0 };
        }

        const currentYield = (totalPayouts.value / totalDeposits.value) * 100;

        const days = accountAge ? Math.max(Math.floor(accountAge.asDays()), 1) : 1;
        const yearlyYield = ((totalPayouts.value / totalDeposits.value) * (365 / days)) * 100;

        return {
            currentYield: Number(currentYield.toFixed(2)),
            yearlyYield: Number(yearlyYield.toFixed(2)),
        };
    }, [accountAge, totalDeposits.value, totalPayouts.value]);

    // Процент роста портфеля
    const portfolioGrowth = useMemo(() => {
        const amount = totalAmountPortfolio.value - totalDeposits.value;
        const percent = (amount / totalDeposits.value) * 100;

        return {
            // сумма прироста (положительная или отрицательная)
            amount: formatMoney(Number(amount.toFixed(2))),
            // процент прироста
            percent: Number(percent.toFixed(2)),
        };
    }, [totalDeposits.value, totalAmountPortfolio.value]);



    return {
        account,
        totalAmountPortfolio,
        totalDeposits,
        portfolioGrowth,
        accountAge,
        totalPaidTaxes,
        totalCommissions,
        totalCoupons,
        totalDividends,
        totalPayouts,
        currentYield,
        yearlyYield,
    }
}