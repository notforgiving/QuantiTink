import React, { FC, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { fetchPositionsRequest } from "api/features/accounts/accountsSlice";
import { useAccounts } from "api/features/accounts/useAccounts";

const AccountPageWrapper: FC = () => {
  const { id } = useParams();
  const accounts = useAccounts();

  const account = useMemo(
    () => accounts?.data.find((el) => el.id === id) ?? null,
    [accounts?.data, id]
  );

  const dispatch = useDispatch();

useEffect(() => {
  if (!account?.id) return;
  dispatch(fetchPositionsRequest({ accountId: account.id }));
}, [account?.id, dispatch]);

  return <Outlet />;
};

export default AccountPageWrapper;
