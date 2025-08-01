import { useAuth } from "hooks/useAuth";
import React, { useEffect, useMemo } from "react";
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
import { currencySlice } from "store/slices/currency.slice";
import moment from "moment";

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

    if (!isAuth && !userLocal) navigate(`/auth`);

    if (userLocal && !isLoadingUser && user.email === null)
      dispatch(userSlice.actions.userSuccessAction(JSON.parse(userLocal)));

    if (isAuth && userId) {
      dispatch(tokenSlice.actions.getTokenAction(userId));
      dispatch(currencySlice.actions.getCurrencyListAction());
    }
  }, [dispatch, isAuth, isLoadingUser, navigate, user.email, userId]);

  const CACHE_KEY = "T-balance-pages";
  const CACHE_TTL_SECONDS = 60;

  const isCacheValid = (cacheKey: string) => {
    const cachedTimestamp = localStorage.getItem(cacheKey);
    if (!cachedTimestamp) return false;

    const timestamp = JSON.parse(cachedTimestamp);
    const now = moment().unix();

    return now - timestamp <= CACHE_TTL_SECONDS;
  };

  const forked = useMemo(() => {
    if (!token || isLoadingToken) return null;

    return {
      info: forkDispatch({
        localStorageName: INFO_LOCALSTORAGE_NAME,
        accountId: "0",
      }),
      accounts: forkDispatch({
        localStorageName: ACCOUNTS_LOCALSTORAGE_NAME,
        accountId: "0",
      }),
      portfolios: forkDispatch({
        localStorageName: PORTFOLIOS_LOCALSTORAGE_NAME,
        accountId: "0",
      }),
      operations: forkDispatch({
        localStorageName: OPERATIONS_LOCALSTORAGE_NAME,
        accountId: "0",
      }),
    };
  }, [token, isLoadingToken]);

  useEffect(() => {
    if (!token || isLoadingToken) return;

    const useCache = isCacheValid(CACHE_KEY);

    // INFO
    if (!isLoadingInfo && Object.keys(infoData).length === 0) {
      forked?.info && useCache
        ? dispatch(getInfoSuccessOnly(forked.info.response))
        : dispatch(getInfoAction());
    }
    // ACCOUNTS
    if (accountsData && accountsData.length === 0 && !isLoadingAccounts) {
      forked?.accounts && useCache
        ? dispatch(getAccountsSuccessOnly(forked.accounts.response))
        : dispatch(getAccountsListAction());
    }
    // PORTFOLIOS & OPERATIONS
    const shouldFetchPortfoliosAndOperations =
      !isLoadingAccounts &&
      !isLoadingPortfolios &&
      !isLoadingOperations &&
      accountsData?.length !== 0 &&
      portfoliosData?.length === 0 &&
      accountsData;

    if (shouldFetchPortfoliosAndOperations) {
      if (useCache && forked?.portfolios && forked.operations) {
        dispatch(getPortfoliosListSuccessOnly(forked.portfolios.response));
        dispatch(getOperationsListSuccessOnly(forked.operations));
        console.log("Используем кэшированные данные");
      } else {
        dispatch(getPortfoliosListAction(accountsData));
        dispatch(getOperationsListAction(accountsData));
        console.log("Обновили данные");
        localStorage.setItem(CACHE_KEY, JSON.stringify(moment().unix()));
      }
    }
  }, [
    accountsData,
    dispatch,
    forked?.accounts,
    forked?.info,
    forked?.operations,
    forked?.portfolios,
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
              _isDisabled: !token,
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
