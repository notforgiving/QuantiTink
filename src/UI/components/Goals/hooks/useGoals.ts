import { TAccount } from "api/features/accounts/accountsSlice";
import { TPortfolioItem } from "Pages/AccountPage/hook/useAccount";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

interface IUseGoalsProps {
  goalsProps: {
    shares: {
      value: TFormatMoney;
      percent: number;
    }
    bonds: [string, TPortfolioItem][];
    etfs: [string, TPortfolioItem][];
    account: TAccount | null;
  } | null
  SIZE_LINE: number;
}

type TUseGoals = (props: IUseGoalsProps) => Record<string, {
  amount: TFormatMoney;
  size: number;
}>;

export const useGoals: TUseGoals = (props) => {
  const result: Record<string, {
    amount: TFormatMoney;
    size: number;
  }> = {};
  if (!props.goalsProps) return result;

  const { goalsProps: { account, shares, bonds, etfs } } = props;
  const totalPortfolioAmount = shares.value.value + bonds.reduce((acc, [key, bond]) => acc + bond.value.value, 0) + etfs.reduce((acc, [key, etf]) => acc + etf.value.value, 0);
  const onePrecentByPortfolio = totalPortfolioAmount / 100;

  // ⚙️ Берём цели из Redux
  const accountGoals = account?.goals || {};

  // --- Shares ---
  if (typeof shares.percent === "number" && !isNaN(shares.percent)) {
    const goal = Number(accountGoals["shares"]);
    if (goal && !isNaN(goal)) {
      const percent = shares.percent;
      const diff = percent >= goal ? 100 : (percent / goal) * 100;
      const diffMoney = formatMoney((goal - percent) * onePrecentByPortfolio);
      result["shares"] = {
        size: Math.floor((diff / 100) * props.SIZE_LINE),
        amount: diffMoney
      };
    }
  }

  // --- Bonds ---
  bonds.forEach(([key, bond]) => {
    const goal = Number(accountGoals[key]);
    if (!goal || isNaN(goal)) return;
    const percent = bond.percent ?? 0;
    const diff = percent >= goal ? 100 : (percent / goal) * 100;
    const diffMoney = formatMoney((goal - percent) * onePrecentByPortfolio);
    result[key] = {
      size: Math.floor((diff / 100) * props.SIZE_LINE),
      amount: diffMoney
    };
  });

  // --- ETFs ---
  etfs.forEach(([key, etf]) => {
    const goal = Number(accountGoals[key]);
    if (!goal || isNaN(goal)) return;
    const percent = etf.percent ?? 0;
    const diff = percent >= goal ? 100 : (percent / goal) * 100;
    const diffMoney = formatMoney((goal - percent) * onePrecentByPortfolio);
    result[key] = {
      size: Math.floor((diff / 100) * props.SIZE_LINE),
      amount: diffMoney
    };
  });

  return result;
};
