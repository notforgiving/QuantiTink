/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store/root-reducer";
import css from "./styles.module.scss";
import { useMain } from "./hooks/useMain";
import { searchItemInArrayData } from "../../utils";
import { TFAmount } from "../../types/portfolio.type";
import { TFAccount } from "../../types/accounts.type";
import cn from "classnames";
import Account from "../../components/Account";
import Load from "../../UI/components/Load";
import { useAuth } from "hooks/useAuth";
import Button from "UI/components/Button";
import Input from "UI/components/Input";
import { tokenSlice } from "store/slices/token.slice";
import { getAccountsSuccessOnly } from "store/slices/accoutns.slice";
import Loader from "components/Loader";

const Main: FC = () => {
  const { id: userId } = useAuth();
  const dispatch = useDispatch();
  const {
    accounts: { data: accountsData },
    portfolios: { data: portfoliosData, isLoading: isLoadingPortfolios },
    operations: { data: operationsData, isLoading: isLoadingOperations },
    token: {
      data: { token },
      isLoading: isLoadingToken,
    },
  } = useSelector((state: StateType) => state);
  const [hiddenAccounts, setHiddenAccounts] = useState<string>("");

  const {
    totalAmountDepositsAllPortfolios,
    totalAmountAllPortfolio,
    amountOfDepositsPortfolios,
    portfoliosReturns,
    tinkoffToken,
    setTinkoffToken,
  } = useMain({
    portfolios: portfoliosData,
    operations: operationsData,
  });

  useEffect(() => {
    if (hiddenAccounts !== "" && accountsData) {
      const correctAccoutns = accountsData.filter(
        (el) => el.id !== hiddenAccounts
      );
      dispatch(getAccountsSuccessOnly(correctAccoutns));
      setHiddenAccounts("");
    }
  }, [accountsData, dispatch, hiddenAccounts]);

  return (
    <div
      className={cn(css.main, {
        _isLoading: isLoadingToken,
      })}
    >
      {isLoadingToken && (
        <div className={css.loading}>
          <Loader />
        </div>
      )}
      {!isLoadingToken && token === null && (
        <div className={css.token}>
          <strong className={css.token_title}>
            Добро пожаловать! <br /> Вы попали в приложение для анализа инвестиций в T-банке. 
            Введите токен ниже для продолжения работы. <a href="https://developer.tbank.ru/invest/intro/intro/token#%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C-%D1%82%D0%BE%D0%BA%D0%B5%D0%BD" rel="noreferrer" target="_blank">Инструкция как создать токен </a>
          </strong>
          <Input
            inputAttributes={{
              value: tinkoffToken,
              name: "token",
              placeholder: "Введите Tinkoff токен...",
              required: true,
              onChange: (e) => setTinkoffToken(e.target.value),
            }}
          />
          <Button
            text="Добавить"
            buttonAttributes={{
              disabled: tinkoffToken === "",
              onClick: () =>
                dispatch(
                  tokenSlice.actions.setTokenAction({
                    token: tinkoffToken,
                    userId: userId || "0",
                  })
                ),
            }}
          />
        </div>
      )}
      {token !== null && !isLoadingToken && (
        <>
          <div className={css.main__header}>
            <h1 className={css.title}>Портфель</h1>
            <div className={css.grid}>
              <div className={css.grid__item}>
                <span>Стоимость портфеля</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    totalAmountAllPortfolio.formatt
                  )}
                </strong>
              </div>
              <div
                className={cn(css.grid__item, {
                  _isGreen: portfoliosReturns.value >= 0,
                })}
              >
                <span>Доходность</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    portfoliosReturns.formatt
                  )}
                </strong>
              </div>
              <div
                className={cn(css.grid__item, {
                  _isGreen: portfoliosReturns.value >= 0,
                })}
              >
                <span>Доходность %</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    portfoliosReturns.percent
                  )}
                </strong>
              </div>
              <div className={css.grid__item}>
                <span>Вложено</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    totalAmountDepositsAllPortfolios.formatt
                  )}
                </strong>
              </div>
            </div>
          </div>
          <div className={css.accounts}>
              {accountsData?.map((account: TFAccount) => {
                const targetPortfolio = searchItemInArrayData(
                  portfoliosData || [],
                  "accountId",
                  account.id
                );
                const totalAmountPortfolio = targetPortfolio
                  ? targetPortfolio.totalAmountPortfolio
                  : ({} as TFAmount);

                return (
                  <Account
                    id={account.id}
                    name={account.name}
                    totalAmountPortfolio={
                      targetPortfolio ? totalAmountPortfolio : undefined
                    }
                    loadingMoney={
                      isLoadingPortfolios || !portfoliosData?.length
                    }
                    key={account.id}
                    amountOfDeposits={amountOfDepositsPortfolios[account.id]}
                  />
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
