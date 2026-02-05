import { TAccount } from "api/features/accounts/accountsSlice";
import { TPortfolioItem } from "Pages/AccountPage/hook/useAccount";

interface IUseGoalsProps {
  goalsProps: {
    shares: number;
    bonds: [string, TPortfolioItem][];
    etfs: [string, TPortfolioItem][];
    account: TAccount | null;
  } | null
  SIZE_LINE: number;
}

type TUseGoals = (props: IUseGoalsProps) => Record<string, number>;

export const useGoals: TUseGoals = (props) => {
  const result: Record<string, number> = {};
  if (!props.goalsProps) return result;

  const { goalsProps: { account, shares, bonds, etfs } } = props;

  // ⚙️ Берём цели из Redux
  const accountGoals = account?.goals || {};

  // --- Shares ---
  if (typeof shares === "number" && !isNaN(shares)) {
    const goal = Number(accountGoals["shares"]);
    if (goal && !isNaN(goal)) {
      const percent = shares;
      const diff = percent >= goal ? 100 : (percent / goal) * 100;
      result["shares"] = Math.floor((diff / 100) * props.SIZE_LINE);
    }
  }

  // --- Bonds ---
  bonds.forEach(([key, bond]) => {
    const goal = Number(accountGoals[key]);
    if (!goal || isNaN(goal)) return;

    const percent = bond.percent ?? 0;
    const diff = percent >= goal ? 100 : (percent / goal) * 100;
    result[key] = Math.floor((diff / 100) * props.SIZE_LINE);
  });

  // --- ETFs ---
  etfs.forEach(([key, etf]) => {
    const goal = Number(accountGoals[key]);
    if (!goal || isNaN(goal)) return;

    const percent = etf.percent ?? 0;
    const diff = percent >= goal ? 100 : (percent / goal) * 100;
    result[key] = Math.floor((diff / 100) * props.SIZE_LINE);
  });

  return result;
};
