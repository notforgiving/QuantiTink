import { useCallback,useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useBonds } from "api/features/bonds/useBonds";
import { useCurrency } from "api/features/currency/useCurrency";
import {
  addFavoriteBondFailure,
  addFavoriteBondRequest,
  loadFavorites,
} from "api/features/favoritesBonds/favoritesBondsSlice";
import { useFavoritesBonds } from "api/features/favoritesBonds/useFavoritesBonds";
import { useInfo } from "api/features/info/useInfo";
import { SortOrder } from "UI/components/SortArrows";

import { useCalcBonds } from "./useCalcBonds";

export function useCalcPageLogic() {
  const dispatch = useDispatch();
  const [isinInput, setIsinInput] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [couponSortOrder, setCouponSortOrder] = useState<SortOrder>(null);

  const { data: bondsData, loading: loadingAllBonds } = useBonds();
  const { data: info, loading: loadingInfo } = useInfo();
  const {
    data: favoritesBonds,
    loading: loadingFavoritesBonds,
    error,
  } = useFavoritesBonds();
  const { rates } = useCurrency();

  useEffect(() => {
    if (!loadingAllBonds && !!bondsData?.length) {
      dispatch(loadFavorites());
    }
  }, [bondsData?.length, dispatch, loadingAllBonds]);

  const loadingPreData = loadingFavoritesBonds || loadingAllBonds || loadingInfo;

  const { result } = useCalcBonds({
    favoritesBonds: !loadingPreData ? favoritesBonds : [],
    comission: info?.comission || 0,
    rates,
  });

  const handleAdd = useCallback(() => {
    if (!isinInput.trim()) return;
    dispatch(addFavoriteBondRequest(isinInput.trim()));
    setIsinInput("");
  }, [isinInput, dispatch]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      dispatch(addFavoriteBondFailure(null));
    }, 10000);
    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const sortedResult = useMemo(() => {
    if (!sortOrder && !couponSortOrder) return result;
    if (sortOrder && !couponSortOrder) {
      return [...result].sort((a, b) => {
        const aVal = Number(a.annualProfitability) ?? 0;
        const bVal = Number(b.annualProfitability) ?? 0;
        if (sortOrder === "asc") return aVal - bVal;
        return bVal - aVal;
      });
    }
    if (!sortOrder && couponSortOrder) {
      return [...result].sort((a, b) => {
        const aVal = Number(a.couponeYeild) ?? 0;
        const bVal = Number(b.couponeYeild) ?? 0;
        if (couponSortOrder === "asc") return aVal - bVal;
        return bVal - aVal;
      });
    }
    return [...result].sort((a, b) => {
      const aVal = Number(a.annualProfitability) ?? 0;
      const bVal = Number(b.annualProfitability) ?? 0;
      if (sortOrder === "asc") return aVal - bVal;
      return bVal - aVal;
    });
  }, [result, sortOrder, couponSortOrder]);

  return {
    isinInput,
    setIsinInput,
    sortOrder,
    setSortOrder,
    couponSortOrder,
    setCouponSortOrder,
    loadingPreData,
    favoritesBonds,
    error,
    handleAdd,
    sortedResult,
  };
}
