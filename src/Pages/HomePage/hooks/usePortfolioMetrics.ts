import { useMemo } from "react";
import { useAccounts } from "api/features/accounts/useAccounts";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

type TAccountMetric = {
  id: string;
  name: string;
  formattedPortfolio: TFormatMoney;
  invested: TFormatMoney;
  returnPercent: string;
};

export const usePortfolioMetrics = () => {
  const { data: accounts = [] } = useAccounts();

  // Исключаем скрытые аккаунты из расчётов
  const visibleAccounts = accounts.filter((a) => !a.hidden);

  const accountMetrics = useMemo<TAccountMetric[]>(() => {
    return visibleAccounts.map((account) => {
      const formattedPortfolio = formatMoney(account.totalAmountPortfolio);

      const investedValue = account.operations?.reduce((acc, operation) => {
        if (operation.type === 'Пополнение брокерского счёта' || operation.type === 'Вывод денежных средств') {
          return acc + formatMoney(operation.payment).value;
        }
        return acc;
      }, 0) ?? 0;

      const invested = formatMoney(investedValue);

      const returnPercent =
        invested.value > 0
          ? (((formattedPortfolio.value - invested.value) / invested.value) * 100).toFixed(2)
          : '0.00';

      return {
        id: account.id,
        name: account.name,
        formattedPortfolio,
        invested,
        returnPercent,
      };
    });
  }, [visibleAccounts]);

  const totalPortfolio = useMemo<TFormatMoney>(() => {
    const totalValue = accountMetrics.reduce((acc, item) => acc + item.formattedPortfolio.value, 0);
    return formatMoney(totalValue);
  }, [accountMetrics]);

  const totalInvested = useMemo<TFormatMoney>(() => {
    const investedValue = accountMetrics.reduce((acc, item) => acc + item.invested.value, 0);
    return formatMoney(investedValue);
  }, [accountMetrics]);

  const totalReturn = useMemo<TFormatMoney>(() => {
    return formatMoney(totalPortfolio.value - totalInvested.value);
  }, [totalPortfolio, totalInvested]);

  const totalReturnPercent = useMemo<string>(() => {
    return totalInvested.value > 0
      ? ((totalReturn.value / totalInvested.value) * 100).toFixed(2)
      : '0.00';
  }, [totalReturn, totalInvested]);

  return {
    totalPortfolio,
    totalInvested,
    totalReturn,
    totalReturnPercent,
    accountMetrics,
  };
};

