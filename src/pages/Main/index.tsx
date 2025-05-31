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
import { NavLink, useNavigate } from "react-router-dom";
import Load from "../../UI/components/Load";
import { useAuth } from "hooks/useAuth";
import { userSlice } from "store/slices/user.slice";
import Button from "UI/components/Button";
import Input from "UI/components/Input";
import { tokenSlice } from "store/slices/token.slice";
import { infoSlice } from "store/slices/info.slice";
import { accountsSlice } from "store/slices/accoutns.slice";
import { portfoliosSlice } from "store/slices/portfolio.slice";
import { operationsSlice } from "store/slices/operations.slice";

const Main: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, email, id: userId } = useAuth();
    const { data: user, isLoading: isLoadingUser } = useSelector(
    (state: StateType) => state.user
  );
    const {
    data: { token },
    isLoading: isLoadingToken,
  } = useSelector((state: StateType) => state.token);
  const { data: accounts, isLoading: isLoadingAccounts } = useSelector(
    (state: StateType) => state.accounts
  );
  const {
    portfolios: { data: portfoliosData, isLoading: isLoadingPortfolios },
  } = useSelector((state: StateType) => state);
  const {
    operations: { data: operationsData, isLoading: isLoadingOperations },
  } = useSelector((state: StateType) => state);
  const { data: infoData, isLoading: isLoadingInfo } = useSelector(
    (state: StateType) => state.info
  );

  useEffect(() => {
    const userLocal = localStorage.getItem("Tbalance_user");
    if (!isAuth && !userLocal) {
      navigate(`/auth`);
    }
    if (userLocal && !isLoadingUser && user.email === null) {
      dispatch(userSlice.actions.userSuccessAction(JSON.parse(userLocal)));
    }
    if (isAuth && userId) {
      dispatch(tokenSlice.actions.getTokenAction(userId));
    }
  }, [dispatch, isAuth, isLoadingUser, navigate, user.email, userId]);

  useEffect(() => {
    if (token) {
      console.log(token,'token');
      
      // if (!isLoadingInfo && Object.keys(infoData).length === 0) {
      //   dispatch(infoSlice.actions.getInfoAction());
      // }
      // if (accounts && accounts.length === 0 && !isLoadingAccounts) {
      //   dispatch(accountsSlice.actions.getaccountsListAction());
      // }
      // if (accounts && accounts.length !== 0 && !isLoadingAccounts) {
      //   dispatch(portfoliosSlice.actions.getPortfoliosListAction(accounts));
      //   dispatch(operationsSlice.actions.getOperationsListAction(accounts));
      // }
    }
  }, [accounts, dispatch, infoData, isLoadingAccounts, isLoadingInfo, token]);

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
              {accounts?.map((account: TFAccount) => {
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
