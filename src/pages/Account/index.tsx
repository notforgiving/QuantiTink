import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { StateType } from "store/root-reducer";
import {
  getBondsListAction,
  getBondsListSuccessOnly,
} from "store/slices/bonds.slice";
import {
  getEtfsListAction,
  getEtfsListSuccessOnly,
} from "store/slices/etfs.slice";
import {
  getSharesListAction,
  getSharesListSuccessOnly,
} from "store/slices/share.slice";
import { BONDS_LOCALSTORAGE_NAME } from "types/bonds.type";
import { ETFS_LOCALSTORAGE_NAME } from "types/etfs.type";
import { SHARE_LOCALSTORAGE_NAME } from "types/share.type";
import { forkDispatch, searchItemInArrayData } from "utils";

const Account = () => {
  let { id } = useParams();
  const accountId = id || "0";
  const dispatch = useDispatch();
  const portfolio = useSelector((state: StateType) =>
    searchItemInArrayData(
      state.portfolios.data || [],
      "accountId",
      accountId,
    )
  );
  useEffect(() => {
    if (portfolio?.positions.length !== 0) {
      const bondPositions =
        portfolio?.positions.filter((el) => el.instrumentType === "bond") || [];
      const forkDispatchDataBonds = forkDispatch({
        localStorageName: BONDS_LOCALSTORAGE_NAME,
        accountId,
      });
      forkDispatchDataBonds
        ? dispatch(getBondsListSuccessOnly(forkDispatchDataBonds))
        : dispatch(getBondsListAction({ bondPositions, accountId }));
      const etfPositions =
        portfolio?.positions.filter((el) => el.instrumentType === "etf") || [];
      const forkDispatchDataEtfs = forkDispatch({
        localStorageName: ETFS_LOCALSTORAGE_NAME,
        accountId,
      });
      forkDispatchDataEtfs
        ? dispatch(getEtfsListSuccessOnly(forkDispatchDataEtfs))
        : dispatch(getEtfsListAction({ etfPositions, accountId }));
      const sharesPositions =
        portfolio?.positions.filter((el) => el.instrumentType === "share") ||
        [];
      const forkDispatchDataShares = forkDispatch({
        localStorageName: SHARE_LOCALSTORAGE_NAME,
        accountId,
      });
      forkDispatchDataShares
        ? dispatch(getSharesListSuccessOnly(forkDispatchDataShares))
        : dispatch(getSharesListAction({ sharesPositions, accountId }));
    }
  }, [accountId, dispatch, portfolio]);
  return <Outlet />;
};

export default Account;
