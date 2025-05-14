import React, { FC } from "react";
import Container from "../../UI/components/Container";
import { useSelector } from "react-redux";
import { StateType } from "../../store/root-reducer";
import css from "./styles.module.scss";
import { useMain } from "./hooks/useMain";
import { searchPortfolioInArrayData } from "../../utils";
import { TFAmount } from "../../types/portfolio.type";
import { TFAccount } from "../../types/accounts.type";
import cn from "classnames";
import Account from "../../components/Account";
import { NavLink } from "react-router-dom";

const Main: FC = () => {
  const accounts = useSelector((state: StateType) => state.accounts);
  const portfolios = useSelector((state: StateType) => state.portfolios);
  const operations = useSelector((state: StateType) => state.operations);

  const {
    totalAmountDepositsAllPortfolios,
    totalAmountAllPortfolio,
    portfoliosReturns,
  } = useMain({
    portfolios,
    operations,
  });

  return (
    <Container>
      <div className={css.main}>
        <h1 className={css.title}>Брокерские счета</h1>
        <div className={css.totalAmountDepositsAllPortfolios}>
          <strong>Вложено средств: </strong>
          <span>{totalAmountDepositsAllPortfolios.formatt}</span>
        </div>
        <div className={css.totalAmountAllPortfolio}>
          <strong>Текущая цена: </strong>
          <span>{totalAmountAllPortfolio.formatt} </span>
          <span
            className={cn(css.difference, {
              _isGreen: portfoliosReturns.value > 0,
            })}
          >
            ( {portfoliosReturns.formatt} / {portfoliosReturns.percent} )
          </span>
        </div>
        <div className={css.accounts}>
          {accounts.data?.map((account: TFAccount) => {
            const targetPortfolio = searchPortfolioInArrayData(
              portfolios.data || [],
              "accountId",
              account.id
            );
            const totalAmountPortfolio = targetPortfolio
              ? targetPortfolio.totalAmountPortfolio
              : ({} as TFAmount);

            return (
              <NavLink to={`/account/${account.id}`} key={account.id}>
                <Account
                  name={account.name}
                  totalAmountPortfolio={
                    targetPortfolio ? totalAmountPortfolio : undefined
                  }
                />
              </NavLink>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Main;
