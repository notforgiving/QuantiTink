
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import Atom from "UI/components/Atom";
import BackHeader from "UI/components/BackHeader";
import BondYieldCard from "UI/components/BondYieldCard";
import Button from "UI/components/Button";
import Input from "UI/components/Input";
import SortArrows from "UI/components/SortArrows";

import { useCalcPageLogic } from "./hooks/useCalcPageLogic";

import css from "./styles.module.scss";

const CalcPageMakup: FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useCalcPageLogic();

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
              if (order) setCouponSortOrder(null);
            }}
          />
          <SortArrows
            order={couponSortOrder}
            label="По купонной доходности"
            onChange={(order) => {
              setCouponSortOrder(order);
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
