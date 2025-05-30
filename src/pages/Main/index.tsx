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

const Main: FC = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const dispatch = useDispatch();
  const accounts = useSelector((state: StateType) => state.accounts);
  const {
    portfolios: { data: portfoliosData, isLoading: isLoadingPortfolios },
  } = useSelector((state: StateType) => state);
  const {
    operations: { data: operationsData, isLoading: isLoadingOperations },
  } = useSelector((state: StateType) => state);

  const {
    totalAmountDepositsAllPortfolios,
    totalAmountAllPortfolio,
    portfoliosReturns,
  } = useMain({
    portfolios: portfoliosData,
    operations: operationsData,
  });

  useEffect(() => {
    const userLocal = localStorage.getItem("Tbalance_user");
    if (!isAuth && !userLocal) {
      navigate(`/auth`);
    }
    if (userLocal) {
      dispatch(userSlice.actions.userSuccessAction(JSON.parse(userLocal)));
    }
  }, [dispatch, isAuth, navigate]);

  return (
    <Container>
      <div className={css.main}>
        <div onClick={()=> dispatch(userSlice.actions.removeUserAction())}>Выход</div>
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
                ( {portfoliosReturns.formatt} / {portfoliosReturns.percent} )
              </span>
            </>
          )}
        </div>
        <div className={css.accounts}>
          {accounts.data?.map((account: TFAccount) => {
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
                  loadingMoney={isLoadingPortfolios || !portfoliosData?.length}
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
