import React, { FC, useEffect } from "react";
import Container from "../../UI/components/Container";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store/root-reducer";
import css from "./styles.module.scss";
import { useMain } from "./hooks/useMain";
import { searchItemInArrayData } from "../../utils";
import { TFAmount } from "../../types/portfolio.type";
import { TFAccount } from "../../types/accounts.type";
import cn from "classnames";
import Account from "../../components/Account";
import { NavLink } from "react-router-dom";
import Load from "../../UI/components/Load";
import { useAuth } from "hooks/useAuth";
import { userSlice } from "store/slices/user.slice";
import Button from "UI/components/Button";
import Input from "UI/components/Input";
import { tokenSlice } from "store/slices/token.slice";

const Main: FC = () => {
  const { email, id: userId } = useAuth();
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

  const {
    totalAmountDepositsAllPortfolios,
    totalAmountAllPortfolio,
    portfoliosReturns,
    tinkoffToken,
    setTinkoffToken,
  } = useMain({
    portfolios: portfoliosData,
    operations: operationsData,
  });

  return (
    <Container>
      <div className={css.main}>
        <div className={css.profile}>
          <div className={css.email}>{email}</div>
          <Button
            text="Выход"
            buttonAttributes={{
              onClick: () => {
                dispatch(userSlice.actions.removeUserAction());
                dispatch(tokenSlice.actions.removeTokenAction());
              },
            }}
          />
        </div>
        {isLoadingToken && "Загрузка"}
        {!isLoadingToken && token === null && (
          <div className={css.token}>
            <strong className={css.token_title}>
              Чтобы начать работу, введите Tinkoff токен
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
            <h1 className={css.title}>Брокерские счета</h1>
            <div className={css.totalAmountDepositsAllPortfolios}>
              <strong>Вложено средств: </strong>
              {isLoadingPortfolios ||
              !portfoliosData?.length ||
              isLoadingOperations ||
              !operationsData?.length ? (
                <Load
                  style={{
                    width: "106px",
                    height: "21.5px",
                  }}
                />
              ) : (
                <span>{totalAmountDepositsAllPortfolios.formatt}</span>
              )}
            </div>
            <div className={css.totalAmountAllPortfolio}>
              <strong>Текущая цена: </strong>
              {isLoadingPortfolios ||
              !portfoliosData?.length ||
              isLoadingOperations ||
              !operationsData?.length ? (
                <Load
                  style={{
                    width: "275px",
                    height: "21.5px",
                  }}
                />
              ) : (
                <>
                  {" "}
                  <span>{totalAmountAllPortfolio.formatt} </span>
                  <span
                    className={cn(css.difference, {
                      _isGreen: portfoliosReturns.value > 0,
                    })}
                  >
                    ( {portfoliosReturns.formatt} / {portfoliosReturns.percent}{" "}
                    )
                  </span>
                </>
              )}
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
                  <NavLink to={`/account/${account.id}`} key={account.id}>
                    <Account
                      name={account.name}
                      totalAmountPortfolio={
                        targetPortfolio ? totalAmountPortfolio : undefined
                      }
                      loadingMoney={
                        isLoadingPortfolios || !portfoliosData?.length
                      }
                    />
                  </NavLink>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default Main;
