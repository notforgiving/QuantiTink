import { TAccount } from "api/features/accounts/accountsSlice";
import { TPortfolioItem } from "Pages/AccountPage/hook/useAccount";

interface IUseGoalsProps {
    shares: number;
    bonds: [string, TPortfolioItem][];
    etfs: [string, TPortfolioItem][];
    account: TAccount | null;
}

type TUseGoals = (props: IUseGoalsProps | null) => Record<string, number>;

export const useGoals: TUseGoals = (props) => {
  const result: Record<string, number> = {};
  if (!props) return result;

  const { shares, bonds, etfs } = props;

  // ⚙️ Берём цели из Redux
  const accountGoals = props.account?.goals || {};

  // --- Shares ---
  if (typeof shares === "number" && !isNaN(shares)) {
    const goal = Number(accountGoals["shares"]);
    if (goal && !isNaN(goal)) {
      const percent = shares;
      const diff = percent >= goal ? 100 : (percent / goal) * 100;
      result["shares"] = Math.floor(diff / 10);
    }
  }

  // --- Bonds ---
  bonds.forEach(([key, bond]) => {
    const goal = Number(accountGoals[key]);
    if (!goal || isNaN(goal)) return;

    const percent = bond.percent ?? 0;
    const diff = percent >= goal ? 100 : (percent / goal) * 100;
    result[key] = Math.floor(diff / 10);
  });

  // --- ETFs ---
  etfs.forEach(([key, etf]) => {
    const goal = Number(accountGoals[key]);
    if (!goal || isNaN(goal)) return;

    const percent = etf.percent ?? 0;
    const diff = percent >= goal ? 100 : (percent / goal) * 100;
    result[key] = Math.floor(diff / 10);
  });

  return result;
};
