import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchCurrencyRatesRequest } from "api/features/currency/currencySlice";
import { AppDispatch } from "api/store";

import { useLoadDataWithToken } from "hooks/useLoadAccountsWithToken";

import BottomMenu from "../BottomMenu";
import Container from "../Container";

const ProtectedLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  useLoadDataWithToken();

  // запрашиваем курсы валют
  useEffect(() => {
    dispatch(fetchCurrencyRatesRequest());
  }, [dispatch]);

  return (
    <Container>
      <Outlet />
      <BottomMenu />
    </Container>
  );
};

export default ProtectedLayout;
