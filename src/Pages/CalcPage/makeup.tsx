import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useBonds } from "api/features/bonds/useBonds";
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

import { useCalcBonds } from "./hooks/useCalcBonds";

import css from "./styles.module.scss";

const CalcPageMakup: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isinInput, setIsinInput] = useState<string>("");

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

  const { result } = useCalcBonds({
    favoritesBonds: !loadingPreData ? favoritesBonds : [],
    comission: info?.comission || 0,
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
              {result.map((bond) => (
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
