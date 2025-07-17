import React, { FC } from "react";
import css from "./styles.module.scss";
import Input from "UI/components/Input";
import Button from "UI/components/Button";
import { useCalcBonds } from "./hook/useCalcBonds";
import Bond from "./components/Bond";
import Loader from "components/Loader";
import cn from "classnames";
import SortArrows from "UI/components/SortArrows";

const CalcBonds: FC = () => {
  const {
    inputField,
    setInputField,
    handleAddBond,
    handleRemoveBond,
    isLoading,
    error,
    bondsTable,
    handleChangeValueBonds,
    isLoadingBonds,
    handleChangeCurrentPrice,
    setSortByProfitability,
    sortFunction,
    sortByProfitability,
  } = useCalcBonds({});

  const conditionLoading = (isLoadingBonds || isLoading) && !bondsTable.length;

  const handleSortSlick = (key: "income" | "alfabet") => {
    if (sortByProfitability.value === null) {
      setSortByProfitability({
        key,
        value: "DESC",
      });
    } else if (sortByProfitability.value === "DESC") {
      setSortByProfitability({
        key,
        value: "ASC",
      });
    } else
      setSortByProfitability({
        key,
        value: null,
      });
  };

  return (
    <div className={css.calc_container}>
      <div className={css.header}>
        <span className={css.header_title}>Рассчет доходности облигаций</span>
        <div className={css.header_field}>
          <Input
            error={error || undefined}
            inputAttributes={{
              type: "text",
              value: inputField,
              placeholder: "Введите ISIN облигации",
              onChange: (e) => setInputField(e.target.value),
              disabled: conditionLoading,
            }}
          />
          <Button
            text="Добавить"
            buttonAttributes={{
              onClick: () => handleAddBond(),
              disabled: conditionLoading || inputField === "",
            }}
          />
        </div>
      </div>
      {bondsTable.length > 1 && !isLoading && (
        <>
          <div className={css.actions}>
            <div
              className={css.actions__item}
              onClick={() => handleSortSlick("income")}
            >
              <span>По доходности</span>
              <SortArrows
                state={
                  sortByProfitability.key === "income"
                    ? sortByProfitability.value
                    : null
                }
              />
            </div>
            <div
              className={css.actions__item}
              onClick={() => handleSortSlick("alfabet")}
            >
              <span>По алфавиту</span>
              <SortArrows
                state={
                  sortByProfitability.key === "alfabet"
                    ? sortByProfitability.value
                    : null
                }
              />
            </div>
          </div>
        </>
      )}
      <div
        className={cn(css.body, {
          isLoading: conditionLoading,
        })}
      >
        {conditionLoading && (
          <div className={css.loading}>
            <Loader />
          </div>
        )}
        {!!bondsTable.length &&
          !isLoading &&
          bondsTable
            .sort(sortFunction)
            .map((item) => (
              <Bond
                key={item.isin}
                itemData={item}
                handleRemoveBond={handleRemoveBond}
                handleChangeValueBonds={handleChangeValueBonds}
                handleChangeCurrentPrice={handleChangeCurrentPrice}
              />
            ))}
        {!conditionLoading && (
          <div className={css.empty}>
            Пока вы не добавили не одной облигации
          </div>
        )}
      </div>
    </div>
  );
};

export default CalcBonds;
