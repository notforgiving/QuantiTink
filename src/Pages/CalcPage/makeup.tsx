import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useBonds } from "api/features/bonds/useBonds";
import { useCurrency } from "api/features/currency/useCurrency";
import {
  addFavoriteBondFailure,
  addFavoriteBondRequest,
  loadFavorites,
} from "api/features/favoritesBonds/favoritesBondsSlice";
import { useFavoritesBonds } from "api/features/favoritesBonds/useFavoritesBonds";
import { useInfo } from "api/features/info/useInfo";
import cn from "classnames";
import Atom from "UI/components/Atom";
import BackHeader from "UI/components/BackHeader";
import BondYieldCard from "UI/components/BondYieldCard";
import Button from "UI/components/Button";
import Input from "UI/components/Input";
import SortArrows, { SortOrder } from "UI/components/SortArrows";

import { useCalcBonds } from "./hooks/useCalcBonds";

import css from "./styles.module.scss";

const CalcPageMakup: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isinInput, setIsinInput] = useState<string>("");
  // Сортировка по годовой доходности
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  // Сортировка по купонной доходности
  const [couponSortOrder, setCouponSortOrder] = useState<SortOrder>(null);

  const { data: bondsData, loading: loadingAllBonds } = useBonds();
  const { data: info, loading: loadingInfo } = useInfo();
  const {
    data: favoritesBonds,
    loading: loadingFavoritesBonds,
    error,
  } = useFavoritesBonds();

  // 🔹 При монтировании загружаем избранные облигации из Firebase
  useEffect(() => {
    if (!loadingAllBonds && !!bondsData?.length) {
      dispatch(loadFavorites());
    }
  }, [bondsData?.length, dispatch, loadingAllBonds]);

  const loadingPreData =
    loadingFavoritesBonds || loadingAllBonds || loadingInfo;

  const { rates } = useCurrency();

  const { result } = useCalcBonds({
    favoritesBonds: !loadingPreData ? favoritesBonds : [],
    comission: info?.comission || 0,
    rates,
  });

  const handleAdd = () => {
    if (!isinInput.trim()) return;
    dispatch(addFavoriteBondRequest(isinInput.trim()));
    setIsinInput("");
  };

  // 🔹 Автоочистка ошибки через 10 секунд
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      dispatch(addFavoriteBondFailure(null));
    }, 10000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  // 🔹 Сортировка результата по annualProfitability или couponeYeild
  const sortedResult = useMemo(() => {
    // Если оба фильтра не выбраны, возвращаем исходный массив
    if (!sortOrder && !couponSortOrder) return result;

    // Если выбран только фильтр по годовой доходности
    if (sortOrder && !couponSortOrder) {
      return [...result].sort((a, b) => {
        const aVal = Number(a.annualProfitability) ?? 0;
        const bVal = Number(b.annualProfitability) ?? 0;
        if (sortOrder === "asc") return aVal - bVal;
        return bVal - aVal;
      });
    }

    // Если выбран только фильтр по купонной доходности
    if (!sortOrder && couponSortOrder) {
      return [...result].sort((a, b) => {
        const aVal = Number(a.couponeYeild) ?? 0;
        const bVal = Number(b.couponeYeild) ?? 0;
        if (couponSortOrder === "asc") return aVal - bVal;
        return bVal - aVal;
      });
    }

    // Если выбраны оба фильтра, приоритет — годовая доходность
    return [...result].sort((a, b) => {
      const aVal = Number(a.annualProfitability) ?? 0;
      const bVal = Number(b.annualProfitability) ?? 0;
      if (sortOrder === "asc") return aVal - bVal;
      return bVal - aVal;
    });
  }, [result, sortOrder, couponSortOrder]);

  return (
    <div>
      <BackHeader
        title="Рассчет доходности облигаций"
        backCallback={() => navigate(`/`)}
      />
      <div className={css.calc_page}>
        <div className={css.calc_page_input}>
          <Input
            inputAttributes={{
              placeholder: "Введите ISIN облигации...",
              disabled: loadingPreData,
              value: isinInput,
              onChange: (e) => setIsinInput(e.target.value),
            }}
          />
          <Button
            text="Добавить"
            buttonAttributes={{
              disabled: !isinInput.trim() || loadingPreData,
              onClick: handleAdd,
            }}
          />
        </div>
        <div className={css.calc_page_sort}>
          <SortArrows
            order={sortOrder}
            label="По годовой доходности"
            onChange={(order) => {
              setSortOrder(order);
              // Сбросить купонную сортировку при выборе годовой
              if (order) setCouponSortOrder(null);
            }}
          />
          <SortArrows
            order={couponSortOrder}
            label="По купонной доходности"
            onChange={(order) => {
              setCouponSortOrder(order);
              // Сбросить сортировку по годовой доходности при выборе купонной
              if (order) setSortOrder(null);
            }}
          />
        </div>
        <div
          className={cn(css.calc_page_grid, {
            isLoading: loadingPreData,
          })}
        >
          {loadingPreData && (
            <div
              className={cn(css.calc_page_status, {
                isLoading: loadingPreData,
              })}
            >
              <Atom />
            </div>
          )}
          {!loadingPreData && !favoritesBonds.length && (
            <div className={css.calc_page_status}>
              Вы еще не добавили ни одной облигации
            </div>
          )}
          {!loadingPreData && error && (
            <div className={css.calc_page_error}>{error}</div>
          )}
          {!loadingPreData && !!favoritesBonds.length && (
            <div className={css.calc_page_list}>
              {sortedResult.map((bond) => (
                <BondYieldCard key={bond.isin} {...bond} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalcPageMakup;
