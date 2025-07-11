import { useAuth } from "hooks/useAuth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { StateType } from "store/root-reducer";
import {
  getAccountsListAction,
  getAccountsSuccessOnly,
} from "store/slices/accoutns.slice";
import { getInfoAction, getInfoSuccessOnly } from "store/slices/info.slice";
import {
  getOperationsListAction,
  getOperationsListSuccessOnly,
} from "store/slices/operations.slice";
import {
  getPortfoliosListAction,
  getPortfoliosListSuccessOnly,
} from "store/slices/portfolio.slice";
import { tokenSlice } from "store/slices/token.slice";
import { USER_LOCALSTORAGE_NAME, userSlice } from "store/slices/user.slice";
import { ACCOUNTS_LOCALSTORAGE_NAME } from "types/accounts.type";
import { INFO_LOCALSTORAGE_NAME } from "types/info.type";
import { OPERATIONS_LOCALSTORAGE_NAME } from "types/operations.types";
import { PORTFOLIOS_LOCALSTORAGE_NAME } from "types/portfolio.type";
import Container from "UI/components/Container";
import { forkDispatch } from "utils";
import css from "./styles.module.scss";
import { ReactComponent as MainImg } from "assets/wallet.svg";
import { ReactComponent as ProfileImg } from "assets/preson.svg";
import { ReactComponent as CalcImg } from "assets/calc.svg";
import cn from "classnames";

const UserPage = () => {
  const { isAuth, id: userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user: { data: user, isLoading: isLoadingUser },
  } = useSelector((state: StateType) => state);

  const {
    accounts: { data: accountsData, isLoading: isLoadingAccounts },
    portfolios: { data: portfoliosData, isLoading: isLoadingPortfolios },
    operations: { isLoading: isLoadingOperations },
    info: { data: infoData, isLoading: isLoadingInfo },
    token: {
      data: { token },
      isLoading: isLoadingToken,
    },
  } = useSelector((state: StateType) => state);

  useEffect(() => {
    const userLocal = localStorage.getItem(USER_LOCALSTORAGE_NAME);
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
    const forkDispatchDataInfo = forkDispatch({
      localStorageName: INFO_LOCALSTORAGE_NAME,
      accountId: "0",
    });
    const forkDispatchDataAccounts = forkDispatch({
      localStorageName: ACCOUNTS_LOCALSTORAGE_NAME,
      accountId: "0",
    });
    const forkDispatchDataPortfolios = forkDispatch({
      localStorageName: PORTFOLIOS_LOCALSTORAGE_NAME,
      accountId: "0",
    });
    const forkDispatchDataOperations = forkDispatch({
      localStorageName: OPERATIONS_LOCALSTORAGE_NAME,
      accountId: "0",
    });

    if (token && !isLoadingToken) {
      if (!isLoadingInfo && Object.keys(infoData).length === 0) {
        forkDispatchDataInfo
          ? dispatch(getInfoSuccessOnly(forkDispatchDataInfo["response"]))
          : dispatch(getInfoAction());
      }
      if (accountsData && accountsData.length === 0 && !isLoadingAccounts) {
        forkDispatchDataAccounts
          ? dispatch(
              getAccountsSuccessOnly(forkDispatchDataAccounts["response"])
            )
          : dispatch(getAccountsListAction());
      }
      if (
        accountsData &&
        accountsData.length !== 0 &&
        portfoliosData &&
        portfoliosData.length === 0 &&
        !isLoadingAccounts &&
        !isLoadingPortfolios &&
        !isLoadingOperations
      ) {
        forkDispatchDataPortfolios
          ? dispatch(
              getPortfoliosListSuccessOnly(
                forkDispatchDataPortfolios["response"]
              )
            )
          : dispatch(getPortfoliosListAction(accountsData));
        forkDispatchDataOperations
          ? dispatch(getOperationsListSuccessOnly(forkDispatchDataOperations))
          : dispatch(getOperationsListAction(accountsData));
      }
    }
  }, [
    accountsData,
    dispatch,
    infoData,
    isLoadingAccounts,
    isLoadingInfo,
    isLoadingOperations,
    isLoadingPortfolios,
    isLoadingToken,
    portfoliosData,
    token,
  ]);

  return (
    <Container>
      <Outlet />
      <div className={css.menu}>
        <div className={css.menu__wrapper}>
          <div
            className={cn(css.menu__item, {
              _isActive:
                !location.pathname.includes("/calcBonds") &&
                !location.pathname.includes("/profile"),
            })}
            onClick={() => navigate(`/`)}
          >
            <MainImg />
            <span>Главная</span>
          </div>
          <div
            className={cn(css.menu__item, {
              _isActive: location.pathname.includes("/calcBonds"),
            })}
            onClick={() => navigate(`/calcBonds`)}
          >
            <CalcImg />
            <span>Доходность облигаций</span>
          </div>
          <div
            className={cn(css.menu__item, {
              _isActive: location.pathname.includes("/profile"),
            })}
            onClick={() => navigate(`/profile`)}
          >
            <ProfileImg />
            <span>Профиль</span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserPage;
