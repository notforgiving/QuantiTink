import { useAuth } from "hooks/useAuth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { StateType } from "store/root-reducer";
import { accountsSlice } from "store/slices/accoutns.slice";
import { infoSlice } from "store/slices/info.slice";
import { operationsSlice } from "store/slices/operations.slice";
import { portfoliosSlice } from "store/slices/portfolio.slice";
import { tokenSlice } from "store/slices/token.slice";
import { USER_LOCALSTORAGE_NAME, userSlice } from "store/slices/user.slice";

const UserPage = () => {
  const { isAuth, id: userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user: { data: user, isLoading: isLoadingUser },
  } = useSelector((state: StateType) => state);

  const {
    accounts: { data: accountsData, isLoading: isLoadingAccounts },
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
    if (token && !isLoadingToken) {
      if (!isLoadingInfo && Object.keys(infoData).length === 0) {
        dispatch(infoSlice.actions.getInfoAction());
      }
      if (accountsData && accountsData.length === 0 && !isLoadingAccounts) {
        dispatch(accountsSlice.actions.getaccountsListAction());
      }
      if (accountsData && accountsData.length !== 0 && !isLoadingAccounts) {
        dispatch(portfoliosSlice.actions.getPortfoliosListAction(accountsData));
        dispatch(operationsSlice.actions.getOperationsListAction(accountsData));
      }
    }
  }, [
    accountsData,
    dispatch,
    infoData,
    isLoadingAccounts,
    isLoadingInfo,
    isLoadingToken,
    token,
  ]);
  return <Outlet />;
};

export default UserPage;
