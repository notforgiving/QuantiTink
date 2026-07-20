import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useAccounts } from "api/features/accounts/useAccounts";
import { fetchBondsRequest } from "api/features/bonds/bondsSlice";
import {
  getComissionFailed,
  getComissionRequest,
  getComissionSuccess,
} from "api/features/info/infoSlice";

import { formatMoney } from "utils/formatMoneyAmount";

const CalcPageWrapper: FC = () => {
  const dispatch = useDispatch();
  const accounts = useAccounts();

  // ✅ Получаем облигации один раз при монтировании
  useEffect(() => {
    dispatch(fetchBondsRequest());
  }, [dispatch]);

  // ✅ Расчёт комиссии при наличии данных
  useEffect(() => {
    if (!accounts.data) {
      dispatch(getComissionFailed("Данные об операциях отсутствуют"));
      return;
    }

    const firstAccount = accounts.data[0];
    if (!firstAccount) return;

    dispatch(getComissionRequest());

    const operations = firstAccount.operations || [];
    const commissionOp = operations.find(
      (op) =>
        op.type === "OPERATION_TYPE_BUY" &&
        (op.instrumentType === "bond" || op.instrumentType === "share"),
    );

    if (commissionOp) {
      const comission = formatMoney(
        Math.abs(formatMoney(commissionOp.commission).value),
      );

      const payment = formatMoney(
        Math.abs(formatMoney(commissionOp.payment).value),
      );

      const percent = (comission.value / payment.value) * 100;

      dispatch(getComissionSuccess(Number(percent.toFixed(2))));
    }
  }, [accounts.data, dispatch]);

  return <Outlet />;
};

export default CalcPageWrapper;
