import React, { FC, useEffect } from "react";
import Container from "../../UI/components/Container";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store/root-reducer";
import { operationsSlice } from "../../store/slices/operations.slice";
import { portfoliosSlice } from "../../store/slices/portfolio.slice";
import css from "./styles.module.scss";
import { useMain } from "./hooks/useMain";
import {
  formattedMoneySupply,
  getNumberMoney,
  searchPortfolioInArrayData,
} from "../../utils";
import { TFAmount } from "../../types/portfolio.type";
import { accountsSlice } from "../../store/slices/accoutns.slice";
import { TFAccount } from "../../types/accounts.type";
import cn from "classnames";

const Main: FC = () => {
  const accounts = useSelector((state: StateType) => state.accounts);
  const portfolios = useSelector((state: StateType) => state.portfolios);
  const operations = useSelector((state: StateType) => state.operations);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(accountsSlice.actions.getaccountsListAction());
  }, [dispatch]);

  useEffect(() => {
    if (accounts.data && !!accounts.data?.length) {
      dispatch(portfoliosSlice.actions.getPortfoliosListAction(accounts.data));
      dispatch(operationsSlice.actions.getOperationsListAction(accounts.data));
    }
  }, [accounts.data, dispatch]);

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
        <div className={css.totalAmountAllPortfolio}>
          Текущая стоимость портфелей: {totalAmountAllPortfolio.formatt}{" "}
          <span
            className={cn(css.difference, {
              _isGreen: portfoliosReturns.value > 0,
            })}
          >
            ( {portfoliosReturns.formatt} / {portfoliosReturns.percent} )
          </span>
        </div>
        <div className={css.totalAmountDepositsAllPortfolios}>
          Общая сумма вложенных средств: {" "}
          {totalAmountDepositsAllPortfolios.formatt}
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
              <div key={account.id} className={css.account}>
                <div className={css.account_name}>{account.name}</div>
                {targetPortfolio && (
                  <div className={css.account_money}>
                    {
                      formattedMoneySupply(getNumberMoney(totalAmountPortfolio))
                        .formatt
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Main;
