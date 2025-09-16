import { ReactNode } from "react";
import { TPortfolioPositionFull } from "api/features/accounts/accountsTypes";

import { formatMoney } from "utils/formatMoneyAmount";

import { TPortfolioItem } from "./useAccount";

export function groupPortfolio<T extends TPortfolioPositionFull>(
  positions: T[],
  instrumentType: "bond" | "etf",
  getKey: (pos: T) => string | undefined,
  getMeta: (pos: T) => { name: string; icon: ReactNode },
  portfolioValue: number
): Record<string, TPortfolioItem> {
  const result: Record<string, TPortfolioItem> = {};

  positions
    .filter((pos) => pos.instrumentType === instrumentType)
    .forEach((pos) => {
      const key = getKey(pos);
      if (!key) return;

      const price = formatMoney(pos.currentPrice);
      const lots = Number(pos.quantity.units);
      const value = price.value * lots;

      if (!result[key]) {
        const meta = getMeta(pos);
        result[key] = {
          value: formatMoney(0),
          percent: 0,
          ...meta,
        };
      }

      result[key].value = formatMoney(result[key].value.value + value);
    });

  // считаем проценты
  Object.keys(result).forEach((key) => {
    result[key].percent =
      portfolioValue > 0
        ? Number(((result[key].value.value / portfolioValue) * 100).toFixed(2))
        : 0;
  });

  return result;
}
