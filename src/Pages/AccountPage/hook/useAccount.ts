import { ReactNode, useMemo } from "react";
import { TAccount } from "api/features/accounts/accountsSlice";
import { useAccounts } from "api/features/accounts/useAccounts";
import moment from "moment";
import { TBondCurrency } from "types/common";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";
import { getBondName } from "utils/getBondName";

type TPortfolioGrowth = {
    amount: TFormatMoney;  // сумма прироста (рубли, может быть + или -)
    percent: number; // процент прироста (может быть + или -)
};

type TPortfolioBondsItem = {
    value: TFormatMoney;
    percent: number;
    name: string;
    icon: ReactNode;
}

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
    /** Объем акций в портфеле */
    portfolioShare: {
        value: TFormatMoney;
        percent: number;
    };
    /** Массив облигаций */
    portfolioBonds: Record<string, TPortfolioBondsItem> | null;
    /** Общая доходность по всей прибыли */
    totalYield: number;
    /** Общая годовая доходность по всей прибыли */
    totalYearlyYield: number;
}

export const useAccount: TUseAccount = (accountId) => {
    const accounts = useAccounts();

    const account = useMemo(
        () => accounts?.data.find((el) => el.id === accountId) ?? null,
        [accounts?.data, accountId]
    );

    const portfolioValue = useMemo(() => {
        if (!account) return formatMoney(0);
        return formatMoney(account.totalAmountPortfolio)
    }, [account]);

    const { totalDeposits, firstDepositDate, totalPaidTaxes, totalCommissions, totalCoupons, totalDividends, totalPayouts } = useMemo(() => {
        const operations = account?.operations ?? [];

        let deposits = 0;
        let taxes = 0;
        let commissions = 0;
        let coupons = 0;
        let dividends = 0;
        let firstDate: moment.Moment | null = null;

        for (const op of operations) {
            const value = formatMoney(op.payment).value
            const absValue = Math.abs(value);
            switch (op.type) {
                case 'Вывод денежных средств': {
                    deposits += value;
                    break;
                }
                case "Пополнение брокерского счёта": {
                    deposits += absValue;
                    const opDate = moment(op.date);
                    if (!firstDate || opDate.isBefore(firstDate)) {
                        firstDate = opDate;
                    }
                    break;
                }
                case 'Удержание комиссии за операцию': {
                    commissions += absValue;
                    break;
                }
                case "Удержание налога по дивидендам":
                case "Удержание налога": {
                    taxes += absValue;
                    break;
                }
                case 'Выплата купонов': {
                    coupons += absValue;
                    break;
                }
                case 'Выплата дивидендов':
                case 'Выплата дивидендов на карту': {
                    dividends += absValue * 0.87;
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

    // Процент роста портфеля
    const portfolioGrowth = useMemo(() => {
        const amount = portfolioValue.value - totalDeposits.value;
        const percent = (amount / totalDeposits.value) * 100;

        return {
            // сумма прироста (положительная или отрицательная)
            amount: formatMoney(Number(amount.toFixed(2))),
            // процент прироста
            percent: Number(percent.toFixed(2)),
        };
    }, [portfolioValue.value, totalDeposits.value]);

    const { currentYield, yearlyYield, totalYield, totalYearlyYield } = useMemo(() => {
        if (totalDeposits.value === 0) {
            return { currentYield: 0, yearlyYield: 0, totalYield: 0, totalYearlyYield: 0 };
        }
        const currentYield = (totalPayouts.value / totalDeposits.value) * 100;

        const days = accountAge ? Math.max(Math.floor(accountAge.asDays()), 1) : 1;
        const yearlyYield = ((totalPayouts.value / totalDeposits.value) * (365 / days)) * 100;

        const totalYield = ((totalPayouts.value + portfolioGrowth.amount.value) / totalDeposits.value) * 100;
        const totalYearlyYield = (((totalPayouts.value + portfolioGrowth.amount.value) / totalDeposits.value) * (365 / days)) * 100;

        return {
            currentYield: Number(currentYield.toFixed(2)),
            yearlyYield: Number(yearlyYield.toFixed(2)),
            totalYield: Number(totalYield.toFixed(2)),
            totalYearlyYield: Number(totalYearlyYield.toFixed(2)),
        };
    }, [accountAge, portfolioGrowth?.amount.value, totalDeposits.value, totalPayouts.value]);

    const portfolioShare = useMemo(() => {
        let sharesValue = formatMoney(0);

        if (!account?.totalAmountShares || !portfolioValue) {
            return { value: sharesValue, percent: 0 }; // или null
        }

        sharesValue = formatMoney(account.totalAmountShares);

        const percent =
            portfolioValue.value > 0
                ? Number(((sharesValue.value / portfolioValue.value) * 100).toFixed(2))
                : 0;

        return {
            value: sharesValue,
            percent,
        };
    }, [account?.totalAmountShares, portfolioValue]);

    const portfolioBonds = useMemo(() => {
        if (!account || !account.positions) return null;
        const result: Record<string, TPortfolioBondsItem> = {};
        account.positions
            .filter((pos) => pos.instrumentType === "bond")
            .forEach((pos) => {
                if (!pos.initialNominal) return;
                const currency = pos.initialNominal.currency as TBondCurrency;
                if (!currency) return;

                const price = formatMoney(pos.currentPrice);
                const lots = Number(pos.quantity.units);
                const value = price.value * lots;

                if (!result[currency]) {
                    const currencyData = getBondName(currency);
                    result[currency] = {
                        value: formatMoney(0),
                        percent: 0,
                        name: currencyData.name,
                        icon: currencyData.icon,
                    };
                }

                result[currency].value = formatMoney(result[currency].value.value + value);
            });

        // посчитаем проценты после суммы
        Object.keys(result).forEach((currency) => {
            result[currency].percent =
                portfolioValue.value > 0
                    ? Number(((result[currency].value.value / portfolioValue.value) * 100).toFixed(2))
                    : 0;
        });

        return result;
    }, [account, portfolioValue.value]);


    return {
        account,
        totalAmountPortfolio: portfolioValue,
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
        totalYield,
        totalYearlyYield,
        portfolioShare,
        portfolioBonds,
    }
}