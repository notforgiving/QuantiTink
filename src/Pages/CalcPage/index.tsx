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
      (op) => op.type === "Удержание комиссии за операцию"
    );

    if (commissionOp) {
      const parentOp = operations.find(
        (op) => op.id === commissionOp.parentOperationId
      );

      if (parentOp) {
        const toNumber = (payment: any) =>
          Number(payment.units) + payment.nano / 1_000_000_000;

        const commissionValue = Math.abs(toNumber(commissionOp.payment));
        const buyValue = Math.abs(toNumber(parentOp.payment));

        const percent = (commissionValue / buyValue) * 100;
        dispatch(getComissionSuccess(Number(percent.toFixed(1))));
      }
    }
  }, [accounts.data, dispatch]);

  return <Outlet />;
};

export default CalcPageWrapper;
