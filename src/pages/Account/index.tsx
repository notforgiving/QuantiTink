import moment from "moment";
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
    searchItemInArrayData(state.portfolios.data || [], "accountId", accountId)
  );
  useEffect(() => {
    const updateTime = localStorage.getItem("T-balance-update") || null;
    const updateTrigger = updateTime ? JSON.parse(updateTime) : null;
    const differenceTime = updateTrigger
      ? moment().unix() - updateTrigger <= 60
      : false;

    const forkDispatchDataBonds = forkDispatch({
      localStorageName: BONDS_LOCALSTORAGE_NAME,
      accountId,
    });
    const forkDispatchDataEtfs = forkDispatch({
      localStorageName: ETFS_LOCALSTORAGE_NAME,
      accountId,
    });
    const forkDispatchDataShares = forkDispatch({
      localStorageName: SHARE_LOCALSTORAGE_NAME,
      accountId,
    });
    if (portfolio?.positions.length !== 0) {
      const bondPositions =
        portfolio?.positions.filter((el) => el.instrumentType === "bond") || [];
      forkDispatchDataBonds && differenceTime
        ? dispatch(getBondsListSuccessOnly(forkDispatchDataBonds))
        : dispatch(getBondsListAction({ bondPositions, accountId }));
      const etfPositions =
        portfolio?.positions.filter((el) => el.instrumentType === "etf") || [];
      forkDispatchDataEtfs && differenceTime
        ? dispatch(getEtfsListSuccessOnly(forkDispatchDataEtfs))
        : dispatch(getEtfsListAction({ etfPositions, accountId }));
      const sharesPositions =
        portfolio?.positions.filter((el) => el.instrumentType === "share") ||
        [];
      forkDispatchDataShares && differenceTime
        ? dispatch(getSharesListSuccessOnly(forkDispatchDataShares))
        : dispatch(getSharesListAction({ sharesPositions, accountId }));
        if (!differenceTime) {
          console.log(
            "Старые данные, еще норм по времени",
            moment().unix(),
            updateTrigger,
            moment().unix() - updateTrigger
          );
         
        } else {
          console.log("Обновляем данные");
           localStorage.setItem(
            "T-balance-update",
            JSON.stringify(moment().unix())
          );
        }
    }
  }, [accountId, dispatch, portfolio]);
  return <Outlet />;
};

export default Account;
